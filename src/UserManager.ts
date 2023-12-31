import { connection } from "websocket";
import { OutgoingMessage } from "./messages/outgoingMessages";

interface User {
    name: string,
    id: string,
    conn: connection
};

interface Room {
    users: User[]
};

export class UserManager{
    private rooms : Map<string, Room>

    constructor(){
        this.rooms = new Map<string, Room>()
    }

    addUser(roomId: string, userId: string,name:string, socket: connection){
        if(!this.rooms.get(roomId)){
            this.rooms.set(roomId,{
               users:[]
            })
        }
         this.rooms.get(roomId)?.users.push({
            name,
            id: userId,
            conn: socket
         });

         socket.on('close', (reasonCode, decript)=> {
            this.removeUser(roomId, userId)
         })
       
    };

    removeUser(roomId:string, userId:string){

        const users = this.rooms.get(roomId)?.users
        if(!users){
            return
        }
        const user = users.filter(({id})=> id !== userId);
    };

    getUser(roomId: string, userId: string){
        const user = this.rooms.get(roomId)?.users.find((({id})=> id === userId));
        return user ?? null
    }

    broadCast(roomId:string, userId:string, message:OutgoingMessage){

        const user = this.getUser(roomId, userId)
        if(!user){
            console.log('no user found')
            return;
        };

        const room = this.rooms.get(roomId)
        if(!room){
            return
        };

        room.users.forEach(({id, conn})=> {
            if( userId === id){
                return
            }else{
                console.log('outputmessage'+ JSON.stringify(message))
                conn.sendUTF(JSON.stringify(message))
            }
        })
    }
}