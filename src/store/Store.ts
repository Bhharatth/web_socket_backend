
export type UserId = string;

export interface chat {
    id: string,
    userId: UserId,
    name: string,
    message: string,
    upvotes: UserId[]
}

export abstract class Store{
    constructor(){
        
    };
    initRoom(roomId: string){

    };

    getChats(roomId: string, limit: number, offset: number){

    };
    addChat(roomId:string, userId: string, name: string, message: string){

    }
    upvote(userId:UserId, roomId:string, chatId:string){

    }
}