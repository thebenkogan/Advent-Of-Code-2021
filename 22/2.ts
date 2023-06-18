import { readFileSync } from "fs";

const input = readFileSync("22/in.txt").toString().split("\n");

type Cube = {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
};

function overlapRanges(
  r1: [number, number],
  r2: [number, number]
): [number, number] | null {
  const [r1Min, r1Max] = r1;
  const [r2Min, r2Max] = r2;
  const overlapMin = Math.max(r1Min, r2Min);
  const overlapMax = Math.min(r1Max, r2Max);
  if (overlapMin > overlapMax) return null;
  return [overlapMin, overlapMax];
}

function overlapCubes(c1: Cube, c2: Cube): Cube | null {
  const xOverlap = overlapRanges(c1.xRange, c2.xRange);
  const yOverlap = overlapRanges(c1.yRange, c2.yRange);
  const zOverlap = overlapRanges(c1.zRange, c2.zRange);
  if (xOverlap === null || yOverlap === null || zOverlap === null) return null;
  return {
    xRange: xOverlap,
    yRange: yOverlap,
    zRange: zOverlap,
  };
}

const steps: ["on" | "off", Cube][] = input.map((l) => {
  const [status, rangesStr] = l.split(" ");
  const [xRange, yRange, zRange] = rangesStr
    .match(/-?\d+\.\.-?\d+/g)!
    .map((r) => r.split("..").map((n) => parseInt(n)) as [number, number]);
  return [
    status as "on" | "off",
    {
      xRange,
      yRange,
      zRange,
    },
  ];
});

const cuboids: [Cube, -1 | 1][] = []; // tuples of cube region and sign to apply to volume
for (const [status, cube] of steps) {
  const cubesToAdd: [Cube, -1 | 1][] = [];
  if (status === "on") cubesToAdd.push([cube, 1]);
  for (let i = 0; i < cuboids.length; i++) {
    const [otherCube, otherSign] = cuboids[i];
    const overlap = overlapCubes(cube, otherCube);
    if (overlap === null) continue;
    cubesToAdd.push([overlap, -otherSign as -1 | 1]);
  }
  cuboids.push(...cubesToAdd);
}

let totalVolume = 0;
for (const [cube, sign] of cuboids) {
  const [xMin, xMax] = cube.xRange;
  const [yMin, yMax] = cube.yRange;
  const [zMin, zMax] = cube.zRange;
  const volume =
    (xMax - xMin + 1) * (yMax - yMin + 1) * (zMax - zMin + 1) * sign;
  totalVolume += volume;
}

console.log(totalVolume);
