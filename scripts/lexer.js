/* lexer.js  

Since Alan hates us and wants us to Parse before lexing the following program, I must make adjustments.
So here's what I'm thinking

We modify the EOF token so it only registers if its the last token on the line (not really needed tbh)
We split the source code by regex described above. Now each program is in its own array element
After we finish lexing we call parse function.

OKAY tried that and failed because I guess strings dont have multiline functionality so maybe we'll split it by \$\n

Not pushing anything until we get lexer working with these new adjustments. gonna be a huge pain in the ass. 

since we split by \n we need to track that in lines and columns - DONE
Check if everything still works with new changes - MOSTLY DONE
		I can't decide if I want unclosed comments to stop the entire compiler or simply pick up with next program. Right now it does the latter. 

*/

/*
	Bugs I've found:
		Having two assign statements in a row will cause an infinite loop. 
		I've fixed it by putting in conditional statement to detect assign statements in the Expr block (despite assign states not being Expressions) 
		*Have yet to see if everything else still works with new changes

	UPDATE: 
		Everything seems to be working for parse
	WHAT'S NEXT:
		-Construct CST (I HATE TREES bc i always study for them and never get them in interviews. >:U )
		-Fix multiprogram functionality   
			Alan said to not make my compiler so fragile so i gotta correct that :/
		-Add line and column report, easy peasy


*/

 var tokens = [];
var tokenIndex = 0;
var currentToken = "";
var errorCount = 0;
var EOF = "$";
        

var regStartComment = new RegExp('/\\*');
var regEndComment = new RegExp('\\*/');
var regEOF = new RegExp("\\$");

var regLeftBrace = new RegExp('{');
var regLeftParen = new RegExp("\\(");
var regRightParen = new RegExp("\\)");
var regRightBrace = new RegExp("}");


var regBooleanFalse = new RegExp('false');
var regBooleanTrue = new RegExp('true');
var regWhile = new RegExp('while');;
var regIf = new RegExp('if');
    
var regWhiteSpace = new RegExp(' |\t|\r');
var regPrint = new RegExp('print');
var regID = new RegExp("[a-z]")
var regDigit = new RegExp("[0-9]")
var regIntOp = new RegExp("\\+");
var regAssign = new RegExp('=');
    //var regSpace = new RegExp('\n | \t ');
var regNewLine = new RegExp('\n');
var regIsNotEqual = new RegExp('!=');
var regIsEqual = new RegExp("==");
var regBoolType = new RegExp('boolean')
var regIntType = new RegExp ('int');
var regStringType = new RegExp('string');
var code;
var codeBody = document.getElementById("taOutput");

var regQuote = new RegExp('"');


var inQuotes = false;         //track whether or not we;re in quote
var inComment = false;        //track whether or not we're in comment
var errorInCurrentProgram = false;   //track if we encountered error so we can skip to next program
var tokenArray;                       //holds all tokens

var line;     //keep track of line
var column;   //keep track of columns


var commentLine     //tracks latest start comment token
var commentCol      //  ^^^^^
var programCount = 0;
        
var quoteLine;      //tracks latest start quote token
var quoteColumn;     // ^^^^^
var programs
    function lex()
    {
        // Grab the "raw" source programs[i].
        var sourceCode = document.getElementById("taSourceCode").value;
        // Trim the leading and trailing spaces.
        sourceCode = trim(sourceCode);
        // TODO: remove all spaces in the middle; remove line breaks too.
        return sourceCode;

       
    }

   
    function init() {
        // Clear the message box.
        console.clear();
        document.getElementById("taOutput").value = "";
        // Set the initial values for our globals.
        tokenArray= []; //kept getting some type error when it was named tokens
        tokenIndex = 0;
        lexPtr =0;
        currentToken = ' ';
        errorCount = 0; 
        warningCount = 0;    

		
         line =1;
         column = 0;
		 errors=0;
		 inQuotes = false;
		 inComment = false;
         errorInCurrentProgram = false;
    }
    
    function btnCompile_click() {        
        // This is executed as a result of the usr pressing the 
        // "compile" button between the two text areas, above.  
        // Note the <input> element's event handler: onclick="btnCompile_click();
      init();
      var codeBody = document.getElementById("taSourceCode").value;  
      code= trim(codeBody);
      parse();
       programs = codeBody.split('\$\n');
      //programs = codeBody.split('\$(?=\n)');
        //console.log(codeBody)
        //console.log(programs)
       // console.log(programs[programs.length-1].charAt(programs[programs.length-1].length-1))
        
        
    }
    
    function putMessage(msg) {
        document.getElementById("taOutput").value += msg + "\n";
    }
    
   
    function parse() {
       	cst = new Tree();
       	cst.addNode("Root", "branch")
        var errors = 0;
        var errorCount = 0;
        var commentLine
        var commentCol
        var programCount = 0;
		
		var quoteLine;
		var quoteColumn;
		var codeBody = document.getElementById("taSourceCode").value;  
			programs = codeBody.split('\$\n');
        	//putMessage("LEXING PROGRAM #" + programCount);
        	
     if(codeBody.charAt(codeBody.length-1) != "$"){
        	document.getElementById("taSourceCode").value+="$";
        	code+="$";
        	}

       
        var ptr =0;
       
        while (ptr<code.length){
        	if(inQuotes){
        			if(regQuote.test(code.charAt(ptr)))
                                    inQuotes = false;
                   //else if(regEOF.test(code.charAt(ptr)))

        	}
        	else if(regEOF.test(code.charAt(ptr))){
            	
            	one = code.slice(0,ptr)
            	two = code.slice(ptr, code.length)

            	code = one + '\n' + two;
            	ptr++;   
            	
        	}
        	else if(regQuote.test(code.charAt(ptr))){
                inQuotes = true;
            }
            
        	ptr++;
        }

      console.log(code)
      putMessage(code)
      programs = code.split('\n\$');
      programs.pop();
     //bitch = programs.splice('\$\n');
      console.log(programs)
     for(i =0; i<programs.length ; i++){
     		putMessage("LEXING PROGRAM #"+ i);
     		errorInCurrentProgram = false;
     		inComment = false;
     		errors = 0;
            errorCount = 0;
        	inQuotes = false;
        while(lexPtr < programs[i].length){
        					//First test to see if we are in a comment. If we are, check to see if there's an END COMMENT token > set incomment flag to false so we can stop ignoring stuff.

                      if(inComment)
                        { 
                          if(regEndComment.test(programs[i].substring(lexPtr, lexPtr+2)))
                          {
                             inComment = false;
                             lexPtr++;
                          }
                          else if(regNewLine.test(programs[i].charAt(lexPtr)))
                          	line++;
                        }

                            // If there's error > ignore everything till EOF so we can lex next program. Tbh idk why the QUOTE test is in there, but i only add stuff when i fuck up 
                            //so it's there for a reason. 
                      else if(errorInCurrentProgram){

                        	if(regEOF.test(programs[i].charAt(lexPtr)))
                            {
                                putMessage("LEXING of Program #"+ programCount+ " stopped due to error. Warnings:" + warningCount +" errors:" + errors);
                        		errorInCurrentProgram = false; 
                        		errorCount = 0;
                                errors=0;
                        		
                        		warningCount = 0;
                                if(lexPtr != programs[i].length-1) //check if we're at end of program, if not move onto next. 
                                {
                                  programCount++;
                        		  putMessage( "-----  LEXING NEXT PROGRAM #" + programCount + " -----")
                                }
                        	}

                            else if(regQuote.test(programs[i].charAt(lexPtr))){
                                if(inQuotes)
                                    inQuotes = false;
                            }

                        }
                        else if(inQuotes)  //If in quotes > spew out tokens for white spaces, CHARS, and QUOTE > else > return error for everything else
                        {
                            if(regID.test(programs[i].charAt(lexPtr)))
                            {
                                addToken("TOKEN_CHAR", programs[i].charAt(lexPtr), line, column);
                                putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                                tokenArray[tokenArray.length-1].value +  " ] line:" + 
                                tokenArray[tokenArray.length-1].line + " column:" +
                                tokenArray[tokenArray.length-1].colNumber);
                            }

                            else if(regWhiteSpace.test(programs[i].charAt(lexPtr)))
                                {
                                    addToken("TOKEN_SPACE", " ", line, column)
                                    putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                                    tokenArray[tokenArray.length-1].value +  " ] line:" + 
                                    tokenArray[tokenArray.length-1].line + " column:" +
                                    tokenArray[tokenArray.length-1].colNumber);
                                }
                            else if(regQuote.test(programs[i].charAt(lexPtr)))
                            {
                                addToken("TOKEN_QUOTE", '"', line, column);
                                putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                                tokenArray[tokenArray.length-1].value +  " ] line:" + 
                                tokenArray[tokenArray.length-1].line + " column:" +
                                tokenArray[tokenArray.length-1].colNumber);
                                
                                inQuotes = false;
                            }
                                
                            else {
                                errors++;
                                if(regNewLine.test(programs[i].charAt(lexPtr)))
                                    putMessage("\t ERROR: \\n  is not a char on line: " + line + " column:" + column );
                                else{
                                putMessage("\t ERROR: " +programs[i].charAt(lexPtr) + " is not a char on line: " + line + " column:" + column );
                                }
                                if(!errorInCurrentProgram){
                                    errorInCurrentProgram = true;
                                }
                            }
                            
                        }
                          //CHECK FOR START COMMENT TOKEN
                        else if(regStartComment.test(programs[i].substring(lexPtr, lexPtr+2)))
                        {
                           inComment = true;
                           lexPtr++;
                           commentLine = line;
                           commentCol = column;
                        }
                    		
                        
                        	//Check for LEFT BRACE token
                        else if(regLeftBrace.test(programs[i].charAt(lexPtr)))
                        {
                            addToken("TOKEN_LEFTBRACE", "{", line, column);
                            putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        }
                        	//CHECK FOR LEFT PARENTHESIS TOKEN
                        else if(regLeftParen.test(programs[i].charAt(lexPtr)))
                        {
                            addToken("TOKEN_LEFTPAREN", "(", line, column);
                             putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        }
                        	//CHECK FOR RIGHT BRACE TOKEN
                        else if(regRightBrace.test(programs[i].charAt(lexPtr)))
                        {
                            addToken("TOKEN_RIGHTBRACE", "}", line, column);
                             putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        }
                        	//CHECK FOR RIGHT PARENTHESIS TOKEN
                        else if(regRightParen.test(programs[i].charAt(lexPtr)))
                        {
                            addToken("TOKEN_RIGHTPAREN", ")", line, column);
                             putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        }
                    		//Check for QUOTE token > anything recognized as ID will be registered as CHAR token 
                    	else if(regQuote.test(programs[i].charAt(lexPtr)))
                    	{      
                        	addToken("TOKEN_QUOTE", '"', line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
							quoteLine = line;
							quoteColumn = column;
                        	if(inQuotes)
                            	inQuotes = false;
                        	else 
                            	inQuotes = true;
                    	}
                    		//Check for TRUE keyword
                     	else if(regBooleanTrue.test(programs[i].substring(lexPtr, lexPtr+4 )))
                     	{
                        	addToken("TOKEN_BOOLTRUE", programs[i].substring(lexPtr, lexPtr+4), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr+=3;
                        	column+=3;
                    	}

                            // Check for IF keyword
                    	else if(regIf.test(programs[i].substring(lexPtr, lexPtr+2)))
                    	{
                        	addToken("TOKEN_IF", programs[i].substring(lexPtr, lexPtr+2), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr++;
                        	column++;
                    	}
                            //Check for WHILE keyword
                    	else if(regWhile.test(programs[i].substring(lexPtr, lexPtr+5)))
                    	{
                        	addToken("TOKEN_WHILE", programs[i].substring(lexPtr, lexPtr+5), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr+=4;
                        	column+=4;
                    	}
                    		//Check for PRINT keyword
                    	else if(regPrint.test(programs[i].substring(lexPtr, lexPtr+5)))
                    	{
                        	addToken("TOKEN_PRINT", programs[i].substring(lexPtr, lexPtr+5), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr+=4;
                        	column+=4;
                    	}

                         //Check for FALSE keyword
                    	else if(regBooleanFalse.test(programs[i].substring(lexPtr, lexPtr+5 )))
                    	{
                        	addToken("TOKEN_BOOLFALSE", programs[i].substring(lexPtr, lexPtr+5), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr+=4;
                        	column+=4;
                    	}
                            //CHECK FOR VAR TYPE STRING
                    	else if(regStringType.test(programs[i].substring(lexPtr, lexPtr+6)))
						{
							addToken("TOKEN_TYPESTRING", "string" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
							lexPtr+=5;


						}
                            //CHECK FOR VAR TYPE BOOLEAN
						else if(regBoolType.test(programs[i].substring(lexPtr, lexPtr+7)))
						{
							addToken("TOKEN_TYPEBOOLEAN", "boolean" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
							lexPtr+=6;

							
						}
                            //CHECK FOR VAR TYPE INT
						else if(regIntType.test(programs[i].substring(lexPtr, lexPtr+3)))
						{
							addToken("TOKEN_TYPEINT", "int" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
							lexPtr+=2;

							
						}
						
                        // Check for ID tokens
                    	else if (regID.test(programs[i].charAt(lexPtr))) 
                    	{
                        	if(inQuotes)
                        	{
                            	addToken("TOKEN_CHAR", programs[i].charAt(lexPtr), line, column);
                            	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	}
                        	else
                        	{
                            	addToken("TOKEN_ID", programs[i].charAt(lexPtr), line, column);
                            	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	}
                    	}
                        	//Check for digit token
                    	else if (regDigit.test(programs[i].charAt(lexPtr))) 
                    	{
                        	addToken("TOKEN_DIGIT", programs[i].charAt(lexPtr), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                    	}
							//Check for ISEQUAL token (==)
						else if(regIsEqual.test(programs[i].substring(lexPtr, lexPtr+2)))
						{
							addToken("TOKEN_ISEQUAL", "==", line, column);
							lexPtr++;
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
						}
							//Check for ISNOTEQUAL token (!=)
						else if (regIsNotEqual.test(programs[i].substring(lexPtr, lexPtr +2)))
						{
							lexPtr++
							addToken("TOKEN_NOTEQUAL", "!=" , line, column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
						}

							//Check for ASSIGN token (=)
						else if(regAssign.test(programs[i].charAt(lexPtr)))
						{
							addToken("TOKEN_ASSIGN", "=" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
						}
                            //CHECK FOR + TOKEN
						else if(regIntOp.test(programs[i].charAt(lexPtr)))
						{
							addToken("TOKEN_INTOP", "+" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
						}
						//THIS IS HERE SO SPACES DONT MESS WITH ANYTHING
                        else if(regWhiteSpace.test(programs[i].charAt(lexPtr)))
                        {
                        }

						else if(regEOF.test(programs[i].charAt(lexPtr)))
                        {
                           addToken("TOKEN_EOF", "$" , line , column)
                           putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                                tokenArray[tokenArray.length-1].value +  " ] line:" + 
                                tokenArray[tokenArray.length-1].line + " column:" +
                                tokenArray[tokenArray.length-1].colNumber);
                           putMessage("Finished lexing program #" + programCount + " Warnings:" +warningCount + " Errors:" +errors);
                           programCount++;

                           if(lexPtr < programs[i].length-1) //i know this can turn into one line but everything is working and im not risking ANYTHING
                           {
                           	putMessage("\n  \n LEXING PROGRAM #" + programCount);
                           }
                        }


                            //NEWLINE TEST. 
                        else if (regNewLine.test(programs[i].charAt(lexPtr))) 
                        {
                            line++
                            column = -1;
                        }
                        //ANYTHING ELSE IS INVALID AND WILL CAUSE ERROR
                        else
                        {
                   	        errors++;
                   	        errorCount++;
                   	        if(!errorInCurrentProgram)
                            {
                   		       errorInCurrentProgram = true;
                   	        }
                            putMessage(" \t ERROR: Unexpected token '" + programs[i].charAt(lexPtr) + "' at line:" + line + " , column:" + column);

                        }
          
           
            		lexPtr++;
            		column++;
            }

             //Will probably change this later so its in while loop. Probs will go something like this: If at final token > check to see if in comment or quotes > return necessary error or w.e
             if(inComment)
            {
            	errors++
                errorCount++;
                putMessage(" \t ERROR: no closing comment symbol at line:" + commentLine + " , column:" + commentCol +"  Warnings:" +warningCount + " Errors:" +errors);
               // document.getElementById("taSourceCode").value+="$"
				
				
				 
            }
			
			else if(inQuotes){
				errors++;
				//if(errorInCurrentProgram)
				putMessage(" \t ERROR: no closing quote for opening quote on line:" + quoteLine+ " column:" + quoteColumn +" Warnings:" +warningCount + " Errors:" +errors)
			}

           /*else if(code.charAt(code.length-1) != "$" ){
                putMessage("WARNING: EOF token not found...injecting token. Injection finished!");
                warningCount++;
                document.getElementById("taSourceCode").value+="$"
                //if(inComment){
                    //inComment = false;
                //code+="$";}
                //document.getElementById("taSourceCode").value+="$";}
                 //
            } */

               
            
				lexPtr = 0;
				//line++; //this was causing faulty line count
				column = 0;
				programTokens = tokenArray;
				//console.log(tokenArray);
				tokenArray = [];
				ok =checkToken();
				//console.log(ok);
				
				parseErrors = errors;
				
				parseProgram();
				//cst = new Tree()

				//console.log(match(["TOKEN_LEFTBRACE	"]))



            }
            console.log(cst.toString())
            putMessage("COMPILATION FINISHED");

           

    }

  //var cst;





