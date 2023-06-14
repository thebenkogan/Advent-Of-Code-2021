import { readFileSync } from "fs";

type SnailfishNumber = [number | SnailfishNumber, number | SnailfishNumber];

/**
 * A node in a binary tree with parent pointers and values at the leaves.
 */
class Node {
  value?: number;
  left?: Node;
  right?: Node;
  parent?: Node;

  constructor(value?: number, left?: Node, right?: Node, parent?: Node) {
    this.value = value;
    this.left = left;
    this.right = right;
    this.parent = parent;
  }

  findExplodeCandidate(depth = 0): Node | null {
    if (this.value === undefined && depth == 4) return this;
    if (this.left) {
      const candidate = this.left.findExplodeCandidate(depth + 1);
      if (candidate) return candidate;
    }
    if (this.right) return this.right.findExplodeCandidate(depth + 1);
    return null;
  }

  findSplitCandidate(): Node | null {
    if (this.value !== undefined && this.value >= 10) return this;
    if (this.left) {
      const candidate = this.left.findSplitCandidate();
      if (candidate) return candidate;
    }
    if (this.right) return this.right.findSplitCandidate();
    return null;
  }

  private findParentWithLeftChild(cameFrom: Node | null): Node | null {
    if (this.left && this.left !== cameFrom) return this;
    if (this.parent) return this.parent.findParentWithLeftChild(this);
    return null;
  }

  private findParentWithRightChild(cameFrom: Node | null): Node | null {
    if (this.right && this.right !== cameFrom) return this;
    if (this.parent) return this.parent.findParentWithRightChild(this);
    return null;
  }

  private rightmostChild(): Node {
    if (this.right) return this.right.rightmostChild();
    return this;
  }

  private leftmostChild(): Node {
    if (this.left) return this.left.leftmostChild();
    return this;
  }

  findFirstLeft(): Node | null {
    if (this.right && this.right.value === undefined)
      return this.right.leftmostChild();
    const parent = this.parent?.findParentWithLeftChild(this);
    if (!parent) return null;
    return parent.left!.rightmostChild();
  }

  findFirstRight(): Node | null {
    if (this.left && this.left.value === undefined)
      return this.left.rightmostChild();
    const parent = this.parent?.findParentWithRightChild(this);
    if (!parent) return null;
    return parent.right!.leftmostChild();
  }

  toLeaf(value: number) {
    this.left = undefined;
    this.right = undefined;
    this.value = value;
  }

  split() {
    const leftVal = Math.floor(this.value! / 2);
    const rightVal = Math.ceil(this.value! / 2);
    this.left = new Node(leftVal);
    this.right = new Node(rightVal);
    this.left.parent = this;
    this.right.parent = this;
    this.value = undefined;
  }

  reduce() {
    while (true) {
      const explodeCandidate = this.findExplodeCandidate();
      if (explodeCandidate) {
        const firstLeft = explodeCandidate.findFirstLeft();
        const firstRight = explodeCandidate.findFirstRight();
        if (firstLeft) firstLeft.value! += explodeCandidate.left!.value!;
        if (firstRight) firstRight.value! += explodeCandidate.right!.value!;
        explodeCandidate.toLeaf(0);
        continue;
      }
      const splitCandidate = this.findSplitCandidate();
      if (splitCandidate) {
        splitCandidate.split();
        continue;
      }
      break;
    }
  }

  magnitude(): number {
    if (this.value !== undefined) return this.value;
    return 3 * this.left!.magnitude() + 2 * this.right!.magnitude();
  }

  static fromSnailfishNumber([snLeft, snRight]: SnailfishNumber): Node {
    const left =
      typeof snLeft === "number"
        ? new Node(snLeft)
        : Node.fromSnailfishNumber(snLeft);
    const right =
      typeof snRight === "number"
        ? new Node(snRight)
        : Node.fromSnailfishNumber(snRight);
    const node = new Node(undefined, left, right);
    left.parent = node;
    right.parent = node;
    return node;
  }

  static combine(left: Node, right: Node): Node {
    const node = new Node(undefined, left, right);
    left.parent = node;
    right.parent = node;
    return node;
  }

  toString(): string {
    const thisString = this.value === undefined ? "<>" : this.value.toString();
    return `[${this.left?.toString() ?? ""}], ${thisString}, [${
      this.right?.toString() ?? ""
    }]`;
  }
}

const input = readFileSync("18/in.txt")
  .toString()
  .split("\n")
  .map((s) => JSON.parse(s) as SnailfishNumber)
  .map(Node.fromSnailfishNumber);

const sum = input.slice(1).reduce((acc, curr) => {
  const addition = Node.combine(acc, curr);
  addition.reduce();
  return addition;
}, input[0]);

console.log(sum.magnitude());
