/*!
 * Limefamily's Gruntfile
 * Copyright 2017-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/namebjp)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');
  var generateCommonJSModule = require('./grunt/bs-commonjs-generator.js');
  var configBridge = grunt.file.readJSON('./grunt/configBridge.json', { encoding: 'utf8' });

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * LimeFamily v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2017-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',
    jqueryCheck: configBridge.config.jqueryCheck.join('\n'),
    jqueryVersionCheck: configBridge.config.jqueryVersionCheck.join('\n'),

    // Task configuration.
    clean: {
      dist: 'dist',
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          // 'build/js/layoutBox.js',
          // 'build/js/resizeWin.js',
          // 'build/js/component/limeFamily.sideMenu.js',
          // 'build/js/component/limeFamily.buttonSelect.js',
          // 'build/js/component/limeFamily.gridView.js'
          'build/js/pushmenu.js',
          'build/js/Tree.js',
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: /^!|@preserve|@license|@cc_on/i
      },
      core: {
        src: '<%= concat.bootstrap.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    less: {
      compileCore: {
        options: {
          banner: '<%= banner %>',
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'build/less/limefamily.less',
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      compileWidget: {
        // options: {
        //   banner: '<%= banner %>',
        //   strictMath: true,
        //   sourceMap: true,
        //   outputSourceFiles: true,
        //   sourceMapURL: '<%= pkg.name %>.css.map',
        //   sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        // },
        // src: ['build/less/mixins/lime-navmenu.less'],
        // dest:['dist/css/navmenu.css']
        // expand:true,
        // cwd:'build/less/component/',
        // src:'*.less',
        // dest:'dist/css/component/',
        // ext:'.css'
      },
      compileTheme: {
        options: {
          banner: '<%= banner %>',
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>-skins.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>-skins.css.map'
        },
        src: 'build/less/skins/all-skin-theme.less',
        dest: 'dist/css/<%= pkg.name %>-skins.css'
      }
    },

    autoprefixer: {
      options: {
        browsers: configBridge.config.autoprefixerBrowsers
      },
      core: {
        options: {
          map: true
        },
        src: 'dist/css/<%= pkg.name %>.css'
      },
      skins: {
        options: {
          map: true
        },
        src: 'dist/css/<%= pkg.name %>-skins.css'
      },
    },

    csslint: {
      options: {
        csslintrc: 'build/less/.csslintrc'
      },
      dist: [
        'dist/css/limefamily.css',
        'dist/css/limefamily-skins.css'
      ]
    },

    cssmin: {
      options: {
        // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
        //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
        compatibility: 'ie8',
        keepSpecialComments: '*',
        sourceMap: true,
        sourceMapInlineSources: true,
        advanced: false
      },
      minifyCore: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      },
      minifySkins: {
        src: 'dist/css/<%= pkg.name %>-skins.css',
        dest: 'dist/css/<%= pkg.name %>-skins.min.css'
      },
    },

    csscomb: {
      options: {
        config: 'build/less/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/'
      }
    },

    copy: {
      fonts: {
        expand: true,
        cwd: 'build/fonts/',
        src: ['*.{eot,svg,ttf,woff,woff2,otf}'],
        dest: 'dist/fonts/'
      },
      images: {
        expand: true,
        cwd: 'build/images/',
        src: ['*.{png,jpg,gif}'],
        dest: 'dist/images/'
      },
      js:{
        expand: true,
        cwd: 'build/js/',
        src:['custom.js'],
        dest: 'dist/js/'
      },
      componentJs: {
        expand: true,
        cwd: 'build/js/component/',
        src:['*.js'],
        dest: 'dist/js/component/'
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify:core', 'commonjs']);

  // CSS distribution task.
  // grunt.registerTask('less-compile', ['less:compileCore', 'less:compileWidget']);
  grunt.registerTask('less-compile', ['less:compileCore','less:compileTheme']);
  grunt.registerTask('dist-css', ['less-compile', 'autoprefixer:core', 'autoprefixer:skins', 'csscomb:dist', 'cssmin:minifyCore','cssmin:minifySkins']);
  grunt.registerTask('copy-fonts', ['copy:fonts', 'copy:images',]);
  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'copy-fonts', 'dist-js', 'copy:js', 'copy:componentJs']);

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'copy:fonts', 'test']);

  grunt.registerTask('commonjs', 'Generate CommonJS entrypoint module in dist dir.', function () {
    var srcFiles = grunt.config.get('concat.bootstrap.src');
    var destFilepath = 'dist/js/npm.js';
    generateCommonJSModule(grunt, srcFiles, destFilepath);
  });

};
