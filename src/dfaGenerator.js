var generators = {}
exports.generators = generators;
var lodash = require('lodash')


generators.dfaGenerator = function(touple){
	return function(string){
		var charString = string.split("");
		if(!stringVarify(charString, touple.alphabet,string)){
			return false;
		}
		var finalStateOfString = charString.reduce(function (currentState, character){
			return touple.transitionFunction[currentState][character];
		}, touple.initialState)
		return lodash.includes(touple.finalState, finalStateOfString)	
	} 
}

generators.nfaGenerator = function(touple){
	return function(string) {
		var charString = string.split("")
		if(!stringVarify(charString, touple.alphabet, string))
			return false
		var finalStateOfString = charString.reduce(function (currentStates, character){
			var currentStatesArrays = currentStates.map(function(currentState){
				
				return touple.transitionFunction[currentState][character]
			})
			return currentStatesArrays.reduce(function(initialValue, currentValue){
				return lodash.union(initialValue, currentValue)
			})
		}, touple.initialState)
		return lodash.intersection(finalStateOfString, touple.finalState).length > 0;
	}
}

var stringVarify = function(charString, alphabet,string){
	var charString = string.split("");
	var regex = "^[" + alphabet.join("") + "]*$"
	return string.match(regex)
}