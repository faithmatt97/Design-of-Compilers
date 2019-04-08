
var sTokens;

//For Semantic Analysis. Constructing AST from tokens bc tree is giving me a goddamn headache;
var sErrors=0;
var sWarnings = 0;
var ast;


function sGetToken(){

	sCurrentToken = sTokens[0];
	sTokens.shift();


}

function sProgram(tokens){
	sTokens = tokens;
	
	sToken = tokens;
	console.log(sTokens)

	ast = new Tree();
	ast.addNode("Program");
	sGetToken();
	console.log(sCurrentToken.type)
	sBlock();
	ast.endChildren
	console.log(ast.toString())
	
}
function sBlock(){

	ast.addNode("Block" , "branch");
	if (sCurrentToken.type === "TOKEN_LEFTBRACE") 
        sGetToken();

    sStatementlist();

    if(sCurrentToken.type === "TOKEN_RIGHTBRACE")
    	sGetToken();
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

	console.log(sCurrentToken.type)
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

		ast.addNode("VarDecl", "branch");

		sGetToken();

		if(sCurrentToken.type ==="TOKEN_ID"){
			sID();

		}


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
			console.log("PLEASE")

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
