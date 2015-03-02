// compiles css and js into dist folder

module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      main: {
        files: [
          {expand: true, src: ['img/*'], dest: 'dist/img/', filter: 'isFile'},
          {expand: true, src: ['css/*'], dest: 'dist/css/', filter: 'isFile'},
        ]
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/main.js'],
        dest: 'dist/main.js',
      },
    },
    bower_concat: {
      all: {
        dest: 'dist/vendor.js',
        cssDest: 'dist/vendor.css',
        exclude: [],
        bowerOptions: {
          relative: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.registerTask('build', ['copy:main', 'concat', 'bower_concat']);
}
