import ConversationInterface from "./interface/conversationInterface";
import MessageInterface from "./interface/messageInterface";

class ChatUsecase {
  constructor(
    private conversationInterface: ConversationInterface,
    private messageInterface: MessageInterface
  ) {}

  async checkExisting(members: Array<{ memberId: string }>) {
    const isExisting = await this.conversationInterface.checkExisting(members);
    return isExisting;
  }

  async newConversation(
    members: Array<{ memberId: string }>,
    senderId: string
  ) {
    try {
      const existing = await this.checkExisting(members);
      if (existing.length > 0) {
        return { status: 200, data: existing[0] };
      }

      const newConversation = await this.conversationInterface.save(
        members,
        senderId
      );

      return {
        status: 200,
        data: newConversation,
      };
    } catch (error) {
      return {
        status: 401,
        data: error,
      };
    }
  }

  async getConversations(id: string) {
    const conversations = await this.conversationInterface.findByUserId(id);
    const message = await this.messageInterface.getLastMessages();
    const data = {
      conv: conversations,
      messages: message,
    };
    if (conversations) {
      return {
        status: 200,
        data: data,
      };
    } else {
      return {
        status: 400,
        data: "No conversation found",
      };
    }
  }

  async getAllConversations() {
    try {
      const conversations =
        await this.conversationInterface.findAllConversations();

      return {
        status: 200,
        data: conversations,
      };
    } catch (error) {
      return {
        status: 400,
        data: error,
      };
    }
  }

  async getMessages(id: string) {
    const messages = await this.messageInterface.findById(id);
    if (messages) {
      return {
        status: 200,
        data: messages,
      };
    } else {
      return {
        status: 401,
        data: "No Messages",
      };
    }
  }

  async addMessage(data: {
    conversationId: string;
    sender: string;
    text: string;
  }) {
    try {
      const message = await this.messageInterface.save(data);
      if (!message) {
        return { status: 400, data: "Failed to save message" };
      }
      return { status: 200, data: message };
    } catch (error) {
      console.error("Error adding message", error);
      return { status: 500, data: "An error occurred" };
    }
  }
}

export default ChatUsecase;
