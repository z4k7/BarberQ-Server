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
class ChatController {
    constructor(chatUsecase) {
        this.chatUsecase = chatUsecase;
    }
    getAllConversations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield this.chatUsecase.getAllConversations();
                res.status(conversations.status).json(conversations);
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    error: error.message,
                });
            }
        });
    }
    newConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const senderId = req.body.members.senderId;
                const members = [
                    { memberId: req.body.members.senderId },
                    { memberId: req.body.members.receiverId },
                ];
                const existing = yield this.chatUsecase.checkExisting(members);
                if (!(existing === null || existing === void 0 ? void 0 : existing.length)) {
                    const conversation = yield this.chatUsecase.newConversation(members, senderId);
                    res.status(conversation === null || conversation === void 0 ? void 0 : conversation.status).json(conversation === null || conversation === void 0 ? void 0 : conversation.data);
                }
                res.status(200).json(existing[0]);
            }
            catch (error) {
                console.log("Error in new conversation controller", error);
                res.status(500).json({
                    message: "Internal server Error",
                    error: error.message,
                });
            }
        });
    }
    addMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = Object.assign({}, req.body);
                const message = yield this.chatUsecase.addMessage(data);
                res.status(message.status).json(message.data);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal server Error",
                    error: error.message,
                });
            }
        });
    }
    // async getConversations(req: Request, res: Response) {
    //   try {
    //     const conversations = await this.chatUsecase.getConversations(
    //       req.params.id
    //     );
    //     res.status(conversations.status).json(conversations.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationId = req.params.conversationId;
                const messages = yield this.chatUsecase.getMessages(conversationId);
                res.status(messages.status).json(messages.data);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal server Error",
                    error: error.message,
                });
            }
        });
    }
}
exports.default = ChatController;
