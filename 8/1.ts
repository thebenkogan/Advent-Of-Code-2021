import { readFileSync } from "fs";

const input = readFileSync("8/in.txt").toString();
const displayResults = input
    .split("\n")
    .flatMap((displayStr) => displayStr.split(" | ")[1].split(" "));

const total = displayResults.filter((res) => {
    switch (res.length) {
        case 2:
        case 3:
        case 4:
        case 7:
            return true;
        default:
            return false;
    }
}).length;

console.log(total);
