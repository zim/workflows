$ = require 'jquery'

do fill = (item = 'The most creative minds in Artsy Doodah!') ->
  $('.tagline').append "#{item}"
fill
