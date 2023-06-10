import { readFileSync } from "fs";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

const input = readFileSync("15/in.txt").toString().split("\n");
const SIZE = input.length * 5;

const grid: number[][] = new Array(SIZE)
  .fill(0)
  .map((_) => new Array(SIZE).fill(0));

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let k = 0; k < input.length; k++) {
      for (let l = 0; l < input.length; l++) {
        let val = parseInt(input[k][l]) + i + j;
        if (val > 9) val %= 9;
        grid[input.length * i + k][input.length * j + l] = val;
      }
    }
  }
}

const DIRS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const dists: number[][] = new Array(SIZE)
  .fill(Infinity)
  .map((_) => new Array(SIZE).fill(Infinity));
const visited: boolean[][] = new Array(SIZE)
  .fill(false)
  .map((_) => new Array(SIZE).fill(false));
const frontier = new MinPriorityQueue<[number, number]>(
  ([x, y]) => dists[y][x]
);

dists[0][0] = 0;
frontier.push([0, 0]);

while (frontier.size() > 0) {
  const [x, y] = frontier.pop();
  if (x === SIZE - 1 && y === SIZE - 1) break;
  const risk = dists[y][x];
  visited[y][x] = true;
  for (const [dx, dy] of DIRS) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE) continue;
    const nextRisk = risk + grid[ny][nx];
    if (!visited[ny][nx] && nextRisk < dists[ny][nx]) {
      dists[ny][nx] = nextRisk;
      frontier.push([nx, ny]);
    }
  }
}

console.log(dists[SIZE - 1][SIZE - 1]);
