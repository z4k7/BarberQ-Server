interface MessageInterface {
  save(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  getLastMessages(): Promise<any>;
}

export default MessageInterface;
