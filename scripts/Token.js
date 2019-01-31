//I should store this info somewhere huh

function addToken(type, value, line, colNumber){
 var newToken = new Token(type, value, line, colNumber);
 tokens.push(newToken);
}

function Token(token, value, line, colNumber) {
	this.type = token;
	this.value = value;
	this.line = line;
    this.colNumber = colNumber;
}