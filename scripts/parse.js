var cst 
var tempcst;
cst.addNode("Root", "branch")


function resetGlobals(){
	parseErrors = 0;
	tempcst = new Tree();
}

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
 	    
	putMessage("\nPARSING PROGRAM " + i)
	tempcst = new Tree();

	if(parseErrors > 0)     // If we encounter error, stop program
	{
		putMessage("\tPARSER-->ERRORS FOUND IN LEX. UNABLE TO PARSE")
		return;
	}

	else                   // else continue parsing 
	{
		tempcst.addNode("Program " + i, "branch");
		putMessage("\t PARSER --> Parsing [Program]");
		parseBlock()
		tempcst.endChildren();

		if(parseErrors >0)
		{
			putMessage("PARSER STOPPED DUE TO ERROR")
			tempcst= new Tree()
		}
			if(checkToken())
		parseBlock();
		else if(parseErrors ==0){
			putMessage("PARSER FINISHED")
			cst = cst +  tempcst;
			//console.log(cst)
		}
	}

	if(checkToken())
		parseBlock();

}

function parseBlock(){
	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	} 

	else{
		tempcst.addNode("Block", "branch")
		
		putMessage("\t PARSER --> Parsing for [Block]");
		match(["TOKEN_LEFTBRACE"]);
		
		parseStatementList();
		match(["TOKEN_RIGHTBRACE"])
		tempcst.endChildren();
		
		//tempcst.endChildren();
		

	}
	//tempcst.endChildren();
	
}

function parseStatementList(){

	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{
		//tempcst.addNode("StatementList", "branch")

		putMessage("\t PARSER --> Parsing [StatementList]");
	
		if( (checkToken().type ==="TOKEN_LEFTBRACE") || (checkToken().type ==="TOKEN_ID") && (LookAhead().type === "TOKEN_ASSIGN") || (checkToken().type ==="TOKEN_PRINT") || (checkToken().type === "TOKEN_ASSIGN") ||(checkToken().type === "TOKEN_TYPEINT") || (checkToken().type === "TOKEN_TYPESTRING") || (checkToken().type === "TOKEN_TYPEBOOLEAN") || (checkToken().type === "TOKEN_WHILE") || (checkToken().type === "TOKEN_IF")){
			tempcst.addNode("StatementList", "branch");
            parseStatement();
			parseStatementList();
			tempcst.endChildren();
            
		}

	else{
		putMessage("Received Epsilon ");
		//tempcst.endChildren();
		return;
	}

	
    
    }
}

function parseStatement(){

	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}
	else
	{
		tempcst.addNode("Statement", "branch")
		putMessage("\t PARSER --> Parsing for [Statement]");

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
			putMessage("\t!**ERROR Expecting [Statement] but received [" + checkToken().value + "] on line:" + checkToken().line + " column:" + checkToken().colNumber)
			parseErrors++;
			return;
		}

        tempcst.endChildren()

	}
}

function parseExpr(){


	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
		tempcst.addNode("Expr", "branch")
		putMessage("\t PARSER --> Parsing for [Expr]");

		if(checkToken().type === "TOKEN_DIGIT")
			parseIntExpr();
		else if (checkToken().type ==="TOKEN_QUOTE")
			parseStringExpr();
		else if ( (checkToken().type === "TOKEN_LEFTPAREN") || (checkToken().type === "TOKEN_BOOLFALSE") || (checkToken().type === "TOKEN_BOOLTRUE"))
			parseBooleanExpr();
		else if(checkToken().type ==="TOKEN_ID" && (LookAhead().type ==="TOKEN_ASSIGN")){
			putMessage("Parsing for ID")
			parseAssignStatement();
		}

		else if (checkToken().type ==="TOKEN_ID") {
            tempcst.addNode("ID", "branch");
			putMessage("Parsing for ID")
			match(["TOKEN_ID"])
            tempcst.endChildren();
		}

		else
		{
			putMessage("\t!**ERROR Expecting [Expr] but received [" + checkToken().value + "] on line:" + checkToken().line + " column:" + checkToken().colNumber)
			parseErrors++;
			return;
		}
        tempcst.endChildren()
	}
	
}
function parseIntExpr(){
	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{	

		
		putMessage("\t PARSER --> Parsing for [IntExpr]");

		if(checkToken().type === "TOKEN_DIGIT" && (LookAhead().type === "TOKEN_INTOP")){
            tempcst.addNode("IntExpr", "branch")
            tempcst.addNode("Digit" , "branch");
			match(["TOKEN_DIGIT"]);
            tempcst.endChildren();
            tempcst.addNode("IntOp", "branch");

			match(["TOKEN_INTOP"]);
            tempcst.endChildren();
			parseExpr();
            tempcst.endChildren();
             //tempcst.endChildren()
		}

		else {
            tempcst.addNode("IntExpr", "branch")
            tempcst.addNode("Digit" , "branch")
			match(["TOKEN_DIGIT"]);
            tempcst.endChildren();
             tempcst.endChildren()
        }

       

	}
}

function parseStringExpr(){



	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
		tempcst.addNode("StringExpr", "branch")
		putMessage("\t PARSER --> Parsing for [StringExpr]");
		match(["TOKEN_QUOTE"]);
		parseCharList();
		match(["TOKEN_QUOTE"]);
		
        tempcst.endChildren();
	}
}

function parseBooleanExpr(){

	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
           // tempcst.addNode("BooleanExpr", "branch")
		putMessage("\t PARSER --> Parsing for [BooleanExpr]");
			if (checkToken().type === "TOKEN_LEFTPAREN"){
                tempcst.addNode("BooleanExpr", "branch")
				match(["TOKEN_LEFTPAREN"])
				parseExpr();
                tempcst.addNode("BoolOp", "branch");
				match(["TOKEN_ISEQUAL", "TOKEN_NOTEQUAL"]);
                tempcst.endChildren();
				parseExpr();
				match(["TOKEN_RIGHTPAREN"]);
                 tempcst.endChildren()
			}

			else{
                tempcst.addNode("BooleanExpr", "branch")
                tempcst.addNode("BoolVal", "branch");
				match(["TOKEN_BOOLFALSE", "TOKEN_BOOLTRUE"]);
                tempcst.endChildren();
                 tempcst.endChildren()
            }
           
	}

}

function parseCharList(){

	if(parseErrors > 0){
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{   
       
		putMessage("\t PARSER --> Parsing for [Charlist]");
		if(checkToken().type === "TOKEN_CHAR"){
            tempcst.addNode("Charlist", "branch")
            tempcst.addNode("char", "branch")
			match(["TOKEN_CHAR"]);
            
            tempcst.endChildren()
           // tempcst.endChildren()
			parseCharList();
			//tempcst.endChildren()
			
		}

		else if(checkToken().type === "TOKEN_SPACE"){
            tempcst.addNode("Charlist", "branch")
            tempcst.addNode("Space", "branch");
			match(["TOKEN_SPACE"]);
            
            tempcst.endChildren()
            //tempcst.endChildren()
			parseCharList();


		}

		else {
				return;
		}
       tempcst.endChildren()
	}
}

function parsePrintStatement(){
	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{
        tempcst.addNode("Print", "branch")
		putMessage("\t PARSER --> Parsing for [Print Statement]");
		match(["TOKEN_PRINT"]);
		match(["TOKEN_LEFTPAREN"]);
		parseExpr();
		match(["TOKEN_RIGHTPAREN"]);
        tempcst.endChildren()
	}
}

function parseAssignStatement(){
	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else 
	{     
        tempcst.addNode("AssignStatement", "branch");
		putMessage("\t PARSER --> Parsing for [Assign Statement]");
        tempcst.addNode("ID" , "branch")
		match(["TOKEN_ID"]);
        tempcst.endChildren();
       
		match(["TOKEN_ASSIGN"]);
        
		parseExpr();
        tempcst.endChildren()
	}
}

function parseVarDecl(){
	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
        tempcst.addNode("VarDecl", "branch")
		putMessage("\t PARSER --> Parsing for [Variable Declaration]");
        tempcst.addNode("Type", "branch")
		match(["TOKEN_TYPEINT", "TOKEN_TYPEBOOLEAN", "TOKEN_TYPESTRING"]);
        tempcst.endChildren();
        tempcst.addNode("ID", "branch");
		match(["TOKEN_ID"]);
        tempcst.endChildren()
         tempcst.endChildren();
	}
   
}

function parseWhileStatement(){

	if(parseErrors > 0){
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
        tempcst.addNode("WhileStatement", "branch")
		putMessage("\t PARSER --> Parsing for [While Statement]");
		match(["TOKEN_WHILE"]);
		parseBooleanExpr();
		parseBlock();
        tempcst.endChildren()
	}
}

function parseIfStatement(){
	if(parseErrors > 0)
	{
		//putMessage("PARSER ENCOUNTERED ERROR SO IT STOPPED")
		return;
	}

	else
	{
        tempcst.addNode("If Statement", "branch")
		putMessage("\t PARSER --> Parsing for [If Statement]");
		match(["TOKEN_IF"]);
		parseBooleanExpr();
		parseBlock();
        tempcst.endChildren()
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
		putMessage("\t PARSER --> Expecting one of the following [" + expectedToken + "]")
		if (expectedToken.includes(currentToken.type)){
			putMessage("\t PARSER --> GREAT! got [" + expectedToken + "] (s) as expected");
			tempcst.addNode(currentToken.value, "leaf");
			//tempcst.endChildren();
		}
		else
		{
			putMessage("% !**ERROR: Received  [" + currentToken.type + "] instead of expected [" + expectedToken + "] on line:" + currentToken.line + " column:" + currentToken.colNumber, 'color:red');
			parseErrors++;
		
		}
	}
}
