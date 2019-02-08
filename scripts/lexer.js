/* lexer.js  */

    function lex()
    {
        // Grab the "raw" source code.
        var sourceCode = document.getElementById("taSourceCode").value;
        // Trim the leading and trailing spaces.
        sourceCode = trim(sourceCode);
        // TODO: remove all spaces in the middle; remove line breaks too.
        return sourceCode;
    }

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


    var inQuotes = false;
    var inComment = false; 
    var errorInCurrentProgram = false;
        var tokenArray;

        var line ;
        var column ;
        
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
                
       // putMessage("Compilation Started");
        // Grab the tokens from the lexer . . .
        //tokens = lex();
        //putMessage("Lex returned [" + tokens + "]");
        // . . . and parse!
        parse();
        
        
    }
    
    function putMessage(msg) {
        document.getElementById("taOutput").value += msg + "\n";
    }
    
    
    function parse() {
       //putMessage("Parsing [" + tokens + "]");
        // Grab the next token.
        //currentToken = getNextToken();
        // A valid parse derives the G(oal) production, so begin there.
       
       // checkToken("boolval");
        // Report the results.
        //putMessage("Parsing found " + errorCount + " error(s).");   
       
       
        
        tokenPtr = 0;
        var errors = 0;
        var commentLine
        var commentCol
        var programCount = 0;
		
		var quoteLine;
		var quoteColumn;
        	putMessage("LEXING PROGRAM #" + programCount);
        while(lexPtr < code.length){
        					//First test to see if we are in a comment. If we are, check to see if there's an END COMMENT token > set incomment flag to false so we can stop ignoring stuff.

                        if(inComment)
                        {
                          if(regEndComment.test(code.substring(lexPtr, lexPtr+2)))
                          {
                             inComment = false;
                             lexPtr++;
                          }
                        }

                       else if(errorInCurrentProgram){

							//inQuotes = false;

                        	//putMessage("LEXING stopped due to error. Warnings:" + warningCount +" errors:" + errors);
                            //errorInCurrentProgram = false; 
                        	if(regEOF.test(code.charAt(lexPtr))){
                                putMessage("LEXING of Program #"+ programCount+ " stopped due to error. Warnings:" + warningCount +" errors:" + errors);
                        		errorInCurrentProgram = false; 
                        		errorCount = 0;
                        		
                        		warningCount = 0;
                                if(lexPtr != code.length-1)
                                {
                                 programCount++;
                        		  putMessage( "-----  LEXING NEXT PROGRAM #" + programCount + " -----")
                                }
                        	}
                         //Check for START COMMENT token
                        }
                        else if(regStartComment.test(code.substring(lexPtr, lexPtr+2)))
                        {
                           inComment = true;
                           lexPtr++;
                           commentLine = line;
                           commentCol = column;
                        }
                    		// Check for white space
                        
                        	//Check for LEFT BRACE token
                        else if(regLeftBrace.test(code.charAt(lexPtr)))
                        {
                            addToken("TOKEN_LEFTBRACE ", "{", line, column);
                            putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        }
                        	//CHECK FOR LEFT PARENTHESIS TOKEN
                        else if(regLeftParen.test(code.charAt(lexPtr)))
                        {
                            addToken("TOKEN_LEFTPAREN", "(", line, column);
                             putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        }
                        	//CHECK FOR RIGHT BRACE TOKEN
                        else if(regRightBrace.test(code.charAt(lexPtr)))
                        {
                            addToken("TOKEN_RIGHTBRACE", "}", line, column);
                             putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        }
                        	//CHECK FOR RIGHT PARENTHESIS TOKEN
                        else if(regRightParen.test(code.charAt(lexPtr)))
                        {
                            addToken("TOKEN_RIGHTPAREN", ")", line, column);
                             putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        }
                        	//Check for EOF token
                         
                   

                    		//Check for QUOTE token > anything recognized as ID will be registered as CHAR token 
                    	else if(regQuote.test(code.charAt(lexPtr)))
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
                     	else if(regBooleanTrue.test(code.substring(lexPtr, lexPtr+4 )))
                     	{
                        	addToken("TOKEN_BOOLTRUE", code.substring(lexPtr, lexPtr+4), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr+=3;
                        	column+=3;
                    	}

                            // Check for IF keyword
                    	else if(regIf.test(code.substring(lexPtr, lexPtr+2)))
                    	{
                        	addToken("TOKEN_IF", code.substring(lexPtr, lexPtr+2), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr++;
                        	column++;
                    	}
                            //Check for WHILE keyword
                    	else if(regWhile.test(code.substring(lexPtr, lexPtr+5)))
                    	{
                        	addToken("TOKEN_WHILE", code.substring(lexPtr, lexPtr+5), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr+=4;
                        	column+=4;
                    	}
                    		//Check for PRINT keyword
                    	else if(regPrint.test(code.substring(lexPtr, lexPtr+5)))
                    	{
                        	addToken("TOKEN_PRINT", code.substring(lexPtr, lexPtr+5), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr+=3;
                        	column+=3;
                    	}

                         //Check for FALSE keyword
                    	else if(regBooleanFalse.test(code.substring(lexPtr, lexPtr+5 )))
                    	{
                        	addToken("TOKEN_BOOLFALSE", code.substring(lexPtr, lexPtr+5), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	lexPtr+=4;
                        	column+=4;
                    	}

                    	else if(regStringType.test(code.substring(lexPtr, lexPtr+6)))
						{
							addToken("TOKEN_TYPESTRING", "string" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
							lexPtr+=5;


						}

						else if(regBoolType.test(code.substring(lexPtr, lexPtr+7)))
						{
							addToken("TOKEN_TYPEBOOLEAN", "string" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
							lexPtr+=6;

							
						}

						else if(regIntType.test(code.substring(lexPtr, lexPtr+3)))
						{
							addToken("TOKEN_TYPEINT", "string" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
							lexPtr+=2;

							
						}
						else if(inQuotes)
						{
							if(regID.test(code.charAt(lexPtr)))
							{
								addToken("TOKEN_CHAR", code.charAt(lexPtr), line, column);
                            	putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
							}

                            else if(regWhiteSpace.test(code.charAt(lexPtr)))
                                {
                                    addToken("TOKEN_SPACE", " ", line, column)
                                    putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                                    tokenArray[tokenArray.length-1].value +  " ] line:" + 
                                    tokenArray[tokenArray.length-1].line + " column:" +
                                    tokenArray[tokenArray.length-1].colNumber);
                                }
							else if(regQuote.test(code.charAt(lexPtr)))
							{
								addToken("TOKEN_QUOTE", '"', line, column);
								putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
								
								inQuotes = false;
							}
								
							else {
								putMessage("\t ERROR: " +code.charAt(lexPtr) + " is not a char on line: " + line + " column:" + column );
								errors++;
								if(!errorInCurrentProgram){
									errorInCurrentProgram = true;
								}
							}
							
						}
                        // Check for ID tokens
                    	else if (regID.test(code.charAt(lexPtr))) 
                    	{
                        	if(inQuotes)
                        	{
                            	addToken("TOKEN_CHAR", code.charAt(lexPtr), line, column);
                            	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	}
                        	else
                        	{
                            	addToken("TOKEN_ID", code.charAt(lexPtr), line, column);
                            	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                        	}
                    	}
                        	//Check for digit token
                    	else if (regDigit.test(code.charAt(lexPtr))) 
                    	{
                        	addToken("TOKEN_DIGIT", code.charAt(lexPtr), line, column);
                        	 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
                    	}
							//Check for ISEQUAL token (==)
						else if(regIsEqual.test(code.substring(lexPtr, lexPtr+2)))
						{
							addToken("TOKEN_ISEQUAL", "==", line, column);
							lexPtr++;
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
						}
							//Check for ISNOTEQUAL token (!=)
						else if (regIsNotEqual.test(code.substring(lexPtr, lexPtr +2)))
						{
							lexPtr++
							addToken("TOKEN_NOTEQUAL", "!=" , line, column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
						}

							//Check for ASSIGN token (=)
						else if(regAssign.test(code.charAt(lexPtr)))
						{
							addToken("TOKEN_ASSIGN", "=" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
						}

						else if(regIntOp.test(code.charAt(lexPtr)))
						{
							addToken("TOKEN_INTOP", "+" , line , column)
							 putMessage(" \t LEXER -->"+tokenArray[tokenArray.length-1].type + " [ "+ 
                            	tokenArray[tokenArray.length-1].value +  " ] line:" + 
                            	tokenArray[tokenArray.length-1].line + " column:" +
                            	tokenArray[tokenArray.length-1].colNumber);
						}
						
                        else if(regWhiteSpace.test(code.charAt(lexPtr)))
                        {
                        }

						else if(regEOF.test(code.charAt(lexPtr))){
                           putMessage("Finished lexing program #" + programCount + " Warnings:" +warningCount + " Errors:" +errors);
                           programCount++;

                           if(lexPtr < code.length-1){
                           	putMessage("\n  \n LEXING PROGRAM #" + programCount);
                           }
                        }


                            //NEWLINE TEST. I don't need a token for this but it's there for testing purposes. Will increment some pointer here to keep track of lines while Coloumn pointer will reset to zero 
                    else if (regNewLine.test(code.charAt(lexPtr))) 
                    {
                        line++
                        column = -1;
                    }

                   else
                   {
                   	errors++;
                   	errorCount++;
                   	if(!errorInCurrentProgram){
                   		errorInCurrentProgram = true;
                   	}
                    putMessage(" \t ERROR: Unexpected token '" + code.charAt(lexPtr) + "' at line:" + line + " , column:" + column);

                   }
          
           
            		lexPtr++;
            		column++;
            }

             
             if(inComment)
            {
            	errors++
                errorCount++;
                putMessage(" \t ERROR: no closing comment symbol at line:" + commentLine + " , column:" + commentCol);
               // document.getElementById("taSourceCode").value+="$"
				
				
				 
            }
			
			else if(inQuotes){
				errors++;
				if(errorInCurrentProgram)
				putMessage(" \t ERROR: no closing quote for opening quote on line:" + quoteLine+ " column:" + quoteColumn )
			}

            else if(code.charAt(code.length-1) != "$" ){
                putMessage("WARNING: EOF token not found...injecting token. Injection finished!");
                warningCount++;
                document.getElementById("taSourceCode").value+="$"
                if(inComment){
                    inComment = false;
                code+="$";}
                //document.getElementById("taSourceCode").value+="$";}
                 //
            }

               // putMessage("FINISHED LEXING Program #"+programCount+" Warnings: " + warningCount + " Errors:" + errors);
            
		
            

    }