

	 
var sWarnings = 0
var scopeCount = 0
var callingAllSymbols = []
var secondBool
var test
var boolArrayYolo = []
var boolArray = []
var comingFromAssignStatement
 sErrors;
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

function update(boolArray){
	//putMessage(boolArray.length + "MIGHTY BEE")
	for(i=0 ; i< boolArray.length; i++){
		//putMessage("CRIKEY")
		if(boolArray[i].type ==="TOKEN_ID"){
			//putMessage("This is a test -------")
			setVarToUsed(boolArray[i].name, symbolTree.current)
		}
	}

}
function printSymbolTable(treeLevel){
	putMessage("ID\tType\t ScopeLevel\t")
	for(var i = 0; i<callingAllSymbols.length; i++){
		putMessage(callingAllSymbols[i].id +"\t" + callingAllSymbols[i].type +"\t\t" + callingAllSymbols[i].scope)
		
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
		if(id === symbolTree.current.symbols[i].id){
			
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

function sGetToken(){
	sCurrentToken = sTokens[0];
	sTokens.shift();
}

function sProgram(tokens){
	putMessage("Entering Semantic Analysis for Program " +programCount)
	//symbolMap = new Map();
	if(parseErrors>0){
		putMessage("Cannot move onto Semantic Analysis due to errors in parse")
	}
	else{
	scopeCount = 0
	callingAllSymbols = []
	sErrors=0;
	varFound = false;
	//test = undefined
	//secondBool = undefined
	symbolTree = new SymbolTree();
	sTokens = tokens;
	//-boolArray = []
	sToken = tokens;
	//putMessage(sTokens)

	ast = new Tree();
	ast.addNode("Program");
	//putMessage("SEMANTIC ANALYSIS --> Analyzing Program: " + programCount)
	sGetToken();
	
	sBlock();
	ast.endChildren
	if(sErrors>0){
		putMessage("Semantic Analysis stopped due to errors")
	}
	if(sErrors == 0){
	checkForWarnings(symbolTree.current)
	putMessage("SEMANTIC ANALYSIS --> ANALYSIS COMPLETE Errors:" + sErrors +" Warnings:" +sWarnings)
	putMessage("-----------AST----------------")
	putMessage(ast.toString())
	
	putMessage("-----------Scope Table----------")
    printSymbolTable()

    return ast;
}
	}
	
}
function sBlock(){
	
	if(sErrors>0){
				return
			}
	//if(scopelvl != -1){
	//if(boolArray >2){
//	putMessage("COTTON CANDY "+test.type +" " + secondBool.type)
	//putMessage("^^^^^^^")
	//putMessage(boolArray)
	//update(boolArray)
	//checkBool(boolArray, test, secondBool)
	//boolArray=[]
//}
//}
	//putMessage("SEMANTIC ANALYSIS --> Analyzing Block")
	symbolTree.current.map = new Map(symbolMap);
	symbolMap = new Map();


	
	symbolTree.addNode("Scope Level:" + scopelvl, "branch");
	
	ast.addNode("Block" , "branch");
	//putMessage(sTokens[1])

	if (sCurrentToken.type === "TOKEN_LEFTBRACE") {
		scopeCount++;
    scopelvl++;
        sGetToken();
       // putMessage(sCurrentToken)
        
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
	//putMessage("SEMANTIC ANALYSIS --> Analyzing Statement")
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

	//putMessage("SEMANTIC ANALYSIS --> Analyzing StatementList")
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
	//putMessage("SEMANTIC ANALYSIS --> Analyzing Print Statement")

		ast.addNode("Print" , "branch");
		
		sGetToken();
		
		if(sCurrentToken.type === "TOKEN_LEFTPAREN")
			sGetToken();
		
		if(sCurrentToken.type ==="TOKEN_ID"){
			putMessage(getValueofID(sCurrentToken.value, symbolTree.current) ==-1 + "SASUKE")
			if(getValueofID(sCurrentToken.value, symbolTree.current) ==-1){
				sErrors++
				putMessage("ERROR: variable [" +sCurrentToken.value+ "] used before declared.")
			}

			else {
				
				setVarToUsed(sCurrentToken.value, symbolTree.current)}

		}

		else if(sCurrentToken.type ==="TOKEN_LEFTPAREN"){
			boolFlag = true
		}
		sExpr();
		/*if(boolFlag){
			putMessage("AT PRINT CHECKING BOOL ARRAY LENGTH: " + boolArray.length)
			checkBool(boolArray, test, secondBool)
			boolFlag = false;
		}*/
		if(sCurrentToken.type === "TOKEN_RIGHTPAREN")
			sGetToken();
//putMessage("#######")
//putMessage(boolArray)
//update(boolArray)
checkBool(boolArray, test, secondBool)
//boolArray=[]
		ast.endChildren();
}


function sAssignmentStatement(){
	enteringBoolean = false;
	//putMessage("SEMANTIC ANALYSIS --> Analyzing Assign Statement")
		
		typeofAssign = sCurrentToken
		
		ast.addNode("AssignStatement", "branch")
		varFound = false;
		
		putMessage("Assigning value to " + typeofAssign.value + " on line: " + typeofAssign.line)
		
			if(varSearchParentScope(sCurrentToken.value, symbolTree.current)){
				typeofAssign = getValueofID(sCurrentToken.value, symbolTree.current)
				//putMessage(sCurrentToken.value  +" has been found in parent scope")
			}
			else{
				sErrors++;
				putMessage("ERROR: ["+sCurrentToken.value+ "] used before declared")
				putMessage(varSearchParentScope(sCurrentToken.value, symbolTree.current.parent))
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
			//putMessage("Found the variable! :thumbsup:")
		if(sCurrentToken.type === "TOKEN_ID"){
				sID();
		}


		if(sCurrentToken.type === "TOKEN_ASSIGN"){
             
             sGetToken()
            
			
			if(sCurrentToken.type === "TOKEN_LEFTPAREN" ||sCurrentToken.type === "TOKEN_BOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){
				

				if(typeofAssign.type != "TOKEN_TYPEBOOLEAN"){
					sErrors++;
					
					putMessage("Error: trying to assign variable [ " + typeofAssign.id + " ] of type ["+ typeofAssign.type +"] to boolean expr on line: " + sCurrentToken.line)
					return;
				}
					//putMessage(boolArray.length + "YEEEEHAW")
					//if(boolArray.length>1)
					//checkBool(boolArray, test, secondBool)
			}


			else if(sCurrentToken.type === "TOKEN_DIGIT"){
				//putMessage("Assigning variable ["+sCurrentToken.value + "] to " + typeofAssign.value + "on line: "+ sCurrentToken.line)
				if(typeofAssign.type != "TOKEN_TYPEINT"){
					sErrors++
					putMessage("ERROR: Mixmatched types. Assignee ["+ typeofAssign.id + "] is type [" + typeofAssign.type+ "] while assignment  [" +sCurrentToken.value +"] is type [" + sCurrentToken.type + "] on line: " +sCurrentToken.line)
					return;
				}
			}

			else if(sCurrentToken.type === "TOKEN_QUOTE"){
				//putMessage("Assigning  [string] to " + typeofAssign.value + "on line: "+ sCurrentToken.line)
				if(typeofAssign.type != "TOKEN_TYPESTRING"){
					sErrors++
					putMessage(typeofAssign)
					putMessage("ERROR: Mixmatched types. Assignee ["+ typeofAssign.id + "] is type [" + typeofAssign.type+ "] while assignment  [" +sCurrentToken.value +"] is type [" + sCurrentToken.type + "] on line: " +sCurrentToken.line)
				   return
				}
			}
			else if(sCurrentToken.type ==="TOKEN_ID"){
				//putMessage("Assigning variable ["+sCurrentToken.value + "] to " + typeofAssign.value + "on line: "+ sCurrentToken.line)
				putMessage("filler")
					//fetch id type and compare to varType, if not the same error, else continue 
				if(getValueofID(sCurrentToken.value,symbolTree.current)== -1){
					sErrors++
					putMessage("ERROR: variable [" +sCurrentToken.value+ "] used before declared.")
					return
				}

				else {
					if(getValueofID(sCurrentToken.value,symbolTree.current).type != typeofAssign.type){
						sErrors++
						putMessage("ERROR: Mixmatched types. Assignee ["+ typeofAssign.id + "] is type [" + typeofAssign.type+ "] while assignment  [" +sCurrentToken.value +"] is type [" + getValueofID(sCurrentToken.value,symbolTree.current).type + "] on line: " +sCurrentToken.line)
						return
					}

					else {
						putMessage("Assining variable ["+sCurrentToken.value + "] to " + typeofAssign.value + "on line: "+ sCurrentToken.line)
						setVarToUsed(sCurrentToken.value, symbolTree.current)}
				}


			}


			sExpr();
			//putMessage(getUnique(boolArray,'unique').length+" GIDDY UP")
			//putMessage("Assign statement ")
			
			
			
				//checkBool(boolArray, test, secondBool)
					
	if(boolArray.length>2){
		putMessage("***********")
		putMessage(boolArray)
		update(boolArray)
		checkBool(boolArray, test, secondBool)
		
	}
			boolArray = []
		}
		//putMessage("COTTON CANDY "+test +" " + secondBool)
			//
		//	boolArray =[]

		ast.endChildren();


}


function sVarDecl(){
		putMessage("SEMANTIC ANALYSIS --> Analyzing VarDecl")
		varFound= false;
		ast.addNode("VarDecl", "branch");
		varType = sCurrentToken.type;
		ast.addNode(sCurrentToken.type, "leaf")
		sGetToken();
		variable = false;
		
		//putMessage("In var decl " +sCurrentToken.type +" "+ sCurrentToken.value)
		
		if(sCurrentToken.type ==="TOKEN_ID"){
				

				variable = varSearchCurrentScope(sCurrentToken.value)
					//putMessage(varSearchCurrentScope(sCurrentToken.value) + " WHAT IS IT BITCH FOR :" +sCurrentToken.value)
				if(variable){
					sErrors++;
					putMessage("ERROR: variable ["+sCurrentToken.value+"] already declared on line: " +sCurrentToken.line)
					return;
				}
				
			}

				if(!variable)
					{
						symbolTree.current.symbols.push(new Symbol(sCurrentToken.value, varType, 0, scopelvl, sCurrentToken.line, sCurrentToken.colNumber, true, false))
						callingAllSymbols.push(new Symbol(sCurrentToken.value, varType, 0, scopeCount, sCurrentToken.line, sCurrentToken.colNumber, true, false))
						putMessage("New variable ["+sCurrentToken.value+"] has been declared on line: " +sCurrentToken.line)
						sID();
					}

			if(sErrors>0){
				return
		}
		//sID();


		ast.endChildren();
}


function sWhileStatement(){
	//putMessage("SEMANTIC ANALYSIS --> Analyzing While Statement")
	//-boolArray = []
	ast.addNode("WhileStatement", "branch");
	sGetToken();
	if(sCurrentToken.type === "TOKEN_LEFTPAREN" || sCurrentToken.type === "TOKEN_BOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){
		sBooleanExpr();
		checkBool(boolArray, test, secondBool)
		sGetToken();
		sBlock();
	}

	ast.endChildren();
}


function sIfStatement (){
	//putMessage("SEMANTIC ANALYSIS --> Analyzing If Statement")
//putMessage("COTTON CANDY "+test +" " + secondBool)
//checkBool(boolArray, test, secondBool)
	//boolArray = []
	ast.addNode("If Statement", "branch");
	symbolTree.addNode("Scope Level: " + (scopelvl+1), "branch")
	

	sGetToken();
	if(sCurrentToken.type === "TOKEN_LEFTPAREN" || sCurrentToken.type === "TOKEN_BOOLFALSE" || sCurrentToken.type ==="TOKEN_BOOLTRUE"){

		sBooleanExpr()
		checkBool(boolArray, test, secondBool)
		sGetToken();
		sBlock();
		
	}



	ast.endChildren();
}


function sExpr(){
	//putMessage("SEMANTIC ANALYSIS --> Analyzing Expr")
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
		//putMessage("SEMANTIC ANALYSIS --> Analyzing Int Expr")
			
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
	//putMessage("SEMANTIC ANALYSIS --> Analyzing String Expr")
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
	//putMessage("SEMANTIC ANALYSIS --> Analyzing ID")
		//putMessage("in sID() and got: " +sCurrentToken.type)
	if(sCurrentToken.type === "TOKEN_ID" ){
	}
		ast.addNode(sCurrentToken.value, "leaf", sCurrentToken.type, sCurrentToken.line, sCurrentToken.colNumber);
		sGetToken();
		//putMessage(sCurrentToken.type + "LOOK OUT")
	

}
var endQuote = false;

function sCharlist(){ // +_+
	//putMessage("SEMANTIC ANALYSIS --> Analyzing CharList")
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
//	putMessage("SEMANTIC ANALYSIS --> Analyzing Boolean Expr")
		//putMessage("In bool expr and got: " +sCurrentToken.type)
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
					putMessage("ERROR: variable [" +sCurrentToken.value+ "] used before declared." )
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
		//putMessage("OUR FIRST BOOLVAL IS....")
		//putMessage(test)
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
			//putMessage("In bool expr and got: " +sCurrentToken.type)
		sExpr();



		if(sCurrentToken.type === "TOKEN_NOTEQUAL" || sCurrentToken.type === "TOKEN_ISEQUAL"){
			//putMessage("GOT == or !=")
			sGetToken();

			if(sCurrentToken.type === "TOKEN_ID"){
				 secondBool= getValueofID(sCurrentToken.value, symbolTree.current)
				 if(secondBool == -1){
				 	sErrors++;
				 	putMessage("ERROR: ["+sCurrentToken.value+ "] used before declared on line: " + sCurrentToken.line)
				 	return;
				 }

				 else 
				 	setVarToUsed(secondBool.value, symbolTree.current)

			}

			else if(sCurrentToken.type != "TOKEN_LEFTPAREN"){
				//putMessage(sCurrentToken.type + "WHAT IS IT?")
				secondBool = sCurrentToken
				//putMessage("OUR NEXT BOOL VAL IS.....")
				//putMessage(secondBool)
				//boolArray.push(sCurrentToken)
			}

			sExpr();
			
		}    

		/*if (ast.current.children.length >= 2) {
            for (var i = 0; i < (ast.current.children.length-1); i++) {
                putMessage("before check")
                if (ast.current.children[i].type === "TOKEN_ID" && ast.current.children[i+1].type === "TOKEN_ID") {
                    if (getVarType(ast.current.children[i].name, symbolTree.current) != getVarType(ast.current.children[i+1].name, symbolTree.current)) {
                        //increases errors
                        aErrors++;
                        //outputs error
                        putMessage("ERROR! ID [ "+ast.current.children[i].name+" ] on line "+ast.current.children[i].line+" type [ "+getVarType(ast.current.children[i].name, symbolTree.current)+" ] cannot be compared to [ "+getVarType(ast.cur.children[i+1].name, st.cur)+" ]...");
                    }
                }
            }
        }*/

//putMessage("LITTY "+ast.current.children[ast.current.children.length-2].name)
      
		
}
trackedtype = first
//putMessage(trackedtype)

		if(sCurrentToken.type === "TOKEN_RIGHTPAREN"){
			//putMessage("************FOLLOW THE STARS***********")
			sGetToken();
		}

		if(sCurrentToken.type === "TOKEN_RIGHTPAREN" && sTokens[0].type != "TOKEN_RIGHTPAREN"){
			//putMessage("************FOLLOW THE STARS***********")
			//checkBool(boolArray, first, secondBool)
		}

		if(closeOut)
			ast.endChildren();
 for(var i = 0; i< ast.current.children.length; i++){ 
             	//putMessage(ast.current.children[i].children[0])
             	//boolArray.push(ast.current.children[i].children[1])
             	pls = ast.current.children[i].children[0]
             	
             	if(ast.current.children[i].name != "isEqual" && ast.current.children[i].name != "notEqual"){
             		
             		
             		boolArray.push(ast.current.children[i])
             		setVarToUsed(ast.current.children[i].name, symbolTree.current)

             }

             else {
             	for( j = 0; j<ast.current.children[i].children.length; j++)
             		if(ast.current.children[i].children[j].name!= "isEqual" && (ast.current.children[i].children[j].name!= "notEqual")){
             	boolArrayYolo.push(ast.current.children[i].children[j])
             setVarToUsed(ast.current.children[i].children[j].name, symbolTree.current)}

             }

             }
 // if(ast.current.children.length >=2){
        	
        	//putMessage("The tracked type is "+ trackedtype)
        	//putMessage("$")
        	/*if(first. === "TOKEN_ID" ){
        		//putMessage(ast.current.children[0].name + "HELLLO")
        		//putMessage(ast.current.children[0])
        		//putMessage(ast.current.children[0])
        		putMessage("Symbol tree length " + symbolTree.current.symbols.length)
        		putMessage("NIGGA WHAT " + symbolTree.current.symbols[0])

        		trackedvar = getValueofID(symbolTree.current.symbols[0], symbolTree.current).type
   				putMessage("** Comparing values to "+trackedvar)
        	}

        	else{
        		//putMessage("NO ID SO THIS WHAT WE COMPARING TO "+ast.current.children[0].type)
        		trackedvar = ast.current.children[0].type
				putMessage("!! Comparing values to "+trackedvar)
        	}

        	
        		putMessage(ast.current.children.length)*/

        		//putMessage(first.type + "RAJEET")
           

        }
        
// end if ast.>2}

function checkBool(boolArrayNonGlobal, firstBool, last){  //first last are last things in boolexpr
    //removeDuplicates(boolArray, line, column)
    //putMessage(boolArray)
    //putMessage("^^^^^^^^^^^")
    //putMessage(firstBool)
    //putMessage(last)
   //putMessage(getUnique(boolArray,'column'))

 // putMessage("((((((((((")
  //putMessage(firstBool)
	boolArrayFinal = getUnique(boolArrayNonGlobal,'unique').reverse()//boolArray.reverse().slice(0);
	var tracking2
	 var firstCheck
	 var lastCheck
	var tracking;
	var compare;
	var compare2
	okay = boolArrayFinal[0]
	//putMessage("AMALEE")
	//putMessage(firstBool)
	//putMessage(boolArrayFinal[0].hasProperty(name))
	//peek = getValueofID(boolArrayFinal[0].name, symbolTree.current)
	//if(peek)
		//tracking = peek.type
if(last === undefined){
	//putMessage("undefined last")
}
		//if(firstBool === undefined)
			//putMessage("undefined first")
		if(firstBool != undefined ||  last != undefined){
			//putMessage("MARIO")
    if(firstBool.type === "TOKEN_ID"){
    	//	putMessage("LESSSS GET IT" + (getValueofID(firstBool.value, symbolTree.current) > -1))
    		if(getValueofID(firstBool.value, symbolTree.current) == -1){
    		sErrors++
    		putMessage("ERROR: ["+firstBool.value+ "] used before declared on line: " + firstBool.line)
    	}
    	
    	//putMessage("UGH UGH UGH")
    	else{
    		firstCheck = getValueofID(firstBool.value, symbolTree.current)
    		setVarToUsed(firstBool.value, symbolTree.current)
    	}

    }

   else {
   
            firstCheck = firstBool
    }
    	//putMessage("YOSHI")
    if(last.type === "TOKEN_ID")
    {
    	//putMessage("YOOOOOO")
    	//putMessage("LESSSS GET IT" + (getValueofID(last.value, symbolTree.current) > -1))
    	if(getValueofID(last.value, symbolTree.current) == -1){
    		sErrors++
    		putMessage("ERROR: ["+last.value+ "] used before declared on line: " + last.line)
    	}
    	
    	//putMessage("UGH UGH UGH")
    	else{
    		//putMessage("DUMB HOE")
    		lastCheck = getValueofID(last.value, symbolTree.current)
    		putMessage(lastCheck.value + " AHHHH" )
    		setVarToUsed(last.value, symbolTree.current)
    	}
    	//putMessage(lastCheck)
    }

    else 
    {
    	lastCheck = last
    }
    //putMessage("DURP***********")
    //putMessage(firstCheck.type)
  //  putMessage(lastCheck)

    if(firstCheck.type === "TOKEN_DIGIT" || firstCheck.type === "TOKEN_TYPEINT"){
    	
    	if(lastCheck != undefined && lastCheck.type != "TOKEN_DIGIT" && lastCheck.type != "TOKEN_TYPEINT" ){
    		sErrors++
    		putMessage("Error: Trying to compare type [" + lastCheck.type +"] to type ["  + firstCheck.type + "] on line: " + firstBool.line)
    		//putMessage(lastCheck)
    		return;
    	}
    }

     if(firstCheck.type === "TOKEN_QUOTE" || firstCheck.type === "TOKEN_TYPESTRING"){
     	

    	if(lastCheck.type != "TOKEN_TYPESTRING" && lastCheck.type != "TOKEN_QUOTE" && lastCheck.type != "string" ){
    		sErrors++

    		putMessage("Error: Trying to compare type [" + lastCheck.type +"] to type ["  + firstCheck.type + "] on line: " + firstBool.line)
    		putMessage(lastCheck)
    		return;
    	}

    }

     if(firstCheck.type === "TOKEN_TYPEBOOLEAN" || firstCheck.type === "TOKEN_BOOLTRUE" || firstCheck.type === "TOKEN_BOOLFALSE"){
    	
    	if(lastCheck.type != undefined && lastCheck.type != "TOKEN_TYPEBOOLEAN" && lastCheck.type != "TOKEN_BOOLTRUE" && lastCheck.type != "TOKEN_BOOLFALSE") {
    		sErrors++;
    		putMessage("Error: Trying to compare type [" + lastCheck.type +"] to type ["  + firstCheck.type + "] on line: " + firstBool.line)
    		putMessage(lastCheck)
    		return;
    	}
    }
}

//putMessage("++++++++++++")
//putMessage(firstCheck)
//putMessage(lastCheck)
    if(sErrors>0){
				return
			}
    //	putMessage("Error: Trying to compare type [" + lastCheck.type +"] to type ["  + firstCheck.type + "] on line: " + firstCheck.line)



    	for(i = 0; i< boolArrayFinal.length; i++){


    		 if(boolArrayFinal[i].type === "TOKEN_ID")
    		 {
    		 	
				compare2 = getValueofID(boolArrayFinal[i].name, symbolTree.current).type
				
					setVarToUsed(boolArrayFinal[i].name,symbolTree.current)
				//putMessage("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayFinal[i].name)
		    }

			 else if(  boolArrayFinal[i].type != "TOKEN_ID")
		     {
				compare2 = boolArrayFinal[i].type
				//putMessage("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayFinal[i].name)
		    }

		    if(firstCheck.type === "TOKEN_DIGIT" || firstCheck.type === "TOKEN_TYPEINT")
		    {

		    	//putMessage("@@ Testing against type: " + firstCheck.type)
    			
    			if( compare2 != undefined && compare2 != "TOKEN_TYPEBOOLEAN" && compare2 != "TOKEN_BOOLTRUE" && compare2!= "TOKEN_BOOLFALSE" && compare2 != "TOKEN_DIGIT" && compare2 != "TOKEN_TYPEINT" ){
    				sErrors++
    				putMessage("Error: Trying to compare type [" + compare2 +"] to type ["  + firstCheck.type + "] on line: " + firstCheck.line)
    				return;
    			}
    			
   		    }

     		if(firstCheck.type === "TOKEN_QUOTE" || firstCheck.type === "TOKEN_TYPESTRING")
     		{
     			

    			if(compare2 != undefined && compare2 != "TOKEN_TYPEBOOLEAN" && compare2 != "TOKEN_BOOLTRUE" && compare2!= "TOKEN_BOOLFALSE" && compare2 != "TOKEN_TYPESTRING" && compare2 != "TOKEN_QUOTE" && compare2 != "string" ){
    				sErrors++
    				putMessage("Error: Trying to compare type [" + compare2 +"] to type ["  + firstCheck.type + "] on line: " + firstCheck.line)
    				return;
    			}

    		}

     		if(firstCheck.type === "TOKEN_TYPEBOOLEAN" || firstCheck.type === "TOKEN_BOOLTRUE" || firstCheck.type === "TOKEN_BOOLFALSE")
     		{
    			
    			if(compare2 != undefined && compare2 != "TOKEN_TYPEBOOLEAN" && compare2 != "TOKEN_BOOLTRUE" && compare2!= "TOKEN_BOOLFALSE") {
    				sErrors++;
    				putMessage("Error: Trying to compare type [" + compare2 +"] to type ["  + firstCheck.type + "] on line: " + firstCheck.line)
    				return;
    			}
    		}


    	}
//}
	//putMessage(tracking + "IM HUNGRY")
	/*for(i=0; i<boolArrayYolo.length; i++){

		if(i==0){
			if(boolArrayYolo[0].type ==="TOKEN_ID"){
				tracking2 = getValueofID(boolArrayYolo[0].name, symbolTree.current).type
				putMessage("$$ Tracked type for final two values is: " + tracking2 + " " + boolArrayYolo[0].name)
			}

			else{
				tracking2 = boolArrayYolo[0].type
				putMessage("$$ Tracked type for final two values is: " + tracking2)
			}


		}

		 else if( i== 1 && boolArrayYolo[i].type === "TOKEN_ID"){
			compare2 = getValueofID(boolArrayYolo[i].name, symbolTree.current).type
			putMessage("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayYolo[i].name)
		}
		 else if( i ==1 && boolArrayYolo[i].type != "TOKEN_ID"){
			compare2 = boolArrayYolo[i].type
			putMessage("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayYolo[i].name)

		}

		else if(i>= 2){
			break;
		}*/
		//putMessage("$$ Comparing tracked type to type: " +compare2 + " " + boolArrayYolo[i].name)






	//} //end for loop

	



	/*for(i = 0 ; i<boolArrayFinal.length; i++){

		//putMessage("vore")
		putMessage(boolArrayFinal[i].name + " xxxx")
		if(i==0){
			if(boolArrayFinal[0].type === "string"){
				putMessage("WE GOT A BOOGER") 
				//boolArrayFinal.shift()
			}
			putMessage(boolArrayFinal[i].name + " VIAGRA THIS ONE " +boolArrayFinal[0].type)
			putMessage("What's the value here? : " + boolArrayFinal[0].name + "and the type: " +boolArrayFinal[0].type)
			if(boolArrayFinal[0].type === "TOKEN_ID"){
			tracking = getValueofID(boolArrayFinal[0].name, symbolTree.current).type
			putMessage(tracking + " YEET " +boolArrayFinal[0].name)
		}
			else{
				tracking = boolArrayFinal[0].type
				putMessage(tracking + "checking for primitives")
			}
		}
		

		 if( i> 0 && boolArrayFinal[i].type === "TOKEN_ID")
			compare = getValueofID(boolArrayFinal[i].name, symbolTree.current).type
		putMessage(getValueofID( "d", symbolTree.current) + "RESULTS: " + boolArrayFinal[i].name)
		 if( boolArrayFinal[i].type != "TOKEN_ID")
			compare = boolArrayFinal[i].type

        putMessage(getValueofID("e",symbolTree.current).type + "PLEASE AND THANK")
		putMessage("!! Target type is [" + tracking +"]. Got [" +compare +"]")
		
		if(tracking === "TOKEN_TYPEBOOLEAN" || tracking === "TOKEN_BOOLTRUE" || tracking === "TOKEN_BOOLFALSE"){
				if( compare != undefined && compare != "TOKEN_TYPEBOOLEAN" && compare != "TOKEN_BOOLTRUE" && compare != "TOKEN_BOOLFALSE" )
					putMessage("BOOP WRONG TYPES BITCH on line :" + boolArrayFinal[i].line +" column: " +boolArrayFinal[i].column +" " +compare + " " + tracking);

		}

		if(tracking === "TOKEN_TYPESTRING" || tracking === "TOKEN_QUOTE" || tracking === "string"){
			if(compare != "TOKEN_TYPESTRING" && compare != "TOKEN_QUOTE" && compare != "string" )
					putMessage("BOOP WRONG TYPES BITCH on line :" + boolArrayFinal[i].line +" column: " +boolArrayFinal[i].column +" " +compare + " " + tracking);
		}

		if(tracking === "TOKEN_DIGIT" || tracking === "TOKEN_TYPEINT"){
			if(compare != "TOKEN_DIGIT" && compare != "TOKEN_TYPEINT" )
					putMessage("BOOP WRONG TYPES BITCH on line :" + boolArrayFinal[i].line +" column: " +boolArrayFinal[i].column +" " +compare + " " + tracking);
		}
		putMessage("... " +tracking)
		putMessage(boolArrayFinal[i].name + " owo " + boolArrayFinal[i].type)
		putMessage(boolArrayFinal)

	    
		
		//if(boolArrayFinal[i].name != undefined)
		putMessage(boolArrayFinal[i].name + " uwu ")
	    //else
	    	//putMessage(boolArrayFinal[i].value + " uwu ")
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
            //putMessage("LET ME SLEEP")
            if (id === level.symbols[i].id) {
                //putMessage("HIYA")
                level.symbols[i].used = true;
                //putMessage(level.symbols[i].used + "ONEGAIII")
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
        putMessage("Warning: The following variables have not been used:")
        for (var i = 0; i < level.symbols.length; i++) {
            //when the correct ID is found
            if (level.symbols[i].used == false) {
            	sWarnings++;
            	putMessage("\t Variable ["+level.symbols[i].id +"]")
                
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
    putMessage("Finished checking for warnings")
}
