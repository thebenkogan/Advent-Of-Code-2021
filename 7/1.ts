import { readFileSync } from "fs";

const input = readFileSync("7/in.txt").toString();
const positions = input.split(",").map((x) => parseInt(x));

positions.sort((a, b) => a - b);
const mid = Math.floor(positions.length / 2);
const median =
    positions.length % 2 === 1
        ? positions[mid]
        : (positions[mid] + positions[mid - 1]) / 2;

let total = 0;
for (const position of positions) {
    total += Math.abs(position - median);
}

console.log(total);
