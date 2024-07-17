import { User } from "src/user/user.entity";

export class TicTacToe {
    user1: User;
    user2: User;
    currentUser: User;
    firstTurn: User;
    private readonly board: number[];
    gameId: string;
    gameStart: Date;
    userPlayerMap = new Map<number, number>();

    constructor(user1: User, user2: User) {
        this.user1 = user1;
        this.user2 = user2;
        if (Math.round(Math.random()) === 0) {
            this.firstTurn = user1;
        } else {
            this.firstTurn = user2;
        }
        this.currentUser = this.firstTurn;
        this.userPlayerMap.set(user1.id, 1);
        this.userPlayerMap.set(user2.id, 2);
        this.board = [0,0,0,
                      0,0,0,
                      0,0,0];
        this.gameId = this.generateString(10);
        this.gameStart = new Date();
    }

    private generateString(length) {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    makeMove(user: User, index: number): number { //-1WrongUser -2NotValidMove -3Draw 0Success >0WinnerID
        if( user.id !== this.currentUser.id) return -1;
        if(!this.isValidMove(index)) return -2;
        this.board[index] = this.userPlayerMap.get(user.id);
        if(this.isGameOver() !== 0) return this.isGameOver();
        this.currentUser = (this.currentUser.id === this.user1.id) ? this.user2 : this.user1;
        return 0;
    }

    private isValidMove(index: number): boolean {
        if( index > 8 || index < 0) return false;
        for(let i = 0; i < this.board.length; i++) {
            if(this.board[index] !== 0) {
                return false;
            }
        }
        return true;
    }

    getBoard(): number[] {
        return this.board;
    }

    private isGameOver(): number { // 0No -3Draw >0WinnerId
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6], // Diagonals
        ];
      
        for (const pattern of winPatterns) {
            if (pattern.every(index => this.board[index] === this.userPlayerMap.get(this.user1.id))) {
                return this.user1.id;
            }
            if (pattern.every(index => this.board[index] === this.userPlayerMap.get(this.user2.id))) {
                return this.user2.id;
            }
        }
        let draw = true;
        for(let i = 0; i < this.board.length; i++) {
            if(this.board[i] === 0) {
                draw = false;
            }
        }
        if(draw) return -3;
        return 0;
    }


}