import { readFileSync } from "fs";

const input = readFileSync("17/in.txt").toString();
const numRegex = /(-?\d+)/g;
const [minX, maxX, minY, maxY] = input.match(numRegex)!.map((n) => parseInt(n));

const MIN_SIM_VY = -100;
const MAX_SIM_VY = 100;
const MAX_SIM_VX = 1000;

let total = 0;
for (let _vy = MIN_SIM_VY; _vy <= MAX_SIM_VY; _vy++) {
  for (let _vx = 0; _vx <= MAX_SIM_VX; _vx++) {
    let vx = _vx;
    let vy = _vy;
    let x = 0;
    let y = 0;
    while (x < maxX && y > minY) {
      x += vx;
      y += vy;
      vx = vx > 0 ? vx - 1 : 0;
      vy--;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        total++;
        break;
      }
    }
  }
}

console.log(total);
