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

     

	 
*/
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
function printShit(treeLevel){
	for(var i = 0; i<treeLevel.symbols.length; i++){
		console.log("Printing all values..." + treeLevel.symbols[i].id )
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
	sErrors=0;
	varFound = false;
	symbolTree = new SymbolTree();
	sTokens = tokens;
	
	sToken = tokens;
	//console.log(sTokens)

	ast = new Tree();
	ast.addNode("Program");
	//console.log("SEMANTIC ANALYSIS --> Analyzing Program: " + programCount)
	sGetToken();
	
	sBlock();
	ast.endChildren
	
	//console.log("SEMANTIC ANALYSIS --> ANALYSIS COMPLETE" )
	console.log(ast.toString())

	
	
}
function sBlock(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing Block")
	symbolTree.current.map = new Map(symbolMap);
	symbolMap = new Map();

    scopelvl++;
	symbolTree.addNode("Scope Level:" + scopelvl, "branch");
	
	ast.addNode("Block" , "branch");
	console.log(sTokens[1])

	if (sCurrentToken.type === "TOKEN_LEFTBRACE") {
        sGetToken();
        console.log(sCurrentToken)
        
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
	//console.log("SEMANTIC ANALYSIS --> Analyzing Print Statement")

		ast.addNode("Print" , "branch");
		//console.log("In sPrint anf got: " +sCurrentToken.type)
		sGetToken();
		//console.log("In sPrint anf got: " +sCurrentToken.type)
		if(sCurrentToken.type === "TOKEN_LEFTPAREN")
			sGetToken();
		console.log("In Print checking token after ( " +sCurrentToken.type)
		sExpr();
		if(sCurrentToken.type === "TOKEN_RIGHTPAREN")
			sGetToken();


		ast.endChildren();
}


function sAssignmentStatement(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing Assign Statement")
		//comingFromAssignStatement = true;
		ast.addNode("AssignStatement", "branch")
		varFound = false;
		
		if(varSearchCurrentScope(sCurrentToken.value)){
			console.log(sCurrentToken.value + " has been found in current scope")
				}
		else if(!varSearchCurrentScope(sCurrentToken.value) ){
			console.log(sCurrentToken.value + " could not be found in current scope. Checking parents...")
			if(varSearchParentScope(sCurrentToken.value, symbolTree.current.parent))
				console.log(sCurrentToken.value  +" has been found in parent scope")
			else{
				console.log("ERROR: ["+sCurrentToken.value+ "] used before declared")
				console.log(varSearchParentScope(sCurrentToken.value, symbolTree.current.parent))
			}
		}
		else
			console.log("variable [" +sCurrentToken.value +"] could not be found in both current and parent scope(s)")
		
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
              console.log("The var type we're keeping track of is " + varType)
              		sGetToken()
              console.log("And we want to compare it to " +sCurrentToken.type)
			
			if(sCurrentToken.type === "TOKEN_LEFTPAREN" || sCurrentToken.type === "TOKEN_BOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){
				if(varType != "TOKEN_TYPEBOOLEAN")
					console.log("Mixmatched types. Assignee ["+ assignee.value + "] is type [" + varType+ "] while assignment  [" +sCurrentToken.value +"] is type [" + sCurrentToken.type + "]")
			}

			else if(sCurrentToken.type === "TOKEN_DIGIT"){
				if(varType != "TOKEN_TYPEINT")
					console.log("Mixmatched types. Assignee ["+ assignee.value + "] is type [" + varType+ "] while assignment  [" +sCurrentToken.value +"] is type [" + sCurrentToken.type + "]")
			}

			else if(sCurrentToken.type === "TOKEN_QUOTE"){
				if(varType != "TOKEN_TYPESTRING")
					console.log("Mixmatched types. Assignee ["+ assignee.value + "] is type [" + varType+ "] while assignment  [" +sCurrentToken.value +"] is type [" + sCurrentToken.type + "]")
			}
			else if(sCurrentToken.type ==="TOKEN_ID"){
				console.log("filler")
				//fetch id type and compare to varType, if not the same error, else continue 
			}
			sExpr();
			//console.log("Assign statement ")
		}

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

				if(variable)
					console.log("ERROR: variable already declared")
					
				if(!variable)
					{
						symbolTree.current.symbols.push(new Symbol(sCurrentToken.value, varType, 0, scopelvl, sCurrentToken.line, sCurrentToken.colNumber, true, false))
						console.log("New variable ["+sCurrentToken.value+"] has been declared on line: " +sCurrentToken.line)
						sID();
					}

			
		}
		//sID();


		ast.endChildren();
}


function sWhileStatement(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing While Statement")
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
	ast.addNode("If Statement", "branch");
	symbolTree.addNode("Scope Level: " + (scopelvl+1), "branch")
	

	sGetToken();
	if(sCurrentToken.type === "TOKEN_LEFTPAREN" || sCurrentToken.type === "TOKEN_BOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){

		sBooleanExpr();
		sGetToken();
		sBlock();
		console.log("WHy are you ending?")
		//console.log(sCurrentToken.type +"This is at the end of if statement")
	}



	ast.endChildren();
}


function sExpr(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing Expr")
	tempType = "";
	//z = getValueofID(assignee.value, symbolTree.current)

	//console.log(assignee.value + "Sigh")
	if(sCurrentToken.type ==="TOKEN_DIGIT"){ //if the token after = is digit then check if the id is an int, if not give error message. If int then proceed. 
		//if(z.type != "TOKEN_TYPEINT")
			//console.log("Mixmatched types. Assignee ["+ assignee.value + "] is type [" + varType+ "] while assignment  [" +sCurrentToken.value +"] is type [" + sCurrentToken.type + "]")
		sIntExpr();
	}

	else if(sCurrentToken.type ==="TOKEN_QUOTE"){ //if the token after = is quote then check if the id is a string, if not give error message. If type string then proceed.
		//if(z.type != "TOKEN_TYPESTRING")
			//console.log("Mixmatched types" + varType + " " + sCurrentToken.type);
		sStringExpr();
	}
	else if (sCurrentToken.type ==="TOKEN_LEFTPAREN" || sCurrentToken.type ==="TOKEN_BOOLTRUE" || sCurrentToken.type === "TOKEN_BOOLFALSE"){ //same as above but with bool
		//if(z.type != "TOKEN_TYPEBOOLEAN")
			//console.log("Mixmatched types");

		sBooleanExpr();
	}



	else if(sCurrentToken.type ==="TOKEN_ID"){  //We need to fetch this id and compare their types. If they're the same, proceed. If not, issue error message. But first we need to check if this id exists
		//varFound = false;
			
			/*if(searchForVar(sCurrentToken.value , symbolTree.current)){
				console.log("variable found: " + sCurrentToken.value)
				
			}
			else{
				console.log("ERROR: Variable not declared");
				sErrors++;
				return;
			}*/
			//console.log("WHERE YOU AT " + sCurrentToken.value)
			//if(sCurrentToken.type != varType)
				//console.log("Mixmatched types. Assignee ["+ assignee.value + "] is type [" + varType+ "] while assignment  [" +sCurrentToken.value +"] is type [" + sCurrentToken.type + "]")
				 /*a = getValueofID(assignee.value, symbolTree.current)
				 b = getValueofID(sCurrentToken.value, symbolTree.current)
				 console.log(a)
				// if( -1)
				if(b == -1 )
					console.log("this id  WAS NOT DECLARED")
				else if(b.type != a.type)
					console.log("Mixmatched types. Assignee ["+ assignee.value + "] is type [" + varType+ "] while assignment  [" +sCurrentToken.value +"] is type [" + b.type + "]")
			check = varSearchCurrentScope(sCurrentToken.value)
			if(scopelvl > 0){
					parentcheck =varSearchParentScope(sCurrentToken.value, symbolTree.current.parent)
			if(check){
				console.log("The variable [" +sCurrentToken.value + "] is within current scope")
				 b = getValueofID(sCurrentToken.value, symbolTree.current)
				console.log(b.type)
				//sID();
			}

			 else if(!check){
				console.log("The variable [" +sCurrentToken.value + "] was not found within current scope. Checking parents")
				//return//parentcheck=varSearchParentScope(sCurrentToken.value, symbolTree.current.parent)

			}

			if(parentcheck ){
				console.log("The variable [" +sCurrentToken.value + "] is within parent scope")
				b = getValueofID(sCurrentToken.value, symbolTree.current)
				console.log(b.type)
				//sID();
				//return;
			}
			 else if(!parentcheck){
				console.log("ERROR: The variable [" +sCurrentToken.value + "] was not found within parent scope")
				return;
			}

			if(parentcheck ||check){

			}
}*/
			sID();

		/*for(i = 0; i<symbolTree.current.symbols.length; i++){
			if(sCurrentToken.value === symbolTree.current.symbols[i].id){ //if variable already declared
				
				tempType = symbolTree.current.symbols[i].type;
				varFound = true;
				console.log("The type is " + tempType);
				console.log("We're going to compare it to this type " + varType)
			}

			if(assignee.value === symbolTree.current.symbols[i].id)      //if assignee and assignment IDs are same type, set 
				varType = symbolTree.current.symbols[i].type;
		}


		if(!varFound){
			console.log("Unable to find ID [" + sCurrentToken.value  + "] on line:" + sCurrentToken.line + " column:" + sCurrentToken.colNumber)

			searchForVar()
		}
		else if(varType !=tempType)
			console.log("Variable types mismatch. Trying to assign ID [" + assignee.value  +"] of type [" + varType +  "] to ID [" + sCurrentToken.value + "] of type [" +  tempType + "]")
		else if(varFound && varType=== tempType)
		sID();

		else
			console.log("Either variable was not found or mixmatched types")
		*/
	}
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
	if(sCurrentToken.type === "TOKEN_QUOTE")
			sGetToken();

		var word =sCharlist();

	if(sCurrentToken.type === "TOKEN_QUOTE"){
		ast.addNode(word, "leaf", "string")
		sGetToken();
	}
}


function sID(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing ID")
		//console.log("in sID() and got: " +sCurrentToken.type)
	if(sCurrentToken.type === "TOKEN_ID" ){
	}
		ast.addNode(sCurrentToken.value, "leaf", sCurrentToken.type);
		sGetToken();
		//console.log(sCurrentToken.type + "LOOK OUT")
	

}


function sCharlist(){ // +_+
	//console.log("SEMANTIC ANALYSIS --> Analyzing CharList")
	var r = sCurrentToken.value;
	sGetToken();

	if( (sCurrentToken.type === "TOKEN_CHAR") || (sCurrentToken.type ==="TOKEN_SPACE"))
		return r+sCharlist();
	else
		return r;
}


function sBooleanExpr(){
	//console.log("SEMANTIC ANALYSIS --> Analyzing Boolean Expr")
		//console.log("In bool expr and got: " +sCurrentToken.type)
		var first;
		var second;
	if(sCurrentToken.type === "TOKEN_BOOLTRUE" || sCurrentToken.type === "TOKEN_BOOLFALSE")
	{
		sID();
	}

	if(sCurrentToken.type ==="TOKEN_LEFTPAREN")
	{                 
		
		sGetToken();
		
		
		if(sCurrentToken.type ==="TOKEN_ID"){
				if(getValueofID(sCurrentToken.value, symbolTree.current) == -1)
			console.log("ERROR: variable [" +sCurrentToken.value+ "] used before declared." )
			first = getValueofID(sCurrentToken.value, symbolTree.current)
		}
		else{
			first = sCurrentToken.type;
		}
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

        if(ast.current.children.length >=2){
        	//console.log("$")
        	if(ast.current.children[0].type === "TOKEN_ID" ){
        		//console.log(ast.current.children[0].name + "HELLLO")
        		console.log(ast.current.children[0])
        		console.log(ast.current.children[0])
        		trackedvar = getValueofID(ast.current.children[0].name, symbolTree.current).type
   				console.log("!! Comparing values to "+trackedvar)
        	}

        	else{
        		//console.log("NO ID SO THIS WHAT WE COMPARING TO "+ast.current.children[0].type)
        		trackedvar = ast.current.children[0].type
				console.log("!! Comparing values to "+trackedvar)
        	}

        	

             for(var i = 1; i < (ast.current.children.length); i++){
             	if(ast.current.children[i].name != "isEqual" && ast.current.children[i].name != "notEqual"){

             	console.log(ast.current.children[i])


             }
                 //  if( (getValueofID(ast.current.children[i].name, symbolTree.current).type) != (getValueofID(ast.current.children[i+1].name, symbolTree.current).type)){
                   	//	console.log("ERROR")
                   //}


             }



        }
		
}
		if(sCurrentToken.type === "TOKEN_RIGHTPAREN"){
			//console.log("************FOLLOW THE STARS***********")
			sGetToken();
		}

		if(closeOut)
			ast.endChildren();


}

function getVarType(id,level) {
    //Gets the type of ID
    //if symbols exist search 
    if (level.symbols.length > 0) {
        for(var i = 0; i < level.symbols.length; i++) {
            //when the correct ID is found
            if (id == level.symbols[i].getID()) {
                //returns the type
                return level.symbols[i].type;
            }
        }
    }
    //If higher level, search there
    if (level.parent != undefined || level.parent != null) {
        //calls a search in the higher levels
        return getVarType(id,level.parent);
    }
}
