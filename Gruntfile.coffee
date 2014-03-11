module.exports = (grunt) ->
  grunt.initConfig {
    pkg: grunt.file.readJSON('package.json')
    coffee: {
      compile: {
        options: {
          bare: true
        }
        files: {
          'lib/freeflow.js': 'src/*.coffee'
        }
      }
    }
  }

  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.registerTask 'default', [ 'coffee' ]
