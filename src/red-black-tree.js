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
    const pivotNode = rotatingNode.right;
    const parentNode = rotatingNode.parent;

    pivotNode.parent = parentNode;
    // if parentNode is root of tree
    if (parentNode == null) {
      this.root = pivotNode;
    } else if (rotatingNode == parentNode.right) {
      // Set the grandparents left/right to match after the rotation
      parentNode.right = pivotNode;
    } else {
      parentNode.left = pivotNode;
    }

    const pivotRightNode = pivotNode.left;
    rotatingNode.right = pivotRightNode;
    pivotNode.left = rotatingNode;
    rotatingNode.parent = pivotNode;
  }

  /* 
    Rotating node is the pivotNodes parent node, and pivot node is the node that will become the new parent
  */
  rotateRight(rotatingNode) {
    const pivotNode = rotatingNode.left;
    const parentNode = rotatingNode.parent;

    pivotNode.parent = parentNode;
    // if parentNode is root of tree
    if (parentNode == null) {
      this.root = pivotNode;
    } else if (rotatingNode == parentNode.right) {
      // Set the grandparents left/right to match after the rotation
      parentNode.right = pivotNode;
    } else {
      parentNode.left = pivotNode;
    }

    const pivotRightNode = pivotNode.right;
    rotatingNode.left = pivotRightNode;
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
    // z == violating node
    // y == uncle?
    while (violatingNode.parent && violatingNode.parent.color == "RED") {
      // left side cases
      if (violatingNode.parent == violatingNode.parent.parent.left) {
        console.log("violation");
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

  /* 
    Print function from https://github.com/petlatkea/dsa-starterfiles/blob/main/BinaryTree/script.js
    used for initial testing
  */
  printTree() {
    // Print the tree in a nice way - by creating a (jagged) 2D array of the tree
    // each level (starting from root) is an array in the array that doubles in size from the previous level

    // breaks if the tree is too deep - but that's a problem for another day

    // Use DFS to fill array with values
    const treeArray = [];
    let height = 0; // and while we're at it, calculate the height of the tree
    buildTreeArray(this.root, 0, 0);

    // Does a Depth-First-Scan of the Tree,
    // keeping track of the current depth (how far down from the top)
    // and the current indent (how far right from the (possible) left-most node at this depth)
    // stores the node values in a 2D array
    function buildTreeArray(node, depth, indent) {
      if (!node) {
        return;
      }
      height = Math.max(height, depth);
      // insert this node value in the 2D array
      if (!treeArray[depth]) treeArray[depth] = [];
      treeArray[depth][indent] = node.value;
      // visit its children - remember to double indent
      buildTreeArray(node.left, depth + 1, indent * 2);
      buildTreeArray(node.right, depth + 1, indent * 2 + 1);
    }

    // Apparently I'm not smart enough to calculate these, so here's a pre-calculated list
    const indentations = [1, 2, 5, 11, 23, 46, 93];

    let treeString = " ";
    // Display array - one level at a time
    for (let depth = 0; depth < treeArray.length; depth++) {
      const values = treeArray[depth];

      // Calculate indent for this depth (or find it in the pre-calculated table)
      let currentHeight = height - depth; // currentHeight is the distance from the bottom of the tree
      let indent = indentations[currentHeight];

      // Only display tree structure if we are not at the top
      if (depth > 0) {
        // Loop through half the values - and show a subtree with left and right
        for (let i = 0; i < values.length / 2; i++) {
          treeString += " ".repeat(indent);
          // Only show sub-tree if there are some values below
          if (values[i * 2] != undefined || values[i * 2 + 1] != undefined) {
            treeString += "┌";
            treeString += "─".repeat(indent > 1 ? indent : 0);
            treeString += "┴";
            treeString += "─".repeat(indent > 1 ? indent : 0);
            treeString += "┐";
          } else {
            treeString += "   " + "  ".repeat(indent > 1 ? indent : 0);
          }
          treeString += " ".repeat(indent);
          // add a single space before the next "block"
          treeString += " ";
        }
        // and finalize the current line
        treeString += "\n";
      }

      // Indent numbers one less than their "tree drawings"
      // Unless it is the first one, then it is two (or maybe three) less ... mystic math!
      if (depth == 0) {
        treeString += " ".repeat(indent - 2);
      } else {
        treeString += " ".repeat(indent - 1);
      }

      // display values
      for (let i = 0; i < values.length; i++) {
        // if both children are undefined, don't show any of then
        // if only one child is, show it as underscores _
        const showUndefined =
          !values[i - (i % 2)] && !values[i - (i % 2) + 1] ? " " : "_";
        // if depth is lowest (height-1) - pad values to two characters
        if (depth == height) {
          treeString += String(values[i] ?? showUndefined.repeat(2)).padStart(
            2,
            " "
          );
          // and add a single space
          treeString += " ";
        } else {
          // otherwise center values in block of three
          treeString += String(values[i] ?? showUndefined.repeat(3))
            .padEnd(2, " ")
            .padStart(3, " ");

          // and add twice the indentation of spaces + 1 in the middle
          treeString += " ".repeat(indent - 1);
          treeString += " ";
          treeString += " ".repeat(indent - 1);
        }
      }

      // finalize the value-line
      treeString += "\n";
    }

    console.log(treeString);
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

  bfs() {
    if (this.root == null) return;

    const queue = [];
    queue.push(this.root);

    const list = [];

    while (queue.length > 0) {
      const item = queue.shift();

      console.log(item);
      console.log(this.depth(item));
      list.push({
        value: item.value,
        color: item.color,
        depth: this.depth(item),
      });

      if (item.left && item.left != this.NIL) queue.push(item.left);
      if (item.right && item.right != this.NIL) queue.push(item.right);
    }
    console.log(list);
  }

  depth(node) {
    let depth = 0;

    const queue = [];
    queue.push(this.root);

    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const frontNode = queue.shift();
        if (frontNode == node) {
          return depth;
        }
        if (frontNode.left != null) {
          queue.push(frontNode.left);
        }
        if (frontNode.right != null) {
          queue.push(frontNode.right);
        }
      }
      depth++;
    }
  }
}
