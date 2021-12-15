
// delay-set-timeout @ npm, call setTimeout() with min/max delay.

var mapTimer = new Map();	//map tmid to final-time	//tmid from nodejs is not a number

var clearFinalTime = function (tmidLast) {
	if (!mapTimer.has(tmidLast)) return;

	var finalTime = mapTimer.get(tmidLast);
	mapTimer.delete(tmidLast);
	return finalTime;
}

//delaySetTimeout(callback / [eventEmitter, eventName], delay, tmidLast, maxDelay /*,arg1, arg2, ...*/)
var delaySetTimeout = function (callback, delay, tmidLast, maxDelay /*,arg1, arg2, ...*/) {
	//arguments for nodejs event emitter
	var eventEmitter, eventName;
	if (callback instanceof Array) {
		eventEmitter = callback[0];
		eventName = callback[1];
		if (!eventName) throw "delaySetTimeout emitter fail, event name empty.";
	}

	//final-time from last tmid
	var finalTime;
	if (tmidLast) {
		finalTime = clearFinalTime(tmidLast);
		clearTimeout(tmidLast);
	}

	//final-time from maxDelay
	if (maxDelay) {
		var newFinalTime = (new Date()).getTime() + maxDelay;
		//nearer final-time will replace the old final-time
		if (!finalTime || newFinalTime < finalTime) finalTime = newFinalTime;
	}

	//final delay
	if (finalTime) {
		var finalDelay = finalTime - (new Date()).getTime();
		if (finalDelay < delay) delay = finalDelay;
	}

	//setTimeout
	var args = (arguments.length > 4) ? Array.prototype.slice.call(arguments, 4) : null;
	if (eventEmitter) { (args || (args = [])).unshift(eventName); }
	//console.log(args);

	//console.log("delay-set-timeout delay: " + delay);
	tmidLast = setTimeout(
		function () {
			clearFinalTime(tmidLast);

			//console.log("call delay-set-timeout callback");
			if (eventEmitter) {
				//nodejs event emitter
				eventEmitter.emit.apply(eventEmitter, args);
			}
			else {
				args ? callback.apply(null, args) : callback();
			}
		},
		delay
	);

	if (finalTime) mapTimer.set(tmidLast, finalTime);	//save final-time for later calling

	return tmidLast;	//return same as setTimeout()
}

module.exports = exports = delaySetTimeout;

exports.clearFinalTime = clearFinalTime;
