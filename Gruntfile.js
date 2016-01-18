
module.exports = function(grunt){

    grunt.initConfig({


        concat: {
            dist: {
                src: [
                    'focus/intro.js',
                    'focus/helpers/*.js',
                    'focus/Validator.js',
                    'focus/Dispatcher.js',
                    'focus/Router.js',
                    'focus/Model.js',
                    'focus/Collection.js',
                    'focus/Binder.js',
                    'focus/outro.js'
                ],
                dest: 'focus/build/Focus.js',
            },
        },

        uglify: {
            js: {
                expand: true,
                files: {
                'focus/build/Focus.min.js': 'focus/build/Focus.js'
                }
            }
        },

        browserify: {
            options: {
                debug: true,
                extensions: ['.js','.jsx'],
                external: ['react.min'],
                transform: [
                    "reactify", "browserify-shim"
                ]
            },
            main: {
                src: ['js/**/*.js', 'js/**/*.jsx','!js/bundle.js'  ],
                dest: 'js/bundle.js'
            }
        },

        watch: {

            focus: {
                files: ['focus/**/*.js', '!focus/Focus.min.js', '!focus/Focus.build.js'],
                tasks: ['concat','uglify'],
                options: {
                    spawn: false
                }
            },

            js: {
                files: ['js/**/*.js', 'js/**/*.jsx'],
                tasks: ['browserify'],
                options: {
                    spawn: false
                }
            }
        },

    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['concat','uglify', 'browserify']);
    grunt.registerTask('dev', ['default','watch']);


}
