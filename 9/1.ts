import { readFileSync } from "fs";

const input = readFileSync("9/in.txt").toString().split("\n");
const DIRS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
];
const ROWS = input.length;
const COLS = input[0].length;

let riskLevel = 0;
for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
        let lowest = true;
        for (const [dx, dy] of DIRS) {
            const px = x + dx;
            const py = y + dy;
            if (py < 0 || py >= ROWS || px < 0 || px >= COLS) {
                continue;
            }
            if (input[py][px] <= input[y][x]) {
                lowest = false;
                break;
            }
        }
        if (lowest) {
            riskLevel += parseInt(input[y][x]) + 1;
        }
    }
}

console.log(riskLevel);
