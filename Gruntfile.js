module.exports = function(grunt) {
    require('time-grunt')(grunt);

    // Tasks loaded
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('@lodder/grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // @grunt-contrib-clean
        // clean folders
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*',
                        '!dist/.git*'
                    ]
                }]
            },
            inline: {
                files: [{
                    src: [
                        'dist/css/inline-*.css',
                    ]
                }]
            }
        },

        // @grunt-contrib-less
        // compile less ~> css
        less: {
            compile: {
                options: {
                    cleancss: true,
                    strictImports : true
                },
                files: {
                    'src/css/main.css': 'src/less/main.less',
                    'src/css/inline-doc.css': 'src/less/inline-doc.less',
                    'src/css/inline-home.css': 'src/less/inline-home.less',
                }
            }
        },

        // @grunt-postcss
        // +~> @cssnano
        // +~> @autoprefixer
        // minify css
        // add browser prefixes
        postcss: {
            build: {
                options: {
                    map: false,
                    processors: [
                        require('autoprefixer')(),
                        require('cssnano')()
                    ]
                },
                src: 'src/css/*.css'
            }
        },

        // @grunt-contrib-copy
        // move files src/ ~> dist/
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'src',
                    dest: 'dist',
                    src: [
                        '*.{ico,png,txt}',
                        '*.html',
                        'css/*',
                        'images/*',
                        'favicons/*',
                    ]
                }]
            }
        },

        // @grunt-inline
        // put css inline in html
        inline: {
            dist: {
                options: {
                    inlineTagAttributes: {
                        css: 'data-inlined="true"'
                    },
                },
                files: {
                    'dist/index.html': 'dist/index.html',
                    'dist/guide.html': 'dist/guide.html',
                    'dist/api.html': 'dist/api.html',
                }
            }
        },

        // @grunt-contrib-watch
        // use livereload
        watch: {
            reload: {
                files: ['Gruntfile.js',
                        "src/*"],
                options: {
                    livereload: true
                }
            },
            less: {
                files: ['src/less/*', 'src/less/*/*'],
                tasks: ['less'],
                options: {
                    livereload: true
                }
            },
        },
    });

    grunt.registerTask('css', ['less', 'postcss']);

    grunt.registerTask('build', [
        'clean:dist',
        'css',
        'copy:dist',
        'inline:dist',
        'clean:inline'
    ]);
};
