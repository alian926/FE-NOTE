class Node {
	constructor(key) {
		this.key = key; // 节点值
		this.left = null; // 左子节点
		this.right = null; // 右子节点
	}
}
const COMPARE = {
	LESS_THAN: -1,
	BIGGER_THAN: 1,
};

function defaultCompare(a, b) {
	if (a === b) {
		return 0;
	}
	return a < b ? COMPARE.LESS_THAN : COMPARE.BIGGER_THAN;
}

// 二叉搜索树 BST

class BinarySearchTree {
	constructor(compareFn = defaultCompare) {
		this.compareFn = compareFn; //比较节点值
		this.root = null; // Node类型的根节点
	}
	insert(key) {
		if (this.root == null) {
			this.root = new Node(key);
		} else {
			this._insertNode(this.root, key);
		}
	}
	// 辅助插入方法
	_insertNode(node, key) {
		// 判断要操作的是左子节点还是右子节点
		let direct =
			this.compareFn(key, node.key) === COMPARE.LESS_THAN ? 'left' : 'right';
		if (node[direct] == null) {
			node[direct] = new Node(key);
		} else {
			this._insertNode(node[direct], key);
		}
	}
	search(key) {
		return this._searchNode(this.root, key);
	}
	_searchNode(node, key) {
		if (node == null) {
			return false;
		}
		if (this.compareFn(key, node.key) === COMPARE.LESS_THAN) {
			return this._searchNode(node.left, key);
		} else if (this.compareFn(key, node.key) === COMPARE.BIGGER_THAN) {
			return this._searchNode(node.right, key);
		} else {
			return true;
		}
	}
	// 通过中序遍历方式遍历所有节点, 左中右/小中大, 符合从小到大的顺序
	inOrderTraverse(callback) {
		this._inOrderTraverseNode(this.root, callback);
	}
	// 中序遍历的辅助函数
	_inOrderTraverseNode(node, callback) {
		if (node != null) {
			this._inOrderTraverseNode(node.left, callback);
			callback(node.key);
			this._inOrderTraverseNode(node.right, callback);
		}
	}
	// 通过前序遍历, 中左右
	preOrderTraverse(callback) {
		this._preOrderTraverseNode(this.root, callback);
	}
	_preOrderTraverseNode(node, callback) {
		if (node != null) {
			callback(node.key);
			this._preOrderTraverseNode(node.left, callback);
			this._preOrderTraverseNode(node.right, callback);
		}
	}
	// 通过后续遍历, 左右中, 执行的时候肯定已经访问过之前的所有节点,适合用来做删除操作
	postOrderTraverse(callback) {
		this._postOrderTraverseNode(this.root, callback);
	}
	_postOrderTraverseNode(node, callback) {
		if (node != null) {
			this._postOrderTraverseNode(node.left, callback);
			this._postOrderTraverseNode(node.right, callback);
			callback(node.key);
		}
	}
	// 树中最小值/键
	min() {
		return this._minNode(this.root);
	}
	max() {
		return this._maxNode(this.root);
	}
	_minNode(node) {
		return this._getDeepNode(node, 'left');
	}
	_maxNode(node) {
		return this._getDeepNode(node, 'right');
	}
	_getDeepNode(node, dire = 'left') {
		let current = node;
		while (current != null && current[dire] != null) {
			current = current[dire];
		}
		return current;
	}
	remove(key) {
		this.root = this._removeNode(this.root, key);
	}
	_removeNode(node, key) {
		if (node == null) return null;
		if (this.compareFn(key, node.key) === COMPARE.LESS_THAN) {
			node.left = this._removeNode(node.left, key);
			return node;
		} else if (this.compareFn(key, node.key) === COMPARE.BIGGER_THAN) {
			node.right = this._removeNode(node.right, key);
			return node;
		} else {
			// 直接移除是不行的, 还需要处理指针引用

			// 没有左右子节点, 直接移除
			if (node.left == null && node.right == null) {
				node = null;
				return node;
			}
			// 单子叶节点,修改节点的引用
			if (node.left == null) {
				node = node.right;
				return node;
			} else if (node.right == null) {
				node = node.left;
				return node;
			}
			// 找到右子树中最小的(右子树最小的也比左子树最大的大)
			const aux = this._minNode(node.right);
			// 更新节点值
			node.key = aux.key;
			// 移除找到的右子树的最小节点,否则树中产生两个相同值了, 这是个递归的步骤
			node.right = this._removeNode(node.right, aux.key);
			// 返回节点的引用
			return node;
		}
	}
}

// const tree = new BinarySearchTree()
// tree.insert(11)
// tree.insert(7)
// tree.insert(15)
// tree.insert(5)
// tree.insert(3)
// tree.insert(9)
// console.log(tree)
// let fn = v => console.log(v)
// console.log('中序↑', tree.inOrderTraverse(fn))
// console.log('先序↑', tree.preOrderTraverse(fn))
// console.log('后序↑', tree.postOrderTraverse(fn))
// console.log('最小', tree.min())
// console.log('最大', tree.max())
// console.log('查找 5', tree.search(5))
// console.log('查找 1', tree.search(1))
// tree.remove(5)
// console.log('中序↑', tree.inOrderTraverse(fn))
// console.log('查找 5', tree.search(5))

// 自平衡树 AVL树 Adelson-Velskii-Landi树, 任何一个节点的左右两侧子树的高度差最多为1

/* 平衡操作: 有单旋转和双旋转两种
  左-左 LL : 向右的单旋转, 左树高于右树
  右-右 RR : 向左的单旋转, 右树高于左树
  左-右 LR : 向右的双旋转, 先LL再RR
  右-左 RL : 向左的双旋转, 先RR再LL
*/
const BalanceFactor = {
	UNBALANCED_RIGHT: 1,
	SLIGHTLY_UNBALANCED_RIGHT: 2,
	BALANCED: 3,
	SLIGHTLY_UNBALANCED_LEFT: 4,
	UNBALANCED_LEFT: 5,
};

class AVLTree extends BinarySearchTree {
	constructor(compareFn = defaultCompare) {
		super(compareFn);
	}
	_getNodeHeight(node) {
		if (node == null) {
			return -1;
		}
		return (
			Math.max(
				this._getNodeHeight(node.left),
				this._getNodeHeight(node.right)
			) + 1
		);
	}
	_getBalanceFactor(node) {
		const heightDifference =
			this._getNodeHeight(node.left) - this._getNodeHeight(node.right);
		switch (heightDifference) {
			case -2:
				return BalanceFactor.UNBALANCED_RIGHT;
			case -1:
				return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT;
			case 1:
				return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT;
			case 2:
				return BalanceFactor.UNBALANCED_LEFT;
			default:
				return BalanceFactor.BALANCED;
		}
	}
	rotationLL(node) {
		/**
		 *      50                 30
		 *    L /\                 /\
		 *    30   70           10    50
		 *  L /\        ->      /     /\
		 * 10   40             5    40  70
		 * /
		 * 5
		 * 过程描述:
		 * 30的左子树不变
		 * 50的左子节点更新为30的右子节点
		 * 30的右子节点更新为50这个节点
		 */
		const tmp = node.left;
		node.left = tmp.right;
		tmp.right = node;
		return tmp;
	}
	rotationRR(node) {
		// 和LL 相反
		const tmp = node.right;
		node.right = tmp.left;
		tmp.left = node;
		return tmp;
	}
	rotationLR(node) {
		node.left = this.rotationRR(node.left);
		return this.rotationLL(node);
	}
	rotationRL(node) {
		node.right = this.rotationLL(node.right);
		return this.rotationRR(node);
	}
	insert(key) {
		this.root = this._insertNode(this.root, key);
	}
	_insertNode(node, key) {
		// 像在BST树中一样插入节点
		if (node == null) {
			return new Node(key);
		} else if (this.compareFn(key, node.key) === COMPARE.LESS_THAN) {
			node.left = this._insertNode(node.left, key);
		} else if (this.compareFn(key, node.key) === COMPARE.BIGGER_THAN) {
			node.right = this._insertNode(node.right, key);
		} else {
			// 重复的键
			return node;
		}
		// 如果需要,将树进行平衡操作
		const balanceFactor = this._getBalanceFactor(node);
		if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
			if (this.compareFn(key, node.left.key) === COMPARE.LESS_THAN) {
				node = this.rotationLL(node);
			} else {
				return this.rotationLR(node);
			}
		}
		if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
			if (this.compareFn(key, node.right.key) === COMPARE.BIGGER_THAN) {
				node = this.rotationRR(node);
			} else {
				return this.rotationRL(node);
			}
		}
		return node;
	}
	_removeNode(node, key) {
		node = super._removeNode(node, key);
		if (node == null) {
			return node; // null,不需要平衡
		}
		const balanceFactor = this._getBalanceFactor(node);
		// 检查树是否平衡
		if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
			const balanceFactorLeft = this._getBalanceFactor(node.left);
			if (
				balanceFactorLeft === BalanceFactor.BALANCED ||
				balanceFactorLeft === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
			) {
				return this.rotationLL(node);
			}
			if (balanceFactorLeft === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {
				return this.rotationLR(node.left);
			}
		}
		if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
			const balanceFactorRight = this._getBalanceFactor(node.right);
			if (
				balanceFactorRight === BalanceFactor.BALANCED ||
				balanceFactorRight === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
			) {
				return this.rotationRR(node);
			}
			if (balanceFactorRight === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT) {
				return this.rotationRL(node.right);
			}
		}
		return node;
	}
}

// const tree = new AVLTree()
// tree.insert(11)
// tree.insert(7)
// tree.insert(15)
// tree.insert(5)
// tree.insert(3)
// tree.insert(9)
// console.log(tree)
// let fn = v => console.log(v)
// console.log('中序↑', tree.inOrderTraverse(fn))
// console.log('先序↑', tree.preOrderTraverse(fn))
// console.log('后序↑', tree.postOrderTraverse(fn))
// console.log('最小', tree.min())
// console.log('最大', tree.max())
// console.log('查找 5', tree.search(5))
// console.log('查找 1', tree.search(1))
// tree.remove(5)
// console.log('中序↑', tree.inOrderTraverse(fn))
// console.log('查找 5', tree.search(5))

// 红黑树
const Colors = {
	RED: 1,
	BLACK: 2,
};
class RedBlackNode extends Node {
	constructor(key) {
		super(key);
		this.color = Colors.RED;
		this.parent = null;
	}
	isRed() {
		return this.color === Colors.RED;
	}
}

class RedBlackTree extends BinarySearchTree {
	constructor(compareFn = defaultCompare) {
		super(compareFn);
	}
	insert(key) {
		if (this.root == null) {
			this.root = new RedBlackNode(key);
			this.root.color = Colors.BLACK;
		} else {
			const newNode = this._insertNode(this.root, key);
			this._fixTreeProperties(newNode);
		}
	}
	_insertNode(node, key) {
		if (this.compareFn(key, node.key) === COMPARE.LESS_THAN) {
			if (node.left == null) {
				node.left = new RedBlackNode(key);
				node.left.parent = node;
				return node.left;
			} else {
				return this._insertNode(node.left, key);
			}
		} else if (node.right == null) {
			node.right = new RedBlackNode(key);
			node.right.parent = node;
			return node.right;
		} else {
			return this._insertNode(node.right, key);
		}
	}
	// 重新填色和旋转
	_fixTreeProperties(node) {
		while (
			node &&
			node.parent &&
			node.parent.color.isReed() &&
			node.color !== Colors.BLACK
		) {
			let parent = node.parent;
			const grandParent = parent.parent;
			// 情形A:父节点是左侧子节点
			if (grandParent && grandParent.left === parent) {
				const uncle = grandParent.right;
				// 情形1A:叔节点也是红色---只需要重新填色
				if (uncle && uncle.color == Colors.RED) {
					grandParent.color = Colors.RED;
					parent.color = Colors.BLACK;
					uncle.color = Colors.BLACK;
					node = grandParent;
				} else {
					//情形2A:节点是右侧子节点---左旋转
					if (node === parent.right) {
						this.rotationRR(parent);
						node = parent;
						parent = node.parent;
					}
					//情形3A:节点是左侧子节点---右旋转
					this.rotationLL(grandParent);
					parent.color = Colors.BLACK;
					grandParent.color = Colors.RED;
					node = parent;
				}
			} else {
				//情形B:父节点是右侧子节点
				const uncle = grandParent.left;
				// 情形1B:叔节点是红色---只需要重新填色
				if (uncle && uncle.color === Colors.RED) {
					grandParent.color = Colors.RED;
					parent.color = Colors.BLACK;
					uncle.color = Colors.BLACK;
					node = grandParent;
				} else {
					// 情形2B:节点是左侧子节点---右旋转
					if (node === parent.left) {
						this.rotationLL(parent);
						node = parent;
						parent = node.parent;
					}
					// 情形3B:节点是右侧子节点---左旋转
					this.rotationRR(grandParent);
					parent.color = Colors.BLACK;
					grandParent.color = Colors.RED;
					node = parent;
				}
			}
		}
		this.root.color = Colors.BLACK;
	}
	rotationLL(node) {
		const tmp = node.left;
		node.left = tmp.right;
		if (tmp.right && tmp.right.key) {
			tmp.right.parent = node;
		}
		tmp.parent = node.parent;
		if (!node.parent) {
			this.root = tmp;
		} else {
			if (node == node.parent.left) {
				node.parent.left = tmp;
			} else {
				node.parent.right = tmp;
			}
		}
		tmp.right = node;
		node.parent = tmp;
	}
	rotationRR(node) {
		const tmp = node.right;
		node.right = tmp.left;
		if (tmp.left && tmp.left.key) {
			tmp.left.parent = node;
		}
		tmp.parent = node.parent;
		if (!node.parent) {
			this.root = tmp;
		} else {
			if (node === node.parent.left) {
				node.parent.left = tmp;
			} else {
				node.parent.right = tmp;
			}
		}
		tmp.left = node;
		node.parent = tmp;
	}
}
