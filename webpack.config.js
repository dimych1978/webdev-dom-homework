/*global module */
/*eslint no-undef: "error"*/

module.exports = {
  entry: './scripts/main.js', // Входной файл, в котором мы пишем свой код
  output: {
    filename: 'main.js', // Выходной файл, который подключаем к HTML
    // Обратите внимание, сохранится он по пути "./dist/main.js"
  },
};
