import { readFileSync } from "fs";

const input = readFileSync("2/in.txt").toString();

let depth = 0;
let horizontalPos = 0;
for (const line of input.split("\n")) {
    const [dir, amountStr] = line.split(" ");
    const amount = parseInt(amountStr);
    switch (dir) {
        case "forward":
            horizontalPos += amount;
            break;
        case "down":
            depth += amount;
            break;
        case "up":
            depth -= amount;
            break;
    }
}

console.log(depth * horizontalPos);
