import { readFileSync } from "fs";

const input = readFileSync("6/in.txt").toString();
const fishes = input.split(",").map((x) => parseInt(x));

// all fish at the same time interval act exactly the same, no need to
// simulate them separately, this will reduce the load

const NUM_DAYS = 256;

let fishCounts: number[] = new Array(9).fill(0); // fish -> num of fishes at that interval
for (const fish of fishes) {
    fishCounts[fish]++;
}

for (let i = 0; i < NUM_DAYS; i++) {
    const nextFishCounts = new Array(9).fill(0);
    for (let j = 0; j < fishCounts.length; j++) {
        if (j === 0) {
            nextFishCounts[6] = fishCounts[0];
            nextFishCounts[8] = fishCounts[0];
        } else {
            nextFishCounts[j - 1] += fishCounts[j];
        }
    }
    fishCounts = nextFishCounts;
}

const numFishes = fishCounts.reduce((a, b) => a + b, 0);

console.log(numFishes);
