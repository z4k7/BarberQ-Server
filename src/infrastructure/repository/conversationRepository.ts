import ConversationModel from "../database/conversationModel";
import UserModel from "../database/userModel";
import ConversationInterface from "../../usecase/interface/conversationInterface";

interface IMember {
  memberId: string;
  lastSeen?: Date | undefined;
}

class ConversationRepository implements ConversationInterface {
  async save(
    memberIds: Array<{ memberId: string }>,
    senderId: string
  ): Promise<any> {
    try {
      const membersArray: IMember[] = memberIds.map(({ memberId }) => ({
        memberId: memberId,
        lastSeen: memberId === senderId ? new Date() : undefined,
      }));

      const newConversation = new ConversationModel({ members: membersArray });
      return await newConversation.save();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to save the conversation.");
    }
  }

  async findAllConversations(): Promise<any> {
    try {
      const conversations = await ConversationModel.find();
      const enrichedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          const firstMember = conversation.members[0];
          const user = await UserModel.findById(firstMember.memberId);
          const userName = user ? user.name : "Admin";
          const userId = user ? user._id : "Id not found";

          return {
            conversationId: conversation._id,
            userName: userName,
            userId: userId,
          };
        })
      );

      return enrichedConversations;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get all conversations");
    }
  }

  async updateUserLastSeen(
    userId: string,
    data: Date
  ): Promise<{ status: number; data: string }> {
    try {
      const updateResult = await ConversationModel.updateMany(
        { "members.memberId": userId },
        { $set: { "members.$.lastSeen": data } }
      );
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
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        data: "Failed to update user's lastSeen.",
      };
    }
  }

  async findByUserId(id: string): Promise<any> {
    const conversations = await ConversationModel.find({
      "members.memberId": id,
    });
    if (conversations) {
      return conversations;
    } else {
      return null;
    }
  }

  async checkExisting(members: Array<{ memberId: string }>) {
    const queryConditions = members.map((member) => ({
      "members.memberId": member.memberId,
    }));

    const conversations = await ConversationModel.find({
      $and: queryConditions,
    });

    return conversations;
    // if (conversations.length > 0) {
    //   return conversations;
    // } else {
    //   return null;
    // }
  }
}

export default ConversationRepository;
