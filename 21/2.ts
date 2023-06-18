import { readFileSync } from "fs";

const input = readFileSync("21/in.txt").toString().split("\n");
const p1 = parseInt(input[0].split(" ").at(-1)!);
const p2 = parseInt(input[1].split(" ").at(-1)!);

type Position = {
  p1Turn: boolean;
  p1Pos: number;
  p2Pos: number;
  p1Score: number;
  p2Score: number;
  universes: number;
};

const rollsMap = new Map<number, number>(); // dice sum -> number of universes that get that sum
let rolls: number[][] = [[]];
for (let i = 0; i < 3; i++) {
  const nextRolls = [];
  for (let val = 1; val < 4; val++) {
    nextRolls.push(...rolls.map((r) => [...r, val]));
  }
  rolls = nextRolls;
}
rolls
  .map((r) => r.reduce((a, b) => a + b, 0))
  .forEach((r) => rollsMap.set(r, (rollsMap.get(r) ?? 0) + 1));

function hash(p: Position) {
  return `${p.p1Turn},${p.p1Pos},${p.p2Pos},${p.p1Score},${p.p2Score}`;
}

const stack: Position[] = [
  {
    p1Turn: true,
    p1Pos: p1,
    p2Pos: p2,
    p1Score: 0,
    p2Score: 0,
    universes: 1,
  },
];
let p1Wins = 0;
let p2Wins = 0;
while (stack.length) {
  const { p1Turn, p1Pos, p2Pos, p1Score, p2Score, universes } = stack.pop()!;
  if (p1Score >= 21) {
    p1Wins += universes;
    continue;
  }
  if (p2Score >= 21) {
    p2Wins += universes;
    continue;
  }
  for (const [val, numUni] of rollsMap.entries()) {
    if (p1Turn) {
      const nextP1 = (p1Pos + val) % 10 === 0 ? 10 : (p1Pos + val) % 10;
      const nextP1Score = p1Score + nextP1;
      stack.push({
        p1Turn: false,
        p1Pos: nextP1,
        p2Pos,
        p1Score: nextP1Score,
        p2Score,
        universes: universes * numUni,
      });
    } else {
      const nextP2 = (p2Pos + val) % 10 === 0 ? 10 : (p2Pos + val) % 10;
      const nextP2Score = p2Score + nextP2;
      stack.push({
        p1Turn: true,
        p1Pos,
        p2Pos: nextP2,
        p1Score,
        p2Score: nextP2Score,
        universes: universes * numUni,
      });
    }
  }
}

console.log(Math.max(p1Wins, p2Wins));
