var gulp = require('gulp');
var tsb = require('gulp-tsb');
var assign = require('object-assign');
var merge = require('merge-stream');
var rimraf = require('rimraf');
var es = require('event-stream');
var path = require('path');

// TypeScript compilation
var clientCompilation = tsb.create(assign({ verbose: true }, require('./tsconfig.json').compilerOptions));

function compileTask() {
	var compilation = (
		gulp.src(['lib/**/*.ts', 'src/**/*.ts'])
		.pipe(clientCompilation())
		.pipe(es.through(function(data) {
			if (/\.js\.map$/.test(data.path)) {
				data.contents = new Buffer(
					data.contents.toString().replace('../../../../../src', '../../../src')
				);
			}
			this.emit('data', data);
		}))
	);

	var client = compilation.pipe(es.through(function(data) {
		if (/common|client/.test(data.path)) {
			this.emit('data', data);
		}
	}));

	var server = compilation.pipe(es.through(function(data) {
		if (/common|server/.test(data.path)) {
			this.emit('data', data);
		}
	}));

	return merge(
		merge(
			gulp.src('public/**/*', { base: 'public' }),
			gulp.src('src/client/**/*.css', { base: 'src' }),
			client
		).pipe(gulp.dest('out/public')),

		merge(
			server
		).pipe(gulp.dest('out/server'))
	);
}

gulp.task('compile-clean', function(cb) { rimraf('out', { maxBusyTries: 1 }, cb); });

gulp.task('compile', ['compile-clean'], compileTask);

gulp.task('compile-without-clean', compileTask);

gulp.task('watch', ['compile'], function() {
	gulp.watch(['lib/**/*', 'src/**/*', 'public/**/*'], ['compile-without-clean']);
});

gulp.task('default', ['compile']);