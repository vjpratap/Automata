var generators = {}
exports.generators = generators;
var lodash = require('lodash')


generators.dfaGenerator = function(touple){
	return function(string){
		var charString = string.split("");
		if(!isOnlyAlphabetContains(charString, touple.alphabet))
			return false;
		var finalStateOfString = charString.reduce(function (currentState, character){
			return touple.transitionFunction[currentState][character];
		}, touple.initialState)
		return lodash.includes(touple.finalState, finalStateOfString)	
	} 
}

generators.nfaGenerator = function(touple){
	return function(string) {
		var charString = string.split("")
		if(!isOnlyAlphabetContains(charString, touple.alphabet))
			return false;
		var finalStatesOfString = charString.reduce(function (currentStates, character){
			return allCurentStatesOfString(touple.transitionFunction, character, currentStates)
		}, touple.initialState)
		return isStringFinalStatesContainsFinalState(finalStatesOfString, touple.finalState);
	}
}

var isOnlyAlphabetContains = function(charString, alphabet){
	var alphabetContains = contains(alphabet)
	return charString.every(alphabetContains)
}

var contains = function(alphabets) {
	return function(character){
		return alphabets.indexOf(+character) >= 0
	}
}

var currentStateChanging = function(transitionFunction, initialState){
	return function(currentState, character){
		return transitionFunction[initialState][character]
	}
}

var currentStateOfSet = function(transitionFunction, character){
	return function(currentState){
		if(transitionFunction[currentState]["epsilon"]){
			return epsilonStates(transitionFunction, currentState,character).concat(transitionFunction[currentState][character])
		}
		return transitionFunction[currentState][character];
	}
}

var allCurentStatesOfString = function(transitionFunction, character, currentStates){
	var getAllStates = currentStateOfSet(transitionFunction, character)
	var currentStatesOfSets = currentStates.map(getAllStates)
	return currentStatesOfSets.reduce(getAllCurrentStates)	
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
