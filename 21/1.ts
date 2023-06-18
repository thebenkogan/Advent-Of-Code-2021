import { readFileSync } from "fs";

const input = readFileSync("21/in.txt").toString().split("\n");
let p1 = parseInt(input[0].split(" ").at(-1)!);
let p2 = parseInt(input[1].split(" ").at(-1)!);

function* deterministicDice() {
  let dice = 1;
  while (true) {
    yield dice;
    dice++;
    if (dice === 101) dice = 1;
  }
}

const dice = deterministicDice();
let p1Turn = true;
let p1Score = 0;
let p2Score = 0;
let rolls = 0;
while (p1Score < 1000 && p2Score < 1000) {
  let val = 0;
  for (let i = 0; i < 3; i++) {
    val += dice.next().value as number;
  }
  rolls += 3;
  if (p1Turn) {
    p1 = (p1 + val) % 10 === 0 ? 10 : (p1 + val) % 10;
    p1Score += p1;
  } else {
    p2 = (p2 + val) % 10 === 0 ? 10 : (p2 + val) % 10;
    p2Score += p2;
  }
  p1Turn = !p1Turn;
}

console.log(rolls * Math.min(p1Score, p2Score));
