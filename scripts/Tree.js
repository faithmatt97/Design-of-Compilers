function Tree(){
	this.root = null;
	this.current ={};
	this.addNode = function(name, branchType,type, line, column){
		var node = {
			name: name,
			parent: {},
			children:  [],
            type: type,
            line: line,
            column: column,
            unique: line + " " + column


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


     this.please = function() {
        // Initialize the result string.
        var poo= "";
        var tracking = ["Print", "AssignStatement", "VarDecl", "WhileStatement", "If Statement", "Block"]

        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth)
        {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            for (var i = 0; i < depth; i++)
            {
                poo += "-";
            }

            // If there are no children (i.e., leaf nodes)...
            //if(node.name == "Print" || node.name == "If Statement" || node.name ==){
            if(tracking.includes(node.name)){
            	console.log(node.name);
            
            }


            if (!node.children || node.children.length === 0)
            {
                // ... note the leaf node.
                poo += "[" + node.name + "]";
               poo += "\n";
            }
            else
            {
                // There are children, so note these interior/branch nodes and ...
               poo += "<" + node.name + "> \n";
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
        return poo;
    };
	


            this.toAST = function() {
            	var poop = this.root;
            	current = poop;
       		//this.root= node 
       		//this.current = this.root
       		//var hold = this.current; 
       		//console.log(node.children)
       		//console.log(poop.name)
       		//console.log(poop.root);
       		//console.log(poop)
       			if(poop.root === null)
       				return;

       			go(poop)
       			//console.log(poop.children)
       		
       			function go(node){

       				if(node.root === null)
       				return;
       				console.log(node.name)
       				go(node.children);
       			}

       		
    };
}

function go(tree){

	//if (this.root == null)
		//return;
	console.log(tree.hasOwnProperty(name))
	//go(tree.children);
}
