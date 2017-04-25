var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean_css = require('gulp-clean-css');

gulp.task('admin_js', function () {
	return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/angular/angular.min.js',

		'node_modules/underscore/underscore-min.js',
		'node_modules/socket.io-client/dist/socket.io.js',

		'client/socket/client_socket.js',

    'client/components/bundles/admin_components_bundle.js'
  ])
	.pipe(concat('js.min.js'))
  .pipe(uglify({ mangle: false }))
	.pipe(gulp.dest('client/dist/admin/js'));
});

gulp.task('admin_css', function () {
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/semantic-ui-input/input.min.css',

		'client/libraries/font-awesome-4.7.0/css/font-awesome.min.css',

		'client/fonts/fonts.css'
  ])
	.pipe(concat('css.min.css'))
  .pipe(clean_css())
	.pipe(gulp.dest('client/dist/admin/css'));
});

gulp.task('index_js', function () {
	return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/angular/angular.min.js',

    'node_modules/underscore/underscore-min.js',
		'node_modules/socket.io-client/dist/socket.io.js',
		'node_modules/angular-animate/angular-animate.min.js',

		'client/libraries/clipboard-js/clipboard.min.js',

		'client/analytics/analytics.js',
		'client/socket/client_socket.js',

    'client/components/bundles/index_components_bundle.js'
  ])
	.pipe(concat('js.min.js'))
  .pipe(uglify({ mangle: false }))
	.pipe(gulp.dest('client/dist/index/js'));
});

gulp.task('index_css', function () {
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/semantic-ui-input/input.min.css',

		'client/libraries/font-awesome-4.7.0/css/font-awesome.min.css',

		'client/fonts/fonts.css'
  ])
	.pipe(concat('css.min.css'))
  .pipe(clean_css())
	.pipe(gulp.dest('client/dist/index/css'));
});

gulp.task('watch', function () {
	gulp.watch('client/components/bundles/admin_components_bundle.js', ['admin_js']);
	gulp.watch('client/components/bundles/index_components_bundle.js', ['index_js']);
});

gulp.task('default', [
	'admin_js',
	'admin_css',
	'index_js',
	'index_css',
	'watch'
]);
