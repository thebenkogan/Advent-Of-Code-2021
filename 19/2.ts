import { Queue } from "@datastructures-js/queue";
import { readFileSync } from "fs";
import Matrix, { inverse } from "ml-matrix";

const input = readFileSync("19/in.txt").toString();

const scanners = input.split("\n\n").map((s) =>
  s
    .split("\n")
    .slice(1)
    .map((p) => new Matrix([p.split(",").map((n) => parseInt(n))]))
);

const s = new Set<string>();
const rotations: Matrix[] = [];
for (let rotX = 0; rotX < 2 * Math.PI; rotX += Math.PI / 2) {
  for (let rotY = 0; rotY < 2 * Math.PI; rotY += Math.PI / 2) {
    for (let rotZ = 0; rotZ < 2 * Math.PI; rotZ += Math.PI / 2) {
      if (rotX === 0 && rotY === 0 && rotZ === 0) continue;
      const rotXMatrix = new Matrix([
        [1, 0, 0],
        [0, Math.cos(rotX), -Math.sin(rotX)],
        [0, Math.sin(rotX), Math.cos(rotX)],
      ]);
      const rotYMatrix = new Matrix([
        [Math.cos(rotY), 0, Math.sin(rotY)],
        [0, 1, 0],
        [-Math.sin(rotY), 0, Math.cos(rotY)],
      ]);
      const rotZMatrix = new Matrix([
        [Math.cos(rotZ), -Math.sin(rotZ), 0],
        [Math.sin(rotZ), Math.cos(rotZ), 0],
        [0, 0, 1],
      ]);
      const rotation = rotXMatrix.mmul(rotYMatrix).mmul(rotZMatrix).round();
      if (s.has(rotation.toString())) continue;
      s.add(rotation.toString());
      rotations.push(rotation);
    }
  }
}

function hash(v: Matrix) {
  return v.to1DArray().toString();
}

function getRotationAndTranslation(s1: Matrix[], s2: Matrix[]) {
  let bestRot = rotations[0];
  let bestTranslation = new Matrix([[0, 0, 0]]);
  let mostMatches = 0;
  for (const rot of rotations) {
    const disps = new Map<string, number>();
    for (let i = 0; i < s1.length; i++) {
      for (let j = 0; j < s2.length; j++) {
        const rotated = s2[j].mmul(rot);
        const trans = Matrix.sub(s1[i], rotated);
        const transHash = hash(trans);
        if (!disps.has(transHash)) disps.set(transHash, 0);
        const nextCount = disps.get(transHash)! + 1;
        disps.set(transHash, nextCount);
        if (nextCount > mostMatches) {
          mostMatches = nextCount;
          bestRot = rot;
          bestTranslation = trans;
        }
      }
    }
  }

  if (mostMatches >= 12) {
    return [bestRot, bestTranslation];
  } else {
    return null;
  }
}

const adj: [number, Matrix, Matrix][][] = [];
for (const _ of scanners) adj.push([]);
for (let i = 0; i < scanners.length; i++) {
  for (let j = i + 1; j < scanners.length; j++) {
    const transform = getRotationAndTranslation(scanners[i], scanners[j]);
    if (!transform) continue;
    const [rot, trans] = transform;
    adj[i].push([j, rot, trans]);
    adj[j].push([i, inverse(rot), Matrix.mul(trans, -1).mmul(inverse(rot))]);
  }
}

const pointSet = new Set<string>();
const points = [];
const q = new Queue<[number, Matrix, Matrix]>([
  [0, Matrix.identity(3), new Matrix([[0, 0, 0]])],
]);
const visited = new Set<number>([0]);
const scannerPositions = [];
while (!q.isEmpty()) {
  const [si, rot, trans] = q.dequeue()!;
  scannerPositions.push(trans);
  for (const p of scanners[si]) {
    const transformed = p.mmul(rot).add(trans);
    const hashed = hash(transformed);
    if (pointSet.has(hashed)) continue;
    points.push(transformed);
    pointSet.add(hashed);
  }
  for (const [ni, nRot, nTrans] of adj[si]) {
    if (visited.has(ni)) continue;
    visited.add(ni);
    const nextRot = nRot.mmul(rot);
    const nextTrans = nTrans.mmul(rot).add(trans);
    q.enqueue([ni, nextRot, nextTrans]);
  }
}

function manhattanDistance(v1: Matrix, v2: Matrix) {
  return Matrix.sub(v1, v2).abs().sum();
}

let maxDist = 0;
for (let i = 0; i < scannerPositions.length; i++) {
  for (let j = i + 1; j < scannerPositions.length; j++) {
    maxDist = Math.max(
      maxDist,
      manhattanDistance(scannerPositions[i], scannerPositions[j])
    );
  }
}
console.log(maxDist);
