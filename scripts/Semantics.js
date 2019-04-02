
var sTokens = tokenArray

//For Semantic Analysis. Constructing AST from tokens bc tree is giving me a goddamn headache;
var sErrors=0;
var sWarnings = 0;
var ast = new Tree();


function sGetToken(){

	sCurrentToken = sTokens.shift();


}

function Sprogram(){


}
function SBlock(){

	ast.addNode("Block");
	if (sCurrentToken.type == "TOKEN_LEFTBRACE") 
        sGetToken();

    sStatementlist();
}

function sStatement(){
		 if (sCurrentToken.type == "TOKEN_PRINT") {
        //goes to print statements
        sPrintStatement();
    //if ID
    } else if (sCurrentToken.type == "TOKEN_ID") {
        //goes to assignment statements
        sAssignmentStatement();
    //if INT, STRING, or BOOLEAN
    } else if (sCurrentToken.type == "TOKEN_TYPEINT" || sCurrentToken.type == "TOKEN_TYPESTRING" || sCurrentToken.type == "TOKEN_TYPEBOOLEAN") {
        //goes to variable declarations
        sVarDecl();
    //if WHILE
    } else if (sCurrentToken.type == "TOKEN_WHILE") {
        //goes to while statements
        sWhileStatement();
    //if IF
    } else if (sCurrentToken.type == "TOKEN_IF") {
        //goes to if statements
        sIfStatement();
    //if LEFT_BRACE
    } else if (sCurrentToken.type == "TOKEN_LEFTBRACE") {
        //goes to block
        sBlock();
    } 
}


function sStatementlist(){
		if (sCurrentToken.type == "TOKEN_RIGHTBRACE") {}
		else if(s.CurrentToken.type === "TOKEN_PRINT" || sCurrentToken.type == "TOKEN_ID" 
    || sCurrentToken.type == "TOKEN_TYPEINT" || sCurrentToken.type == "TOKEN_TYPESTRING"
    || sCurrentToken.type == "TOKEN_TYPEBOOLEAN" || sCurrentToken.type == "TOKEN_WHILE" 
    || sCurrentToken.type == "TOKEN_IF" || sCurrentToken.type == "TOKEN_LEFTBRACE")

			sStatement();
			sStatementlist()
}

function sPrint(){
		ast.addNode("Print");

		sGetToken();
		if(sCurrentToken.type === "TOKEN_LEFTPAREN")
			sGetToken();

		sExpr();
		if(s.CurrentToken.type === "TOKEN_RIGHTPAREN")
			s.sGetToken();


		//ast.kick();
}


function sAssignmentStatement(){
		ast.addNode("AssignStatement")


		if(s.CurrentToken.type === "TOKEN_ID"){

		}


		if(s.CurrentToken.type == "TOKEN_ASSIGN"){

			s.sGetToken()
		}


}


function sVarDecl(){

		ast.addNode("VarDecl");

		s.sGetToken();

		if(s.CurrentToken.type ==="TOKEN_ID"){

		}


		ast.endChildren();
}


function sWhileStatement(){
	ast.addNode("WhileStatement");



	ast.endChildren();
}


function sIfStatement (){
	ast.addNode("If Statement");



	ast.endChildren();
}


function sExpr(){
	if(s.CurrentToken.type ==="TOKEN_DIGIT")
		sIntExpr();

	else if(s.CurrentToken.type ==="TOKEN_QUOTE")
		sStringExpr();
	else if (s.CurrentToken.type ==="TOKEN_LEFTPAREN" || s.CurrentToken.type ==="TOKEN_BOOLTRUE" || s.CurrentToken.type === "TOKEN_BOOLFALSE")
		sBooleanExpr();
	else if(s.CurrentToken.type ==="TOKEN_ID")
		sID();
}


function sIntExpr(){
		if(s.CurrentToken.type ==="TOKEN_INTOP")
			addNode("Addition");
		sID();

		if(s.CurrentToken.type === "TOKEN_INTOP"){
			s.sGetToken();
			sExpr();

			ast.endChildren();
		}
}


function sStringExpr(){
	if(s.CurrentToken.type === "TOKEN_QUOTE")
			s.sGetToken();

	if(s.CurrentToken.type === "TOKEN_QUOTE")
		console.log("blah")
}


function sID(){

}


function sCharlist(){ // +_+

	var r = sCurrentToken.value;
	sGetToken();

	if(s.CurrentToken.type === "TOKEN_CHAR")
		return r+sCharlist();
	else
		return r;
}


function sBooleanExpr(){

	if(s.CurrentToken.type === "TOKEN_BOOLTRUE" || s.CurrentToken.type === "TOKENBOOLFALSE"){
		sID();
	}
	if(s.CurrentToken.type ==="TOKEN_LEFTPAREN"){

		sGetToken();

		var closeOut = false;

		if(sTokens[0].type === "TOKEN_ISEQUAL"){
			addNode("isEqual")
			closeOut = true;
		}

	if(sTokens[0].type ==="TOKEN_NOTEQUAL"){
			addNode("notEqual")
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
        
		if(sCurrentToken.type === "TOKEN_RIGHTPAREN")
			sGetToken();

		if(closeOut)
			ast.endChildren();
}

}