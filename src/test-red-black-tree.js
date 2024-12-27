import RedBlackTree from "./red-black-tree.js";

const tree = new RedBlackTree();
tree.insert(5);
tree.insert(3);
tree.insert(2);
tree.insert(4);
tree.insert(7);

//tree.traverse();
tree.printTree();
tree.rotateRight(tree.root);
tree.printTree();
tree.rotateLeft(tree.root);
/* tree.rotateLeft(tree.root.right); */
tree.printTree();

tree.traverse();
tree.print();

tree.insert(5);
tree.insert(3);
tree.insert(7);
tree.insert(6);

/* tree.printTree();
tree.rotateRight(tree.root.right.left);
tree.printTree();
tree.rotateLeft(tree.root.right);
tree.printTree(); */
