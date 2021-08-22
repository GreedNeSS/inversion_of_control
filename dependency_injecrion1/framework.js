'use strict';

// Example showing us how the framework creates an environment (sandbox) for
// application runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core librueries
const api = {};
api.fs = require('fs');
api.vm = require('vm');
api.sandboxedFs = require('sandboxed-fs');

const { cloneInterface, wrapFunction } = require('./wrapper');

const log = s => {
	console.log('Prints something from sandbox');
	console.log(s);
};

const safeRequire = name => {
	if (name === 'fs') {
		const msg = 'You dont have access to fs API';
		console.log(msg);
		return new Error(msg);
	} else {
		return require('name');
	}
};

const runSandboxed = path => {
	const filename = path + '/main.js';
	const context = {
		module: {},
		require: safeRequire,
		api: {
			console: { log },
			timers: {
				setTimeout: wrapFunction('setTimeout', setTimeout)
			},
			fs: cloneInterface(api.sandboxedFs.bind(path))
		}
	};
	context.global = context;
	const sandbox = api.vm.createContext(context);
	// Read an application source code from the file
	api.fs.readFile(filename, (err, src) => {
		// We need to handle errors here

		// Run an application in sandboxed content
		const script = new api.vm.Script(src, filename);
		const f = script.runInNewContext(sandbox);
		if (f) f();

		// We can access a link to exported interface from sandbox.module.exports
		// to execute, save to the cache, print to console, etc.
	});
};

runSandboxed('./applications/application1');
runSandboxed('./applications/application2');