var generators = {}
exports.generators = generators;
var lodash = require('lodash')


generators.dfaGenerator = function(tuple){
	return function(string){
		var charString = string.split("");
		var finalStateOfString = charString.reduce(function (currentState, alphabet){
			return tuple.transitionFunction[currentState][alphabet];
		}, tuple.initialState)
		return lodash.includes(tuple.finalState, finalStateOfString)	
	} 
}

generators.nfaGenerator = function(tuple){
	return function(string) {
		var finalStatesOfMachine = getFinalStatesOfMachine(tuple, string)
		return lodash.intersection(lodash.filter(lodash.flatten(finalStatesOfMachine)), tuple.finalState).length > 0
	}
}

var getFinalStatesOfMachine = function(tuple, string){
	var charString = string.split("")
	if(!string.length && tuple.transitionFunction[tuple.initialState]["e"]){
		return emptyStringHandler(tuple)
	}
	var initialState = getInitialStateHandlingEpsiloneState(tuple)
	var finalStates = charString.reduce(function(currentStates, alphabet){
		return allStatesOfMachine(tuple.transitionFunction, alphabet, currentStates)
	},initialState)
	return finalStates
}

var getInitialStateHandlingEpsiloneState = function(tuple){
	return lodash.compact(lodash.flatten(emptyStringHandler(tuple).concat(tuple.initialState)))
}

var emptyStringHandler = function(tuple){
	var addStatesWithEpsiloneStates = addingStateInEpsilone(tuple.transitionFunction)
	return tuple.transitionFunction[tuple.initialState]["e"].map(addStatesWithEpsiloneStates)
}

var getCurrentStates = function(transitionFunction, alphabet){
	return function(currentState){
		if(transitionFunction[currentState]["e"]){
			return epsilonStates(transitionFunction, currentState,alphabet).concat(transitionFunction[currentState][alphabet])
		}
		return transitionFunction[currentState][alphabet];
	}
}

var allCurentStatesOfMachine = function(transitionFunction, alphabet, currentStates){
	var getAllStates = getCurrentStates(transitionFunction, alphabet)
	currentStates = lodash.filter(currentStates, Boolean)
	return lodash.flatten(currentStates.map(getAllStates))
}

var allStatesOfMachine = function(transitionFunction, alphabet,currentStates){
	var allStates = allCurentStatesOfMachine(transitionFunction, alphabet, currentStates)
	var addStatesWithEpsiloneStates = addingStateInEpsilone(transitionFunction)
	var states = lodash.compact(lodash.flattenDeep(allStates))
	return lodash.flattenDeep(states.map(addStatesWithEpsiloneStates))
}
var addingStateInEpsilone = function(transitionFunction){
	return function(state){
		return transitionFunction[state]["e"] ? transitionFunction[state]["e"].concat(state) : state;
	}
}

var epsilonStates = function(transitionFunction, currentState, alphabet){
	var epsilonCurrentStates = transitionFunction[currentState]["e"]
	return epsilonCurrentStates.map(function(epsilonCurrentState){
		return transitionFunction[epsilonCurrentState][alphabet]
	})
}
