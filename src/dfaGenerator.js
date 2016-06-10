var generators = {}
exports.generators = generators;
var lodash = require('lodash')

var dfaTransformer = function(transitionFunction){
	return function(currentState, alphabet){
		return transitionFunction[currentState][alphabet];
	}
}

var nfaTransformer = function(transitionFunction){
	return function(currentStates, alphabet){
		var nextStates = getNextStateOfMachine(transitionFunction, alphabet)
		var states = currentStates.map(nextStates)
		states = lodash.compact(lodash.flattenDeep(states))
		return states && epsilonTraverser(transitionFunction, states)
	}
}

generators.dfaGenerator = function(tuple){
	return function(string){
		var charString = string.split("");
		var dfaReducer = dfaTransformer(tuple.transitionFunction)
		var finalStateOfString = charString.reduce(dfaReducer, tuple.initialState)
		return lodash.includes(tuple.finalState, finalStateOfString)	
	} 
}

generators.nfaGenerator = function(tuple){
	return function(string) {
		var alphabets = string.split("")
		var initialState = epsilonTraverser(tuple.transitionFunction, [tuple.initialState])
		var nfaReducer = nfaTransformer(tuple.transitionFunction)
		var finalStatesOfMachine = alphabets.reduce(nfaReducer, initialState);
		return lodash.intersection(finalStatesOfMachine, tuple.finalState).length > 0
	}
}

var getNextStateOfMachine = function(transitionFunction, alphabet){
	return function(state){
		return transitionFunction[state] && transitionFunction[state][alphabet]
	}
}

var epsilonTraverser = function(transitionFunction,initialState){
	var getNextEpsiloneState = getNextStateOfMachine(transitionFunction, "e")
	var epsiloneState = initialState.map(getNextEpsiloneState)
	epsiloneState = lodash.compact(lodash.flatten(epsiloneState))
	if(checkArrayIsSubset(epsiloneState, initialState))
		return initialState
	return epsilonTraverser(transitionFunction, lodash.union(initialState, epsiloneState))
}

var checkArrayIsSubset = function(subSet, superSet){
	return subSet.every(function(state){
		return superSet.indexOf(state) >= 0
	})
}