import { readFileSync } from "fs";

const input = readFileSync("4/in.txt").toString().split("\n\n");

const callNumbers = input[0].split(",").map((n) => parseInt(n));

class Board {
    board: { num: number; marked: boolean }[][];
    won: boolean = false;
    private numMap: Map<number, [number, number]>;

    constructor(boardStr: string) {
        this.board = new Array(5).fill(0).map(() => new Array(5).fill(0));
        this.numMap = new Map();
        boardStr.split("\n").forEach((row, y) => {
            row.split(" ")
                .filter((cell) => cell !== "")
                .forEach((cell, x) => {
                    const num = parseInt(cell);
                    this.board[y][x] = { num, marked: false };
                    this.numMap.set(num, [x, y]);
                });
        });
    }

    private getScore(calledNum: number): number {
        let unmarkedTotal = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (!this.board[i][j].marked) {
                    unmarkedTotal += this.board[i][j].num;
                }
            }
        }
        return unmarkedTotal * calledNum;
    }

    /**
     * Marks the given number on the board.
     * @param num number to mark on board
     * @returns score if the board wins, otherwise undefined
     */
    markNumber(num: number): number | undefined {
        const pos = this.numMap.get(num);
        if (!pos) return undefined;
        this.board[pos[1]][pos[0]].marked = true;

        let [rx, ry] = [0, pos[1]];
        let rowWin = true;
        for (; rx < 5; rx++) {
            rowWin &&= this.board[ry][rx].marked;
        }

        let [cx, cy] = [pos[0], 0];
        let colWin = true;
        for (; cy < 5; cy++) {
            colWin &&= this.board[cy][cx].marked;
        }

        if (rowWin || colWin) {
            this.won = true;
            return this.getScore(num);
        }
    }
}

const boards = input.slice(1).map((boardStr) => new Board(boardStr));
const scores = [];

for (const callNum of callNumbers) {
    for (const board of boards) {
        if (board.won) continue;
        const score = board.markNumber(callNum);
        if (score !== undefined) scores.push(score);
    }
}

console.log(scores[scores.length - 1]);
