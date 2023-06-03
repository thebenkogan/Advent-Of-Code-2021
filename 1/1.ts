import { readFileSync } from "fs";

const input = readFileSync("1/in.txt").toString();

let count = 0;
let prev = Infinity;
for (const line of input.split("\n")) {
    const depth = parseInt(line);
    if (depth > prev) count++;
    prev = depth;
}

console.log(count);
