import { readFileSync } from "fs";

const input = readFileSync("13/in.txt").toString();

const [dotStrs, foldStrs] = input.split("\n\n").map((x) => x.split("\n"));
let maxDotX = 0;
let maxDotY = 0;
const dots = dotStrs
    .map((x) => x.split(","))
    .map(([xStr, yStr]) => {
        const [x, y] = [parseInt(xStr), parseInt(yStr)];
        maxDotX = Math.max(maxDotX, x);
        maxDotY = Math.max(maxDotY, y);
        return [x, y];
    });
const folds: [string, number][] = foldStrs
    .map((x) => x.split(" ").at(-1)!.split("="))
    .map((x) => [x[0], parseInt(x[1])]);

let paper: string[][] = new Array(maxDotY + 1)
    .fill("")
    .map(() => new Array(maxDotX + 1).fill("."));
for (const [dx, dy] of dots) paper[dy][dx] = "#";

function foldPoint(
    [x, y]: [number, number],
    axis: string,
    val: number
): [number, number] {
    if (axis === "x") {
        return [val - (x - val), y];
    } else {
        return [x, val - (y - val)];
    }
}

for (const [foldAxis, foldVal] of folds) {
    const nextMaxDotX = foldAxis === "x" ? foldVal - 1 : maxDotX;
    const nextMaxDotY = foldAxis === "y" ? foldVal - 1 : maxDotY;
    const foldedPaper: string[][] = new Array(nextMaxDotY + 1)
        .fill("")
        .map(() => new Array(nextMaxDotX + 1).fill("."));
    for (let x = 0; x <= maxDotX; x++) {
        for (let y = 0; y <= maxDotY; y++) {
            if (
                (foldAxis === "x" && x > foldVal) ||
                (foldAxis === "y" && y > foldVal)
            ) {
                const [fx, fy] = foldPoint([x, y], foldAxis, foldVal);
                foldedPaper[fy][fx] = paper[fy][fx] === "#" ? "#" : paper[y][x];
            } else if (
                (foldAxis === "x" && x === foldVal) ||
                (foldAxis === "y" && y === foldVal)
            ) {
                continue;
            } else {
                foldedPaper[y][x] = paper[y][x];
            }
        }
    }
    paper = foldedPaper;
    maxDotX = nextMaxDotX;
    maxDotY = nextMaxDotY;
}

for (const row of paper) console.log(row.join(""));
