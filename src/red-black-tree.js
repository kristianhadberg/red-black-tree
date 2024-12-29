// TODO remove export, currently just for test purposes
export class Node {
  value = null;
  parent = null;
  color = "RED"; // Initialise all nodes as red nodes.
  left = null;
  right = null;

  constructor(value) {
    this.value = value;
  }
}

export default class RedBlackTree {
  root = null;
  NIL = new Node(); // Sentinel node used for "NIL" leaf nodes

  constructor() {
    this.NIL.color = "BLACK";
    this.root = this.NIL;
  }

  rotateLeft(rotatingNode) {
    // x = rotating node
    // y = pivotNode
    const pivotNode = rotatingNode.right;
    rotatingNode.right = pivotNode.left;

    if (pivotNode.left != this.NIL) {
      pivotNode.left.parent = rotatingNode;
    }

    pivotNode.parent = rotatingNode.parent;

    if (rotatingNode.parent == null) {
      this.root = pivotNode;
    } else if (rotatingNode == rotatingNode.parent.left) {
      rotatingNode.parent.left = pivotNode;
    } else {
      rotatingNode.parent.right = pivotNode;
    }

    pivotNode.left = rotatingNode;
    rotatingNode.parent = pivotNode;
  }

  /* 
        Rotating node is the pivotNodes parent node, and pivot node is the node that will become the new parent
    */
  rotateRight(rotatingNode) {
    const pivotNode = rotatingNode.left;
    rotatingNode.left = pivotNode.right;

    if (pivotNode.right != this.NIL) {
      pivotNode.right.parent = rotatingNode;
    }

    pivotNode.parent = rotatingNode.parent;

    if (rotatingNode.parent == null) {
      this.root = pivotNode;
    } else if (rotatingNode == rotatingNode.parent.right) {
      rotatingNode.parent.right = pivotNode;
    } else {
      rotatingNode.parent.left = pivotNode;
    }

    pivotNode.right = rotatingNode;
    rotatingNode.parent = pivotNode;
  }

  insert(value) {
    const newNode = new Node(value);
    newNode.left = this.NIL;
    newNode.right = this.NIL;

    let parent = null;
    let currentNode = this.root;

    // Iterate through the tree to find the place to insert the new node
    while (currentNode != this.NIL) {
      parent = currentNode;

      if (newNode.value == currentNode.value) {
        return;
      }

      // Move left or right in tree depending value compared to the current node
      if (newNode.value < currentNode.value) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    newNode.parent = parent;
    // Set new node to be root, or the left/right value of the parent
    if (parent == null) {
      this.root = newNode;
    } else if (newNode.value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this.insertFixup(newNode);
  }

  insertFixup(violatingNode) {
    // z = violating node
    // y = uncle
    while (violatingNode.parent && violatingNode.parent.color == "RED") {
      // left side cases
      if (violatingNode.parent == violatingNode.parent.parent.left) {
        const uncle = violatingNode.parent.parent.right;

        if (uncle.color == "RED") {
          // case 1
          violatingNode.parent.color = "BLACK";
          uncle.color = "BLACK";
          violatingNode.parent.parent.color = "RED";
          violatingNode = violatingNode.parent.parent; // move the violation up the tree
        } else {
          if (violatingNode == violatingNode.parent.right) {
            // case 2
            violatingNode = violatingNode.parent;
            this.rotateLeft(violatingNode);
          }
          // case 3 (always happens after case 2)
          violatingNode.parent.color = "BLACK";
          violatingNode.parent.parent.color = "RED";
          this.rotateRight(violatingNode.parent.parent);
        }
      } else {
        // right side cases, same as the code above just the opposite side
        const uncle = violatingNode.parent.parent.left;

        if (uncle.color == "RED") {
          // case 1
          violatingNode.parent.color = "BLACK";
          uncle.color = "BLACK";
          violatingNode.parent.parent.color = "RED";
          violatingNode = violatingNode.parent.parent;
        } else {
          if (violatingNode == violatingNode.parent.left) {
            // case 2
            violatingNode = violatingNode.parent;
            this.rotateRight(violatingNode);
          }
          // case 3
          violatingNode.parent.color = "BLACK";
          violatingNode.parent.parent.color = "RED";
          this.rotateLeft(violatingNode.parent.parent);
        }
      }
      if (violatingNode == this.root) {
        break;
      }
    }
    this.root.color = "BLACK";
  }

  delete(value) {
    const node = this.search(value);

    if (node == this.NIL) {
      console.log(`Value ${value} not found in the tree`);
      return `Value ${value} not found in the tree`;
    }
    let nodeToBeDeleted = node;
    let nodeOriginalColor = nodeToBeDeleted.color;

    let nodeToBeFixed;
    // case 1 left is NIL
    if (node.left == this.NIL) {
      nodeToBeFixed = node.right;
      this.transplant(node, node.right);
    }

    // case 2, right is NIL
    else if (node.right == this.NIL) {
      nodeToBeFixed = node.left;
      this.transplant(node, node.left);
    } else {
      /* 
            case 3, neither are NIL
            find minimum value in the node to be deleted's right sub tree 
        */
      const minimumNodeInRightSubTree = this.minimum(node.right);
      nodeOriginalColor = minimumNodeInRightSubTree.color;
      nodeToBeFixed = minimumNodeInRightSubTree.right;

      // if the minimum node is the direct child of the node to be deleted
      if (minimumNodeInRightSubTree.parent == node) {
        nodeToBeFixed.parent = minimumNodeInRightSubTree;
      } else {
        this.transplant(
          minimumNodeInRightSubTree,
          minimumNodeInRightSubTree.right
        );
        minimumNodeInRightSubTree.right = node.right;
        minimumNodeInRightSubTree.right.parent = minimumNodeInRightSubTree;
      }

      this.transplant(node, minimumNodeInRightSubTree);
      minimumNodeInRightSubTree.left = node.left;
      minimumNodeInRightSubTree.left.parent = minimumNodeInRightSubTree;
      minimumNodeInRightSubTree.color = node.color;
    }

    if (nodeOriginalColor == "BLACK") {
      this.deleteFixup(nodeToBeFixed);
    }
  }

  deleteFixup(node) {
    while (node != this.root && node.color == "BLACK") {
      // if deleted node is left child
      if (node == node.parent.left) {
        let uncle = node.parent.right;

        // case 1 - uncle is red
        if (uncle.color == "RED") {
          uncle.color = "BLACK";
          node.parent.color = "RED";
          this.rotateLeft(node.parent);
          uncle = node.parent.right;
        }

        // case 2 - uncle is black && both uncle's children are black
        if (uncle.left.color == "BLACK" && uncle.right.color == "BLACK") {
          uncle.color = "RED";
          node = node.parent;
        } else {
          // case 3 - uncle is black && uncle.left is RED && uncle.right is BLACK
          if (uncle.right.color == "BLACK") {
            uncle.left.color = "BLACK";
            uncle.color = "RED";
            this.rotateRight(uncle);
            uncle = node.parent.right;
          }
          // case 4 - uncle is black and both children are red (always happens if case 3 happens)
          uncle.color = node.parent.color;
          node.parent.color = "BLACK";
          uncle.right.color = "BLACK";
          this.rotateLeft(node.parent);
          node = this.root;
        }
      }

      // if deleted node is right child - same as the code above, just the opposite side
      else {
        let uncle = node.parent.left;

        // case 1
        if (uncle.color == "RED") {
          uncle.color = "BLACK";
          node.parent.color = "RED";
          this.rotateRight(node.parent);
          uncle = node.parent.right;
        }

        // case 2
        if (uncle.left.color == "BLACK" && uncle.right.color == "BLACK") {
          uncle.color = "RED";
          node = node.parent;
        } else {
          // case 3 - uncle is black && uncle.left is BLACK && uncle.right is RED
          if (uncle.left.color == "BLACK") {
            uncle.right.color = "BLACK";
            uncle.color = "RED";
            this.rotateLeft(uncle);
            uncle = node.parent.leftr;
          }
          // case 4
          uncle.color = node.parent.color;
          node.parent.color = "BLACK";
          uncle.left.color = "BLACK";
          this.rotateRight(node.parent);
          node = this.root;
        }
      }
    }
    node.color = "BLACK";
  }

  /* 
        Helper function to swap nodes within a subtree
        Used for deleting nodes
      */
  transplant(firstNode, secondNode) {
    if (firstNode.parent == null) {
      // firstNode is root
      this.root = secondNode;
    } else if (firstNode == firstNode.parent.left) {
      firstNode.parent.left = secondNode;
    } else {
      firstNode.parent.right = secondNode;
    }
    secondNode.parent = firstNode.parent;
  }

  /* 
        Find the lowest value in the given subtree
      */
  minimum(node) {
    while (node.left != this.NIL) {
      node = node.left;
    }
    return node;
  }

  /* 
        Find a specific value in the tree
      */
  search(value) {
    let currentNode = this.root;

    while (currentNode != this.NIL && value != currentNode.value) {
      if (value < currentNode.value) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    return currentNode;
  }

  print(node = this.root, depth = 0) {
    // tabs is only used stylistically to prettify the print
    let tabs = "";
    for (let i = 0; i < depth; i++) {
      tabs += "\t";
    }
    console.log(`${tabs}node val: ${node.value}, node color:${node.color}`);

    if (node.left != this.NIL) {
      this.print(node.left, depth + 1);
    }

    if (node.right != this.NIL) {
      this.print(node.right, depth + 1);
    }
  }

  // In order traversal through the tree
  traverse(node = this.root) {
    if (node == this.NIL) {
      return;
    }
    this.traverse(node.left);
    console.log(node.value);
    this.traverse(node.right);
  }
}
