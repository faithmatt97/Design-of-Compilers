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
	addZeros();

	
	
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
		codeGenPrint(node, level)
		
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
	     addCode("00")
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
				addCode("00")

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
if(machineCode.length<1){
	addCode("A9");
	addCode("00")
}
   //addCode("AC");
   console.log("PERIA IS OUT (PRINT)")
 //console.log(node.children[0])
 console.log(node.children[0])
 tempNode = node.children[0].children[0]
 console.log(tempNode)
 //console.log(node.children.length)
 
 	if(tempNode ==="TOKEN_DIGIT"){
 		console.log("DIGIT")
 	}

 	else if(node.children[0].type === "TOKEN_ID"){
 		console.log("ID");
 		
 		addCode("AC");
 		findTempLocation(node.children[0], node.children)
 		addCode("00")
 		addCode("A2")

 		addCode("01")
 		addCode("FF")
 	}

 	else if(tempNode === "TOKEN_BOOLTRUE"){

 	}

 	else if(node.children[0].type === "string"){
 		console.log("Generating code for string");
 		addToHeap(node.children[0].name);
 		
 		addCode("A0");
 		addCode(getHeapAddress(node.children[0].name).toUpperCase());
 		addCode("A2")
 		addCode("02");  
 		addCode("FF");  //System call : Print


 		 
 	}

 //if(node[0].children.length>0)
 	//console.log("KILL THE BABIES")
 //findTempLocation(node[0].name, node)
/* addCode("XX")
 addCode("A2")
 addCode("01")
 addCode("FF")*/

 if(node.length>1){
 	console.log("REEL EM IN")
 }


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

	if(!tempFound){
		for(i=0; i< stringTable.length;i++){

		}
	}
	
}

function addToHeap(val){
    //str= val.split("").reverse().join("");
 heap.unshift("00")
    ascii_to_hexa(val)
/*    for(i=0; i<str.length; i++){
    	heap.push(str.charCodeAt(i)).toString(16);
    }*/
   
    console.log(heap)
}


function ascii_to_hexa(str)

  {
	
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		heap.unshift(hex);
	 }
	 console.log(heap.join(''))
	return heap.join('');
   }


function getHeapAddress(val){
	tempString = [];
	z=0;
	place = 0;
	counter = 0;
	if(val ==="false"){
		return "FA";
	}

	else if(val === "true"){
		return "F5";
	}

	else {
		for ( z = 0 ; z < val.length; z++) 
     	{
			var check = Number(val.charCodeAt(z)).toString(16);
			tempString.push(check);
	 	}
	 
	 	for (z=0;  z < heap.length; z++){
	 		if (counter == heap.length){
	 			console.log("HEWWO")
	 			console.log(z)
	 			place = z;
	 			break;
	 		}

	 		else if(counter==0 && (tempString[z] === heap[z])){
	 			console.log("FUCK")
	 			counter++;
	 		}
	 		else if(tempString[z] === heap[z]){
	 			console.log("pls god")
	 			counter++;
	 		}

	 		else{
	 			counter = 0;
	 		}
	 	}
	 	return	(256-heap.length).toString(16);
	 	

	}
}


function addZeros(){
	max=256-(machineCode.length+heap.length)
	console.log(256-(machineCode.length+heap.length))
	for(i=0; i< max; i++){
		machineCode.push("00");


	}

	machineCode = machineCode.concat(heap);


}

function printCode(){
	j=0
	str = ""
	for(i=0; i< 256; i++){
		//if(j==8)
			//putMessage("\n")
		str = str+ machineCode[i] + " "
		j++;
	}
	putMessage(str)
}