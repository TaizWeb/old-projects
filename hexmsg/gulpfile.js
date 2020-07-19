// Dependencies
const gulp = require('gulp'),
	concat = require('gulp-concat'),
	babel = require('gulp-babel'),
	stylus = require('gulp-stylus'),
	cssmin = require('gulp-clean-css'),
	uglify = require('gulp-uglify');

// CSS
gulp.task('css', () => {
	return gulp.src('public/css/*.css')
		.pipe(concat('styles.css'))
		.pipe(cssmin({compatibility:'ie8'}))
		.pipe(gulp.dest('public/css/min'));
});

// Stylus
gulp.task('stylus', () => {
	return gulp.src('public/css/stylus/*')
	.pipe(concat('socket.styl'))
	.pipe(stylus())
	.pipe(gulp.dest('public/css'))
});

// JS
gulp.task('js', () => {
	return gulp.src('public/js/*.js')
		.pipe(concat('scripts.js'))
		.pipe(babel({presets: ['es2015']}))
		.pipe(uglify({mangle: false}))
		.pipe(gulp.dest('public/js/min'));
});

// Default
gulp.task('default', ['stylus', 'js'], () => {
	gulp.watch(['public/css/stylus/*.styl'], ['stylus']);
	gulp.watch(['public/css/*.css'], ['css']);
	gulp.watch(['public/js/*.js'], ['js']);
});
