module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "browserify"],
    files: ["test/spec/*Spec.js", "lib/**/*.js"],
    exclude: [],

    client: {
      jasmine: {
        random: false
      }
    },

    preprocessors: {
      "test/**/*.js": "browserify",
      "lib/**/*.js": ["browserify", "coverage"],
    },

    browserify: {
      debug: true,
      transform: [
        ["browserify-css", { global: true, rootDir: "./inexistent_directory" }],
      ],
    },

    reporters: ["progress", "coverage"],

    coverageReporter: {
      type: "lcov",
      dir: "test/coverage",
      instrumenterOptions: {
        istanbul: { noCompact: true },
      },
    },

    port: 8080,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ["ChromeHeadless"],
    singleRun: true,
  });
};
