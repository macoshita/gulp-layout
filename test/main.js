var expect = require('chai').expect;
var gutil = require('gulp-util');
var _ = require('lodash');
var layout = require('../');

var makeSrc = function(options) {
  var file = new gutil.File({
    path: "test/fixtures/entry.html",
    cwd: "test/",
    base: "test/fixtures",
    contents: new Buffer("<p>Hello</p>")
  });
  return _.assign(file, options);
};

describe('gulp-layout', function() {
  it('should throw error if not select engine', function(done) {
    var src = makeSrc();

    var myLayout = layout({
      title: 'Test',
      layout: 'test/fixtures/layout' // not select engine
    });

    myLayout.on('error', function(err) {
      expect(err).to.exist;
      expect(err.message).to.contain('Please select template engine');
      expect(err.fileName).to.equals('test/fixtures/entry.html');
      done();
    });

    myLayout.on('data', function(file) {
      done(new Error('should not write a contents'));
    });

    myLayout.write(src);
  });

  it('should throw error if engine is not exist', function(done) {
    var src = makeSrc();

    var myLayout = layout({
      title: 'Test',
      layout: 'test/fixtures/layout.not_supported_engine' // is dummy
    });

    myLayout.on('error', function(err) {
      expect(err).to.exist;
      expect(err.message).to.contain('not_supported_engine');
      expect(err.message).to.contain('not supported');
      expect(err.fileName).to.equals('test/fixtures/entry.html');
      done();
    });

    myLayout.on('data', function(file) {
      done(new Error('should not write a contents'));
    });

    myLayout.write(src);
  });

  it('should throw error if engine is not installed', function(done) {
    var src = makeSrc();

    var myLayout = layout({
      title: 'Test',
      layout: 'test/fixtures/layout.hogan' // is not installed
    });

    myLayout.on('error', function(err) {
      expect(err).to.exist;
      expect(err.message).to.contain('hogan');
      expect(err.message).to.contain('not installed');
      expect(err.fileName).to.equals('test/fixtures/entry.html');
      done();
    });

    myLayout.on('data', function(file) {
      done(new Error('should not write a contents'));
    });

    myLayout.write(src);
    myLayout.end();
  });

  it('should throw error if layout file is not exist', function(done) {
    var src = makeSrc();

    var myLayout = layout({
      title: 'Test',
      layout: 'dummy.pug' // not exist
    });

    myLayout.on('error', function(err) {
      expect(err).to.exist;
      expect(err.fileName).to.equals('test/fixtures/entry.html');
      done();
    });

    myLayout.on('data', function(file) {
      done(new Error('should not write a contents'));
    });

    myLayout.write(src);
    myLayout.end();
  });

  it('should do nothing if not set "layout"', function(done) {
    var src = makeSrc();

    var myLayout = layout({
      title: 'Test'
      // layout property is not set
    });

    myLayout.on('error', function(err) {
      expect(err).to.exist;
      done(err);
    });

    myLayout.on('data', function(file) {
      expect(file).to.exist;
      expect(file.contents).to.exist;
      var html = file.contents.toString();
      expect(html).to.contain('<p>Hello</p>');
      done();
    });

    myLayout.write(src);
    myLayout.end();
  });

  it('should use the specified template', function(done) {
    var src = makeSrc();

    var myLayout = layout({
      title: 'Test',
      layout: 'test/fixtures/layout.pug'
    });

    myLayout.on('error', function(err) {
      expect(err).to.exist;
      done(err);
    });

    myLayout.on('data', function(file) {
      expect(file).to.exist;
      expect(file.contents).to.exist;
      var html = file.contents.toString();
      expect(html).to.contain('<h1>Test</h1>');
      expect(html).to.contain('<p>Hello</p>');
      done();
    });

    myLayout.write(src);
    myLayout.end();
  });

  it('should be specified template engine', function(done) {
    var src = makeSrc();

    var myLayout = layout({
      title: 'Test',
      layout: 'test/fixtures/layout.html',
      engine: 'ejs'
    });

    myLayout.on('error', function(err) {
      expect(err).to.exist;
      done(err);
    });

    myLayout.on('data', function(file) {
      expect(file).to.exist;
      expect(file.contents).to.exist;
      var html = file.contents.toString();
      expect(html).to.contain('<h1>Test</h1>');
      expect(html).to.contain('<p>Hello</p>');
      done();
    });

    myLayout.write(src);
    myLayout.end();
  });

  it('should be specified properties in the function', function(done) {
    var src = makeSrc({
      frontMatter: {
        title: 'Test',
        layout: 'test/fixtures/layout.pug'
      }
    });

    var myLayout = layout(function(file) {
      return file.frontMatter;
    });

    myLayout.on('error', function(err) {
      expect(err).to.exist;
      done(err);
    });

    myLayout.on('data', function(file) {
      expect(file).to.exist;
      expect(file.contents).to.exist;
      var html = file.contents.toString();
      expect(html).to.contain('<h1>Test</h1>');
      expect(html).to.contain('<p>Hello</p>');
      done();
    });

    myLayout.write(src);
    myLayout.end();
  });
});
