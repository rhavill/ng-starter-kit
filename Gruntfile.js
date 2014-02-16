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
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= vendor_files.css %>'
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
      compile_js: {
        options: {
          //banner: '<%= meta.banner %>'
        },
        src: [ 
          '<%= vendor_files.js %>', 
          'module.prefix', 
          '<%= build_dir %>/src/**/*.js', 
          '<%= html2js.app.dest %>', 
          '<%= html2js.common.dest %>', 
          '<%= vendor_files.js %>', 
          'module.suffix' 
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      compile: {
        options: {
          //banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
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
      cssFiles = grunt.config('vendor_files.css');
      var vendorJsFiles = grunt.config('vendor_files.js');
      var jsFiles = grunt.config('app_files.js');
      jsFiles = vendorJsFiles.concat(jssFiles);
      var templateJsFiles = grunt.config('dev_template_js_files');
      jsFiles = jsFiles.concat(templateJsFiles);
      tmplData = {jsFiles:jsFiles,cssFiles:cssFiles,baseDir:grunt.config( 'build_dir' ) };
    }
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

  grunt.registerTask('build', 'Development build.', function() {
    grunt.config('isDev', true);
    grunt.task.run('clean','copy','concat','uglify','html2js','index:build','karmaconfig','karma:continuous');
  });

  // Default task(s).
  grunt.registerTask('default', ['build']);

};