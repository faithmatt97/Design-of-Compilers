/* AAHHH ITS THE FINAL STRETCHHHHHHHHHHHH

So what are we doing???
Ww gonna traverse the tree and when we come across certain statements we gonna do certain TINGS


in order to keep track of ids and their temp storage vals we use hashmap. to search it up. 


*/


var machineCode;
var codeGenScope
var tempFound
function generate(tree){
	machineCode = [];
	tempFound = false;	
	tempStorageCounter =0;
	tempStorageMap = [];
	heap = [];
	stringTable = []
	codeGenScope = -1;
	console.log("CODE GEN INITIATING");
	console.log(tree);
    addToHeap("false");
	addToHeap("true");	
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
	codeGenScope++;
	for (var i = 0; i < node.children.length; i++) {
        //moves deeper on each one		
        traverseAST(node.children[i], level++);
	}
	codeGenScope--;
}


function codeGenVarDecl(node, level){
	console.log("JESUS")

	if(node[0].name === "TOKEN_TYPEINT")
	{
	     console.log(node[0]);
	     console.log(node[0].parent.children)
	     addCode("A9")
	     addCode("00")
	     addCode("8D")
	     tempValue = "T"+tempStorageCounter
	     addCode(tempValue);
	     tempStorageCounter++;
	     //addCode("XX")  //Delete later mayhaps
	     tempStorageMap.push(new Temp (tempValue, node[1].name, node[0].name, codeGenScope));
   }

   else if(node[0].name ==="TOKEN_TYPEBOOLEAN"){
   		addCode("A9")
	    addCode("00")
	    addCode("8D")
	    tempValue = "T"+tempStorageCounter
	    addCode(tempValue);
	    addCode("00")
	    tempStorageCounter++;
	    tempStorageMap.push(new Temp (tempValue, node[1].name, node[0].name, codeGenScope));
   }


   else if(node[0].name ==="TOKEN_TYPESTRING"){
   	console.log("STRING DECLR")
		tempValue = "T"+tempStorageCounter
   		tempStorageMap.push(new Temp (tempValue, node[1].name, node[0].name, codeGenScope));
   		
   	addCode("A9")
	    addCode("00")
	    addCode("8D")
	    addCode(tempValue);
	    addCode("00")
   		  tempStorageCounter++;

   		//addCode("A9")
   		//console.log(node[0].name)
   		//addCode("8D")
   		//addCode(tempValue)
   }
}

function codeGenAssign(node, level){

	addCode("A9");
//	addCode("0" + node[1].name)
	
	for(i=0; i< tempStorageMap.length;i++){
		if(codeGenScope == tempStorageMap[i].getScope() && node[0].name === tempStorageMap[i].getID()){
			
			if(tempStorageMap[i].getType()==="TOKEN_TYPEINT"){
				addCode("0" + node[1].name);
				addCode("8D");
				addCode(tempStorageMap[i].getTempID());
				break;
			}
			else if(tempStorageMap[i].getType() ==="TOKEN_TYPEBOOLEAN"){

				addCode(getHeapAddress(node[1].name));   //fetch and add address of T or F 
				addCode("8D");
				addCode(tempStorageMap[i].getTempID());   //add temp storage

			}

			else if(tempStorageMap[i].getType()==="TOKEN_TYPESTRING"){
				//addCode("A9");
				addToHeap(node[1].name)
				heapAddress = (256-heap.length).toString(16);
				addCode(heapAddress);
				stringTable.push(new StringEntry(node[1].name, heapAddress))
				addCode("8D");
				addCode(tempStorageMap[i].getTempID());
				addCode("00");

			}
		}
	}

	//addCode("XX") //delete later mayhaps

}


function codeGenPrint(node, level){
   addCode("AC");
   console.log("PERIA IS OUT (PRINT)")
 //console.log(node.children[0])
 if(node[0].children.length>0)
 	console.log("KILL THE BABIES")
findTempLocation(node[0].name, node)
addCode("XX")
addCode("A2")
addCode("01")
addCode("FF")


}
function addCode(val){
	machineCode.push(val)
}

function findTempLocation(id, node){
	tempFound = false;
	for(i = 0; i<tempStorageMap.length; i++){
		if(codeGenScope == tempStorageMap[i].getScope() && node[0].name === tempStorageMap[i].getID()){
			console.log("MATCH")
			addCode(tempStorageMap[i].getTempID());
			tempFound = true;
			break;
		}
	}
}

function addToHeap(val){
    //str= val.split("").reverse().join("");

    ascii_to_hexa(val)
/*    for(i=0; i<str.length; i++){
    	heap.push(str.charCodeAt(i)).toString(16);
    }*/
    heap.push("00")
    console.log(heap)
}


function ascii_to_hexa(str)

  {
	
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		heap.push(hex);
	 }
	 console.log(heap.join(''))
	return heap.join('');
   }


function getHeapAddress(val){
	if(val ==="false"){
		return "F5";
	}

	else if(val === "true"){
		return "5B";
	}

	else{

	}
}