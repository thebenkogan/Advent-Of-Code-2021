// I have no time to reverse engineer this stuff. Thank you this guy:
// https://www.reddit.com/r/adventofcode/comments/rnejv5/comment/hpsjfis/?utm_source=share&utm_medium=web2x&context=3

import { readFileSync } from "fs";

const input = readFileSync("24/in.txt").toString().split("\n");

let maxInput = 99999999999999;
const stack = [];

for (let i = 0; i < 14; i++) {
  const a = parseInt(input[18 * i + 5].split(" ").at(-1)!);
  const b = parseInt(input[18 * i + 15].split(" ").at(-1)!);

  if (a > 0) {
    stack.push([i, b]);
    continue;
  }

  const [j, b2] = stack.pop()!;
  const power = 13 - (a > -b2 ? j : i);
  maxInput -= Math.abs((a + b2) * 10 ** power);
}

console.log(maxInput);
