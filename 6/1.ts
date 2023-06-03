import { readFileSync } from "fs";

const input = readFileSync("6/in.txt").toString();
const fishes = input.split(",").map((x) => parseInt(x));

const NUM_DAYS = 80;

for (let i = 0; i < NUM_DAYS; i++) {
    for (let j = 0; j < fishes.length; j++) {
        if (fishes[j] === 0) {
            fishes[j] = 6;
            fishes.push(9); // we will decrement this later in the loop
        } else {
            fishes[j]--;
        }
    }
}

console.log(fishes.length);
