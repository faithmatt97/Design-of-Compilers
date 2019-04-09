//WHAT TO WORRY ABOUT FOR EACH STATEMENT

/*
	VARDECL
	________

	-Error if variable not declared


	ASSIGNSTATEMENT
	____

	-type checking (int a cannot be assigned to a string)
	-make sure variable declared first!


	Print Statement
	______

	-make sure variable declared first
	-type check (print statemnt allows digit + Expr )

	IF / WHILE STATEMENT

	-make sure variable declared first
	-type checking

		BED TIME (:


*/


var sTokens;
var symbolMap;
var symbolTree;
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

function checkIfExists(){
	//createTable(scopelvl);

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
	symbolMap = new Map();
	symbolTree = new SymbolTree();
	sTokens = tokens;
	
	sToken = tokens;
	//console.log(sTokens)

	ast = new Tree();
	ast.addNode("Program");
	sGetToken();
	//console.log(sCurrentToken.type)
	sBlock();
	ast.endChildren
	console.log(ast.toString())
	console.log(symbolMap)
	console.log(symbolTree	)
	
}
function sBlock(){
scopelvl++;
	symbolTree.addNode("Scope Level:" + scopelvl, "branch");
	
	ast.addNode("Block" , "branch");
	if (sCurrentToken.type === "TOKEN_LEFTBRACE") {
        sGetToken();
        
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

	
		if (sCurrentToken.type === "TOKEN_RIGHTBRACE"){

		}
		if(sCurrentToken.type === "TOKEN_PRINT" || sCurrentToken.type === "TOKEN_ID" 
    || sCurrentToken.type === "TOKEN_TYPEINT" || sCurrentToken.type === "TOKEN_TYPESTRING"
    || sCurrentToken.type === "TOKEN_TYPEBOOLEAN" || sCurrentToken.type === "TOKEN_WHILE" 
    || sCurrentToken.type === "TOKEN_IF" || sCurrentToken.type === "TOKEN_LEFTBRACE"){

			sStatement();
			sStatementlist()
		}
}

function sPrint(){
		ast.addNode("Print" , "branch");

		sGetToken();
		if(sCurrentToken.type === "TOKEN_LEFTPAREN")
			sGetToken();

		sExpr();
		if(sCurrentToken.type === "TOKEN_RIGHTPAREN")
			sGetToken();


		ast.endChildren();
}


function sAssignmentStatement(){
		ast.addNode("AssignStatement", "branch")


		if(sCurrentToken.type === "TOKEN_ID"){
				sID();
		}


		if(sCurrentToken.type === "TOKEN_ASSIGN"){

			sGetToken()
			sExpr();
		}

		ast.endChildren();


}


function sVarDecl(){
		varFound =false;
		console.log("BITCH")
		ast.addNode("VarDecl", "branch");
		//varType = sCurrentToken.type;
		sGetToken();
		

		if(sCurrentToken.type ==="TOKEN_ID"){

			//if(symbolTree.current.symbols.length >0 ){
			for(i = 0 ; i< symbolTree.current.symbols.length; i++){

				if(sCurrentToken.value === symbolTree.current.symbols[i].id){
					console.log("ERROR:This variable already exists" +sCurrentToken.value);
					varFound = true;
					//break;

				}

			}
				//}
			if(!varFound){
						console.log("YEET IT AINT HERE" + sCurrentToken.value)
					symbolTree.current.symbols.push(new Symbol(sCurrentToken.value, "dummy type", 0, scopelvl, sCurrentToken.line, sCurrentToken.colNumber, true, false));
				}
			//checkIfDeclared(sCurrentToken.value, symbolTree.current);
			
			
				
sID();
		}
		//sID();


		ast.endChildren();
}


function sWhileStatement(){
	ast.addNode("WhileStatement", "branch");
	sGetToken();
	if(sCurrentToken.type === "TOKEN_LEFTPAREN" || sCurrentToken.type === "TOKENBOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){
		sBooleanExpr();
		sGetToken();
		sBlock();
	}

	ast.endChildren();
}


function sIfStatement (){
	ast.addNode("If Statement", "branch");

	sGetToken();
	if(sCurrentToken.type === "TOKEN_LEFTPAREN" || sCurrentToken.type === "TOKENBOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){

		sBooleanExpr();
		sGetToken();
		sBlock();
	}



	ast.endChildren();
}


function sExpr(){
	if(sCurrentToken.type ==="TOKEN_DIGIT")
		sIntExpr();

	else if(sCurrentToken.type ==="TOKEN_QUOTE")
		sStringExpr();
	else if (sCurrentToken.type ==="TOKEN_LEFTPAREN" || sCurrentToken.type ==="TOKEN_BOOLTRUE" || sCurrentToken.type === "TOKEN_BOOLFALSE")
		sBooleanExpr();
	else if(sCurrentToken.type ==="TOKEN_ID")
		sID();
}


function sIntExpr(){
			
			
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
	if(sCurrentToken.type === "TOKEN_QUOTE")
			sGetToken();

		var word =sCharlist();

	if(sCurrentToken.type === "TOKEN_QUOTE"){
		ast.addNode(word, "leaf")
		sGetToken();
	}
}


function sID(){

	if(sCurrentToken.type === "TOKEN_ID" ){
	}
		ast.addNode(sCurrentToken.value, "leaf");
		sGetToken();
	

}


function sCharlist(){ // +_+

	var r = sCurrentToken.value;
	sGetToken();

	if(sCurrentToken.type === "TOKEN_CHAR")
		return r+sCharlist();
	else
		return r;
}


function sBooleanExpr(){

	if(sCurrentToken.type === "TOKEN_BOOLTRUE" || sCurrentToken.type === "TOKENBOOLFALSE")
	{
		sID();
	}

	if(sCurrentToken.type ==="TOKEN_LEFTPAREN")
	{                 

		sGetToken();
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

		sExpr();



		if(sCurrentToken.type === "TOKEN_NOTEQUAL" || sCurrentToken.type === "TOKEN_ISEQUAL"){
			sGetToken();
			sExpr();
		}


		/*if (ast.cur.children.length >= 2) {
            for (var i = 0; i < (ast.cur.children.length-1); i++) {
                console.log("before check")
                if (ast.cur.children[i].type == "ID" && ast.cur.children[i+1].type == "ID") {
                    if (getVarType(ast.cur.children[i].name, st.cur) != getVarType(ast.cur.children[i+1].name, st.cur)) {
                        //increases errors
                        aErrors++;
                        //outputs error
                        analysisLog("ERROR! ID [ "+ast.cur.children[i].name+" ] on line "+ast.cur.children[i].line+" type [ "+getVarType(ast.cur.children[i].name, st.cur)+" ] cannot be compared to [ "+getVarType(ast.cur.children[i+1].name, st.cur)+" ]...");
                    }
                }
            }
        } */
        
		
}
		if(sCurrentToken.type === "TOKEN_RIGHTPAREN")
			sGetToken();

		if(closeOut)
			ast.endChildren();
}
