'use strict';

const
    gulp = require('gulp'),
    build = require('./task/build');

gulp.task('build', build);

// Our default task. Run when "gulp" is called with no task names.
gulp.task('default', build);
