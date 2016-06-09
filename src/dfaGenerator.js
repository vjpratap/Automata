var generators = {}
exports.generators = generators;
var lodash = require('lodash')


generators.dfaGenerator = function(touple){
	return function(string){
		var charString = string.split("");
		var finalStateOfString = charString.reduce(function (currentState, character){
			return touple.transitionFunction[currentState][character];
		}, touple.initialState)
		return lodash.includes(touple.finalState, finalStateOfString)	
	} 
}

generators.nfaGenerator = function(touple){
	return function(string) {
		var charString = string.split("")
		var finalStatesOfString
		if(!string.length && touple.transitionFunction[touple.initialState]["e"]){
			return emptyStringHandler(touple.transitionFunction,touple.initialState, touple.finalState)
		}
		var finalStatesOfString = charString.reduce(function (currentStates, character){
			return allStates(touple.transitionFunction, character, currentStates)
		}, [touple.initialState])
		return isStringFinalStatesContainsFinalState(finalStatesWithoutFalsyValue(finalStatesOfString), touple.finalState);
	}
}

var emptyStringHandler = function(transitionFunction, initialState,finalState){
	var finalStates = transitionFunction[initialState]["e"].map(function(state){
		return transitionFunction[state]["e"] ? transitionFunction[state]["e"].concat(state) : state
	})
	return isStringFinalStatesContainsFinalState(finalStatesWithoutFalsyValue(finalStates), finalState);
}

var finalStatesWithoutFalsyValue = function(finalStatesOfString){
	return lodash.filter(lodash.flatten(finalStatesOfString))
}

var currentStateChanging = function(transitionFunction, initialState){
	return function(currentState, character){
		return transitionFunction[initialState][character]
	}
}

var currentStateOfSet = function(transitionFunction, character){
	return function(currentState){
		if(transitionFunction[currentState]["e"]){
			return epsilonStates(transitionFunction, currentState,character).concat(transitionFunction[currentState][character])
		}
		return transitionFunction[currentState][character];
	}
}

var allCurentStatesOfString = function(transitionFunction, character, currentStates){
	var getAllStates = currentStateOfSet(transitionFunction, character)
	currentStates = lodash.filter(currentStates, Boolean)
	var currentStatesOfSets = currentStates.map(getAllStates)
	return lodash.flatten(currentStatesOfSets)
}

var allStates = function(transitionFunction, character,currentStates){
	var allStates = allCurentStatesOfString(transitionFunction, character, currentStates)
	var states = lodash.flattenDeep(lodash.filter(allStates, Boolean)).map(function(state){
		return transitionFunction[state]["e"] ? transitionFunction[state]["e"].concat(state) : state
	})
	return lodash.flattenDeep(states)
}


var epsilonStates = function(transitionFunction, currentState, character){
	var epsilonCurrentStates = transitionFunction[currentState]["e"]
	return epsilonCurrentStates.map(function(epsilonCurrentState){
		return transitionFunction[epsilonCurrentState][character]
	})
}

var isStringFinalStatesContainsFinalState = function(finalStatesOfString, finalStates){
	return lodash.intersection(finalStatesOfString, finalStates).length > 0;
}