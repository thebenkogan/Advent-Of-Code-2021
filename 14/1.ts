import { readFileSync } from "fs";

const input = readFileSync("14/in.txt").toString();

const STEPS = 10;
let [start, rulesStr] = input.split("\n\n");

const rules = Object.fromEntries(
  rulesStr.split("\n").map((s) => s.split(" -> "))
);

for (let i = 0; i < STEPS; i++) {
  let next = "";
  for (let j = 0; j < start.length - 1; j++) {
    const pair = start[j] + start[j + 1];
    next += start[j] + rules[pair];
  }
  start = next + start[start.length - 1];
}

const counts: Record<string, number> = {};
for (const c of start) {
  counts[c] ||= 0;
  counts[c]++;
}
const vals = Object.values(counts);
const max = Math.max(...vals);
const min = Math.min(...vals);

console.log(max - min);
