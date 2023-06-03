import { readFileSync } from "fs";

const input = readFileSync("2/in.txt").toString();

let depth = 0;
let horizontalPos = 0;
let aim = 0;
for (const line of input.split("\n")) {
    const [dir, amountStr] = line.split(" ");
    const amount = parseInt(amountStr);
    switch (dir) {
        case "forward":
            horizontalPos += amount;
            depth += aim * amount;
            break;
        case "down":
            aim += amount;
            break;
        case "up":
            aim -= amount;
            break;
    }
}

console.log(depth * horizontalPos);
