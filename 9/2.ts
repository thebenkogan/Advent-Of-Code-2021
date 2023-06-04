import { readFileSync } from "fs";

const input = readFileSync("9/in.txt").toString().split("\n");
const DIRS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
];
const ROWS = input.length;
const COLS = input[0].length;

function inBounds([x, y]: [number, number]) {
    return x >= 0 && x < COLS && y >= 0 && y < ROWS;
}

function dfs(lowpoint: [number, number]) {
    let basinSize = 0;
    const stack = [lowpoint];
    const seen = new Set<string>();
    seen.add(lowpoint.toString());

    while (stack.length > 0) {
        const [x, y] = stack.pop()!;
        basinSize++;
        for (const [dx, dy] of DIRS) {
            const px = x + dx;
            const py = y + dy;
            if (!inBounds([px, py]) || seen.has([px, py].toString())) continue;
            if (
                parseInt(input[py][px]) <= parseInt(input[y][x]) ||
                parseInt(input[py][px]) === 9
            ) {
                continue;
            }
            seen.add([px, py].toString());
            stack.push([px, py]);
        }
    }

    return basinSize;
}

let basinSizes: number[] = [];
for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
        let lowest = true;
        for (const [dx, dy] of DIRS) {
            const px = x + dx;
            const py = y + dy;
            if (!inBounds([px, py])) continue;
            if (input[py][px] <= input[y][x]) {
                lowest = false;
                break;
            }
        }
        if (lowest) {
            basinSizes.push(dfs([x, y]));
        }
    }
}

basinSizes.sort((a, b) => b - a);

console.log(basinSizes.slice(0, 3).reduce((a, b) => a * b, 1));
