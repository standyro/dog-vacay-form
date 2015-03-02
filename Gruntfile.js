// compiles css and js into dist folder

module.exports = function(grunt) {
  grunt.initConfig({
    bower_concat: {
      all: {
        dest: 'dist/main.js',
        cssDest: 'dist/styles.css',
        exclude: [
        'jquery',
        'modernizr'
        ],
        bowerOptions: {
          relative: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.registerTask('default', ['bower_concat']);
}
