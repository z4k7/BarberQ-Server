import mongoose, { Document, Schema } from "mongoose";

interface IMember {
  memberId: string;
  lastSeen?: Date;
}

export interface IConversation extends Document {
  members: Array<IMember>;
}

const conversationSchema = new Schema<IConversation>(
  {
    members: {
      type: [
        {
          memberId: {
            type: String,
          },
          lastSeen: {
            type: Date,
            required: false,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default ConversationModel;
