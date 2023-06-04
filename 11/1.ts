import { readFileSync } from "fs";

const input = readFileSync("11/in.txt").toString().split("\n");
const STEPS = 100;
const DIRS = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
];

let energyLevels = input.map((row) => row.split("").map((c) => parseInt(c)));

let flashes = 0;
for (let i = 0; i < STEPS; i++) {
    energyLevels = energyLevels.map((row) => row.map((c) => c + 1));
    const seen = new Set();
    for (let y = 0; y < energyLevels.length; y++) {
        for (let x = 0; x < energyLevels[y].length; x++) {
            if (energyLevels[y][x] > 9 && !seen.has([x, y].toString())) {
                seen.add([x, y].toString());
                const stack = [[x, y]];
                while (stack.length > 0) {
                    const [x, y] = stack.pop()!;
                    energyLevels[y][x] = 0;
                    flashes++;
                    for (const [dx, dy] of DIRS) {
                        const px = x + dx;
                        const py = y + dy;
                        if (py < 0 || py >= 10 || px < 0 || px >= 10) continue;
                        if (seen.has([px, py].toString())) continue;
                        energyLevels[py][px]++;
                        if (energyLevels[py][px] > 9) {
                            seen.add([px, py].toString());
                            stack.push([px, py]);
                        }
                    }
                }
            }
        }
    }
}

console.log(flashes);
