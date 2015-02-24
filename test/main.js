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
  it('should throw error if engine is not exist', function(done) {
    var src = makeSrc();

    var stream = layout({
      title: 'Test',
      layout: 'test/fixtures/layout.not_supported_engine' // is dummy
    });

    stream.on('error', function(err) {
      expect(err).to.exist;
      expect(err.message).to.contain('not_supported_engine');
      expect(err.message).to.contain('not supported');
      expect(err.fileName).to.equals('test/fixtures/entry.html');
      done();
    });

    stream.on('data', function(file) {
      done(new Error('should not write a contents'));
    });

    stream.write(src);
    stream.end();
  });

  it('should throw error if engine is not installed', function(done) {
    var src = makeSrc();

    var stream = layout({
      title: 'Test',
      layout: 'test/fixtures/layout.hogan' // is not installed
    });

    stream.on('error', function(err) {
      expect(err).to.exist;
      expect(err.message).to.contain('hogan');
      expect(err.message).to.contain('not installed');
      expect(err.fileName).to.equals('test/fixtures/entry.html');
      done();
    });

    stream.on('data', function(file) {
      done(new Error('should not write a contents'));
    });

    stream.write(src);
    stream.end();
  });

  it('should throw error if layout file is not exist', function(done) {
    var src = makeSrc();

    var stream = layout({
      title: 'Test',
      layout: 'dummy.jade' // not exist
    });

    stream.on('error', function(err) {
      expect(err).to.exist;
      expect(err.fileName).to.equals('test/fixtures/entry.html');
      done();
    });

    stream.on('data', function(file) {
      done(new Error('should not write a contents'));
    });

    stream.write(src);
    stream.end();
  });

  it('should use the specified template', function(done) {
    var src = makeSrc();

    var stream = layout({
      title: 'Test',
      layout: 'test/fixtures/layout.jade'
    });

    stream.on('error', function(err) {
      expect(err).to.exist;
      done(err);
    });

    stream.on('data', function(file) {
      expect(file).to.exist;
      expect(file.contents).to.exist;
      var html = file.contents.toString();
      expect(html).to.contain('<h1>Test</h1>');
      expect(html).to.contain('<p>Hello</p>');
      done();
    });

    stream.write(src);
    stream.end();
  });

  it('should be specified template engine', function(done) {
    var src = makeSrc();

    var stream = layout({
      title: 'Test',
      layout: 'test/fixtures/layout.html',
      engine: 'ejs'
    });

    stream.on('error', function(err) {
      expect(err).to.exist;
      done(err);
    });

    stream.on('data', function(file) {
      expect(file).to.exist;
      expect(file.contents).to.exist;
      var html = file.contents.toString();
      expect(html).to.contain('<h1>Test</h1>');
      expect(html).to.contain('<p>Hello</p>');
      done();
    });

    stream.write(src);
    stream.end();
  });

  it('should be specified properties in the function', function(done) {
    var src = makeSrc({
      title: 'Test',
      layout: 'test/fixtures/layout.jade'
    });

    var stream = layout(function(file) {
      return {
        title: file.title,
        layout: file.layout
      };
    });

    stream.on('error', function(err) {
      expect(err).to.exist;
      done(err);
    });

    stream.on('data', function(file) {
      expect(file).to.exist;
      expect(file.contents).to.exist;
      var html = file.contents.toString();
      expect(html).to.contain('<h1>Test</h1>');
      expect(html).to.contain('<p>Hello</p>');
      done();
    });

    stream.write(src);
    stream.end();
  });
});
