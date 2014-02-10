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
    dev_template_js_files: [
        'build/templates-app.js',
        'build/templates-common.js'
    ],
    pkg: grunt.file.readJSON('package.json'),
    index: {
      src: '<%= app_files.html %>',  // source template file
      dest: '<%= build_dir %>/index.html'  // destination file (usually index.html)
    },
    copy: {
      build_appjs: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      }
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
    },
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src/app'
        },
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/templates-app.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/common'
        },
        src: [ '<%= app_files.ctpl %>' ],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },
  });

  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  grunt.registerTask( "index", "Generate index.html depending on configuration", function() {
    var conf = grunt.config('index'),
        tmpl = grunt.file.read(conf.src);
    // var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
    //   console.log(file.replace( dirRE, '' ));
    //   return file.replace( dirRE, '' );
    // });

    grunt.file.write(conf.dest, grunt.template.process(tmpl));

    grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.registerTask('build', 'Development build.', function() {
    grunt.config('isDev', true);
    grunt.task.run('copy','concat','uglify','html2js','index');
  });

  // Default task(s).
  grunt.registerTask('default', ['build']);

};