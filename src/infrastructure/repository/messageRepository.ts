import MessageInterface from "../../usecase/interface/messageInterface";
import MessageModel from "../database/messageModel";

class MessageRepository implements MessageInterface {
  async save(data: any): Promise<any> {
    const message = new MessageModel(data).save();
    // const save = await message.save();
  }

  async findById(id: string): Promise<any> {
    const messages = await MessageModel.find({ conversationId: id });
    if (messages) {
      return messages;
    } else {
      return null;
    }
  }

  async getLastMessages(): Promise<any> {
    try {
      const lastMessages = await MessageModel.aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: "$conversationId",
            lastMessage: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$lastMessage" },
        },
      ]);

      return lastMessages;
    } catch (error) {
      console.error("Error fetching last messages:", error);
    }
  }
}

export default MessageRepository;
