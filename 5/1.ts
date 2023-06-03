import { readFileSync } from "fs";

const input = readFileSync("5/in.txt").toString().split("\n");

type Point = {
    x: number;
    y: number;
};

type Segment = {
    start: Point;
    end: Point;
};

let maxX = 0;
let maxY = 0;
const segments: Segment[] = input
    .map((line) => {
        const [startStr, endStr] = line.split(" -> ");
        const [sx, sy] = startStr.split(",").map((n) => parseInt(n));
        const [ex, ey] = endStr.split(",").map((n) => parseInt(n));
        return {
            start: { x: sx, y: sy },
            end: { x: ex, y: ey },
        };
    })
    .filter(({ start: { x: sx, y: sy }, end: { x: ex, y: ey } }) => {
        if (sx === ex || sy === ey) {
            maxX = Math.max(maxX, sx, ex);
            maxY = Math.max(maxY, sy, ey);
            return true;
        }
    });

const field = new Array(maxY + 1)
    .fill(0)
    .map(() => new Array(maxX + 1).fill(0));

function* pointsOnSegment(s: Segment) {
    const {
        start: { x: sx, y: sy },
        end: { x: ex, y: ey },
    } = s;
    const [dx, dy] = [Math.sign(ex - sx), Math.sign(ey - sy)];
    let [x, y] = [sx, sy];
    while (x != ex + dx || y != ey + dy) {
        yield { x, y } as Point;
        x += dx;
        y += dy;
    }
}

let overLaps = 0;
for (const segment of segments) {
    for (const { x, y } of pointsOnSegment(segment)) {
        field[y][x] += 1;
        if (field[y][x] === 2) overLaps++;
    }
}

console.log(overLaps);
