// compiles css and js into dist folder

module.exports = function(grunt) {
  grunt.initConfig({
    nodemon: {
      dev: {
        script: 'web.js',
        exec: 'grunt build'
      }
    },
    clean: ["dist"],
    copy: {
      main: {
        files: [
          {src: ['index.html'], dest: 'dist/'},
          {expand: true, src: ['img/*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, src: ['css/*'], dest: 'dist/', filter: 'isFile'},
        ]
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/main.js'],
        dest: 'dist/js/main.js',
      },
    },
    bower_concat: {
      all: {
        dest: 'dist/js/vendor.js',
        cssDest: 'dist/css/vendor.css',
        exclude: ['jquery'],
        bowerOptions: {
          relative: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.registerTask('watch', ['nodemon:dev']);
  grunt.registerTask('build', ['clean', 'copy:main', 'concat', 'bower_concat']);
}
