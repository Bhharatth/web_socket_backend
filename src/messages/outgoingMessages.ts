export enum SupportedMessages {
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT"
}

 type Messagepayload = {
    roomId: string,
    message: string,
    name: string,
    upvote: number,
    chatId: string
};

export type OutgoingMessage = {
    type: SupportedMessages.AddChat,
    payload: Messagepayload
} | {
    type: SupportedMessages.UpdateChat,
    payload: Partial<Messagepayload>
}