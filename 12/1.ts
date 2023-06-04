import { readFileSync } from "fs";

const input = readFileSync("12/test.txt").toString().split("\n");

function isSmallCave(cave: string): boolean {
    return cave.toLowerCase() === cave;
}

const adjMap = new Map<string, string[]>();
for (const edge of input) {
    const [from, to] = edge.split("-");
    if (!adjMap.has(from)) adjMap.set(from, []);
    if (!adjMap.has(to)) adjMap.set(to, []);
    adjMap.get(from)!.push(to);
    adjMap.get(to)!.push(from);
}

const seen = new Set<string>(["start"]);
const stack: [string, Set<string>][] = [["start", seen]];
let paths = 0;
while (stack.length > 0) {
    const [cave, visitedSmallCaves] = stack.pop()!;
    if (cave === "end") {
        paths++;
        continue;
    }
    for (const neighbor of adjMap.get(cave)!) {
        if (visitedSmallCaves.has(neighbor)) continue;
        const nextSeen = new Set(visitedSmallCaves);
        if (isSmallCave(neighbor) && neighbor !== "end") {
            nextSeen.add(neighbor);
        }
        stack.push([neighbor, nextSeen]);
    }
}

console.log(paths);
