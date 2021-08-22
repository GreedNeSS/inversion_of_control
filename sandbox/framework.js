'use strict';

const PARSING_TIMEOUT = 1000;
const EXECUTION_TIMEOUT = 5000;

const fs = require('fs');
const vm = require('vm');
const timers = require('timers');
const events = require('events');

const context = {
	module: {},
	console,
	require: name => {
		if (name === 'fs') {
			console.log('Module fs is restricted');
			return null;
		}
		return require(name);
	}
};

context.global = context;
context.name = 'sandbox';
const sandbox = vm.createContext(context);

const api = { timers, events };

const fileName = './application.js';
fs.readFile(fileName, 'utf8', (err, src) => {
	if (err) {
		console.log(err.message);
	}

	// Wrap source to lambda, inject api
	src = `api => {${src}};`;
	console.log(src);

	let script;
	try {
		script = new vm.Script(src, { timeout: PARSING_TIMEOUT });
	} catch (e) {
		console.dir(e);
		console.log('Parsing timeout');
		process.exit(1);
	}

	try {
		const f = script.runInNewContext(sandbox, { timeout: EXECUTION_TIMEOUT });
		f(api);
		const exported = sandbox.module.exports;
		console.dir({ exported });
		exported();
	} catch (e) {
		console.dir(e);
		console.log('Execution timeout');
		process.exit(1);
	}
});

process.on('uncaughtException', err => {
	console.log('Unhandled exception: ' + err);
});