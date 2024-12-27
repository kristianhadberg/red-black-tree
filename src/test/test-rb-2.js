import RedBlackTree from "../red-black-tree.js";

const tree = new RedBlackTree();

tree.insert(8);
tree.insert(5);
tree.insert(15);
tree.insert(12);
tree.insert(19);
tree.insert(9);
tree.insert(13);
tree.insert(23);
tree.print();
tree.printTree();

tree.insert(10);
tree.print();
tree.printTree();
