import { chat, UserId, Store } from "./Store";
let globalChatId = 0;

export interface Room {
    roomId :string,
    chats: chat[]
}

export class InMemoryStore implements Store{
    private store:Map<string, Room>
    constructor(){
        this.store = new Map<string, Room>();
    };

    initRoom(roomId: string) {
        this.store.set(roomId, {
            roomId,
            chats: []
        });
    };


    getChats(roomId: string, limit: number, offset: number) {
        const room = this.store.get(roomId);
       if(!room){
        return []
       };
       return room.chats
    }

    addChat(roomId: string, userId: string, name: string, message: string) {
        if(!this.store.get(roomId)){
            this.initRoom(roomId);
        };
        const room = this.store.get(roomId);
        if(!room){
            return;
        }
        
        const chat:chat ={
            id:(globalChatId).toString(),
            name,
            userId,
            upvotes: [],
            message,
        }

       room.chats.push(chat);
       return chat
    };
    upvote(userId: string, roomId: string, chatId: string){
        const room = this.store.get(roomId);
        if(!room){
            return
        };
        const chat = room.chats.find(x=> x.id === userId);

        if(chat){
            if(chat.upvotes.find(x=> x === userId)){
                return chat
            }
            chat.upvotes.push(userId);
        };

         return chat;
    }

}