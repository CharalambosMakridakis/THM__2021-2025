import { Injectable } from "@nestjs/common";
import { User } from "src/user/user.entity";

@Injectable()
export class QueueService {
    static queue: User[] = [];

    private checkQueueForGame(newUser: User): User[] | null {
        if(QueueService.queue.length === 0) return null;

        for (let i = 0; i < QueueService.queue.length; i++) {
            if (Math.abs(QueueService.queue[i].elo - newUser.elo) <= 200) {
                const usersForMatch: User[] = [QueueService.queue[i], newUser];
                QueueService.queue.splice(i, 1);
                return usersForMatch;
              }
        }


        return null;
    }

    async add(user: User): Promise<User[] | null> {
        if(QueueService.queue.filter((Quser) => Quser.id ===  user.id).length > 0) return;
        const hasOp = this.checkQueueForGame(user);
        if(!hasOp) QueueService.queue.push(user);
        return hasOp;
    }

    async remove(userId: number): Promise<void> {
        if(QueueService.queue.length === 0) return;
        QueueService.queue = QueueService.queue.filter(user => user.id !== userId);
    }

    async getCurrentQueue() {
        try {
            return QueueService.queue;
        } catch (error) {
            throw (error)
        }

    }
}