var path = require('path');
var consolidate = require('consolidate');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

module.exports = function(options) {
  'use strict';

  options = options || {};
  
  var requireOk = {};

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('gulp-layout', 'Streaming not supported.'));
      return;
    }

    var data = options;

    if (typeof options === 'function') {
      data = options(file);
    }

    var engine = data.engine;

    if (!engine) {
      engine = path.extname(data.layout).substring(1);
    }

    if (!engine) {
      cb(null, file);
      return;
    }

    if (!consolidate[engine]) {
      cb(new PluginError('gulp-layout', 'Template engine "' + engine + '" is not supported.', {fileName: file.path}));
      return;
    }

    if (!requireOk[engine]) {
      try {
        require(engine);
        requireOk[engine] = true;
      } catch (err) {
        cb(new PluginError('gulp-layout', 'Template engine "' + engine + '" is not installed.', {fileName: file.path}));
        return;
      }
    }

    data.contents = file.contents;

    consolidate[engine](data.layout, data, function(err, html) {
      if (err) {
        cb(new PluginError('gulp-layout', err, {fileName: file.path}));
        return;
      }
      file.contents = new Buffer(html);
      file.path = gutil.replaceExtension(file.path, '.html');
      cb(null, file);
    });
  });
};
