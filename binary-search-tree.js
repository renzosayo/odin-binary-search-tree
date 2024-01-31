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

  insert (data, root = this.root, parent = null) {
    // if trying to go left and root is null, attach, same for right
    if (root === null) {
      const newNode = new Node(data);
      if (parent.data > newNode.data) parent.left = newNode;
      else parent.right = newNode;
      return;
    }

    // if root.data === data, return
    if (root.data === data) return; 

    // attached root as parent reference
    if (root.data < data) {
      this.insert(data, root.right, root);
    } else {
      this.insert(data, root.left, root);
    }
  }

  delete (data, root = this.root, parent = null) { 
    // if root is null, value does not exist, return false
    if (root === null) {
      return false;
    }
    let toRemove = null;

    // traverse tree to find node
    if (data === root.data) {
      toRemove = root;
    } else if (data > root.data) {
      this.delete(data, root.right, root);
    } else {
      this.delete(data, root.left, root);
    }
    if (toRemove === null)  return false;

    // determine children
    if (toRemove.left === null && toRemove.right === null) {
      if (toRemove.data > parent.data) parent.right = null;
      else parent.left = null;
      return true;
    } else if (toRemove.left === null || toRemove.right === null) {
        let child = toRemove.left || toRemove.right;
        if (parent.data > child.data) parent.left = child;
        else parent.right = child;
    }

    //  -if one child, point parent to child
    //  -if no children, point parent to null

    // todo: if have both children
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
tree.insert(21);
tree.delete(12);

prettyPrint(tree.root);