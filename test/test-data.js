
//global variable, for html page, refer tpsvr @ npm.
delay_set_timeout = require("../delay-set-timeout.js");

module.exports = {

	"delay_set_timeout()": function (done) {
		var tmid = null;	//timer-id
		var ret = [];

		//delaySetTimeout(callback / [eventEmitter, eventName], delay, tmidLast, maxDelay /*,arg1, arg2, ...*/)

		tmid = delay_set_timeout(		//get tmid at (start+0)
			function () { ret.push(1); },
			201,	//plan at (start+201), but cancelled by 105.
			tmid,
			402		//final-time is (start+402)
		);

		setTimeout(
			function () {
				tmid = delay_set_timeout(		//get new tmid at (start+105), cancel 201
					function () {
						ret.push(2);	//run at (start+105+103)
					},

					//plan at (start+105+(N=103));
					//here if (start+105+N) is larger than final-time, it will be shrinked to final-time.
					103,

					tmid,	//old timer-id is required
					404		//not work, (start+105+404)>(start+402), final-time is still (start+402)
				);
			},
			105		//to cancel 201
		);

		setTimeout(
			function () {
				tmid = delay_set_timeout(		//get new tmid at (start+308), a new timer, because (start+105+103) is finished
					function () {
						ret.push(3);		//run at (start+308+106)

						console.log(ret.join(","));
						done(!(
							ret.join(",") === "2,3"
						))
					},
					106,	//plan at (start+308+106)
					tmid,		//not work, the previous is finished
					407		//new max-delay
				);
			},
			308
		);

	},

	"delay_set_timeout()/emit": function (done) {
		if (typeof window !== "undefined") throw "disable for browser";

		var tmid = null;
		var ret = [], cnt = 0;

		var EventEmitter = require('events');
		const myEmitter = new EventEmitter();
		myEmitter.on('test', function firstListener(arg1) {
			ret.push(arg1);

			cnt++;
			if (cnt >= 2) {
				console.log(ret.join(","));
				done(!(
					ret.join(",") === "b,c"
				))
			}
		});

		tmid = delay_set_timeout(		//get tmid at (start+0)
			[myEmitter, "test"],
			201,	//plan at (start+201), but cancelled by 105.
			tmid,
			402,		//final-time is (start+402)
			"a"		//as emitting arguments, refer nodejs/emitter.emit()
		);

		setTimeout(
			function () {
				tmid = delay_set_timeout(		//get new tmid at (start+105), cancel 201
					[myEmitter, "test"],		//emit at (start+105+103)
					103,	//plan at (start+105+103)
					tmid,	//old timer-id is required
					404,		//not work, (start+105+404)>(start+402), final-time is still (start+402)
					"b"
				);
			},
			105		//to cancel 201
		);

		setTimeout(
			function () {
				tmid = delay_set_timeout(		//get new tmid at (start+308), a new timer, because (start+105+103) is finished
					[myEmitter, "test"],			//emit at (start+308+106)
					106,	//plan at (start+308+106)
					tmid,		//not work, the previous is finished
					407,		//new max-delay
					"c"
				);
			},
			308
		);

	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('delay_set_timeout', function () { for (var i in module.exports) { it(i, module.exports[i]).timeout(5000); } });
