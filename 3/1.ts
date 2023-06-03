import { readFileSync } from "fs";

const input = readFileSync("3/in.txt").toString().split("\n");

type BinaryCounts = { 0: number; 1: number };

const stats: BinaryCounts[] = [];
for (let i = 0; i < input[0].length; i++) {
    stats.push({ 0: 0, 1: 0 });
}

for (const line of input) {
    for (let i = 0; i < line.length; i++) {
        stats[i][parseInt(line[i]) as 0 | 1] += 1;
    }
}

const gammaRate = parseInt(
    stats.map((stat) => (stat[0] > stat[1] ? "0" : "1")).join(""),
    2
);
const epsilonRate = parseInt(
    stats.map((stat) => (stat[0] > stat[1] ? "1" : "0")).join(""),
    2
);

console.log(gammaRate * epsilonRate);
