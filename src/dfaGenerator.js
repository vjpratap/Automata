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
		return epsilonTraverser(tuple.transitionFunction,[tuple.initialState])
	}
	var initialState = getInitialStateHandlingEpsiloneState(tuple)
	var finalStates = charString.reduce(function(currentStates, alphabet){
		return allStatesOfMachine(tuple.transitionFunction, alphabet, currentStates)
	},initialState)
	return finalStates
}

var getInitialStateHandlingEpsiloneState = function(tuple){
	var addStatesWithEpsiloneStates = addingStateInEpsilone(tuple.transitionFunction)
	var startingStates = epsilonTraverser(tuple.transitionFunction, [tuple.initialState])
	return lodash.compact(lodash.flatten(startingStates.concat(tuple.initialState)))
}

var epsilonTraverser = function(transitionFunction,initialState){
	var addStatesWithEpsiloneStates = addingStateInEpsilone(transitionFunction)
	var compareStates = initialState;
	var currentInitialState = lodash.union(lodash.flatten(initialState.map(addStatesWithEpsiloneStates)))
	if (currentInitialState.length == compareStates.length)
		return initialState
	return epsilonTraverser(transitionFunction, currentInitialState)
}

var getCurrentStates = function(transitionFunction, alphabet){
	return function(currentState){
		if(isTransitionerValidForAlphabet(transitionFunction, currentState, alphabet)){
			var states = transitionFunction[currentState][alphabet]
			return lodash.union(states.concat(epsilonTraverser(transitionFunction, states)))
		}
	}
}

var isTransitionerValidForAlphabet = function(transitionFunction, currentState, alphabet){
	return transitionFunction[currentState] && transitionFunction[currentState][alphabet]
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
	return lodash.union(lodash.flattenDeep(states.map(addStatesWithEpsiloneStates)))
}
var addingStateInEpsilone = function(transitionFunction){
	return function(state){
		return (isTransitionerValidForAlphabet(transitionFunction, state, "e")) ? 
		transitionFunction[state]["e"].concat(state) : state;
	}
}