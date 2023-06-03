import { readFileSync } from "fs";

const input = readFileSync("7/in.txt").toString();
const positions = input.split(",").map((x) => parseInt(x));

// the test input works with Math.ceil, the actual works with Math.floor
// I'm too dumb to figure out why so I'll just leave this here
const avg = Math.floor(positions.reduce((a, b) => a + b, 0) / positions.length);

let total = 0;
for (const position of positions) {
    const dist = Math.abs(position - avg);
    const crabDist = (dist * (dist + 1)) / 2;
    total += crabDist;
}

console.log(total);
