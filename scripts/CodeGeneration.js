/* AAHHH ITS THE FINAL STRETCHHHHHHHHHHHH

So what are we doing???
Ww gonna traverse the tree and when we come across certain statements we gonna do certain TINGS


in order to keep track of ids and their temp storage vals we use hashmap. to search it up. 


*/


var machineCode;

function generate(tree){
	machineCode = [];	
	tempStorageCounter =0;
	tempStorageMap = new Map();
	console.log("CODE GEN INITIATING");
	console.log(tree);
    	
	traverseAST(tree.root, 0);	
}

function traverseAST(node, level){


    if(node.name === "Program"){
    	console.log("HIT PROGRAM")
    	codeGenProgram(node.children, level)
    }
    else if(node.name === "Block"){
    	console.log("HIT BLOCK")
    	codeGenBlock(node, level)

    }
	else if(node.name === "VarDecl"){
		console.log("HIT VARDECL")
		codeGenVarDecl(node.children, level)
	}

	else if(node.name === "AssignStatement"){
		console.log("HIT AssignStatement")
		codeGenAssign(node.children, level)
	}

	else if(node.name === "Print"){
		console.log("HIT PRINT");
		codeGenPrint(node.children, level)
		
	}
}


function codeGenProgram(node, level){
	
    //loops through the level
    for (var i = 0; i < node.length; i++) {
        //moves deeper on each one
        console.log(node[i])
        traverseAST(node[i], level);
    }

}

function codeGenBlock(node, level){
	for (var i = 0; i < node.children.length; i++) {
        //moves deeper on each one		
        traverseAST(node.children[i], level++);
	}
}


function codeGenVarDecl(node, level){
	console.log("JESUS")
     console.log(node[0].name);
     addCode("A9")
     addCode("00")
     tempValue = "T"+tempStorageCounter
     addCode(tempValue);
     tempStorageCounter++;
     addCode("XX")
     tempStorageMap.set(node[0].name, tempValue);
}

function codeGenAssign(node, level){

	addCode("A9");
	addCode("0" + node[1].name)


}
function addCode(val){
	console.log("we're here")
	machineCode.push(val)
}