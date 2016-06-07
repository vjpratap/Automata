var assert = require("chai").assert;
var nfaGenerator = require("../src/dfaGenerator.js").generators.nfaGenerator;

var touple = {
	"setOfState": ["q1","q2"], 
	"alphabet": [0,1], 
	"transitionFunction": {
		"q1": {
			0:["q1"],
			1:["q1","q2"]
		}, 
		"q2": {
			0:[], 
			1:[]
		}
	}, 
	"initialState": ["q1"], 
	"finalState": ["q2"]
}
var toupleforContaining00Or11 = {
	"alphabet"	: [0,1],
	"initialState"	: ["q1"],
	"finalState"	: ["q4"],
	"setOfState"	: ["q1","q2","q3","q4"],
	"transitionFunction"	: {
		"q1" : {
			0:["q1","q2"],
			1:["q1","q3"]
		},
		"q2" : {
			0:["q4"],
			1:[]
		},
		"q3" : {
			0:[],
			1:["q4"]
		},
		"q4" : {
			0:["q4"],
			1:["q4"]
		}

	}
}

describe("nfaGenerator test", function() {
	describe("string that end with 1", function() {
		var endsWith1 = nfaGenerator(touple)
		it("for string 1001", function() {
			assert.isTrue(endsWith1("1001"))
		})
		it("for string 10010", function() {
			assert.isFalse(endsWith1("10010"))
		})
	})
	describe("string that contains 11 or 00", function() {
		var stringContainsDoubleZeroOrDoubleOne = nfaGenerator(toupleforContaining00Or11)
		it("for the string 1001", function() {
			assert.isTrue(stringContainsDoubleZeroOrDoubleOne("1001"))
		})
		it("for string 00", function() {
			assert.isTrue(stringContainsDoubleZeroOrDoubleOne("010110"))
		})
		it("for string 11", function() {
			assert.isTrue(stringContainsDoubleZeroOrDoubleOne("11"))
		})
		it("for string 0101010", function() {
			assert.isFalse(stringContainsDoubleZeroOrDoubleOne("0101010"))
		})
		it("it should fail when string doesn't belong to alphabet set", function(){
			assert.isFalse(stringContainsDoubleZeroOrDoubleOne("1021"))
		})
	})
})

