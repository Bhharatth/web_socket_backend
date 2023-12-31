import z from "zod"

export enum SupportedMessages {
    JoinRoom = "JOIN_ROOM",
    SendMessage = "SEND_MESSAGE",
    UpvoteMessage = "UPVOTE_MESSAGE",
}

export type incomingMessage = {
    type: SupportedMessages.JoinRoom,
    payload: InitMessageType
} | {
    type: SupportedMessages.SendMessage,
    payload: UserMessageType

} | {
    type: SupportedMessages.UpvoteMessage,
    payload: UpvoteMesageType
}

export const InitMessage = z.object({
    name: z.string(),
    userId: z.string(),
    roomId: z.string()
})

export type InitMessageType = z.infer<typeof InitMessage>

export const UserMessages = z.object({
    userId: z.string(),
    roomId: z.string(),
    message: z.string(),
});

export type UserMessageType = z.infer<typeof UserMessages>

export const UpvoteMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
    chatId: z.string(),
});

export type UpvoteMesageType = z.infer<typeof UpvoteMessage> 
