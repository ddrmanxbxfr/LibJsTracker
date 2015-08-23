'use strict';
var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
  browserify({
    entries: './player.js',
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('output.js'))
  .pipe(gulp.dest('./dist'));
});


gulp.task("watch", function(){
  gulp.watch('modules/**/*.js', ['default'])
});
