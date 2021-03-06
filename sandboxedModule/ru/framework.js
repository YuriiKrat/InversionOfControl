// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm');
    util = require ('util');

// Задания 4-5
var newConsole = {};
newConsole.log = function(message) {
	fs.appendFile('file.txt', fileName + " " + new Date() + " " + message + '\n', 
		(err) => {
			if (err)
				throw err;
	});
	console.log(fileName + " " + new Date() + " " + message);
}

//Задание 6
var newRequire = function(module) {
	fs.appendFile('file.txt', new Date() + " " + module + '\n', 
		(err) => {
			if (err)
				throw err;
	});
	return require(module);
}

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {}, console: newConsole, setTimeout: setTimeout, 
				setInterval: setInterval, util: util, require: newRequire,
				inspect: util.inspect };
context.global = context;
var sandbox = vm.createContext(context);

var keys = {};
for (var tmp in sandbox)
	keys[tmp] = sandbox[tmp];

// Читаем исходный код приложения из файла
// Задание 3
var fileName = process.argv[2] == null?'./application.js':process.argv[2];
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  if (err)
  	throw err;

  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  
  //Задание 10
  console.log("----------TASK 10----------");
  var newKeys = {};
	for (var tmp in sandbox)
		newKeys[tmp] = sandbox[tmp];

	console.log("New keys:");
	for (var tmp in newKeys) {
		if (!(tmp in keys))
			console.log(tmp);
	}

	console.log("Deleted keys:");
	for (var tmp in keys) {
		if (!(tmp in newKeys))
			console.log(tmp);
	}

  //Задание 7
  console.log("----------TASK 7----------");
  for (var tmp in sandbox.module.exports) {
  	console.log(tmp + " -> " + typeof sandbox.module.exports[tmp]);
	}

	//Задание 8
	console.log("----------TASK 8----------");
	console.log(sandbox.module.exports.func.toString());
	console.log('Amount of arguments: '+
        sandbox.module.exports.func.toString().
        replace(/.+\(/, '').replace(/\)[^]+/, '').
        split(/, */).length);

  sandbox.module.exports();
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.

});
