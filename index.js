var debug = require('debug')('component-jade2');
var jade = require('jade');

module.exports = function (options) {
  options = options || {};

  return function(file, done) {
    if (file.extension !== 'jade') return done();
    debug('compiling: %s', file.filename);

    file.read(function (err, string) {
      if (err) return done(err);
      
      options.filename = file.filename;

      file.string = JSON.stringify(jade.render(string, options));
      file.define = true;

      // HTML output, for next middleware 
      file.extension = "html";
      
      done();
    })
  }
}