const { src, dest, series, watch } = require('gulp'),
  del = require('delete'),
  eslint = require('gulp-eslint'),
  karma = require('karma'),
  autoprefixer = require('gulp-autoprefixer'),
  coveralls = require('@kollavarsham/gulp-coveralls'),
  csso = require('gulp-csso'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  terser = require('gulp-terser'),
  pkg = require('./package.json'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  path = require('path'),
  connect = require('gulp-connect'),
  ghpages = require('gh-pages');
  


function clean() {
  return del([
    'dist',
    'test/coverage',
    'lib/bespoke-simple-overview.min.css'
  ]);
}

function lint() {
  return src(['gulpfile.js', 'lib/**/*.js', 'specs/**/*.js'])
    .pipe(eslint.failAfterError());
}

function styles() {
  return src('lib/bespoke-simple-overview.css')
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(rename('bespoke-simple-overview.min.css'))
    .pipe(dest('dist'))
    .pipe(connect.reload());
}

function test(done) {
  const parseConfig = karma.config.parseConfig;
  const Server = karma.Server;
  parseConfig(path.resolve('karma.conf.js'), null, {
    promiseConfig: true,
    throwErrors: true,
  }).then((karmaConfig) => {
    const server = new Server(karmaConfig, (exitCode) => {
      done();
    });
    server.start();
  });
}

function coverageReport() {
  return src(['test/coverage/**/lcov.info']).pipe(coveralls());
}

function compileDemo() {
  return browserify({ debug: false })
      .add('demo/demo.js')
      .bundle()
      .pipe(source('demo.bundled.js'))
      .pipe(dest('demo'))
      .pipe(connect.reload())
}

function compile() {
  return browserify({
    debug: false,
    standalone: "bespoke.plugins.simpleOverview",
  })
    .add("./lib/bespoke-simple-overview.js")
    .transform("browserify-css", {
      global: true,
      minify: true,
      autoInject: true,
      autoInjectOptions: {
        verbose: true
      },
    })
    .bundle()
    .pipe(source("bespoke-simple-overview.js"))
    .pipe(buffer())
    .pipe(
      header(
        [
          "/*!",
          " * <%= name %> v<%= version %>",
          " *",
          " * Copyright <%= new Date().getFullYear() %>, <%= author.name %>",
          " * This content is released under the <%= license %> license",
          " */\n\n",
        ].join("\n"),
        pkg
      )
    )
    .pipe(dest("dist"))
    .pipe(rename("bespoke-simple-overview.min.js"))
    .pipe(terser())
    .pipe(
      header(
        [
          "/*! <%= name %> v<%= version %> ",
          "© <%= new Date().getFullYear() %> <%= author.name %>, ",
          "<%= license %> License */\n",
        ].join(""),
        pkg
      )
    )
    .pipe(dest("dist"))
    .pipe(connect.reload());
}


function dev() {
  const port = 8085;

  watch(['demo/**/*.js', '!demo/demo.bundled.js'], compileDemo);
  watch('lib/**/*.js', series(test, lint, compile));
  watch('test/spec/**/*.js', test);

  connect.server({
    root: 'demo',
    livereload: true,
    port,
  });
}

function deploy(cb) {
  ghpages.publish(path.join(__dirname, 'demo'), cb);
}

exports.clean = clean;
exports.lint = lint;
exports.compile = series(lint, styles, compile);
exports.test = series(lint, test);
exports.dev = series(compileDemo, dev);
exports.coveralls = series(exports.test, coverageReport);
exports.deploy = deploy;
