var generators = {}
exports.generators = generators;
var lodash = require('lodash')

var dfaTransformer = function(transitionFunction){
	return function(currentState, alphabet){
		return transitionFunction[currentState] && transitionFunction[currentState][alphabet];
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

generators.nfaToDfaConverter = function(tuple){
	return function(string){
		var newDfaTuple = getNewTupleForDfa(tuple)
		var dfaConverter = generators.dfaGenerator(newDfaTuple)
		return dfaConverter(string)
	}
}

var getNewTupleForDfa = function(tuple){
	var initialState = epsilonTraverser(tuple.transitionFunction, [tuple.initialState]).join(",") 
	var nfaTransitionFunction = eNfaToNfa(tuple)
	var dfaTransitionalFunction = transitionTable(tuple, [initialState], nfaTransitionFunction, {})["transitionFunction"]
	var newDfaTuple = {}
	newDfaTuple.initialState = initialState
	newDfaTuple.setOfState = transitionTable(tuple, [initialState], nfaTransitionFunction, {})["setOfState"]
	newDfaTuple.alphabet = tuple.alphabet
	newDfaTuple.finalState = getFinalStates(tuple.finalState, Object.keys(dfaTransitionalFunction))
	newDfaTuple.transitionFunction = dfaTransitionalFunction
	return newDfaTuple
}

var getFinalStates = function(finalState, allStates){
	return allStates.filter(function(state){
		return lodash.intersection(finalState, state.split(",")).length > 0
	})
}

var removeEpsilone = function(alphabet, nfaTransitionTable, transitionFunction){
	return function(state){
		nfaTransitionTable[state] = {}
		alphabet.forEach(function(character){
			nfaTransitionTable[state][character] = nfaStateWithoutEpsilone(transitionFunction, state, character)
		})
	}
}

var eNfaToNfa = function(tuple){
	var nfaTransitionTable = {}
	var addStatesWithValueInNfaTableWithoutEpsilone = removeEpsilone(tuple.alphabet, nfaTransitionTable,tuple.transitionFunction)
	tuple.setOfState.forEach(addStatesWithValueInNfaTableWithoutEpsilone)
	return nfaTransitionTable
}

var nfaStateWithoutEpsilone = function(transitionFunction, state, character){
	var nextStates = getNextStateOfMachine(transitionFunction, character)
	var newStates = epsilonTraverser(transitionFunction, [state])
	newStates = newStates.map(nextStates)
	newStates = lodash.flattenDeep(lodash.compact(newStates))
	var epsilonTraverserForEachStates = stateEpsiloneTraverser(transitionFunction)
	return lodash.compact(lodash.flattenDeep(newStates.map(epsilonTraverserForEachStates)))
}

var addStatesWithValueInDfaTable = function(tuple, withoutEpsiloneNfa,setOfState,dfaTransitional){
	return function(state){
		dfaTransitional[state] = {}
		tuple.alphabet.forEach(function(character){
			dfaTransitional[state][character] = getStateForCharacter(state.split(","), withoutEpsiloneNfa, character, tuple.setOfState)
			setOfState.push(dfaTransitional[state][character])
		})
	}
}

var getSetOfStatesAndDfaTransitional = function(tuple, dfaTransitional, withoutEpsiloneNfa, setOfState){
	var remainingStates = lodash.difference(setOfState, Object.keys(dfaTransitional))
	var addStatesAndFillValueInDfaTable = addStatesWithValueInDfaTable(tuple, withoutEpsiloneNfa,setOfState, dfaTransitional)
	remainingStates.forEach(addStatesAndFillValueInDfaTable)
	setOfState = lodash.union(setOfState)
	return {"transitionFunction":dfaTransitional, "setOfState":setOfState}
}

var transitionTable = function(tuple, setOfState, withoutEpsiloneNfa, dfaTransitional){
	var setOfStateAndDfaTransitional = getSetOfStatesAndDfaTransitional(tuple, dfaTransitional, withoutEpsiloneNfa,setOfState)
	setOfStates = setOfStateAndDfaTransitional["setOfState"]
	dfaTransitional = setOfStateAndDfaTransitional["transitionFunction"]
	if(checkArrayIsSubset(setOfState,Object.keys(dfaTransitional)))
		return setOfStateAndDfaTransitional
	return transitionTable(tuple, setOfState, withoutEpsiloneNfa, dfaTransitional)
}

var getStateForCharacter = function(states, withoutEpsiloneNfa, character,setOfState){
	var nextState = getNextStateOfMachine(withoutEpsiloneNfa, character)
	var stateForCharacter = states.map(nextState)
	stateForCharacter = lodash.union(lodash.flattenDeep(stateForCharacter))
	return lodash.sortBy(stateForCharacter, function(state) {return setOfState.indexOf(state)}).join(",")
}

var stateEpsiloneTraverser = function(transitionFunction){
	return function(state){
		return epsilonTraverser(transitionFunction, [state])
	}
}

var getNextStateOfMachine = function(transitionFunction, alphabet){
	return function(state){
		return transitionFunction[state] && transitionFunction[state][alphabet]
	}
}

var epsilonTraverser = function(transitionFunction,state){
	var getNextEpsiloneState = getNextStateOfMachine(transitionFunction, "e")
	var epsiloneState = state.map(getNextEpsiloneState)
	epsiloneState = lodash.compact(lodash.flatten(epsiloneState))
	if(checkArrayIsSubset(epsiloneState, state))
		return state
	return epsilonTraverser(transitionFunction, lodash.union(state, epsiloneState))
}

var checkArrayIsSubset = function(subSet, superSet){
	return lodash.difference(subSet,superSet) == 0
}