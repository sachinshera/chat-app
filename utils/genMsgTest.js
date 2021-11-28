const genmsg = require("./genmsg");
const expect = require("expect");

describe("generate message",()=>{
	it("should  generate correct object",()=>{
		let from = "sachin test",text = "hellow how are you",
		message = genMsg(from,text);
		expect(typeof genMsg.date).tobe("number");
	})

})