class Node {
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

  insert(value) {
    const newNode = new Node(value);

    let parent = null;
    let currentNode = this.root;

    // Iterate through the tree to find the place to insert the new node
    while (currentNode != null) {
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
  }

  print(node = this.root, depth = 0) {
    // tabs is only used stylistically to prettify the print
    let tabs = "";
    for (let i = 0; i < depth; i++) {
      tabs += "\t";
    }
    console.log(`${tabs}node val: ${node.value}, node color:${node.color}`);

    if (node.left != null) {
      this.dump(node.left, depth + 1);
    }

    if (node.right != null) {
      this.dump(node.right, depth + 1);
    }
  }

  // In order traversal through the tree
  traverse(node = this.root) {
    if (!node) {
      return;
    }
    this.traverse(node.left);
    console.log(node.value);
    this.traverse(node.right);
  }
}
