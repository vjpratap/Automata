var assert = require("chai").assert;
var generators = require("../src/dfaGenerator.js").generators;

var toupleForStringEndsWithOne = {
	"setOfState": ["q1","q2"], 
	"alphabet": [0,1], 
	"transitionFunction": {
		"q1": {
			0:"q1",
			1:"q2"
		}, 
		"q2": {
			0:"q1", 
			1: "q2"}
		}, 
	"initialState": "q1", 
	"finalState": ["q2"]
}

var toupleForStringThatLenghtIsDivisibleByTwoAndThree = {
	"setOfState": ["q1","q2","q3","q4","q5","q6","q7"], 
	"alphabet": [0], 
	"transitionFunction": {
		"q1": {
			0:"q2"
			}, 
		"q2": {
			0:"q3"
			},
		"q3": {
			0:"q4"
			}, 
		"q4": {
			0:"q5"
			},
		"q5": {
			0:"q6"
			}, 
		"q6": {
			0:"q7"
			},
		"q7" : {
			0:"q2"
			}
		}, 
	"initialState": "q1", 
	"finalState": ["q3","q4","q5","q7"]
}


describe("dfaGenerator test", function() {
	describe("string that end with 1", function() {
		var endsWith1 = generators.dfaGenerator(toupleForStringEndsWithOne)
		it("for string 001", function() {
			assert.isTrue(endsWith1("001"))
		})
		it("for string 100", function(){
			assert.isFalse(endsWith1("100"))
		})
		it("for string 1001", function(){
			assert.isTrue(endsWith1("1001"))
		})
		it("it should fail when string doesn't belong to alphabet set", function(){
			assert.isFalse(endsWith1("1021"))
		})
	})
	describe("string lenght is divisible by two and three", function(){
		var divisibleByTwoAndThree = generators.dfaGenerator(toupleForStringThatLenghtIsDivisibleByTwoAndThree)
		it("for string 000000", function(){
			assert.isTrue(divisibleByTwoAndThree("000000"))
		})
		it("for string 00000", function(){
			assert.isFalse(divisibleByTwoAndThree("00000"))
		})
		it("it should fail when string doesn't belong to alphabet set", function(){
			assert.isFalse(divisibleByTwoAndThree("11111"))
		})
	})
})

