var generators = {}
exports.generators = generators;
var lodash = require('lodash')
generators.dfaGenerator = function(touple){
	return function(string){
		var charString = string.split("");
		var regex = "^[" + touple.alphabet.join("") + "]*$"
		if(!string.match(regex)){
			return false;
		}
		var finalStateOfString = charString.reduce(function (currentState, character){
			return touple.transitionFunction[currentState][character];
		}, touple.initialState)
		return lodash.includes(touple.finalState, finalStateOfString)	
	} 
}

