'use strict';

const moduleName = {};
module.exports = moduleName;

const privatProperty = 'Privat variable value in Module1';

const privatFunction = () => {
	console.log('Output from private function of Module1');
}

privatFunction(privatProperty);

moduleName.publicProperty = 'Public property value in Module1';

moduleName.publicFunction = () => {
	console.log('Output from public function of Module1');
};