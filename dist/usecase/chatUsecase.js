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
Object.defineProperty(exports, "__esModule", { value: true });
class ChatUsecase {
    constructor(conversationInterface, messageInterface) {
        this.conversationInterface = conversationInterface;
        this.messageInterface = messageInterface;
    }
    checkExisting(members) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExisting = yield this.conversationInterface.checkExisting(members);
            return isExisting;
        });
    }
    newConversation(members, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield this.checkExisting(members);
                if (existing.length > 0) {
                    return { status: 200, data: existing[0] };
                }
                const newConversation = yield this.conversationInterface.save(members, senderId);
                return {
                    status: 200,
                    data: newConversation,
                };
            }
            catch (error) {
                return {
                    status: 401,
                    data: error,
                };
            }
        });
    }
    getConversations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversations = yield this.conversationInterface.findByUserId(id);
            const message = yield this.messageInterface.getLastMessages();
            const data = {
                conv: conversations,
                messages: message,
            };
            if (conversations) {
                return {
                    status: 200,
                    data: data,
                };
            }
            else {
                return {
                    status: 400,
                    data: "No conversation found",
                };
            }
        });
    }
    getAllConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield this.conversationInterface.findAllConversations();
                return {
                    status: 200,
                    data: conversations,
                };
            }
            catch (error) {
                return {
                    status: 400,
                    data: error,
                };
            }
        });
    }
    getMessages(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.messageInterface.findById(id);
            if (messages) {
                return {
                    status: 200,
                    data: messages,
                };
            }
            else {
                return {
                    status: 401,
                    data: "No Messages",
                };
            }
        });
    }
    addMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield this.messageInterface.save(data);
                if (!message) {
                    return { status: 400, data: "Failed to save message" };
                }
                return { status: 200, data: message };
            }
            catch (error) {
                console.error("Error adding message", error);
                return { status: 500, data: "An error occurred" };
            }
        });
    }
}
exports.default = ChatUsecase;
