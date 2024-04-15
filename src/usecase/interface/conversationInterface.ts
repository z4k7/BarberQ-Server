interface ConversationInterface {
  save(
    conversation: Array<{ memberId: string }>,
    senderId: string
  ): Promise<any>;
  updateUserLastSeen(
    id: string,
    data: Date
  ): Promise<{ status: number; data: string }>;
  findByUserId(id: string): Promise<any>;
  checkExisting(members: Array<{ memberId: string }>): Promise<any>;

  findAllConversations(): Promise<any>;
}

export default ConversationInterface;
