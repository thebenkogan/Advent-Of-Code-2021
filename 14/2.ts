import { readFileSync } from "fs";

const input = readFileSync("14/in.txt").toString();

const STEPS = 40;
let [startStr, rulesStr] = input.split("\n\n");

const rules = Object.fromEntries(
  rulesStr.split("\n").map((s) => s.split(" -> "))
);

let pairs: Record<string, number> = {};
for (let j = 0; j < startStr.length - 1; j++) {
  const pair = startStr[j] + startStr[j + 1];
  pairs[pair] ||= 0;
  pairs[pair]++;
}

for (let i = 0; i < STEPS; i++) {
  const nextPairs: Record<string, number> = {};
  for (const [pair, count] of Object.entries(pairs)) {
    const add = rules[pair];
    const firstPair = pair[0] + add;
    const secondPair = add + pair[1];
    nextPairs[firstPair] ||= 0;
    nextPairs[secondPair] ||= 0;
    nextPairs[firstPair] += count;
    nextPairs[secondPair] += count;
  }
  pairs = nextPairs;
}

const counts: Record<string, number> = {};
for (const [[fst, _], count] of Object.entries(pairs)) {
  counts[fst] ||= 0;
  counts[fst] += count;
}

// we miss one count (the last letter), which is exactly the last letter of
// the start string since the last character in the string never changes
counts[startStr[startStr.length - 1]]++;

const vals = Object.values(counts);
const max = Math.max(...vals);
const min = Math.min(...vals);

console.log(max - min);
