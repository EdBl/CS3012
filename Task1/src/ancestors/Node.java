package ancestors;

public class Node {

	public int value;
	public Node left, right, parent;
	
	public Node(Node parent, int value){
		this.parent = parent;
		this.value = value;
	}
	
	public void addLeft(int value){
		left = new Node(this, value);
	}
	
	public void addRight(int value){
		right = new Node(this, value);
	}
	
}
