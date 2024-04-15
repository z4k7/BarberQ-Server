import { Request, Response } from "express";
import ChatUsecase from "../usecase/chatUsecase";
class ChatController {
  constructor(private chatUsecase: ChatUsecase) {}

  async getAllConversations(req: Request, res: Response) {
    try {
      const conversations = await this.chatUsecase.getAllConversations();
      res.status(conversations.status).json(conversations);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async newConversation(req: Request, res: Response) {
    try {
      const senderId = req.body.members.senderId;
      const members = [
        { memberId: req.body.members.senderId },
        { memberId: req.body.members.receiverId },
      ];
      const existing = await this.chatUsecase.checkExisting(members);

      if (!existing?.length) {
        const conversation = await this.chatUsecase.newConversation(
          members,
          senderId
        );

        res.status(conversation?.status).json(conversation?.data);
      }
      res.status(200).json(existing[0]);
    } catch (error) {
      console.log("Error in new conversation controller", error);
      res.status(500).json({
        message: "Internal server Error",
        error: (error as Error).message,
      });
    }
  }

  async addMessage(req: Request, res: Response) {
    try {
      const data = {
        ...req.body,
      };
      const message = await this.chatUsecase.addMessage(data);

      res.status(message.status).json(message.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server Error",
        error: (error as Error).message,
      });
    }
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

  async getMessages(req: Request, res: Response) {
    try {
      const conversationId = req.params.conversationId;
      const messages = await this.chatUsecase.getMessages(conversationId);
      res.status(messages.status).json(messages.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server Error",
        error: (error as Error).message,
      });
    }
  }
}

export default ChatController;
