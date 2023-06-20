import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { readFileSync } from "fs";

const input = readFileSync("23/in.txt").toString().split("\n");
const topRow = input[2].match(/\w/g)!;
const bottomRow = input[3].match(/\w/g)!;

const moveFactors: Record<string, number> = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

const targetRooms: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

const roomToHallwayIdx: Record<number, number> = {
  0: 2,
  1: 4,
  2: 6,
  3: 8,
};

const invalidHallwayIdxs = new Set([2, 4, 6, 8]);

type Position = {
  hallway: (string | null)[];
  rooms: string[][];
};

function copy(pos: Position): Position {
  return {
    hallway: [...pos.hallway],
    rooms: pos.rooms.map((r) => [...r]),
  };
}

// for debugging
function print(pos: Position): void {
  console.log("#############");
  console.log("#" + pos.hallway.map((h) => (h ? h : ".")).join("") + "#");
  console.log("###" + pos.rooms.map((r) => r[1] ?? " ").join("#") + "###");
  console.log("  #" + pos.rooms.map((r) => r[0] ?? " ").join("#") + "#  ");
  console.log("  #########  ");
}

const start: Position = {
  hallway: new Array(11).fill(null),
  rooms: bottomRow.map((room, i) => [room, topRow[i]]),
};

function generateNextPositions(pos: Position): [number, Position][] {
  const nextPositions: [number, Position][] = [];

  // hallway to room moves
  pos.hallway.forEach((h, i) => {
    if (
      !h ||
      pos.rooms[targetRooms[h]].length === 2 ||
      pos.rooms[targetRooms[h]].some((l) => l !== h)
    )
      return;
    const roomIdx = roomToHallwayIdx[targetRooms[h]];
    const start = Math.min(roomIdx, i);
    const end = Math.max(roomIdx, i);
    let valid = true;
    for (let j = start; j <= end; j++) {
      if (j === i) continue;
      if (pos.hallway[j] !== null) {
        valid = false;
        break;
      }
    }
    if (!valid) return;

    const nextPos = copy(pos);
    nextPos.hallway[i] = null;
    nextPos.rooms[targetRooms[h]].push(h);
    const score =
      (Math.abs(start - end) + (2 - pos.rooms[targetRooms[h]].length)) *
      moveFactors[h];
    nextPositions.push([score, nextPos]);
  });

  // room to hallway moves
  pos.rooms.forEach((r, i) => {
    if (r.length === 0) return;
    const toMove = r.at(-1)!;
    if (targetRooms[toMove] === i && r.every((rl) => rl === toMove)) return;
    const baseScore = moveFactors[toMove] * (2 - r.length + 1);
    const startHallwayIdx = roomToHallwayIdx[i];

    for (let j = startHallwayIdx - 1; j >= 0; j--) {
      if (invalidHallwayIdxs.has(j)) continue;
      if (pos.hallway[j] !== null) break;
      const nextPos = copy(pos);
      nextPos.hallway[j] = toMove;
      nextPos.rooms[i].pop();
      const score = baseScore + moveFactors[toMove] * (startHallwayIdx - j);
      nextPositions.push([score, nextPos]);
    }

    for (let j = startHallwayIdx + 1; j < 11; j++) {
      if (invalidHallwayIdxs.has(j)) continue;
      if (pos.hallway[j] !== null) break;
      const nextPos = copy(pos);
      nextPos.hallway[j] = toMove;
      nextPos.rooms[i].pop();
      const score = baseScore + moveFactors[toMove] * (j - startHallwayIdx);
      nextPositions.push([score, nextPos]);
    }
  });

  return nextPositions;
}

function hash(pos: Position, score: number) {
  return (
    pos.hallway.toString() +
    pos.rooms.map((r) => r.toString()).toString() +
    score.toString()
  );
}

function isSolved(pos: Position): boolean {
  return ["A", "B", "C", "D"].every(
    (letter, roomIndex) =>
      pos.rooms[roomIndex].length === 2 &&
      pos.rooms[roomIndex].every((l) => l === letter)
  );
}

const q = new MinPriorityQueue<[number, Position]>(([score, _]) => score);
q.enqueue([0, start]);
const seen = new Set<string>();
while (!q.isEmpty()) {
  const [score, pos] = q.dequeue()!;
  if (isSolved(pos)) {
    console.log(score);
    break;
  }
  for (const [cost, nextPos] of generateNextPositions(pos)) {
    const h = hash(nextPos, score + cost);
    if (seen.has(h)) continue;
    seen.add(h);
    q.enqueue([score + cost, nextPos]);
  }
}
