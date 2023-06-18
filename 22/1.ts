import { readFileSync } from "fs";

const input = readFileSync("22/in.txt").toString().split("\n");
const steps: [string, [number, number], [number, number], [number, number]][] =
  input.map((l) => {
    const [status, rangesStr] = l.split(" ");
    const [xRange, yRange, zRange] = rangesStr
      .match(/-?\d+\.\.-?\d+/g)!
      .map((r) => r.split("..").map((n) => parseInt(n)) as [number, number]);
    return [status, xRange, yRange, zRange];
  });

const onCubes = new Set<string>();
for (const step of steps) {
  const [status, [xMin, xMax], [yMin, yMax], [zMin, zMax]] = step;
  for (let x = Math.max(xMin, -50); x <= Math.min(xMax, 50); x++) {
    for (let y = Math.max(yMin, -50); y <= Math.min(yMax, 50); y++) {
      for (let z = Math.max(zMin, -50); z <= Math.min(zMax, 50); z++) {
        if (status === "on") {
          onCubes.add(`${x},${y},${z}`);
        } else {
          onCubes.delete(`${x},${y},${z}`);
        }
      }
    }
  }
}

console.log(onCubes.size);
