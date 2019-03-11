//var cst 
cst.addNode("Root", "branch")

function checkErrors(){
	if(parseErrors > 1)
		return true;; 
}

function getToken(){   //consumes next token
	currentToken = programTokens.shift()
}

function checkToken(){  //checks next token
	return programTokens[0];
}

function LookAhead(){ //checks 2 tokens ahead
	return programTokens[1];
}

function parseProgram(){  //Everything from here on out is self explanatory 
 	    
	console.log("\n PARSING PROGRAM " + i)
	

	if(parseErrors > 0)     // If we encounter error, stop program
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else                   // else continue parsing 
	{
		cst.addNode("Program " + i, "branch");
		console.log("PARSER --> Parsing [Program]");
		parseBlock()
		cst.endChildren();

		if(parseErrors >0)
			console.log("PARSER STOPPED DUE TO ERROR")
		else if(parseErrors ==0)
			console.log("PARSER FINISHED")
	}

}

function parseBlock(){
	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	} 

	else{
		cst.addNode("Block", "branch")
		
		console.log("PARSER --> Parsing for [Block]");
		match(["TOKEN_LEFTBRACE"]);
		
		parseStatementList();
		match(["TOKEN_RIGHTBRACE"])
		cst.endChildren();
		cst.addNode("$")
		cst.endChildren();
		

	}
	//cst.endChildren();
	
}

function parseStatementList(){

	if(parseErrors > 0)
	{
		//console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{
		//cst.addNode("StatementList", "branch")

		console.log("PARSER --> Parsing [StatementList]");
	
		if( (checkToken().type ==="TOKEN_LEFTBRACE") || (checkToken().type ==="TOKEN_ID") && (LookAhead().type === "TOKEN_ASSIGN") || (checkToken().type ==="TOKEN_PRINT") || (checkToken().type === "TOKEN_ASSIGN") ||(checkToken().type === "TOKEN_TYPEINT") || (checkToken().type === "TOKEN_TYPESTRING") || (checkToken().type === "TOKEN_TYPEBOOLEAN") || (checkToken().type === "TOKEN_WHILE") || (checkToken().type === "TOKEN_IF")){
			cst.addNode("StatementList", "branch");
            parseStatement();
			parseStatementList();
			cst.endChildren();
            
		}

	else{
		console.log("Received Epsilon ");
		cst.endChildren();
	}

	
    
    }
}

function parseStatement(){

	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}
	else
	{
		cst.addNode("Statement", "branch")
		console.log("PARSER --> Parsing for [Statement]");

		if(checkToken().type === "TOKEN_PRINT")
			parsePrintStatement();
	
		else if(checkToken().type === "TOKEN_ID" && (LookAhead().type === "TOKEN_ASSIGN"))
			parseAssignStatement();
		
		else if( (checkToken().type === "TOKEN_TYPEINT") || (checkToken().type === "TOKEN_TYPEBOOLEAN") || (checkToken().type === "TOKEN_TYPESTRING"))
			parseVarDecl();
	
		else if(checkToken().type === "TOKEN_WHILE")
			parseWhileStatement();

		else if (checkToken().type === "TOKEN_IF")
			parseIfStatement();

		else if(checkToken().type ==="TOKEN_LEFTBRACE")
			parseBlock();

		else{
			console.log("ERROR ERROT ERROR")
			parseErrors++;
		}

        cst.endChildren()

	}
}

function parseExpr(){


	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
		cst.addNode("Expr", "branch")
		console.log("PARSER --> Parsing for [Expr]");

		if(checkToken().type === "TOKEN_DIGIT")
			parseIntExpr();
		else if (checkToken().type ==="TOKEN_QUOTE")
			parseStringExpr();
		else if ( (checkToken().type === "TOKEN_LEFTPAREN") || (checkToken().type === "TOKEN_BOOLFALSE") || (checkToken().type === "TOKEN_BOOLTRUE"))
			parseBooleanExpr();
		else if(checkToken().type ==="TOKEN_ID" && (LookAhead().type ==="TOKEN_ASSIGN")){
			console.log("Parsing for ID")
			parseAssignStatement();
		}

		else if (checkToken().type ==="TOKEN_ID") {
            cst.addNode("ID", "branch");
			console.log("Parsing for ID")
			match(["TOKEN_ID"])
            cst.endChildren();
		}

		else
		{
			console.log('%c ERROR: Expecting [Expr], but received [' + checkToken().type + "]", ' color:red')
			parseErrors++;
			return;
		}
        cst.endChildren()
	}
	
}
function parseIntExpr(){
	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{	

		
		console.log("PARSER --> Parsing for [IntExpr]");

		if(checkToken().type === "TOKEN_DIGIT" && (LookAhead().type === "TOKEN_INTOP")){
            cst.addNode("IntExpr", "branch")
            cst.addNode("Digit" , "branch");
			match(["TOKEN_DIGIT"]);
            cst.endChildren();
            cst.addNode("IntOp", "branch");

			match(["TOKEN_INTOP"]);
            cst.endChildren();
			parseExpr();
            cst.endChildren();
             //cst.endChildren()
		}

		else {
            cst.addNode("IntExpr", "branch")
            cst.addNode("Digit" , "branch")
			match(["TOKEN_DIGIT"]);
            cst.endChildren();
             cst.endChildren()
        }

       

	}
}

function parseStringExpr(){



	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
		cst.addNode("StringExpr", "branch")
		console.log("PARSER --> Parsing for [StringExpr]");
		match(["TOKEN_QUOTE"]);
		parseCharList();
		match(["TOKEN_QUOTE"]);
		
        cst.endChildren();
	}
}

function parseBooleanExpr(){

	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
           // cst.addNode("BooleanExpr", "branch")
		console.log("PARSER --> Parsing for [BooleanExpr]");
			if (checkToken().type === "TOKEN_LEFTPAREN"){
                cst.addNode("BooleanExpr", "branch")
				match(["TOKEN_LEFTPAREN"])
				parseExpr();
                cst.addNode("BoolOp", "branch");
				match(["TOKEN_ISEQUAL", "TOKEN_NOTEQUAL"]);
                cst.endChildren();
				parseExpr();
				match(["TOKEN_RIGHTPAREN"]);
                 cst.endChildren()
			}

			else{
                cst.addNode("BooleanExpr", "branch")
                cst.addNode("BoolVal", "branch");
				match(["TOKEN_BOOLFALSE", "TOKEN_BOOLTRUE"]);
                cst.endChildren();
                 cst.endChildren()
            }
           
	}

}

function parseCharList(){

	if(parseErrors > 0){
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{   
        
		console.log("PARSER --> Parsing for [Charlist]");
		if(checkToken().type === "TOKEN_CHAR"){
            cst.addNode("Charlist", "branch")
            cst.addNode("char", "branch")
			match(["TOKEN_CHAR"]);
            cst.endChildren();
            cst.endChildren()
			parseCharList();
		}

		else if(checkToken().type === "TOKEN_SPACE"){
            cst.addNode("Charlist", "branch");
            cst.addNode("Space", "branch");
			match(["TOKEN_SPACE"]);
            cst.endChildren();
            cst.endChildren()
			parseCharList();
		}

		else {

		}
        //cst.endChildren()
	}
}

function parsePrintStatement(){
	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{
        cst.addNode("Print", "branch")
		console.log("PARSER --> Parsing for [Print Statement]");
		match(["TOKEN_PRINT"]);
		match(["TOKEN_LEFTPAREN"]);
		parseExpr();
		match(["TOKEN_RIGHTPAREN"]);
        cst.endChildren()
	}
}

function parseAssignStatement(){
	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{     
        cst.addNode("AssignStatement", "branch");
		console.log("PARSER --> Parsing for [Assign Statement]");
        cst.addNode("ID" , "branch")
		match(["TOKEN_ID"]);
        cst.endChildren();
       
		match(["TOKEN_ASSIGN"]);
        
		parseExpr();
        cst.endChildren()
	}
}

function parseVarDecl(){
	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
        cst.addNode("VarDecl", "branch")
		console.log("PARSER --> Parsing for [Variable Declaration]");
        cst.addNode("Type", "branch")
		match(["TOKEN_TYPEINT", "TOKEN_TYPEBOOLEAN", "TOKEN_TYPESTRING"]);
        cst.endChildren();
        cst.addNode("ID", "branch");
		match(["TOKEN_ID"]);
        cst.endChildren()
         cst.endChildren();
	}
   
}

function parseWhileStatement(){

	if(parseErrors > 0){
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
        cst.addNode("WhileStatement", "branch")
		console.log("PARSER --> Parsing for [While Statement]");
		match(["TOKEN_WHILE"]);
		parseBooleanExpr();
		parseBlock();
        cst.endChildren()
	}
}

function parseIfStatement(){
	if(parseErrors > 0)
	{
		console.log("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
        cst.addNode("If Statement", "branch")
		console.log("PARSER --> Parsing for [If Statement]");
		match(["TOKEN_IF"]);
		parseBooleanExpr();
		parseBlock();
        cst.endChildren()
	}
}

function match(expectedToken){
	getToken();


	if(parseErrors > 0)
	{
		return;
	}
	else
	{
		console.log("PARSER--> Expecting one of the following [" + expectedToken + "]")
		if (expectedToken.includes(currentToken.type)){
			console.log("PARSER --> GREAT! got [" + expectedToken + "] (s) as expected");
			cst.addNode(currentToken.value, "leaf");
			//cst.endChildren();
		}
		else
		{
			console.log("%c ERROR: Received  [" + currentToken.type + "] instead of expected [" + expectedToken + "] on line:" + currentToken.line + " column:" + currentToken.colNumber, 'color:red');
			parseErrors++;
		
		}
	}
}
