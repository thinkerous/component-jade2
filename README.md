# component-jade2

  A plugin to transpile Jade files for the [component builder](https://github.com/component/builder2.js).

## Install

    $ npm install component-jade2

## Usage

  Add your `.jade` files to the `templates` array in your `component.json`:

  ```js
  {
    "templates": [
      "template.jade"
    ]
  }
  ```

  And require the files in your Javascript:

  ```js
  var template = require('template.jade');
  ```

  Use the plugin during your build process:

  ```js
  var fs = require('fs');
  var resolve = require('component-resolver');
  var build = require('component-builder');
  var componentJade = require('component-jade2');

  /**
   * Options
   */
  var options = {
    dir: "/build/",
    name: "thinkerous"
  };

  var filepath = __dirname + options.dir + options.name;

  // resolve the dependency tree
  resolve(process.cwd(), {
    // install the remote components locally
    install: true
  }, function (err, tree) {
    if (err) throw err;

    build.scripts(tree)
      .use('scripts', build.plugins.js())
      // TODO: copy over html files too
      .use('templates', componentJade({
        // Jade Options
        compileDebug: false,
        pretty: false,

        // Optional urlPrefix. Enables `staticUrl(filepath)` in templates.
        // Relative to jade file.
        // Ex. img(src=staticUrl("../images/picture.png")
        urlPrefix: "//cdn.domain.com/"

        // + data to be rendered
      }))
      .end(function (err, string) {
        if (err) throw err;
        fs.writeFileSync(filepath + '.js', build.scripts.require + string);
      });
  });
  ```

  __Note:__ You should add jade to your package.json yourself. By default, this will use the latest Jade 1.x.x.

# License

(The MIT License)

Copyright &copy; 2014 Thinkerous \<team@thinkero.us\>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.