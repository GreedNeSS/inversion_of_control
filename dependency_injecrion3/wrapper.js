'use strict';

const fs = require('fs');

const wrapFunction = (key, fn) => {
	console.log(`Wrap function: ${key}`);
	return (...args) => {
		const log = `WrapFunction: ${key}, Date: ${new Date().toString()}\n`;
		let isRecorded = false;
		if (args.length > 0) {
			let callback = args[args.length - 1];
			if (typeof callback === 'function') {
				isRecorded = true;
				args[args.length - 1] = (...args) => {
					fs.appendFile('log.txt', log, 'utf8', err => {
						if (err) console.log(err.message);
					});
					console.log('dsg');
					callback(...args);
				};
			} else {
				callback = null;
			}
		}
		if (!isRecorded) {
			fs.appendFile('log.txt', log, 'utf8', err => {
				if (err) console.log(err.message);
			});
		}
		const result = fn(...args);
		return result;
	};
};

const cloneInterface = anInterface => {
	const clone = {};
	for (const key in anInterface) {
		const fn = anInterface[key];
		clone[key] = wrapFunction(key, fn);
	}
	return clone;
};

module.exports = { cloneInterface, wrapFunction };