var $, fill;

$ = require('jquery');

(fill = function(item) {
  return $('.tagline').append("" + item);
})('The most creative minds in Artsy Doooooooooooozzydoooooooooh!');

fill;
