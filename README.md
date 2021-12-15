# delay-set-timeout
Call setTimeout() with min/max delay.

* If an old timer is waiting, before min-delay, a new calling will cancel the old one;
* If there is no more new calling, the last timer will be executed after min-delay, but certainly before the max-delay, or before the earliest one of multiple max-delays;

# Install
```
npm install delay-set-timeout
```

# Usage & Api
```javascript

var delay_set_timeout = require("delay-set-timeout");

var tmid = null;	//timer-id
var ret = [];

//delay_set_timeout(callback / [eventEmitter, eventName], delay, tmidLast, maxDelay /*,arg1, arg2, ...*/)

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
				//ret.join(",") === "2,3"
			},
			106,	//plan at (start+308+106)
			tmid,		//not work, the previous is finished
			407		//new max-delay
		);
	},
	308
);

```
