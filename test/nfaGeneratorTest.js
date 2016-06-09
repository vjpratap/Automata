var assert = require("chai").assert;
var nfaGenerator = require("../src/dfaGenerator.js").generators.nfaGenerator;

var touple = {
	"setOfState": ["q3","q1","q2"], 
	"alphabet": [0,1], 
	"transitionFunction": {
		"q3":{
			"e" :["q1"],
		},
		"q1": {
			0:["q1"],
			1:["q1","q2"]
		}, 
		"q2": {
		}
	}, 
	"initialState": "q1", 
	"finalState": ["q2"]
}
var toupleforContaining00Or11 = {
	"alphabet"	: [0,1],
	"initialState"	: "q1",
	"finalState"	: ["q4"],
	"setOfState"	: ["q1","q2","q3","q4"],
	"transitionFunction"	: {
		"q1" : {
			0:["q1","q2"],
			1:["q1","q3"]
		},
		"q2" : {
			0:["q4"],
		},
		"q3" : {
			1:["q4"]
		},
		"q4" : {
			0:["q4"],
			1:["q4"]
		}
	}
}

var toupleForStringThatLenghtIsDivisibleByTwoAndThree = {
	"alphabet"	: [0],
	"initialState"	: "q1",
	"finalState"	: ["q3", "q6"],
	"setOfState"	: ["q1","q2","q3","q4", "q5", "q5"],
	"transitionFunction"	: {
		"q1" : {
			0:["q2","q4"]
		},
		"q2" : {
			0:["q3"]
		},
		"q3" : {
			0:["q2"]
		},
		"q4" : {
			0:["q5"]
		},
		"q5" : {
			0:["q6"]
		},
		"q6" : {
			0:["q4"]
		}

	}
}

var toupleForStringThatContainEvenNumberOfZerosOrOne = {
	"alphabet"	: [0,1],
	"initialState"	: "q1",
	"finalState"	: ["q4", "q2"],
	"setOfState"	: ["q1","q2","q3","q4","q5"],
	"transitionFunction"	: {
		"q1" : {
			"e": ["q2", "q4"],
		},
		"q2" : {
			0:["q3"],
			1:["q2"]
		},
		"q3" : {
			0:["q2"],
			1:["q3"]
		},
		"q4" : {
			0:["q4"],
			1:["q5"]
		},
		"q5" : {
			0:["q5"],
			1:["q4"]
		}

	}
}

describe("nfaGenerator test", function() {
	describe("string that end with 1", function() {
		var endsWith1 = nfaGenerator(touple)
		it("it should pass when string ends with one 1001", function() {
			assert.isTrue(endsWith1("1001"))
		})
		it("it should fail when string is not ends with one 10010", function() {
			assert.isFalse(endsWith1("10010"))
		})
		it("it should fail when string doesn't belong to alphabet set", function(){
			assert.isFalse(endsWith1("1021"))
		})
	})
	describe("string that contains 11 or 00", function() {
		var stringContainsDoubleZeroOrDoubleOne = nfaGenerator(toupleforContaining00Or11)
		it("it should pass when string has two zeros continueslly 1001", function() {
			assert.isTrue(stringContainsDoubleZeroOrDoubleOne("1001"))
		})
		it("it should pass for 00", function() {
			assert.isTrue(stringContainsDoubleZeroOrDoubleOne("010110"))
		})
		it("it should pass for 11", function() {
			assert.isTrue(stringContainsDoubleZeroOrDoubleOne("11"))
		})
		it("it should fail when there is no zeros and ones it sequence 0101010", function() {
			assert.isFalse(stringContainsDoubleZeroOrDoubleOne("0101010"))
		})
		it("it should fail when string doesn't belong to alphabet set", function(){
			assert.isFalse(stringContainsDoubleZeroOrDoubleOne("1021"))
		})
	})
	describe("string lenght is divisible by two and three", function(){
		var divisibleByTwoAndThree = nfaGenerator(toupleForStringThatLenghtIsDivisibleByTwoAndThree)
		it("it should pass for string that lenght is six", function(){
			assert.isTrue(divisibleByTwoAndThree("000000"))
		})
		it("it should fail for string that lenght is five", function(){
			assert.isFalse(divisibleByTwoAndThree("00000"))
		})
		it("it should fail for string that lenght is nine", function(){
			assert.isTrue(divisibleByTwoAndThree("000000000"))
		})
		it("it should pass when string doesn't belong to alphabet set", function(){
			assert.isFalse(divisibleByTwoAndThree("11111"))
		})
	})
	describe("string that has even number of zeros of one in middle", function(){
		var evenNumberInMiddle = nfaGenerator(toupleForStringThatContainEvenNumberOfZerosOrOne)
		it("should Pass for string that has for zeros in middle 100001", function(){
			assert.isTrue(evenNumberInMiddle("100001"))
		})
		it("should fail for string that has for one in middle 1111000001", function(){
			assert.isFalse(evenNumberInMiddle("1111000001"))
		})
		it("should pass for string that has for one in middle 00001", function(){
			assert.isTrue(evenNumberInMiddle("00001"))
		})
	})
})

