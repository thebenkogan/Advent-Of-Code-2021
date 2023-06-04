import { readFileSync } from "fs";

const input = readFileSync("13/in.txt").toString();

const [dotStrs, foldStrs] = input.split("\n\n").map((x) => x.split("\n"));
const dots = dotStrs.map((x) => x.split(",").map((y) => parseInt(y)));
const folds: [string, number][] = foldStrs
    .map((x) => x.split(" ").at(-1)!.split("="))
    .map((x) => [x[0], parseInt(x[1])]);

const paper = new Set<string>();
for (const dot of dots) paper.add(dot.toString());

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

const [foldAxis, foldVal] = folds[0];
const foldedPaper = new Set<string>();
for (const [x, y] of dots) {
    if (
        (foldAxis === "x" && x > foldVal) ||
        (foldAxis === "y" && y > foldVal)
    ) {
        foldedPaper.add(foldPoint([x, y], foldAxis, foldVal).toString());
    } else {
        foldedPaper.add([x, y].toString());
    }
}

console.log(foldedPaper.size);
