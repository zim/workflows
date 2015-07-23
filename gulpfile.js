var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    concat = require('gulp-concat');

// ALL THE METHODS SND PLUGINS THAT COME WITH GULP WILL VE ASSIGNED TO THIS VARIABLE

// SO WE CAN USE THIS GULP VARIABLE TO ISSUE COMMANDS
// GULP WORKS BY ALLOWING YOU TO CREATE DIFFERENT TASKS (THINGS WE NEED TO GET DONE)
// AND WE CREATE A TASK BY USING THE TASK METHOD. SO SINCE WE PLACE ALL THE THE METHODS INTO THIS GULP VARIABLE WE
// TELL GULP TO USE THE TASK METHOD, AND CREATE A TASK, SAY FOR INSTANCE 'log' OR WHATEVER.

gulp.task('log', function() {
  gutil.log('Workflows are awesome');
});

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;


env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];

jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];


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
  .pipe(browserify())
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(gulp.dest(outputDir + 'js'))
  .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
  .pipe(compass({
    sass: 'components/sass',
    image: outputDir + 'images',
    style: sassStyle
  }))
  .on('error', gutil.log)
  .pipe(gulp.dest(outputDir + 'css'))
  .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/js/*.json', ['json']);
  gulp.watch('builds/development/images/**/*.*', ['images']);

});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  })
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
  .pipe(gulpif(env === 'production', minifyHTML()))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
  .pipe(connect.reload())
});

gulp.task('images', function() {
  gulp.src('builds/development/images/**/*.*')
  .pipe(gulpif(env === 'production', imagemin({
    progressive: true,
    svgoPlugins: [{ removeViewBox: false}],
    use: [pngcrush()]
  })))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
});

gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
  .pipe(gulpif(env === 'production', jsonminify()))
  .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
  .pipe(connect.reload())
});

gulp.task('default', ['html','json', 'coffee', 'js', 'compass', 'images', 'connect', 'watch'], function() {

});
