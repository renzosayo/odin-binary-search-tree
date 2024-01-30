class Node {
  constructor (data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor (array) {
    const sorted = this.sort(array);
    const filtered = this.filter(sorted);
    this.root = this.buildTree(filtered);
  }

  buildTree (array) {
    // buildTree creates a node for every call, and returns that node
    // node contains value, left and right children
    if (array.length === 0) {
      return null;
    }
    if (array.length === 1) {
      return new Node(array[0]);
    }
    let mid = Math.floor(array.length / 2);
    const root = new Node(array[mid], 
      this.buildTree(array.slice(0, mid)), 
      this.buildTree(array.slice(mid + 1))
    );
    return root;
  }

  filter (array) {
    return array.filter((element, index) => {

      // indexOf only returns 1st instance
      return array.indexOf(element) === index;
    });
  }

  sort (array) {
    if (array.length === 1) {
      return array;
    }
    let mid = Math.floor(array.length / 2);
    let leftHalf = this.sort(array.slice(0, mid));
    let rightHalf = this.sort(array.slice(mid));
    // merge
    let merged = [];
    while (leftHalf.length && rightHalf.length) {
      if (leftHalf[0] < rightHalf[0]) {
        merged.push(leftHalf.shift());
      } else {
        merged.push(rightHalf.shift());
      }
    }
    merged = [...merged, ...leftHalf, ...rightHalf];
    return merged;
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

let tree = new Tree([2, 8, 12, 4, 34, 9, 8]);

prettyPrint(tree.root);