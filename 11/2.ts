import { readFileSync } from "fs";

const input = readFileSync("11/in.txt").toString().split("\n");
const STEPS = 300; // this is just some number that is greater than both the test and input target values
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
    const seenFlashes = new Set();
    for (let y = 0; y < energyLevels.length; y++) {
        for (let x = 0; x < energyLevels[y].length; x++) {
            if (energyLevels[y][x] > 9 && !seenFlashes.has([x, y].toString())) {
                seenFlashes.add([x, y].toString());
                const stack = [[x, y]];
                while (stack.length > 0) {
                    const [x, y] = stack.pop()!;
                    energyLevels[y][x] = 0;
                    flashes++;
                    for (const [dx, dy] of DIRS) {
                        const px = x + dx;
                        const py = y + dy;
                        if (py < 0 || py >= 10 || px < 0 || px >= 10) continue;
                        if (seenFlashes.has([px, py].toString())) continue;
                        energyLevels[py][px]++;
                        if (energyLevels[py][px] > 9) {
                            seenFlashes.add([px, py].toString());
                            stack.push([px, py]);
                        }
                    }
                }
            }
        }
    }
    if (seenFlashes.size === 100) {
        console.log(i + 1);
        break;
    }
}
