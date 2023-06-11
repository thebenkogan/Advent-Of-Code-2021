import { readFileSync } from "fs";

const input = readFileSync("17/in.txt").toString();
const numRegex = /(-?\d+)/g;
const [minX, maxX, minY, maxY] = input.match(numRegex)!.map((n) => parseInt(n));

// with start y velocity vy, it will reach max height vy(vy+1)/2
// it will return to y = 0 with velocity -(vy + 1)
// the maximum return to 0 speed should be minY, i.e. vy + 1 = abs(minY)
// so vy = abs(minY) - 1, calculate max height:

console.log((-minY * (-minY - 1)) / 2);
