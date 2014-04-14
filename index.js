var debug = require('debug')('component-jade2');
var jade = require('jade');
var urlRewriter = require('component-builder').plugins.urlRewriter;


module.exports = function (options) {
  options = options || {};

  return function(file, done) {
    if (file.extension !== 'jade') return done();
    debug('compiling jade: %s', file.filename);

    file.read(function (err, string) {
      if (err) return done(err);
      
      options.staticUrl = options.staticUrl || _staticUrl(file, options.urlPrefix);

      file.string = JSON.stringify(jade.render(string, options));
      file.define = true;
      file.extension = 'html';
      done();
    })
  }
}

/**
 * staticUrl function passed to jade templates
 *
 * @param {Object} file
 * @param {String} prefix   Prefix to prepend to urls
 * @return {String}
 * @api private
 */
function _staticUrl (file, prefix){
  return function (uri) {
    var resolve = require('url').resolve;

    if (typeof prefix === "undefined") {
      throw new Error("staticUrl used but options.urlPrefix not defined");
    }

    // rewrite URLs
    if (_isData(uri)) return uri;
    if (_isAbsolute(uri)) return uri;
    if (_isTemplate(uri)) return uri;
    uri = resolve(file.path, uri);
    uri = resolve(prefix + rewriteUrl(file.branch) + '/', uri);
    return uri;
  }
}

/**
 * Check if a URL is a data url.
 *
 * @param {String} url
 * @return {Boolean}
 * @api private
 */

 function _isData(url) {
  return 0 === url.indexOf('data:');
}

/**
 * Check if a URL is an absolute url.
 *
 * @param {String} url
 * @return {Boolean}
 * @api private
 */

function _isAbsolute(url) {
  return ~url.indexOf('://')
    || '/' === url[0];
}

/**
 * Check if a URL contains template symbols
 *
 * @param {String} url
 * @return {Boolean}
 * @api private
 */
function _isTemplate(url) {
  return ~url.indexOf('<%') && ~url.indexOf('%>');
}

/**
 * COPIED FROM component-builder/utils.js
 * This is how the url rewriter and file copy/symlink will rewrite the file names.
 * This will create names like github's with `/`s.
 * i.e. fortawesome/fontawesome/v4.0.3/fonts/font.woff
 * and, for local components, lib/my-local-component/image.png
 *
 * @param {Object} branch
 * @return {String}
 * @api private
 */

function rewriteUrl (branch) {
  if (branch.type === 'local') return branch.relativePath || branch.name;
  if (branch.type === 'dependency') return branch.name + '/' + branch.ref;
}