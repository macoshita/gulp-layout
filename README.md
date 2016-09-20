# gulp-layout [![Build Status](https://travis-ci.org/macoshita/gulp-layout.svg?branch=master)](https://travis-ci.org/macoshita/gulp-layout)

Gulp plugin to switch layout files for each content (like a [jekyll](http://jekyllrb.com/)). We can use many template engines thanks to [consolidate.js](https://github.com/tj/consolidate.js).

## Install

```
npm install gulp-layout
```

## Usage

### Simple task to build html

```javascript
var gulp = require('gulp');
var layout = require('gulp-layout');

gulp.task('build', function() {
  return gulp.src('./src/test.html')
    .pipe(layout({
      title: 'Hello World',
      layout: 'post.pug'
    }))
    .pipe(gulp.dest('./dist'));
});
```

(src) test.html:

```html
<p>gulp</p>
```

(layout) post.pug:

```pug
h1= title
|!= contents
```

(dist) test.html:

```html
<h1>Hello World</h1><p>gulp</p>
```

### Like a jekyll

Use [gulp-markdown](https://github.com/sindresorhus/gulp-markdown) & [gulp-front-matter](https://github.com/lmtm/gulp-front-matter) (thanks!)

```javascript
var gulp = require('gulp');
var frontMatter = require('gulp-front-matter');
var markdown = require('gulp-markdown');
var layout = require('gulp-layout');

gulp.task('build', function() {
  return gulp.src('./src/**/*.md')
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      return file.frontMatter;
    }))
    .pipe(gulp.dest('./dist'));
});
```

(src) test.md:

```md
---
title: Hello World
layout: post.pug
---

gulp
```

(layout) post.pug:

```pug
doctype html
html
  head
   title= title
  body
    != contents
```

(dist) test.html:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <p>gulp</p>
  </body>
</html>
```

More example: see `examples`.

## Options

### layout(options)

- `options` {Object}
  - `layout` {String}: File path of template. If not set `engine`, select the template engine by this extension.
  - `engine` {String}: Name of template engine. Use this option if cannot decide the engine by `layout`. For example, the extension of `layout` is `.html`

### layout(func)

- `func` {Function}: Please return `options`. It will be called with the file.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
