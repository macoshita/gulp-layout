var gulp = require('gulp');
var del = require('del');
var frontMatter = require('gulp-front-matter');
var markdown = require('gulp-markdown');
var layout = require('../');

// clean dist
gulp.task('clean', function(cb) {
  del('dist', cb);
});

// Simple Task
gulp.task('example1', function() {
  return gulp.src('./src/example1.html')
    .pipe(layout({
      title: 'Hello World',
      layout: 'post.jade'
    }))
    .pipe(gulp.dest('./dist'));
});

// Switch layout files for each content (set properties in the front-matter)
// - example2-1: using post.jade
// - example2-2: using post.ejs
// - example2-3: using post.html ('engine' property = 'ejs')
// If you will use gulp-front-matter, this example is useful.
gulp.task('example2', function() {
  return gulp.src('./src/example2-*.html')
    .pipe(frontMatter())
    .pipe(layout(function(file) {
      return file.frontMatter;
    }))
    .pipe(gulp.dest('./dist'));
});

// If you will write a content by markdown (set properties in the front-matter):
gulp.task('example3', function() {
  return gulp.src('./src/example3.md')
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      return file.frontMatter;
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['clean', 'example1', 'example2', 'example3']);
