import { readFileSync } from "fs";

const lines = readFileSync("10/in.txt").toString().split("\n");

const closingScores: Record<string, number> = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
};

const closedToOpen: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
    ">": "<",
};

const openToClosed: Record<string, string> = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
};

let scores = [];
for (const line of lines) {
    let valid = true;
    const stack: string[] = [];
    for (const c of line) {
        if (closedToOpen[c] !== undefined) {
            const associatedOpen = stack.pop();
            if (associatedOpen !== closedToOpen[c]) {
                valid = false;
                break;
            }
        } else {
            stack.push(c);
        }
    }
    if (!valid) continue;

    let score = 0;
    while (stack.length > 0) {
        score *= 5;
        score += closingScores[openToClosed[stack.pop()!]];
    }
    scores.push(score);
}

scores.sort((a, b) => a - b);

console.log(scores[Math.floor(scores.length / 2)]);
