module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    build_dir: 'build',
    compile_dir: 'bin',
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build_appjs: {
        files: [
          {
            //src: [ '<%= app_files.js %>' ],
            src: [ 'src/**/*.js','common/**/*.js' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      }/*,
      build_vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      }*/
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        //src: ['src/**/*.js'],
        src: ['*.js'],
        // the location of the resulting JS file
        //dest: 'dist/<%= pkg.name %>.js'
        dest: '<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'uglify-test.js',
        dest: 'uglify-test.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['copy','concat','uglify']);

};