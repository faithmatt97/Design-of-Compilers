//CODE WITH CHECK IF USED FUNCTIONS 


//WHAT TO WORRY ABOUT FOR EACH STATEMENT

/*
	
     TODO

     *Scope checking seems to be in play, shoutout to Chris' Sonar. Saved me before i had a stroke
     Var Declaration only applies to current scope, not parents so we're guuci

     All we have to do now is type check, which seems easy in theory but there are some funky stuff
     		right type checking for assignment works
		
		boolean expr are kicking my ass



		AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH

		BOOLEAN EXPR I HATE YOU

		WHAT WE DOING NOW

		WE GONNA TRACK A VARIABLE

		IF ANY CHILDREN DO NOT MATCH VARIABLE TYPE RETURN ERROR
		IDC ABOUT BEING SPECIFIC RN

		BOOLEXPR I WILL KNOCK UR KNEES IN 

		I realized that all values in bool expr dont have to be the same. There are two groups here. if(a == (b ==c))

		b and c must be equal to one another

		while a must be boolean or either match type b and c

		
		so i have two arrays. All values except for the final two will be pushed into boolArray while, the other two will be pushed to boolArrayYolo.

			First we'll compare the types in boolArrayYolo, if they do not match then error
			Next we'll check the objects in boolArray to see if they are type boolean or same as boolArray types.

			GG



     

	 
*/
var scopeCount = 0
var callingAllSymbols = []
var secondBool
var test
var boolArrayYolo = []
var boolArray = []
var comingFromAssignStatement
var sErrors;
var motherfucker
var varType;
var sTokens;
var symbolMap;
var symbolTree;
var assignee;
//For Semantic Analysis. Constructing AST from tokens bc traversing non binary tree is giving me a goddamn headache;

//can i do this without creating tree of hashmaps, but simply one big hashmap???
//variable ids will be keys
// values will be object holding information 
//if we fail to find key value pair in current scope, we'll move back a pair
//collisions will still happen
var sErrors=0;
var sWarnings = 0;
var ast;
var scopelvl = -1;
function printSymbolTable(treeLevel){
	console.log("ID\tType\t ScopeLevel\t")
	for(var i = 0; i<callingAllSymbols.length; i++){
		console.log(callingAllSymbols[i].id +"\t" + callingAllSymbols[i].type +"\t\t" + callingAllSymbols[i].scope)
		
	}
}

function getValueofID(id,level){
	if ((level.parent != undefined || level.parent != null) && level.symbols.length > 0) {
        //finds the ID
        for (var i = 0; i < level.symbols.length; i++) {
            //when the correct ID is found
            if (id == level.symbols[i].getID()) {
                
                return level.symbols[i];
            }
        }
    }
    //If higher level, search there
    if (level.parent != undefined || level.parent != null) {
        //calls a search in the higher levels
        return getValueofID(id, level.parent);
    }
    //or doesn't
    return -1;

}

function varSearchParentScope(id, level){
	/*
if ((treeLevel.parent != undefined || treeLevel.parent != null) && treeLevel.symbols.length > 0) {
	for(var i = 0; i<treeLevel.symbols.length; i++){
		
		console.log("Printing all values..." + treeLevel.symbols[i].id )

		if(id == treeLevel.symbols[i].getID()){
			console.log("HELLOOOOOO")
			
			return true;
		}
	}


	}



    	
	 if((treeLevel.parent != undefined || treeLevel.parent != null)){
		console.log("AGAIN AND AGAIN")
		varSearchParentScope(id, treeLevel.parent)
	}


	return false;

*/


   //if the current level has symbols
    if ((level.parent != undefined || level.parent != null) && level.symbols.length > 0) {
        //finds the ID
        for (var i = 0; i < level.symbols.length; i++) {
            //when the correct ID is found
            if (id == level.symbols[i].getID()) {
                //returns true
                return true;
            }
        }
    }
    //If higher level, search there
    if (level.parent != undefined || level.parent != null) {
        //calls a search in the higher levels
        return varSearchParentScope(id, level.parent);
    }
    //or doesn't
    return false;

}

function varSearchCurrentScope(id){
	if(symbolTree.current.symbols.length >0){ 
	for(i = 0; i<symbolTree.current.symbols.length; i++){
		if(sCurrentToken.value === symbolTree.current.symbols[i].id){
			
			return true;
		}
	}
}
	return false;
}




function searchForVar(id, level) {
    //if the current level has symbols
    if ((level.parent != undefined || level.parent != null) && level.symbols.length > 0) {
        //finds the ID
        for (var i = 0; i < level.symbols.length; i++) {
            //when the correct ID is found
            if (id == level.symbols[i].getID()) {
                //returns true
                return true;
            }
        }
    }
    //If higher level, search there
    if (level.parent != undefined || level.parent != null) {
        //calls a search in the higher levels
        return searchForVar(id, level.parent);
    }
    //or doesn't
    return false;
}


function buildSymbolTable(level, r = "") {
    //if the current level has symbols
    if (level.symbols.length > 0) {
        //for each symbol 
        for (var i = 0; i < level.symbols.length; i++) {
            //add row to table
            r += "<tr><td>" + level.symbols[i].getID() + "</td><td>" + level.symbols[i].getType() + "</td><td>" + level.symbols[i].getScope() + "</td><td>" + level.symbols[i].getLine() + "</td></tr>";
        }
    }
    //If lower level, search there
    if (level.children != undefined || level.children != null) {
        //loops through all children
        for (var j = 0; j < level.children.length; j++) {
            //calls a search in the lover levels
            r = buildSymbolTable(level.children[j], r);
        }
    }
    //return table
    return r;
} 
function createTable(lvl){
	/*var row = "";

	if((lvl.parent!+undefined || lvl.parent!=null) && lvl.symbols.length > 0){
		for(var i = 0;l i<lvl.symbols.length;i++){

			row+= "<tr><td>" + lvl.symbols[i].getKey() + "</td><td>" + lvl.symbols[i].getType() + "</td><td>" + lvl.symbols[i].getScope() + "</td><td>" + lvl.symbols[i].getLine() + "</td></tr>";
		}
		return row;
	}
		if(lvl.parent !- undefined || lvl.parent != null){
			return  createTable(lvl.parent);
		}*/
	
}

function checkIfDeclared(id, level){
	counter = 0
	//level = symbolTree.current;
	//putMessage(buildSymbolTable(symbolTree.current))
	//for(i = 0; i<symbolTree.current.symbols.length; i++){
	/*if(symbolTree.current.symbols[i].id === sCurrentToken.value){  //if map already has id at current scope
				console.log(symbolMap.get(sCurrentToken.value).scope);
				console.log("Error: redeclared variable")    //Error message
				console.log("It has it");
				//break;
			}
			else{

				
				symbolMap.set(sCurrentToken.value, new Symbol(sCurrentToken.value, "dummy type", 0, scopelvl, sCurrentToken.line, sCurrentToken.colNumber, true, false));
				
				symbolTree.current.symbols.push(new Symbol(sCurrentToken.value, "dummy type", 0, scopelvl, sCurrentToken.line, sCurrentToken.colNumber, true, false));
			}
		//}

		for(i = 0; i< symbolTree.current.symbols.length; i++){
			if(id == symbolTree.current.symbols[i].getID()){
				console.log('id exists');
				counter++;
			}
		}

		if(counter ==0){
			console.log("Does not exist")
			symbolTree.current.symbols.push(new Symbol(sCurrentToken.value, "dummy type", 0, scopelvl, sCurrentToken.line, sCurrentToken.colNumber, true, false))
		}*/


		if (level.symbols.length > 0) {
        //for each symbol 
        for (var i = 0; i < level.symbols.length; i++) {
            //add row to table
            if(id === sCurrentToken.value){
            	console.log("variable exist" + sCurrentToken.value);
            	counter++;
            }
        }
    }
    //If lower level, search there
    if (level.parent!= undefined || level.parent != null) {
        //loops through all children
        for (var j = 0; j < level.children.length; j++) {
            //calls a search in the lover levels
              checkIfDeclared(sCurrentToken.value, level.parent);
        }
    }
    	if(counter == 0 ){

				symbolTree.current.symbols.push(new Symbol(sCurrentToken.value, "dummy type", 0, scopelvl, sCurrentToken.line, sCurrentToken.colNumber, true, false));

    	}
    console.log(counter);
    //return table
    //return r;
}
function sGetToken(){

	sCurrentToken = sTokens[0];
	sTokens.shift();


}

function sProgram(tokens){
	//symbolMap = new Map();
	scopeCount = 0
	callingAllSymbols = []
	sErrors=0;
	varFound = false;
	//test = undefined
	//secondBool = undefined
	symbolTree = new SymbolTree();
	sTokens = tokens;
	boolArray = []
	sToken = tokens;
	//console.log(sTokens)

	ast = new Tree();
	ast.addNode("Program");
	//console.log("SEMANTIC ANALYSIS --> Analyzing Program: " + programCount)
	sGetToken();
	
	sBlock();
	ast.endChildren
	if(sErrors>0){
		console.log("Semantic Analysis stopped due to errors")
	}
	if(sErrors == 0){
	//console.log("SEMANTIC ANALYSIS --> ANALYSIS COMPLETE" )
	console.log(ast.toString())
	console.log(ast)
	console.log(symbolTree)
printSymbolTable()

	}
	
}
function sBlock(){
	
	if(sErrors>0){
				return
			}
	if(scopelvl != -1){
	if(test != undefined && secondBool != undefined){
	//console.log("COTTON CANDY "+test.type +" " + secondBool.type)
	checkBool(boolArray, test, secondBool)
	boolArray=[]
}
}
	//console.log("SEMANTIC ANALYSIS --> Analyzing Block")
	symbolTree.current.map = new Map(symbolMap);
	symbolMap = new Map();


	scopeCount++;
    scopelvl++;
	symbolTree.addNode("Scope Level:" + scopelvl, "branch");
	
	ast.addNode("Block" , "branch");
	//console.log(sTokens[1])

	if (sCurrentToken.type === "TOKEN_LEFTBRACE") {
        sGetToken();
       // console.log(sCurrentToken)
        
	}

    sStatementlist();

    if(sCurrentToken.type === "TOKEN_RIGHTBRACE"){
    	
    	sGetToken();
    }
    
 
    
    scopelvl--;


    symbolTree.endChildren();
    ast.endChildren();
}

function sStatement(){
	if(sErrors>0){
				return
			}
	//console.log("SEMANTIC ANALYSIS --> Analyzing Statement")
		 if (sCurrentToken.type === "TOKEN_PRINT") 
		 {
   			sPrint();
 		 } 
    else if (sCurrentToken.type === "TOKEN_ID") 
    {
        
        sAssignmentStatement();
    
    } else if (sCurrentToken.type === "TOKEN_TYPEINT" || sCurrentToken.type === "TOKEN_TYPESTRING" || sCurrentToken.type === "TOKEN_TYPEBOOLEAN") {
        //goes to variable declarations
        sVarDecl();
    //if WHILE
    } else if (sCurrentToken.type === "TOKEN_WHILE") {
        //goes to while statements
        sWhileStatement();
    //if IF
    } else if (sCurrentToken.type === "TOKEN_IF") {
        //goes to if statements
        sIfStatement();
    //if LEFT_BRACE
    } else if (sCurrentToken.type === "TOKEN_LEFTBRACE") {
        //goes to block
        sBlock();
    } 

}


function sStatementlist(){
	if(sErrors>0){
				return
			}

	//console.log("SEMANTIC ANALYSIS --> Analyzing StatementList")
		if (sCurrentToken.type === "TOKEN_RIGHTBRACE"){

		}
		if(sCurrentToken.type === "TOKEN_PRINT" || sCurrentToken.type === "TOKEN_ID" 
    || sCurrentToken.type === "TOKEN_TYPEINT" || sCurrentToken.type === "TOKEN_TYPESTRING"
    || sCurrentToken.type === "TOKEN_TYPEBOOLEAN" || sCurrentToken.type === "TOKEN_WHILE" 
    || sCurrentToken.type === "TOKEN_IF" || sCurrentToken.type === "TOKEN_LEFTBRACE"){

			sStatement();
				if(sErrors>0)
					return
			sStatementlist()
		}
}

function sPrint(){
	var boolFlag
	if(sErrors>0){
				return
			}
	//console.log("SEMANTIC ANALYSIS --> Analyzing Print Statement")

		ast.addNode("Print" , "branch");
		
		sGetToken();
		
		if(sCurrentToken.type === "TOKEN_LEFTPAREN")
			sGetToken();
		
		if(sCurrentToken.type ==="TOKEN_ID"){
			console.log(getValueofID(sCurrentToken.value, symbolTree.current) ==-1 + "SASUKE")
			if(getValueofID(sCurrentToken.value, symbolTree.current) ==-1){
				sErrors++
				console.log("ERROR: variable [" +sCurrentToken.value+ "] used before declared.")
			}

			else if(getValueofID(sCurrentToken.value, symbolTree.current) !=-1){
				console.log("NARUTOOOO")
				setVarToUsed(sCurrentToken.value, symbolTree.current)}

		}

		else if(sCurrentToken.type ==="TOKEN_LEFTPAREN"){
			boolFlag = true
		}
		sExpr();
		/*if(boolFlag){
			console.log("AT PRINT CHECKING BOOL ARRAY LENGTH: " + boolArray.length)
			checkBool(boolArray, test, secondBool)
			boolFlag = false;
		}*/
		if(sCurrentToken.type === "TOKEN_RIGHTPAREN")
			sGetToken();

checkBool(boolArray, test, secondBool)
boolArray=[]
		ast.endChildren();
}


function sAssignmentStatement(){
	enteringBoolean = false;
	//console.log("SEMANTIC ANALYSIS --> Analyzing Assign Statement")
		
		typeofAssign = sCurrentToken
		
		ast.addNode("AssignStatement", "branch")
		varFound = false;
		
		
		
			if(varSearchParentScope(sCurrentToken.value, symbolTree.current)){
				typeofAssign = getValueofID(sCurrentToken.value, symbolTree.current)
				console.log(sCurrentToken.value  +" has been found in parent scope")
			}
			else{
				sErrors++;
				console.log("ERROR: ["+sCurrentToken.value+ "] used before declared")
				console.log(varSearchParentScope(sCurrentToken.value, symbolTree.current.parent))
				return;
			}
			if(sErrors>0){
				return
			}
		
		
		
		for(i=0; i< symbolTree.current.symbols.length ; i++){
			
			if(sCurrentToken.value === symbolTree.current.symbols[i].id)
				varFound = true;
				assignee = sCurrentToken;
		}

		//if(varFound)
			//console.log("Found the variable! :thumbsup:")
		if(sCurrentToken.type === "TOKEN_ID"){
				sID();
		}


		if(sCurrentToken.type === "TOKEN_ASSIGN"){
             
             sGetToken()
            
			
			if(sCurrentToken.type === "TOKEN_LEFTPAREN" ||sCurrentToken.type === "TOKEN_BOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){
				

				if(typeofAssign.type != "TOKEN_TYPEBOOLEAN"){
					sErrors++;
					
					console.log("Error: trying to assign variable [ " + typeofAssign.id + " ] of type ["+ typeofAssign.type +"] to boolean expr on line: " + sCurrentToken.line)
					return;
				}
					console.log(boolArray.length + "YEEEEHAW")
					//if(boolArray.length>1)
					//checkBool(boolArray, test, secondBool)
			}


			else if(sCurrentToken.type === "TOKEN_DIGIT"){
				if(typeofAssign.type != "TOKEN_TYPEINT"){
					
					console.log("Mixmatched types. Assignee ["+ typeofAssign.id + "] is type [" + typeofAssign.type+ "] while assignment  [" +sCurrentToken.value +"] is type [" + sCurrentToken.type + "] on line: " +sCurrentToken.line)
				}
			}

			else if(sCurrentToken.type === "TOKEN_QUOTE"){
				if(typeofAssign.type != "TOKEN_TYPESTRING"){
					console.log(typeofAssign)
					console.log("Mixmatched types. Assignee ["+ typeofAssign.id + "] is type [" + typeofAssign.type+ "] while assignment  [" +sCurrentToken.value +"] is type [" + sCurrentToken.type + "] on line: " +sCurrentToken.line)
				}
			}
			else if(sCurrentToken.type ==="TOKEN_ID"){
				console.log("filler")
					//fetch id type and compare to varType, if not the same error, else continue 
				if(getValueofID(sCurrentToken.value,symbolTree.current)== -1){
					console.log("ERROR: variable [" +sCurrentToken.value+ "] used before declared.")
				}

				else {
					if(getValueofID(sCurrentToken.value,symbolTree.current).type != typeofAssign.type)
						console.log("ERROR ERROR ERROR")

					else setVarToUsed(sCurrentToken.value, symbolTree.current)
				}


			}


			sExpr();
			console.log(getUnique(boolArray,'unique').length+" GIDDY UP")
			//console.log("Assign statement ")
			
			
			
				//checkBool(boolArray, test, secondBool)
				
			
		}
		//console.log("COTTON CANDY "+test +" " + secondBool)
			//
		//	boolArray =[]
		checkBool(boolArray, test, secondBool)
		boolArray = []
		ast.endChildren();


}


function sVarDecl(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing VarDecl")
		varFound= false;
		ast.addNode("VarDecl", "branch");
		varType = sCurrentToken.type;
		sGetToken();
		variable = false;
		
		//console.log("In var decl " +sCurrentToken.type +" "+ sCurrentToken.value)
		
		if(sCurrentToken.type ==="TOKEN_ID"){
				

				variable = varSearchCurrentScope(sCurrentToken.value)

				if(variable){
					sErrors++;
					console.log("ERROR: variable already declared")
					return;
				}
				if(sErrors>0){
				return
			}

				if(!variable)
					{
						symbolTree.current.symbols.push(new Symbol(sCurrentToken.value, varType, 0, scopelvl, sCurrentToken.line, sCurrentToken.colNumber, true, false))
						callingAllSymbols.push(new Symbol(sCurrentToken.value, varType, 0, scopeCount, sCurrentToken.line, sCurrentToken.colNumber, true, false))
						console.log("New variable ["+sCurrentToken.value+"] has been declared on line: " +sCurrentToken.line)
						sID();
					}

			
		}
		//sID();


		ast.endChildren();
}


function sWhileStatement(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing While Statement")
	boolArray = []
	ast.addNode("WhileStatement", "branch");
	sGetToken();
	if(sCurrentToken.type === "TOKEN_LEFTPAREN" || sCurrentToken.type === "TOKEN_BOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){
		sBooleanExpr();
		sGetToken();
		sBlock();
	}

	ast.endChildren();
}


function sIfStatement (){
	//console.log("SEMANTIC ANALYSIS --> Analyzing If Statement")
//console.log("COTTON CANDY "+test +" " + secondBool)
//checkBool(boolArray, test, secondBool)
	boolArray = []
	ast.addNode("If Statement", "branch");
	symbolTree.addNode("Scope Level: " + (scopelvl+1), "branch")
	

	sGetToken();
	if(sCurrentToken.type === "TOKEN_LEFTPAREN" || sCurrentToken.type === "TOKEN_BOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){

		sBooleanExpr();
		sGetToken();
		sBlock();
		
	}



	ast.endChildren();
}


function sExpr(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing Expr")
	tempType = "";
	
	if(sCurrentToken.type ==="TOKEN_DIGIT"){ //if the token after = is digit then check if the id is an int, if not give error message. If int then proceed. 
		
		sIntExpr();
	}

	else if(sCurrentToken.type ==="TOKEN_QUOTE"){ //if the token after = is quote then check if the id is a string, if not give error message. If type string then proceed.
		
		sStringExpr();
	}
	else if (sCurrentToken.type ==="TOKEN_LEFTPAREN" || sCurrentToken.type ==="TOKEN_BOOLTRUE" || sCurrentToken.type === "TOKEN_BOOLFALSE"){ //same as above but with bool
		
		sBooleanExpr();
		//checkBool(boolArray, test, secondBool)
	}



	else if(sCurrentToken.type ==="TOKEN_ID"){  //We need to fetch this id and compare their types. If they're the same, proceed. If not, issue error message. But first we need to check if this id exists
		
			sID();

	}
	//checkBool(boolArray, test, secondBool)
}


function sIntExpr(){
		//console.log("SEMANTIC ANALYSIS --> Analyzing Int Expr")
			
		if(sTokens[0].type ==="TOKEN_INTOP"){
			ast.addNode("Addition", "branch");
			
		}
		/*if(sTokens[0]=== "TOKEN_INTOP"){
			sGetToken();
			sExpr();

			//ast.endChildren();
		} */

		sID();

		if(sCurrentToken.type === "TOKEN_INTOP"){
			

			sGetToken();
			sExpr();
			ast.endChildren();
		}

}


function sStringExpr(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing String Expr")
	if(sCurrentToken.type === "TOKEN_QUOTE"){
		 endQuote = false;
			sGetToken();
		}

		var word =sCharlist();

	if(sCurrentToken.type === "TOKEN_QUOTE" && endQuote){
		ast.addNode(word, "leaf", "string", sCurrentToken.line, sCurrentToken.colNumber)
		sGetToken();
	}
}


function sID(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing ID")
		//console.log("in sID() and got: " +sCurrentToken.type)
	if(sCurrentToken.type === "TOKEN_ID" ){
	}
		ast.addNode(sCurrentToken.value, "leaf", sCurrentToken.type, sCurrentToken.line, sCurrentToken.colNumber);
		sGetToken();
		//console.log(sCurrentToken.type + "LOOK OUT")
	

}
var endQuote = false;

function sCharlist(){ // +_+
	//console.log("SEMANTIC ANALYSIS --> Analyzing CharList")
	var r = sCurrentToken.value;
	//var doneQuote = false
	sGetToken();

	if( (sCurrentToken.type === "TOKEN_CHAR") || (sCurrentToken.type ==="TOKEN_SPACE"))
		return r+sCharlist();
	else{
		endQuote = true
		return r;
	}
}


function sBooleanExpr(){
//	console.log("SEMANTIC ANALYSIS --> Analyzing Boolean Expr")
		//console.log("In bool expr and got: " +sCurrentToken.type)
		var first;
		var second;
		
		//var boolArray = []
		var trackedtype;
	if(sCurrentToken.type === "TOKEN_BOOLTRUE" || sCurrentToken.type === "TOKEN_BOOLFALSE")
	{
		sID();
	}

	if(sCurrentToken.type ==="TOKEN_LEFTPAREN")
	{                 
		
		sGetToken();
		
		
		if(sCurrentToken.type ==="TOKEN_ID"){
			
				if(getValueofID(sCurrentToken.value, symbolTree.current) == -1){
					sErrors++;
					console.log("ERROR: variable [" +sCurrentToken.value+ "] used before declared." )
					return;
				}
				if(sErrors>0){
				return
			}
			
			 first = getValueofID(sCurrentToken.value, symbolTree.current)
			setVarToUsed(sCurrentToken.value,symbolTree.current)

				test = sCurrentToken

		}
		else{
			first = sCurrentToken.type;
			test = sCurrentToken;
		}
		console.log("OUR FIRST BOOLVAL IS....")
		console.log(test)
		var closeOut = false;

		if(sTokens[0].type === "TOKEN_ISEQUAL")
		{
			ast.addNode("isEqual", "branch")
			closeOut = true;
		}

		
		else if(sTokens[0].type ==="TOKEN_NOTEQUAL")
		{
			ast.addNode("notEqual", "branch")
			closeOut = true;
				
		}
			//console.log("In bool expr and got: " +sCurrentToken.type)
		sExpr();



		if(sCurrentToken.type === "TOKEN_NOTEQUAL" || sCurrentToken.type === "TOKEN_ISEQUAL"){
			//console.log("GOT == or !=")
			sGetToken();

			if(sCurrentToken.type === "TOKEN_ID"){
				 secondBool= getValueofID(sCurrentToken.value, symbolTree.current)
				 if(secondBool == -1){
				 	sErrors++;
				 	console.log("ERROR: ["+sCurrentToken.value+ "] used before declared on line: " + sCurrentToken.line)
				 	return;
				 }

				 else 
				 	setVarToUsed(secondBool.value, symbolTree.current)

			}

			else if(sCurrentToken.type != "TOKEN_LEFTPAREN"){
				//console.log(sCurrentToken.type + "WHAT IS IT?")
				secondBool = sCurrentToken
				console.log("OUR NEXT BOOL VAL IS.....")
				console.log(secondBool)
				//boolArray.push(sCurrentToken)
			}

			/*if(sCurrentToken.type === "TOKEN_ID")
			{
				console.log("In Boolean expr and 2nd expr is ID")
				second = getValueofID(sCurrentToken.value, symbolTree.current)
				
				if(second == -1)
				{

					console.log("ERROR: variable [" +sCurrentToken.value+ "] used before declared." )
				}
				 //if(second.type != first){
					//console.log("ERROR: Mixmatched types in boolean expr")
				//}
		    }

		    

		   
		    else{
		    	for(i=0; i<sTokens.length; i++){
		    		if(sTokens[i].type != "TOKEN_LEFTPAREN" && sTokens[i].type!="TOKEN_RIGHTPAREN"){
		    			second=sTokens[i].type
		    			console.log("AND THE VERDICT IS "+second)
		    			break;
		    		}
		    	}
		    	
		    }


		    if(typeof first === "object" && typeof second === "object"){
		    		if(first.type != second.type)
		    			console.log("Two ids do not match types")
		    }

		    else if(typeof first ==="object" && typeof second != "object"){
		    	if(second === "TOKEN_LEFTPAREN" || second  === "TOKEN_BOOLFALSE" || second  ==="TOKEN_BOOLTRUE"){
				if(first.type != "TOKEN_TYPEBOOLEAN")
					console.log("Mixmatched types.  ["+ first.id + "] is type [" + first.type+ "] is being compared to  type [" + second+ "]")
			}

			else if(second === "TOKEN_DIGIT"){
				if(first.type != "TOKEN_TYPEINT")
					console.log("Mixmatched types.  ["+ first.id + "] is type [" + first.type+ "] is being compared to  type [" + second+ "]")
			}

			else if(second === "TOKEN_QUOTE"){
				if(first.type != "TOKEN_TYPESTRING")
					console.log("Mixmatched types.  ["+ first.id + "] is type [" + first.type+ "] is being compared to  type [" + second+ "]")
			}

		    }

		    else if(typeof first !="object" && typeof second === "object"){
		    	if(first === "TOKEN_LEFTPAREN" || first  === "TOKEN_BOOLFALSE" || first  ==="TOKEN_BOOLTRUE"){
				if(second.type != "TOKEN_TYPEBOOLEAN")
					console.log("Mixmatched types.  ["+ second.id + "] is type [" + second.type+ "] is being compared to  type [" + first+ "]")
			}

			else if(first === "TOKEN_DIGIT"){
				if(second.type != "TOKEN_TYPEINT")
					console.log("Mixmatched types.  ["+ second.id + "] is type [" + second.type+ "] is being compared to  type [" + first+ "]")
			}

			else if(first === "TOKEN_QUOTE"){
				if(second.type != "TOKEN_TYPESTRING")
					console.log("Mixmatched types.  ["+ second.id + "] is type [" + second.type+ "] is being compared to  type [" + first+ "]")
			}

		    }
		    else if(typeof first != "object" && typeof second != "object"){
		    		//if((first === "TOKEN_BOOLTRUE" && second === "TOKEN_BOOLFALSE" )|| (first === "TOKEN_BOOLFALSE" && second ==="TOKEN_BOOLTRUEL")){}

		    		 if(first !=second){
		    		 	if((first === "TOKEN_BOOLTRUE" && second === "TOKEN_BOOLFALSE" )|| (first === "TOKEN_BOOLFALSE" && second ==="TOKEN_BOOLTRUEL")){console.log("comparing bool types")}
		    			else 
		    				console.log("ERROR: comparing " + first +"to " + second + " on line: " + sCurrentToken.line)
		    		}
		    }*/
			sExpr();
			
		}    

		/*if (ast.current.children.length >= 2) {
            for (var i = 0; i < (ast.current.children.length-1); i++) {
                console.log("before check")
                if (ast.current.children[i].type === "TOKEN_ID" && ast.current.children[i+1].type === "TOKEN_ID") {
                    if (getVarType(ast.current.children[i].name, symbolTree.current) != getVarType(ast.current.children[i+1].name, symbolTree.current)) {
                        //increases errors
                        aErrors++;
                        //outputs error
                        console.log("ERROR! ID [ "+ast.current.children[i].name+" ] on line "+ast.current.children[i].line+" type [ "+getVarType(ast.current.children[i].name, symbolTree.current)+" ] cannot be compared to [ "+getVarType(ast.cur.children[i+1].name, st.cur)+" ]...");
                    }
                }
            }
        }*/

//console.log("LITTY "+ast.current.children[ast.current.children.length-2].name)
      
		
}
trackedtype = first
//console.log(trackedtype)

		if(sCurrentToken.type === "TOKEN_RIGHTPAREN"){
			//console.log("************FOLLOW THE STARS***********")
			sGetToken();
		}

		if(sCurrentToken.type === "TOKEN_RIGHTPAREN" && sTokens[0].type != "TOKEN_RIGHTPAREN"){
			//console.log("************FOLLOW THE STARS***********")
			//checkBool(boolArray, first, secondBool)
		}

		if(closeOut)
			ast.endChildren();

 // if(ast.current.children.length >=2){
        	
        	//console.log("The tracked type is "+ trackedtype)
        	//console.log("$")
        	/*if(first. === "TOKEN_ID" ){
        		//console.log(ast.current.children[0].name + "HELLLO")
        		//console.log(ast.current.children[0])
        		//console.log(ast.current.children[0])
        		console.log("Symbol tree length " + symbolTree.current.symbols.length)
        		console.log("NIGGA WHAT " + symbolTree.current.symbols[0])

        		trackedvar = getValueofID(symbolTree.current.symbols[0], symbolTree.current).type
   				console.log("** Comparing values to "+trackedvar)
        	}

        	else{
        		//console.log("NO ID SO THIS WHAT WE COMPARING TO "+ast.current.children[0].type)
        		trackedvar = ast.current.children[0].type
				console.log("!! Comparing values to "+trackedvar)
        	}

        	
        		console.log(ast.current.children.length)*/

        		//console.log(first.type + "RAJEET")
             for(var i = 1; i< ast.current.children.length; i++){ 
             	//console.log(ast.current.children[i].children[0])
             	//boolArray.push(ast.current.children[i].children[1])
             	pls = ast.current.children[i].children[0]
             	//console.log(pls)
             	//Object.defineProperty(pls, "unique",{
             			//value: pls.line + " " + pls.column
             	//});
             	//boolArray.push(ast.current.children[i].children[0])
             	if(ast.current.children[i].name != "isEqual" && ast.current.children[i].name != "notEqual"){
             		//console.log(ast.current.children[i])
             		
             		//else
             			//console.log(ast.current.children[i])
             		
             		boolArray.push(ast.current.children[i])
/*go = getValueofID(ast.current.children[i].name, symbolTree.current)
console.log(go.type + "IKEEEEE " + go.id)
             		if(first.type ==="TOKEN_TYPEBOOLEAN" || first.type ==="TOKEN_BOOLTRUE" || first.type ==="TOKEN_BOOLFALSE"){
             			//console.log("Marching to zion " + ast.current.children[i].name)
             			
             			
             			console.log("CHECKING: " + ast.current.children[i].type + " " + ast.current.children[i].name)
             			if((go.type != "TOKEN_TYPEBOOLEAN") && (go.type != "TOKEN_BOOLFALSE") && (go.type != "TOKEN_BOOLTRUE"))
             			{

             				console.log("ERROR: " + ast.current.children[i].type + " " + ast.current.children[i].name)
             			}
             		}



*/
             }

             else {
             	for( j = 0; j<ast.current.children[i].children.length; j++)
             		if(ast.current.children[i].children[j].name!= "isEqual" && (ast.current.children[i].children[j].name!= "notEqual"))
             	boolArrayYolo.push(ast.current.children[i].children[j])
             }


          
                 


             }



        }
        
// end if ast.>2}

function checkBool(boolArray, firstBool, last){  //first last are last things in boolexpr
    //removeDuplicates(boolArray, line, column)
    //console.log(boolArray)
    console.log("^^^^^^^^^^^")
    console.log(firstBool)
    console.log(last)
   //console.log(getUnique(boolArray,'column'))

  // console.log(boolArray)
	boolArrayFinal = getUnique(boolArray,'unique').reverse()//boolArray.reverse().slice(0);
	var tracking2
	 var firstCheck
	 var lastCheck
	var tracking;
	var compare;
	var compare2
	okay = boolArrayFinal[0]
	//console.log("AMALEE")
	//console.log(firstBool)
	//console.log(boolArrayFinal[0].hasProperty(name))
	//peek = getValueofID(boolArrayFinal[0].name, symbolTree.current)
	//if(peek)
		//tracking = peek.type
if(last === undefined){
	console.log("undefined last")
}
		if(firstBool === undefined)
			console.log("undefined first")
		if(firstBool != undefined &&  last != undefined){
    if(firstBool.type === "TOKEN_ID"){
    	//	console.log("LESSSS GET IT" + (getValueofID(firstBool.value, symbolTree.current) > -1))
    		if(getValueofID(firstBool.value, symbolTree.current) == -1){
    		sErrors++
    		console.log("ERROR: ["+firstBool.value+ "] used before declared on line: " + firstBool.line)
    	}
    	
    	//console.log("UGH UGH UGH")
    	else
    		firstCheck = getValueofID(firstBool.value, symbolTree.current)

    }

   else {
   
            firstCheck = firstBool
    }

    if(last.type === "TOKEN_ID")
    {
    	console.log("LESSSS GET IT" + (getValueofID(last.value, symbolTree.current) > -1))
    	if(getValueofID(last.value, symbolTree.current) == -1){
    		sErrors++
    		console.log("ERROR: ["+last.value+ "] used before declared on line: " + last.line)
    	}
    	
    	//console.log("UGH UGH UGH")
    	else
    		lastCheck = getValueofID(last.value, symbolTree.current)
    	//console.log(lastCheck)
    }

    else 
    {
    	lastCheck = last
    }
    //console.log("DURP***********")
    //console.log(firstCheck.type)
  //  console.log(lastCheck)

    if(firstCheck.type === "TOKEN_DIGIT" || firstCheck.type === "TOKEN_TYPEINT"){
    	
    	if(lastCheck != undefined && lastCheck.type != "TOKEN_DIGIT" && lastCheck.type != "TOKEN_TYPEINT" ){
    		sErrors++
    		console.log("Error: Trying to compare type [" + lastCheck.type +"] to type ["  + firstCheck.type + "] on line: " + firstBool.line)
    		console.log(lastCheck)
    		return;
    	}
    }

     if(firstCheck.type === "TOKEN_QUOTE" || firstCheck.type === "TOKEN_TYPESTRING"){
     	

    	if(lastCheck.type != "TOKEN_TYPESTRING" && lastCheck.type != "TOKEN_QUOTE" && lastCheck.type != "string" ){
    		sErrors++

    		console.log("Error: Trying to compare type [" + lastCheck.type +"] to type ["  + firstCheck.type + "] on line: " + firstBool.line)
    		console.log(lastCheck)
    		return;
    	}

    }

     if(firstCheck.type === "TOKEN_TYPEBOOLEAN" || firstCheck.type === "TOKEN_BOOLTRUE" || firstCheck.type === "TOKEN_BOOLFALSE"){
    	
    	if(lastCheck.type != undefined && lastCheck.type != "TOKEN_TYPEBOOLEAN" && lastCheck.type != "TOKEN_BOOLTRUE" && lastCheck.type != "TOKEN_BOOLFALSE") {
    		sErrors++;
    		console.log("Error: Trying to compare type [" + lastCheck.type +"] to type ["  + firstCheck.type + "] on line: " + firstBool.line)
    		console.log(lastCheck)
    		return;
    	}
    }
}
    if(sErrors>0){
				return
			}
    //	console.log("Error: Trying to compare type [" + lastCheck.type +"] to type ["  + firstCheck.type + "] on line: " + firstCheck.line)



    	for(i = 0; i< boolArrayFinal.length; i++){


    		 if(boolArrayFinal[i].type === "TOKEN_ID")
    		 {
    		 	
				compare2 = getValueofID(boolArrayFinal[i].name, symbolTree.current).type
				
					setVarToUsed(boolArrayFinal[i].name,symbolTree.current)
				console.log("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayFinal[i].name)
		    }

			 else if(  boolArrayFinal[i].type != "TOKEN_ID")
		     {
				compare2 = boolArrayFinal[i].type
				console.log("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayFinal[i].name)
		    }

		    if(firstCheck.type === "TOKEN_DIGIT" || firstCheck.type === "TOKEN_TYPEINT")
		    {
    			
    			if( compare2 != undefined && compare2 != "TOKEN_TYPEBOOLEAN" && compare2 != "TOKEN_BOOLTRUE" && compare2!= "TOKEN_BOOLFALSE" && compare2 != "TOKEN_DIGIT" && compare2 != "TOKEN_TYPEINT" ){
    				sErrors++
    				console.log("Error: Trying to compare type [" + compare2 +"] to type ["  + firstCheck.type + "] on line: " + firstCheck.line)
    				return;
    			}
    			
   		    }

     		if(firstCheck.type === "TOKEN_QUOTE" || firstCheck.type === "TOKEN_TYPESTRING")
     		{
     			

    			if(compare2 != undefined && compare2 != "TOKEN_TYPEBOOLEAN" && compare2 != "TOKEN_BOOLTRUE" && compare2!= "TOKEN_BOOLFALSE" && compare2 != "TOKEN_TYPESTRING" && compare2 != "TOKEN_QUOTE" && compare2 != "string" ){
    				sErrors++
    				console.log("Error: Trying to compare type [" + compare2 +"] to type ["  + firstCheck.type + "] on line: " + firstCheck.line)
    				return;
    			}

    		}

     		if(firstCheck.type === "TOKEN_TYPEBOOLEAN" || firstCheck.type === "TOKEN_BOOLTRUE" || firstCheck.type === "TOKEN_BOOLFALSE")
     		{
    			
    			if(compare2 != undefined && compare2 != "TOKEN_TYPEBOOLEAN" && compare2 != "TOKEN_BOOLTRUE" && compare2!= "TOKEN_BOOLFALSE") {
    				sErrors++;
    				console.log("Error: Trying to compare type [" + compare2 +"] to type ["  + firstCheck.type + "] on line: " + firstCheck.line)
    				return;
    			}
    		}


    	}
//}
	//console.log(tracking + "IM HUNGRY")
	/*for(i=0; i<boolArrayYolo.length; i++){

		if(i==0){
			if(boolArrayYolo[0].type ==="TOKEN_ID"){
				tracking2 = getValueofID(boolArrayYolo[0].name, symbolTree.current).type
				console.log("$$ Tracked type for final two values is: " + tracking2 + " " + boolArrayYolo[0].name)
			}

			else{
				tracking2 = boolArrayYolo[0].type
				console.log("$$ Tracked type for final two values is: " + tracking2)
			}


		}

		 else if( i== 1 && boolArrayYolo[i].type === "TOKEN_ID"){
			compare2 = getValueofID(boolArrayYolo[i].name, symbolTree.current).type
			console.log("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayYolo[i].name)
		}
		 else if( i ==1 && boolArrayYolo[i].type != "TOKEN_ID"){
			compare2 = boolArrayYolo[i].type
			console.log("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayYolo[i].name)

		}

		else if(i>= 2){
			break;
		}*/
		//console.log("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayYolo[i].name)






	//} //end for loop

	



	/*for(i = 0 ; i<boolArrayFinal.length; i++){

		//console.log("vore")
		console.log(boolArrayFinal[i].name + " xxxx")
		if(i==0){
			if(boolArrayFinal[0].type === "string"){
				console.log("WE GOT A BOOGER") 
				//boolArrayFinal.shift()
			}
			console.log(boolArrayFinal[i].name + " VIAGRA THIS ONE " +boolArrayFinal[0].type)
			console.log("What's the value here? : " + boolArrayFinal[0].name + "and the type: " +boolArrayFinal[0].type)
			if(boolArrayFinal[0].type === "TOKEN_ID"){
			tracking = getValueofID(boolArrayFinal[0].name, symbolTree.current).type
			console.log(tracking + " YEET " +boolArrayFinal[0].name)
		}
			else{
				tracking = boolArrayFinal[0].type
				console.log(tracking + "checking for primitives")
			}
		}
		

		 if( i> 0 && boolArrayFinal[i].type === "TOKEN_ID")
			compare = getValueofID(boolArrayFinal[i].name, symbolTree.current).type
		console.log(getValueofID( "d", symbolTree.current) + "RESULTS: " + boolArrayFinal[i].name)
		 if( boolArrayFinal[i].type != "TOKEN_ID")
			compare = boolArrayFinal[i].type

        console.log(getValueofID("e",symbolTree.current).type + "PLEASE AND THANK")
		console.log("!! Target type is [" + tracking +"]. Got [" +compare +"]")
		
		if(tracking === "TOKEN_TYPEBOOLEAN" || tracking === "TOKEN_BOOLTRUE" || tracking === "TOKEN_BOOLFALSE"){
				if( compare != undefined && compare != "TOKEN_TYPEBOOLEAN" && compare != "TOKEN_BOOLTRUE" && compare != "TOKEN_BOOLFALSE" )
					console.log("BOOP WRONG TYPES BITCH on line :" + boolArrayFinal[i].line +" column: " +boolArrayFinal[i].column +" " +compare + " " + tracking);

		}

		if(tracking === "TOKEN_TYPESTRING" || tracking === "TOKEN_QUOTE" || tracking === "string"){
			if(compare != "TOKEN_TYPESTRING" && compare != "TOKEN_QUOTE" && compare != "string" )
					console.log("BOOP WRONG TYPES BITCH on line :" + boolArrayFinal[i].line +" column: " +boolArrayFinal[i].column +" " +compare + " " + tracking);
		}

		if(tracking === "TOKEN_DIGIT" || tracking === "TOKEN_TYPEINT"){
			if(compare != "TOKEN_DIGIT" && compare != "TOKEN_TYPEINT" )
					console.log("BOOP WRONG TYPES BITCH on line :" + boolArrayFinal[i].line +" column: " +boolArrayFinal[i].column +" " +compare + " " + tracking);
		}
		console.log("... " +tracking)
		console.log(boolArrayFinal[i].name + " owo " + boolArrayFinal[i].type)
		console.log(boolArrayFinal)

	    
		
		//if(boolArrayFinal[i].name != undefined)
		console.log(boolArrayFinal[i].name + " uwu ")
	    //else
	    	//console.log(boolArrayFinal[i].value + " uwu ")
	}*/
	boolArray = []
}


function getUnique(arr, index) {

  const unique = arr
       .map(e => e[index])

       // store the keys of the unique objects
       .map((e, i, final) => final.indexOf(e) === i && i)
  
       // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);      

   return unique;
}

function setVarToUsed(id, level){

	if ((level.parent != undefined || level.parent != null) && level.symbols.length > 0) {
        //finds the ID
        for (var i = 0; i < level.symbols.length; i++) {
            //when the correct ID is found
            console.log("LET ME SLEEP")
            if (id === level.symbols[i].id) {
                console.log("HIYA")
                level.symbols[i].used = true;
                console.log(level.symbols[i].used + "ONEGAIII")
				return;
                 
                 
            }
        }
    }
    //If higher level, search there
    if (level.parent != undefined || level.parent != null) {
        //calls a search in the higher levels
        return getValueofID(id, level.parent);
    }
    //or doesn't
}

function checkForWarnings(level){

   if ((level.parent != undefined || level.parent != null) && level.symbols.length > 0) {
        //finds the ID
        for (var i = 0; i < level.symbols.length; i++) {
            //when the correct ID is found
            if (level.symbols[i].used == false) {
            	console.log("Variable ["+level.symbols[i].id +"] was not used")
                
                //level.symbols[i].used = true;
				//return;
                 
                 
            }
        }
    }
    //If higher level, search there
    if (level.parent != undefined || level.parent != null) {
        //calls a search in the higher levels
        return checkForWarnings(level.parent);
    }
    console.log("Finished checking for warnings")
}
