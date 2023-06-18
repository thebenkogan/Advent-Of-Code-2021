import { readFileSync } from "fs";

const input = readFileSync("20/in.txt").toString();
const NUM_ENHANCEMENTS = 50;

const [alg, imageStr] = input.split("\n\n");
const imageStrSplit = imageStr.split("\n");

const image = new Array(imageStrSplit.length)
  .fill(0)
  .map(() => new Array(imageStrSplit[0].length).fill(0));

for (let i = 0; i < imageStrSplit.length; i++) {
  for (let j = 0; j < imageStrSplit[i].length; j++) {
    if (imageStrSplit[i][j] === "#") {
      image[i][j] = 1;
    }
  }
}

const algo = alg.split("").map((c) => (c === "." ? 0 : 1));
const SHOULD_ALTERNATE_FILLS = algo[0] === 1; // if first algo index is 1, infinite region alternates between 0 and 1

function applyAlgo(image: number[][], fill: number) {
  const output = new Array(image.length + 2)
    .fill(0)
    .map(() => new Array(image[0].length + 2).fill(0));

  for (let i = 0; i < output.length; i++) {
    for (let j = 0; j < output[0].length; j++) {
      let binary = "";
      for (let k = i - 2; k < i + 1; k++) {
        for (let l = j - 2; l < j + 1; l++) {
          if (k < 0 || k >= image.length || l < 0 || l >= image[0].length) {
            binary += fill.toString();
          } else {
            binary += image[k][l].toString();
          }
        }
      }
      const index = parseInt(binary, 2);
      output[i][j] = algo[index];
    }
  }

  return output;
}

let enhanced = image;
for (let i = 0; i < NUM_ENHANCEMENTS; i++) {
  enhanced = applyAlgo(enhanced, SHOULD_ALTERNATE_FILLS ? i % 2 : 0);
}

let lit = 0;
for (let i = 0; i < enhanced.length; i++) {
  for (let j = 0; j < enhanced[0].length; j++) {
    lit += enhanced[i][j];
  }
}

console.log(lit);
