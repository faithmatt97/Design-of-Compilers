function Tree(){
	this.root = null;
	this.current ={};
	this.addNode = function(name, branchType){
		var node = {
			name: name,
			parent: {},
			children:  [] 


		}

		if((this.root ==null) || (!this.root)){
			this.root=node;
            this.current = node;
		}
		else{
			node.parent = this.current;
			this.current.children.push(node);
			
		}

		if (branchType == "branch") {
          
            this.current = node;
        }
}


		this.endChildren = function() {
        if ((this.current.parent !== null) && (this.current.parent.name !== undefined)) {
            this.current = this.current.parent;
        } 
		else {
            
        }
    };

            this.toString = function() {
        // Initialize the result string.
        var traversalResult = "";

        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth)
        {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            for (var i = 0; i < depth; i++)
            {
                traversalResult += "-";
            }

            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0)
            {
                // ... note the leaf node.
                traversalResult += "[" + node.name + "]";
                traversalResult += "\n";
            }
            else
            {
                // There are children, so note these interior/branch nodes and ...
                traversalResult += "<" + node.name + "> \n";
                // .. recursively expand them.
                for (var i = 0; i < node.children.length; i++)
                {
                    expand(node.children[i], depth + 1);
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.root, 0);
        // Return the result.
        return traversalResult;
    };
	
}
