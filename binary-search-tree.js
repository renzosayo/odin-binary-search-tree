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

    // no children - point parent to null
    if (toRemove.left === null && toRemove.right === null) {
      if (toRemove.data > parent.data) parent.right = null;
      else parent.left = null;
      return true;

      // one child - point parent to child
    } else if (toRemove.left === null || toRemove.right === null) {
        let child = toRemove.left || toRemove.right;
        if (parent.data > child.data) parent.left = child;
        else parent.right = child;
      
    // 2 children - find next biggest (newRoot), remove that, and replace toRemove
    } else {
      // always look in the right subtree
      let newRoot = this.findNextBiggest(toRemove.right);
      this.delete(newRoot.data);

      // if parent exists, point to newRoot, else make it new this.root
      if (parent) {
        if (parent.data > newRoot.data) parent.left = newRoot;
        else parent.right = newRoot;
      } else {
        this.root = newRoot;
      }
      
      // newRoot.left point to toRemove.left, same for right
      newRoot.left = toRemove.left;
      newRoot.right = toRemove.right;
      toRemove.data = null;
      toRemove.left = null;
      toRemove.right = null;
    }

  }

  find (data, root = this.root) {
    if (root === null) {
      console.log('Does not exist.');
      return false;
    }
    if (data === root.data) {
      return root;
    } else {
      if (data > root.data) {
        return this.find(data, root.right);
      } else {
        return this.find(data, root.left);
      }
    }
  }

  levelOrder (callback) {
    if (this.root === null) return;
    let queue = [];
    let values = [];
    queue.push(this.root);
    values.push(this.root.data);
    while (queue.length > 0) {
      let current = queue.shift();
      if (current.left !== null) {
        queue.push(current.left);
        values.push(current.left.data);
      }
      if (current.right !== null) {
        queue.push(current.right);
        values.push(current.right.data); 
      }
      if (callback !== undefined) {
        callback(current);
      }
    }
    if (callback === undefined) return values;
  }

  inOrder (callback, root = this.root, values = []) {
    if (root === null) return;

    // left
    this.inOrder(callback, root.left, values);

    // root
    if (callback) callback(root);
    else values.push(root.data)

    // right
    this.inOrder(callback, root.right, values);
    if (callback === undefined) return values;
  }

  preOrder (callback, root = this.root, values = []) {
    if (root === null) return;

    // root
    if (callback) callback(root);
    else values.push(root.data)

    // left
    this.preOrder(callback, root.left, values);

    // right
    this.preOrder(callback, root.right, values);
    if (callback === undefined) return values;
  }

  postOrder (callback, root = this.root, values = []) {
    if (root === null) return;

    // left
    this.postOrder(callback, root.left, values);

    // right
    this.postOrder(callback, root.right, values);

    // root
    if (callback) callback(root);
    else values.push(root.data)

    if (callback === undefined) return values;
  }

  // accepts node instead of raw value as per instructions
  height (node, height = 0) {
    // -1 because leaf nodes are 0
    if (node === null) return -1;

    // increment height at every pass
    let leftHeight = this.height(node.left, height) + 1;
    let rightHeight = this.height(node.right, height) + 1;
    if (leftHeight > rightHeight) return leftHeight;
    return rightHeight;
  }

  // accepts node instead of raw value as per instructions
  depth (node, current = this.root, depth = 0) {
    if (node.data === current.data) return depth;
    if (node.data > current.data) {
      return this.depth(node, current.right, depth + 1);
    } else {
      return this.depth(node, current.left, depth + 1);
    }
  }

  isBalanced (root = this.root, arr = this.levelOrder()) {
    if (root === null)  return;
    while (arr.length > 0) {
      let current = this.find(arr.shift());
      if (Math.abs(this.height(current.left) - this.height(current.right)) > 1) {
        return false;
      }
    }
    return true;
  }

  rebalance () {
    // get array by traversing and sort
    let arr = this.sort(this.inOrder());
    console.log(arr);
    this.root = this.buildTree(arr);
  }

  // returns root if null, else go deeper
  findNextBiggest (root) {
    if (root.left === null) {
      return root;
    }
    return this.findNextBiggest(root.left);
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

let tree = new Tree([4, 2, 6, 3, 1, 5]);
//  tree.insert(21);
//  tree.insert(22);
//  tree.insert(23);
// console.log(tree.inOrder());
// console.log(tree.preOrder());
// console.log(tree.postOrder());
//console.log(tree.depth(tree.find(23)));
//console.log(tree.height(tree.find(21)));
// console.log(tree.isBalanced());
//console.log(tree.rebalance());

prettyPrint(tree.root);