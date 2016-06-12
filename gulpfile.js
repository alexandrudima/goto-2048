var gulp = require('gulp');
var tsb = require('gulp-tsb');
var assign = require('object-assign');
var merge = require('merge-stream');
var rimraf = require('rimraf');
var es = require('event-stream');

// TypeScript compilation
var clientCompilation = tsb.create(assign({ verbose: true }, require('./tsconfig.json').compilerOptions));

function compileTask() {
	var compilation = gulp.src(['lib/**/*.ts', 'src/**/*.ts']).pipe(clientCompilation());

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
	gulp.watch(['lib/**/*.ts', 'src/**/*.ts', 'public/**/*'], ['compile-without-clean']);
});

gulp.task('default', ['compile']);