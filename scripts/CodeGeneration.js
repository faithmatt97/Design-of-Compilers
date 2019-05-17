/* 

Okay i cant do this anymore. the end is so close so im caving in. 

There was an attempt at if and while. However, i do not have the patience to finish this

VarDecl and Assign seem to almost fully work. I cannot be assed to do a=1+2 so w.e
Print only works for raw strings, single digits, and variables. No + is sight. This is the end for me.


*/


var machineCode;
var codeGenScope
var tempFound
var codeGenErrors;
function generate(tree){
    if (sErrors>0){
    	putMessage("Code Gen stopped due to errors in previous stages");
    	return;
    }
    codeGenErrors=0;
	machineCode = [];
	tempFound = false;	
	tempStorageCounter =0;
	tempStorageMap = [];
	heap = [];
	stringTable = []
	codeGenScope = -1;
	putMessage("CODE GEN INITIATING");
	putMessage(tree);
    addToHeap("false");
	addToHeap("true");	
	traverseAST(tree.root, 0);
	if(codeGenErrors>0){
		putMessage("Code Generation stopped due to errors")
	}
	else{
	backpatch()
	addZeros();
	printCode();
	putMessage("Code Generation Complete")
}
	
	
}

function traverseAST(node, level){


    if(node.name === "Program"){
    	putMessage("HIT PROGRAM")
    	codeGenProgram(node.children, level)
    }
    else if(node.name === "Block"){
    	putMessage("HIT BLOCK")
    	codeGenBlock(node, level)

    }
	else if(node.name === "VarDecl"){
		putMessage("Generating codes for VarDecl")
		
		codeGenVarDecl(node.children, level)
	}

	else if(node.name === "AssignStatement"){
		putMessage("Generating codes for Assign Statement")
		
		codeGenAssign(node.children, level)
	}

	else if(node.name === "Print"){
		putMessage("Generating codes for print")
		codeGenPrint(node, level)
		
	}

	else if(node.name ==="Addition"){
		putMessage("Error: Code Gen does not support Addition ):")
		return;
	}

	else if(node.name === "If Statement"){
		
		codeGenErrors++
		putMessage("Error: Code Gen does not support If Statements.")
		return;

	}

	else if(node.name === "WhileStatement"){
		codeGenErrors++
		putMessage("Error: Code Gen does not support While Statements.")
		return;
	}
}


function codeGenProgram(node, level){
	
    //loops through the level
    for (var i = 0; i < node.length; i++) {
        //moves deeper on each one
       // putMessage(node[i])
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
	putMessage("JESUS")

	if(node[0].name === "TOKEN_TYPEINT")
	{

		tempValue = "T"+tempStorageCounter
	     putMessage("Adding A9")
	     putMessage("Adding 00")
	     putMessage("Adding 8D")
	     putMessage("Creating temp value " + tempValue)
	     putMessage("Adding 00")

	     addCode("A9")
	     addCode("00")
	     addCode("8D")
	     
	     addCode(tempValue);
	     tempStorageCounter++;
	     //addCode("XX")  //Delete later mayhaps
	     tempStorageMap.push(new Temp (tempValue, node[1].name, node[0].name, codeGenScope));
	     addCode("00")
   }

   else if(node[0].name ==="TOKEN_TYPEBOOLEAN"){
   		 putMessage("Adding A9")
	     putMessage("Adding 00")
	     putMessage("Adding 8D")
	     putMessage("Creating temp value " + tempValue)
	     putMessage("Adding 00")

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
   	putMessage("STRING DECLR")
		tempValue = "T"+tempStorageCounter
   		tempStorageMap.push(new Temp (tempValue, node[1].name, node[0].name, codeGenScope));
   		
   	addCode("A9")
	    addCode("00")
	    addCode("8D")
	    addCode(tempValue);
	    addCode("00")



	    	putMessage("Adding A9")
	    putMessage("Adding 00")
	    putMessage("Adding 8D")
	    putMessage("Creating temp value" +tempValue);
	    putMessage("Adding 00")
   		  tempStorageCounter++;

   		//addCode("A9")
   		//putMessage(node[0].name)
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
				addCode("00")


				putMessage("Adding 0" + node[1].name);
				putMessage("Adding 8D");
				putMessage("Fetching Temp Value " +tempStorageMap[i].getTempID());
				putMessage("Adding 00")
			}
			else if(tempStorageMap[i].getType() ==="TOKEN_TYPEBOOLEAN"){

				addCode(getHeapAddress(node[1].name));   //fetch and add address of T or F 
				addCode("8D");
				addCode(tempStorageMap[i].getTempID());   //add temp storage
				addCode("00")


				putMessage("Fetching heap address" +getHeapAddress(node[1].name));   //fetch and add address of T or F 
				putMessage("Adding 8D");
				putMessage("Fetching temp value " + tempStorageMap[i].getTempID());   //add temp storage
				putMessage("Adding 00")

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
   putMessage("")


 tempNode = node.children[0].children[0]
 //putMessage(tempNode)
 //putMessage(node.children.length)
 
 	if(node.children[0].type ==="TOKEN_DIGIT"){
 		addCode("A0") //A0 01 A2 01 FF
 		addCode("0"+node.children[0].name)
 		addCode("A2")
 		addCode("01")
 		addCode("FF")



 		putMessage("A0") //A0 01 A2 01 FF
 		putMessage("0"+node.children[0].name)
 		putMessage("A2")
 		putMessage("01")
 		putMessage("FF")
 	}

 	else if(node.children[0].type === "TOKEN_ID"){
 		putMessage("ID");
 		
 		addCode("AC");
 		findTempLocation(node.children[0], node.children)
 		addCode("00")
 		addCode("A2")

 		addCode("01")
 		addCode("FF")



 		putMessage("AC");
 		
 		putMessage("00")
 		putMessage("A2")

 		putMessage("01")
 		putMessage("FF")
 	}

 	else if(tempNode === "TOKEN_BOOLTRUE"){

 	}

 	else if(node.children[0].type === "string"){
 		putMessage("Generating code for string");
 		addToHeap(node.children[0].name);
 		
 		addCode("A0");
 		addCode(getHeapAddress(node.children[0].name).toUpperCase());
 		addCode("A2")
 		addCode("02");  
 		addCode("FF");  //System call : Print


 		 
 	}

 if(node.children[0].children.length>0){

 	tempNode = node.children[0].children
	if(tempNode[1].children[1].name ==="Addition"){
		codeGenErrors++;
		return;

		if(tempNode[1].children[0].type === "TOKEN_ID"){
			findTempLocation()
		}

		if(tempNode[1].children[0].type === "TOKEN_DIGIT"){

		}	
		codeGenAddition(tempNode[1].children[1],level)
		putMessage("But wait, there's more")
	}
 	putMessage("This is a big print expr")
 }




}
function codeGenAddition(node, level){
	putMessage("WE IN ADDITION")
	putMessage(node)
}


function codeGenWhile(node, level){
  putMessage(node.children)
}

function codeGenIf(node, level){ //0: IsEqual 1: Block
 putMessage(node.children)
//putMessage(node.children[0].children[1].children.length || node.children.length>2)
 if(node.children[0].children[1].children.length>0 || node.children.length>2){
 	putMessage("NESTED BOOLEAN")
 	//something about an error please and thanks

 }

 else{

 	if(machineCode.length<1){
 		machineCode.push("A9");
 		machineCode.push("00");
 	}
 	one =node.children[0].children[0]
 	two =node.children[0].children[1]

 	if(one.type === "TOKEN_DIGIT"){  //Fin
 		addCode("A2");
 		addCode("0" + one.name);

 	}
 	else if (one.type === "string"){ //error with AST
 		addToHeap(one.name)

 	}

 	else if( one.type ==="TOKEN_ID"){ //needs work

 	}

 	else if(one.type ==="TOKEN_BOOLTRUE" || "TOKEN_BOOLFALSE"){ //Fin
 			addCode("A2");
 			addCode(getHeapAddress(one.name))
 	}


 	if(two.type === "TOKEN_DIGIT"){ //Fin
 		addCode("A9");
 		addCode("0" + two.name);
 		addCode("8D")
 		addCode("00")
 		if(one.type ==="TOKEN_DIGIT" && two.type ==="TOKEN_DIGIT"){
 		addCode("00");
 	}
 		addCode("EC")
 	}

 	
 	else if (two.type === "string"){ //Error with AST
 		addToHeap(two.name);
 	}

 	else if(two.type ==="TOKEN_ID"){ //needs work

 	}

 	else if(two.type ==="TOKEN_BOOLTRUE" || two.type ==="TOKEN_BOOLFALSE"){ //Fin
 		addCode("A9");
 		addCode(getHeapAddress(two.name));
 		addCode("8D");
 		addCode("00");
 			if(one.type ==="TOKEN_BOOLTRUE" ||one.type ==="TOKEN_BOOLFALSE"){
 				addCode("00");
 			}
 			addCode("EC");
 	}

 }
}
function addCode(val){
	machineCode.push(val)
}



function findTempLocation(id, node){
	tempFound = false;
	
	for(i = 0; i<tempStorageMap.length; i++){
		if(codeGenScope == tempStorageMap[i].getScope() && node[0].name === tempStorageMap[i].getID()){
			
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
   
    //putMessage(heap)
}


function ascii_to_hexa(str)

  {
	
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		heap.unshift(hex);
	 }
	// putMessage(heap.join(''))
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
	 			//putMessage("HEWWO")
	 			putMessage(z)
	 			place = z;
	 			break;
	 		}

	 		else if(counter==0 && (tempString[z] === heap[z])){
	 			putMessage("FUCK")
	 			counter++;
	 		}
	 		else if(tempString[z] === heap[z]){
	 			//putMessage("pls god")
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
	//putMessage(256-(machineCode.length+heap.length))
	for(i=0; i< max; i++){
		machineCode.push("00");


	}
	for(i=0;i<heap.length;i++){
		machineCode.push(heap[i])
	}
	//machineCode = machineCode.concat(heap);


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
	putMessage("--------------------MACHINE CODE--------------------------")
	putMessage(str)
}



function backpatch(){
	sub=0;
	increment=0;
	for(i=0 ; i<tempStorageMap.length;i++){
		for(j=0; j<machineCode.length; j++){
			//putMessage("T"+i)
			if(machineCode[j] === "T"+i){

				//machineCode[j] = (increment+machineCode.length).toString(16)
				
				//machineCode[j] = "0"+(machineCode.length+i-3).toString(16)}
				sub= Math.abs(machineCode.length+i).toString(16)
				putMessage(sub)
				if(sub.length<2){
				machineCode[j]= "0"+sub}
				else 
				machineCode[j] = sub
			


			
			}
		}
		
	}
}