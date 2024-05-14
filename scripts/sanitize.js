export default (text) => {
  return text
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('QUOTE_BEGIN', "<blockquote class='quote'>")
    .replaceAll('QUOTE_END', '</blockquote>');
};
