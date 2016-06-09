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

var toupleForStringStartsAndEndsWithDoubleOneAndEvenNumberOfZerosInMiddle = {
	"setOfState": ["q1","q2","q3","q4","q5","q6"],
	"alphabet" : [0,1],
	"transitionFunction" : {
		"q1": {
			0: "q6",
			1: "q2"
		},
		"q2": {
			0: "q6",
			1: "q3"
		},
		"q3": {
			0: "q4",
			1: "q3"
		},
		"q4": {
			0: "q5",
			1: "q6"
		},
		"q5": {
			0: "q4",
			1: "q2"
		},
		"q6": {
			0: "q6",
			1: "q6"
		}
	},
	"initialState": "q1",
	"finalState" :["q3"]
}

describe("dfaGenerator test", function() {
	describe("string that end with 1", function() {
		var endsWith1 = generators.dfaGenerator(toupleForStringEndsWithOne)
		it("it should pass for string 001", function() {
			assert.isTrue(endsWith1("001"))
		})
		it("it should fail for string 100", function(){
			assert.isFalse(endsWith1("100"))
		})
		it("should pass for string 1001", function(){
			assert.isTrue(endsWith1("1001"))
		})
		it("it should fail when string doesn't belong to alphabet set", function(){
			assert.isFalse(endsWith1("1021"))
		})
	})
	describe("string lenght is divisible by two and three", function(){
		var divisibleByTwoAndThree = generators.dfaGenerator(toupleForStringThatLenghtIsDivisibleByTwoAndThree)
		it("it should pass for string that lenght is six", function(){
			assert.isTrue(divisibleByTwoAndThree("000000"))
		})
		it("it should fail for string that lenght is five", function(){
			assert.isFalse(divisibleByTwoAndThree("00000"))
		})
		it("it should fail when string doesn't belong to alphabet set", function(){
			assert.isFalse(divisibleByTwoAndThree("11111"))
		})
	})
	describe("string starts with double one ends with double one and even number of zeros in middle", function(){
		var startsAndEndsWithDoubleOneAndEvenNumberOfZerosInMiddle = generators.dfaGenerator(toupleForStringStartsAndEndsWithDoubleOneAndEvenNumberOfZerosInMiddle)
		it("it should pass for string 110011", function(){
			assert.isTrue(startsAndEndsWithDoubleOneAndEvenNumberOfZerosInMiddle("110011"))
		})
		it("it should pass for string 11001111", function(){
			assert.isTrue(startsAndEndsWithDoubleOneAndEvenNumberOfZerosInMiddle("11001111"))
		})
		it("it should fail for when the number of zeros are odd 110001111", function(){
			assert.isFalse(startsAndEndsWithDoubleOneAndEvenNumberOfZerosInMiddle("110001111"))
		})
		it("it should fail string ends with single one 110001111001", function(){
			assert.isFalse(startsAndEndsWithDoubleOneAndEvenNumberOfZerosInMiddle("110001111001"))
		})
		it("it should pass when string starts with single one 1000011", function(){
			assert.isFalse(startsAndEndsWithDoubleOneAndEvenNumberOfZerosInMiddle("1000011"))
		})
		it("it should fail when string doesn't belong to alphabet set 110002111", function(){
			assert.isFalse(startsAndEndsWithDoubleOneAndEvenNumberOfZerosInMiddle("110002111"))
		})
	})
})

