import { readFileSync } from "fs";

const lines = readFileSync("10/in.txt").toString().split("\n");

const closingScores: Record<string, number> = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
};

const closedToOpen: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
    ">": "<",
};

let score = 0;
for (const line of lines) {
    const stack: string[] = [];
    for (const c of line) {
        if (closedToOpen[c] !== undefined) {
            const associatedOpen = stack.pop();
            if (associatedOpen !== closedToOpen[c]) {
                score += closingScores[c];
                break;
            }
        } else {
            stack.push(c);
        }
    }
}

console.log(score);
