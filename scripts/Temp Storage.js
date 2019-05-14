class Temp{

constructor(tempID, id, type, scope){
	this.tempID = tempID
	this.id = id;
	this.type = type;
	this.scope = scope
	
}

	getTempID(){
		return this.tempID;
	}

	getID(){
		return this.id;
	}

	getType(){
		return this.type;
	}
	getScope(){
		return this.scope;
	}
}


class StringEntry{
	constructor(string, address){
		this.string = string
		this.address = address
	}


	getAddress(){
		return this.address;
	}

	getString(){
		return this.string;
	}
}