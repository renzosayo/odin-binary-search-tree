class Node {
  constructor (value, leftChild, rightChild) {
    this.value = value;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
}

class Tree {
  constructor (array) {
    this.root = this.buildTree(array);
  }

  buildTree (array) {
    const sorted = this.sort(array);
    const filtered = this.filter(sorted);
    console.log(filtered);
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

let tree = new Tree([2, 3, 12, 8, 4, 2]);