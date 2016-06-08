var generators = {}
exports.generators = generators;
var lodash = require('lodash')


generators.dfaGenerator = function(touple){
	return function(string){
		var charString = string.split("");
		if(isStringContainMoreCharacterThanAlphabets(charString, touple.alphabet,string)){
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
		if(isStringContainMoreCharacterThanAlphabets(charString, touple.alphabet, string))
			return false
		var finalStatesOfString = charString.reduce(function (currentStates, character){
			var currentStatesSets = currentStates.map(function(currentState){
				if(touple.transitionFunction[currentState]["epsilon"]){
					return epsilonStates(touple.transitionFunction, currentState,character).concat(touple.transitionFunction[currentState][character])
				}
				return touple.transitionFunction[currentState][character]
			})
			return currentStatesSets.reduce(getAllCurrentStates)
		}, touple.initialState)
		return isStringFinalStatesContainsFinalState(finalStatesOfString, touple.finalState);
	}
}

var epsilonStates = function(transitionFunction, currentState, character){
	var epsilonCurrentStates = transitionFunction[currentState]["epsilon"]
	return epsilonCurrentStates.map(function(epsilonCurrentState){
			return transitionFunction[epsilonCurrentState][character]
	})
}

var isStringFinalStatesContainsFinalState = function(finalStatesOfString, finalStates){
	return lodash.intersection(finalStatesOfString, finalStates).length > 0;
}

var getAllCurrentStates = function(previousValue, currentValue){
	return lodash.union(previousValue, currentValue)
}

var isStringContainMoreCharacterThanAlphabets = function(charString, alphabet,string){
	var charString = string.split("");
	var regex = "^[" + alphabet.join("") + "]*$"
	return !string.match(regex)
}
