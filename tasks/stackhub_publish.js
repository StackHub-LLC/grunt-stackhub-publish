/*
 * stackhub-publish
 * https://bitbucket.org/stack-hub/stackhub-publish
 *
 * Copyright (c) 2015 StackHub.org
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var inquirer = require('inquirer');
    var btoa = require('btoa');
    var fs = require('fs');
    var rest = require('restler');
    
    grunt.registerMultiTask('stackhub-publish', 'Grunt plugin to publish your package versions to StackHub', function() {
        // Tell Grunt this task is asynchronous.
        var done = this.async();
        
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            shuser: '',
            shpass: '',
            host: 'https://stackhub.org',
            releaseStatus: 'released',
            filepath: '',
            onComplete: function(data) {}
        });
        
        // Validate the options
        if (!options.filepath.trim().length)
            grunt.fail.warn('File path (filepath) not defined.');

        // Warn on missing file
        if (!grunt.file.exists(options.filepath)) {
            grunt.fail.warn('Package version file "' + options.filepath + '" not found.');
            return false;
        }
        
        //
        // Part 1: Prompt for credentials if necessary
        //
        var questions = [];
        if (!options.shuser.trim().length) {
            questions.push({
                type: 'input',
                name: 'shuser',
                message: 'StackHub username',
                validate: function(s) {
                    if (s.trim().length < 1)
                        return "Username is required";
                    return true;
                }
            });
        }
        if (!options.shpass.trim().length) {
            questions.push({
                type: 'password',
                name: 'shpass',
                message: 'StackHub password',
                validate: function(s) {
                    if (s.trim().length < 1)
                        return "Password is required";
                    return true;
                }
            });
        }
        
        inquirer.prompt(questions, function(answers) {
            for (var p in answers)
                options[p] = answers[p];
            
            //
            // Part 2: Upload package version
            //
            
            // Get file size (necessary for multipart upload)
            fs.stat(options.filepath, function(err, stats) {
                if (err) {
                    grunt.fail.warn('Error: ' + err);
                    done(err);
                }
                else if (stats.isFile()) {
                    var fileSize = stats.size;
                    grunt.log.writeln('Uploading "' + options.filepath + '"');
                    
                    var url = options.host +"/api/packageVersionCreate";
                    var headers = {
                        Authorization: 'Basic '+ btoa(options.shuser +":"+ options.shpass),
                        Accept: "application/json"
                    };
                    
                    var gridRow = {
                        // Add pod overrides here as necessary.
                        // Made need to convert a readme to markdown or something.
                        releaseStatus: options.releaseStatus
                    };
                    var grid = JSON.stringify({rows: [gridRow]});
                    
                    var reqData = {
                        grid: rest.data('', 'application/json', grid),
                        'package': rest.file(options.filepath, null, fileSize, null, null)
                    };
                    
                    // HTTP request
                    rest.request(url, {
                        rejectUnauthorized: true,
                        method: 'POST',
                        headers: headers,
                        multipart: true,
                        data: reqData
                    }).on('error',function(e) {
                        grunt.fail.warn('Upload failed with error code: ' + e.message);
                    }).on('complete', function(data, response) {
                        if (response !== null && response.statusCode >= 200 && response.statusCode < 300) {
                            var grid = JSON.parse(data);
                            if (grid.meta && grid.meta.err)
                                grunt.fail.warn('Upload failed with API error: ' + grid.meta.dis);
                            else {
                                grunt.log.ok('Upload successful');
                                options.onComplete(grid.rows && grid.rows.length ? grid.rows[0] : null);
                            }
                            
                            // callback once upload is done
                            done(data);
                        }
                        else if (response !== null)
                            grunt.fail.warn('Upload failed with status code: ' + response.statusCode);
                        else
                            grunt.fail.warn('Upload failed, no response');
                    });
                }
            });
        });
    });
};
