import { readFileSync } from "fs";

const input = readFileSync("8/in.txt").toString();
const displayData = input
    .split("\n")
    .map((displayStr) => displayStr.split(" | "));

let total = 0;
for (const [nums, output] of displayData) {
    const wireMap = deriveWiring(nums.split(" "));
    total += parseInt(
        output
            .split(" ")
            .map((n) => wireMap.get(sortString(n)))
            .join("")
    );
}
console.log(total);

function deriveWiring(nums: string[]) {
    const wiring = new Array<string>(10).fill("");
    const length5 = [];
    const length6 = [];
    for (const num of nums) {
        switch (num.length) {
            case 2:
                wiring[1] = num;
                break;
            case 3:
                wiring[7] = num;
                break;
            case 4:
                wiring[4] = num;
                break;
            case 5:
                length5.push(num);
                break;
            case 6:
                length6.push(num);
                break;
            case 7:
                wiring[8] = num;
                break;
        }
    }
    wiring[6] = length6.find((n) => intersect(n, wiring[1]!).length === 1)!;
    wiring[5] = length5.find((n) => intersect(n, wiring[6]!).length === 5)!;
    wiring[9] = length6.find(
        (n) => n !== wiring[6] && intersect(n, wiring[5]!).length === 5
    )!;
    wiring[0] = length6.find((n) => n !== wiring[6] && n !== wiring[9])!;
    wiring[2] = length5.find(
        (n) => n !== wiring[5] && intersect(n, wiring[1]!).length === 1
    )!;
    wiring[3] = length5.find((n) => n !== wiring[2] && n !== wiring[5])!;

    const wireMap = new Map<string, number>();
    wiring.forEach((num, i) => wireMap.set(sortString(num), i));
    return wireMap;
}

function sortString(s: string) {
    return s.split("").sort().join("");
}

function intersect(a: string, b: string) {
    const al = new Set(a);
    let intersection = "";
    for (const char of b) {
        if (al.has(char)) {
            intersection += char;
        }
    }
    return intersection;
}
