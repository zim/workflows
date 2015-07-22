var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat');

// ALL THE METHODS SND PLUGINS THAT COME WITH GULP WILL VE ASSIGNED TO THIS VARIABLE

// SO WE CAN USE THIS GULP VARIABLE TO ISSUE COMMANDS
// GULP WORKS BY ALLOWING YOU TO CREATE DIFFERENT TASKS (THINGS WE NEED TO GET DONE)
// AND WE CREATE A TASK BY USING THE TASK METHOD. SO SINCE WE PLACE ALL THE THE METHODS INTO THIS GULP VARIABLE WE
// TELL GULP TO USE THE TASK METHOD, AND CREATE A TASK, SAY FOR INSTANCE 'log' OR WHATEVER.

gulp.task('log', function() {
  gutil.log('Workflows are awesome');
});

var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

// ONE OF THE CORE PRINCIPLES BEHIND GULP IS THAT YOU TAKE A PIECE OF INFORMATION AND PASS THAT THROUGH A PLUGIN/FILTER
// AND THEN THE OUTPUT OF THAT PLUGIN BECOMES THE INPUT OF A NEW PLUGIN.
// THE METHOD USED FOR THIS IS CALLED PIPE, AND IT IS PART OF WHAT MAKES GULP EASY TO UNDERSTAND AND USE

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
  .pipe(concat('script.js'))
  .pipe(gulp.dest('builds/development/js'))
});
