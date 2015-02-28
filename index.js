var path = require('path');
var consolidate = require('consolidate');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-layout';

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
      cb(new PluginError(PLUGIN_NAME, 'Streaming not supported.'));
      return;
    }

    var data = options;

    if (typeof options === 'function') {
      data = options(file);
    }

    if (!data || !data.layout) {
      cb(null, file);
      return;
    }

    var engine = data.engine;

    if (!engine) {
      engine = path.extname(data.layout).substring(1);
    }

    if (!engine) {
      cb(new PluginError(PLUGIN_NAME, 'Please select template engine in options ("engine" or extension of "layout")', {fileName: file.path}));
      return;
    }

    if (!consolidate[engine]) {
      cb(new PluginError(PLUGIN_NAME, 'Template engine "' + engine + '" is not supported.', {fileName: file.path}));
      return;
    }

    if (!requireOk[engine]) {
      try {
        require(engine);
        requireOk[engine] = true;
      } catch (err) {
        cb(new PluginError(PLUGIN_NAME, 'Template engine "' + engine + '" is not installed.', {fileName: file.path}));
        return;
      }
    }

    data.contents = file.contents;

    consolidate[engine](data.layout, data, function(err, html) {
      if (err) {
        cb(new PluginError(PLUGIN_NAME, err, {fileName: file.path}));
        return;
      }
      file.contents = new Buffer(html);
      file.path = gutil.replaceExtension(file.path, '.html');
      cb(null, file);
    });
  });
};
