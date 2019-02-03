//I should store this info somewhere huh

function addToken(type, value, line, colNumber){
 var newToken = new Token(type, value, line, colNumber);
 tokenArray.push(newToken);
}

function Token(token, value, line, colNumber) {
	this.type = token;
	this.value = value;
	this.line = line;
    this.colNumber = colNumber;
}



const tokenTypes = {
    LEFTBRACE: 'LEFTBRACE',
    RIGHTBRACE: 'RIGHTBRACE',
    ID: 'ID',
    CHAR: 'CHAR'
}