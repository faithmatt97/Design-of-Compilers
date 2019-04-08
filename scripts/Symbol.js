class Symbol{

constructor(id, type, value, scope, line, column, initialized, used){
	this.id = id;
	this.type = type;
	this.scope = scope;
	this.line = line;
	this.column = column;
	this.initialized= initialized;
	this.used = used;
}

	getID(){
		return this.id;
	}

}