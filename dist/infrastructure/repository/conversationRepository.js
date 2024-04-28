"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversationModel_1 = __importDefault(require("../database/conversationModel"));
const userModel_1 = __importDefault(require("../database/userModel"));
class ConversationRepository {
    save(memberIds, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const membersArray = memberIds.map(({ memberId }) => ({
                    memberId: memberId,
                    lastSeen: memberId === senderId ? new Date() : undefined,
                }));
                const newConversation = new conversationModel_1.default({ members: membersArray });
                return yield newConversation.save();
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to save the conversation.");
            }
        });
    }
    findAllConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield conversationModel_1.default.find();
                const enrichedConversations = yield Promise.all(conversations.map((conversation) => __awaiter(this, void 0, void 0, function* () {
                    const firstMember = conversation.members[0];
                    const user = yield userModel_1.default.findById(firstMember.memberId);
                    const userName = user ? user.name : "Admin";
                    const userId = user ? user._id : "Id not found";
                    return {
                        conversationId: conversation._id,
                        userName: userName,
                        userId: userId,
                    };
                })));
                return enrichedConversations;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to get all conversations");
            }
        });
    }
    updateUserLastSeen(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateResult = yield conversationModel_1.default.updateMany({ "members.memberId": userId }, { $set: { "members.$.lastSeen": data } });
                if (updateResult.matchedCount === 0) {
                    return {
                        status: 404,
                        data: "User not found in any conversation.",
                    };
                }
                return {
                    status: 200,
                    data: "User's lastSeen updated successfully.",
                };
            }
            catch (error) {
                console.log(error);
                return {
                    status: 500,
                    data: "Failed to update user's lastSeen.",
                };
            }
        });
    }
    findByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversations = yield conversationModel_1.default.find({
                "members.memberId": id,
            });
            if (conversations) {
                return conversations;
            }
            else {
                return null;
            }
        });
    }
    checkExisting(members) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryConditions = members.map((member) => ({
                "members.memberId": member.memberId,
            }));
            const conversations = yield conversationModel_1.default.find({
                $and: queryConditions,
            });
            return conversations;
            // if (conversations.length > 0) {
            //   return conversations;
            // } else {
            //   return null;
            // }
        });
    }
}
exports.default = ConversationRepository;
