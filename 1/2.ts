import { readFileSync } from "fs";

const input = readFileSync("1/in.txt").toString();
const WINDOW_SIZE = 3;

const depths = input.split("\n").map((line) => parseInt(line));

let prevSum = depths.slice(0, WINDOW_SIZE).reduce((a, b) => a + b, 0);
let count = 0;
for (let i = 1; i < depths.length - WINDOW_SIZE + 1; i++) {
    const nextSum = prevSum - depths[i - 1] + depths[i + WINDOW_SIZE - 1];
    if (nextSum > prevSum) count++;
}

console.log(count);
