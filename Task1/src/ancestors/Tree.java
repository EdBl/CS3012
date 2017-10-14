package ancestors;

import java.util.ArrayList;
import java.util.Collections;

public class Tree {

	public Node root;
	
	public Tree(int rootValue){
		root = new Node(null, rootValue);
	}
	
	public void addLeft(int value){
		root.addLeft(value);
	}
	
	public void addRight(int value){
		root.addRight(value);
	}
	
	public Node left(){
		return root.left();
	}
	
	public Node right(){
		return root.right();
	}
	
	
	
	
	public Node getLowestCommonAncestor(Node a, Node b){
		
		ArrayList<Node> pathA = getPathRootToParent(a);
		ArrayList<Node> pathB = getPathRootToParent(b);
		
		return lowestCommonNode(pathA, pathB);
		
	}
	
	/** @return Path from the root to the node's parent. */
	private ArrayList<Node> getPathRootToParent(Node n){
		
		ArrayList<Node> path = new ArrayList<Node>();
		
		n = n.parent();
		while(n != null){
			path.add(n);
			n = n.parent();
		}
		
		Collections.reverse(path);
		
		return path;
	}
	
	/** Returns the last node before path a and path b split off. */
	private Node lowestCommonNode(ArrayList<Node> a, ArrayList<Node> b){
		
		Node common = null;
		int min = Math.min(a.size(), b.size());
		
		for (int i = 0; i < min; i++) {
			Node nodeA = a.get(i);
			Node nodeB = b.get(i);
			
			if (nodeA != nodeB) return common; // This means that the paths have just split off. Common is the last node before the paths split off.
			common = nodeA; // The paths have not split off yet.
		}
		
		return common;
	}
}
