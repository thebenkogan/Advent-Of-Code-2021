import { readFileSync } from "fs";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

const input = readFileSync("15/in.txt").toString().split("\n");

const DIRS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const dists: number[][] = new Array(input.length)
  .fill(Infinity)
  .map((_) => new Array(input.length).fill(Infinity));
const visited: boolean[][] = new Array(input.length)
  .fill(false)
  .map((_) => new Array(input.length).fill(false));
const frontier = new MinPriorityQueue<[number, number]>(
  ([x, y]) => dists[y][x]
);

dists[0][0] = 0;
frontier.push([0, 0]);

while (frontier.size() > 0) {
  const [x, y] = frontier.pop();
  if (x === input.length - 1 && y === input.length - 1) break;
  const risk = dists[y][x];
  visited[y][x] = true;
  for (const [dx, dy] of DIRS) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= input.length || ny < 0 || ny >= input.length) continue;
    const nextRisk = risk + parseInt(input[ny][nx]);
    if (!visited[ny][nx] && nextRisk < dists[ny][nx]) {
      dists[ny][nx] = nextRisk;
      frontier.push([nx, ny]);
    }
  }
}

console.log(dists[input.length - 1][input.length - 1]);
