module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    build_dir: 'build',
    compile_dir: 'bin',
    src_dir: 'src',
    app_files: {
      js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
      jsunit: [ 'src/**/*.spec.js' ],

      atpl: [ 'src/app/**/*.tpl.html' ],
      ctpl: [ 'src/common/**/*.tpl.html' ],

      index: [ 'src/index.html' ]
    },
    vendor_files: {
      js: [
        'vendor/angular/angular.js',
        'vendor/angular-bootstrap/ui-bootstrap.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/angular-ui/common/module.js',
        'vendor/angular-ui/modules/directives/route/route.js'
      ],
      css: [
        'vendor/bootstrap/dist/css/bootstrap.css',
        'vendor/bootstrap/dist/css/bootstrap-theme.css'
      ],
      assets: [
      ]
    },
    dev_template_js_files: [
        'templates-app.js',
        'templates-common.js'
    ],
    pkg: grunt.file.readJSON('package.json'),

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [ 
      '<%= build_dir %>', 
      '<%= compile_dir %>'
    ],
    index: {
      build: {
        dest: '<%= build_dir %>/index.html',  // destination file (usually index.html)
        js: [
          '<%= vendor_files.js %>',
          'src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>'
        ],
        css: [
          '<%= vendor_files.css %>'
        ]
      },
      compile: {
        dest: '<%= compile_dir %>/index.html',
        js: [
          'assets/<%= pkg.name %>-<%= pkg.version %>.js'
        ],
        css: [
          'assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
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
      },
      build_vendorcss: {
        files: [
          {
            src: [ '<%= vendor_files.css %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
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
      compile_css: {
        src: [
          '<%= vendor_files.css %>'
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      compile_js: {
        options: {
          //banner: '<%= meta.banner %>'
        },
        src: [ 
          '<%= vendor_files.js %>', 
          //'module.prefix', 
          '<%= build_dir %>/src/**/*.js', 
          '<%= html2js.app.dest %>', 
          '<%= html2js.common.dest %>', 
          '<%= vendor_files.js %>'
          //'module.suffix' 
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    ngmin: {
      compile: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      },
      test: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            //src: [ '<%= build_dir %>/src/app/app.js' ],
            cwd: '<%= build_dir %>',
            dest: '/tmp',
            expand: true
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: true,
        //beautify: true
      },
      compile: {
        options: {
          //banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
          //'<%= concat.compile_css.dest %>': '<%= concat.compile_css.dest %>'
        }
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
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        runnerPort: 9101,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [ 
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'vendor/angular-mocks/angular-mocks.js'
        ]
      }
    },
  });

  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  grunt.registerMultiTask( "index", "Generate index.html depending on configuration", function() {
    var conf, tmpl, tmplData;
    if (this.target == 'build') {
      conf = grunt.config('index.build');
      tmpl = grunt.file.read(grunt.config('app_files.index'));
      var cssFiles = grunt.config('vendor_files.css');
      var vendorJsFiles = grunt.config('vendor_files.js');
      var jsFiles = grunt.config('app_files.js');
      jsFiles = vendorJsFiles.concat(jsFiles);
      var templateJsFiles = grunt.config('dev_template_js_files');
      jsFiles = jsFiles.concat(templateJsFiles);
      tmplData = {jsFiles:jsFiles,cssFiles:cssFiles,baseDir:grunt.config( 'build_dir' ) };
    }
    else if (this.target == 'compile') {
      conf = grunt.config('index.compile');
      tmpl = grunt.file.read(grunt.config('app_files.index'));
      var cssFiles = grunt.config('index.compile.css');
      // var vendorJsFiles = grunt.config('vendor_files.js');
      var jsFiles = grunt.config('index.compile.js');
      // jsFiles = vendorJsFiles.concat(jsFiles);
      // var templateJsFiles = grunt.config('dev_template_js_files');
      // jsFiles = jsFiles.concat(templateJsFiles);

      tmplData = {jsFiles:jsFiles,cssFiles:cssFiles,baseDir:grunt.config( 'compile_dir' )};
    }
      console.log(tmplData); 
    grunt.file.write(conf.dest, grunt.template.process(tmpl, {data:tmplData}));

    grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + grunt.config('app_files.index') + '\'');
  });

  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );
    
    grunt.file.copy( 'karma/karma-unit.tpl.js', grunt.config( 'build_dir' ) + '/karma-unit.js', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');

  grunt.registerTask('build', 'Development build.', function() {
    //grunt.config('isDev', true);
    grunt.task.run('clean','copy:build_vendorcss','copy:build_vendorjs','copy:build_appjs','html2js','index:build','karmaconfig','karma:continuous');
  });

  grunt.registerTask('compile', 'Production build.', function() {
    //grunt.config('isDev', true);
    grunt.task.run('clean','copy','html2js','ngmin','concat','uglify','index:compile');
  });

  grunt.registerTask('test', 'Production build.', function() {
    //grunt.config('isDev', true);
    grunt.task.run('ngmin:test');
  });

  // Default task(s).
  grunt.registerTask('default', ['build']);

};