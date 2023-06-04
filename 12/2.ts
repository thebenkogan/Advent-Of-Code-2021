import { readFileSync } from "fs";

const input = readFileSync("12/in.txt").toString().split("\n");

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
const stack: [string, Set<string>, boolean][] = [["start", seen, false]];
let paths = 0;
while (stack.length > 0) {
    const [cave, visitedSmallCaves, didTwice] = stack.pop()!;
    if (cave === "end") {
        paths++;
        continue;
    }
    for (const neighbor of adjMap.get(cave)!) {
        if (neighbor === "start") continue;
        if (visitedSmallCaves.has(neighbor) && didTwice) continue;
        const nextDidTwice = didTwice || visitedSmallCaves.has(neighbor);
        const nextSeen = new Set(visitedSmallCaves);
        if (isSmallCave(neighbor) && neighbor !== "end") {
            nextSeen.add(neighbor);
        }
        stack.push([neighbor, nextSeen, nextDidTwice]);
    }
}

console.log(paths);
