module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    build_dir: 'build',
    compile_dir: 'bin',
    app_files: {
      js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
      jsunit: [ 'src/**/*.spec.js' ],

      atpl: [ 'src/app/**/*.tpl.html' ],
      ctpl: [ 'src/common/**/*.tpl.html' ],

      html: [ 'src/index.html' ]
    },
  vendor_files: {
    js: [
      'vendor/angular/angular.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-ui/common/module.js',
      'vendor/angular-ui/modules/directives/route/route.js',
      'vendor/angular-ui/modules/directives/showhide/showhide.js'
    ],
    css: [
      'vendor/bootstrap/dist/css/bootstrap.css',
      'vendor/bootstrap/dist/css/bootstrap-theme.css'
    ],
    assets: [
    ]
  },
    pkg: grunt.file.readJSON('package.json'),
    index: {
      src: '<%= app_files.html %>',  // source template file
      dest: '<%= build_dir %>/index.html'  // destination file (usually index.html)
    },
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

  grunt.registerTask( "index", "Generate index.html depending on configuration", function() {
    var conf = grunt.config('index'),
        tmpl = grunt.file.read(conf.src);

    grunt.file.write(conf.dest, grunt.template.process(tmpl));

    grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['index','copy','concat','uglify']);

};