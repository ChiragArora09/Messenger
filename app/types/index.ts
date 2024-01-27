import { Conversation, Message, User } from "@prisma/client";

export type WholeMessageType = Message & {
    sender: User,
    seen: User[]
}

export type WholeConversationType = Conversation & {
    users: User[],
    messages: WholeMessageType[]
}