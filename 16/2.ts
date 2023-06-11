import { readFileSync } from "fs";

const input = readFileSync("16/in.txt").toString();

const hexToBinary: Record<string, string> = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

let binary = "";
for (const c of input) {
  binary += hexToBinary[c];
}

type ParseResult = {
  val: number;
  bitsRead: number;
};

function parseLiteral(binary: string): ParseResult {
  let rest = binary;
  let readRest = true;
  let val = "";
  let bitsRead = 6;
  while (readRest) {
    const leadingBit = rest.substring(0, 1);
    const group = rest.substring(1, 5);
    readRest = leadingBit === "1";
    val += group;
    rest = rest.substring(5);
    bitsRead += 5;
  }

  return {
    val: parseInt(val, 2),
    bitsRead,
  };
}

function applyOperator(vals: number[], id: number): number {
  switch (id) {
    case 0:
      return vals.reduce((a, b) => a + b, 0);
    case 1:
      return vals.reduce((a, b) => a * b, 1);
    case 2:
      return Math.min(...vals);
    case 3:
      return Math.max(...vals);
    case 5:
      return vals[0] > vals[1] ? 1 : 0;
    case 6:
      return vals[0] < vals[1] ? 1 : 0;
    case 7:
      return vals[0] === vals[1] ? 1 : 0;
    default:
      throw Error("Invalid operator ID");
  }
}

function parseOperator(binary: string, id: number): ParseResult {
  const lengthId = binary.substring(0, 1);
  let bitsToRead = undefined;
  let subpacketsToRead = undefined;
  let rest: string;
  let bitsRead = 7;
  if (lengthId === "1") {
    subpacketsToRead = parseInt(binary.substring(1, 12), 2);
    rest = binary.substring(12);
    bitsRead += 11;
  } else {
    bitsToRead = parseInt(binary.substring(1, 16), 2);
    rest = binary.substring(16);
    bitsRead += 15;
  }

  const vals: number[] = [];
  while (bitsToRead || subpacketsToRead) {
    const res = parsePacket(rest);
    if (bitsToRead) {
      bitsToRead -= res.bitsRead;
    } else if (subpacketsToRead) {
      subpacketsToRead--;
    }
    rest = rest.substring(res.bitsRead);
    bitsRead += res.bitsRead;
    vals.push(res.val);
  }

  return {
    bitsRead,
    val: applyOperator(vals, id),
  };
}

function parsePacket(binary: string) {
  const version = parseInt(binary.substring(0, 3), 2);
  const id = parseInt(binary.substring(3, 6), 2);
  const rest = binary.substring(6);
  if (id === 4) {
    return parseLiteral(rest);
  } else {
    return parseOperator(rest, id);
  }
}

console.log(parsePacket(binary).val);
