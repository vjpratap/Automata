var assert = require("chai").assert;
var nfaToDfaConverter = require("../src/dfaGenerator.js").generators.nfaToDfaConverter;

var touple = {
	"setOfState": ["q3","q1","q2"], 
	"alphabet": ["0","1"], 
	"transitionFunction": {
		"q3":{
			"e" :["q1"],
		},
		"q1": {
			"0":["q1"],
			"1":["q1","q2"]
		}, 
		"q2": {
		}
	}, 
	"initialState": "q3", 
	"finalState": ["q2"]
}

var tuple = {
		"setOfState" : ["q1","q3","q2","q5","q6","q4"],
		"alphabet" : ["0","1"],
			"initialState":"q1",
		"finalState":["q7","q6"],
		"transitionFunction": {
			"q1":{
				"e":["q2","q4"]
			},
			"q2":{
				"0":["q2"],
				"e":["q3"]
			},
			"q3":{
				"1":["q3"],
				"e":["q6"]
			},
			"q4":{
				"1":["q4"],
				"e":["q5"]
			},
			"q5":{
				"0":["q5"],
				"e":["q7"]
			}
		}
}

describe("nfaToDfaConverter Tests", function(){
	describe("string ends with 1", function(){
		var endsWithOne = nfaToDfaConverter(tuple)
		it("it should pass when string ends with one 1001", function() {
			assert.isTrue(endsWithOne("101"))
		})
	})
})
