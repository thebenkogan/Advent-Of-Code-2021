import { readFileSync } from "fs";

const input = readFileSync("3/in.txt").toString().split("\n");

type BinaryCounts = { 0: number; 1: number };

function getBinaryCounts(nums: string[], index: number): BinaryCounts {
    let numZeros = 0;
    let numOnes = 0;
    for (let i = 0; i < nums.length; i++) {
        nums[i][index] === "0" ? numZeros++ : numOnes++;
    }
    return [numZeros, numOnes];
}

let oxygenGenNums = input;
let c02ScrubberNums = input;
for (let i = 0; i < input[0].length; i++) {
    if (oxygenGenNums.length > 1) {
        const stats = getBinaryCounts(oxygenGenNums, i);
        const max = stats[0] > stats[1] ? 0 : 1;
        oxygenGenNums = oxygenGenNums.filter(
            (line) => parseInt(line[i]) === max
        );
    }
    if (c02ScrubberNums.length > 1) {
        const stats = getBinaryCounts(c02ScrubberNums, i);
        const min = stats[0] > stats[1] ? 1 : 0;
        c02ScrubberNums = c02ScrubberNums.filter(
            (line) => parseInt(line[i]) === min
        );
    }
}

console.log(parseInt(oxygenGenNums[0], 2) * parseInt(c02ScrubberNums[0], 2));
