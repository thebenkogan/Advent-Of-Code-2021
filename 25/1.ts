import { readFileSync } from "fs";

const input = readFileSync("25/in.txt").toString().split("\n");
let ocean = input.map((line) => line.split(""));
const ROWS = ocean.length;
const COLS = ocean[0].length;

function step(ocean: string[][]): [string[][], boolean] {
  const newOcean = ocean.map((row) => [...row]);
  let moved = false;

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const spot = ocean[i][j];
      if (spot === ".") continue;
      if (spot === ">") {
        const nextX = (j + 1) % COLS;
        if (ocean[i][nextX] === ".") {
          moved = true;
          newOcean[i][nextX] = ">";
          newOcean[i][j] = ".";
        }
      }
      if (spot === "v") {
        const prevX = (j - 1 + COLS) % COLS;
        const nextY = (i + 1) % ROWS;
        const nextX = (j + 1) % COLS;
        if (ocean[nextY][j] === ">" && ocean[nextY][nextX] === ".") {
          moved = true;
          newOcean[nextY][j] = "v";
          newOcean[i][j] = ".";
          newOcean[nextY][nextX] = ">";
          ocean[nextY][j] = ".."; // HACK
          ocean[nextY][nextX] = ".."; // HACK
        } else if (ocean[nextY][prevX] !== ">" && ocean[nextY][j] === ".") {
          moved = true;
          newOcean[nextY][j] = "v";
          newOcean[i][j] = ".";
        }
      }
    }
  }

  return [newOcean, moved];
}

let count = 1;
while (true) {
  const [newOcean, moved] = step(ocean);
  if (!moved) break;
  ocean = newOcean;
  count++;
}

console.log(count);
