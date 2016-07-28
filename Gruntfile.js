module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                reporter: require('jshint-html-reporter'),
                reporterOutput: 'output/jshint/jshint-report.html'
            },
            target: ['app/*']
        },
        mochaTest: {
          test: {
            options: {
              reporter: 'mochawesome',
              reporterOptions: {
                reportDir: 'output/mocha'
              },
              quiet: 'false',
              run: true
            },
            src: ['test/*.js']
          }
        }
    });

    grunt.registerTask('test', ['jshint', 'mochaTest']);    
};
