var gulp = require('gulp');
var ts = require('gulp-typescript');
var path = require('path');

var clientProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true,
	module: 'amd'
});

var serverProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true,
	module: 'commonJS'
});

function destTransform(to, strip) {
	return function(file) {
		var result = path.join(file.cwd, to, file.base.substr(file.cwd.length + strip.length + 1/* +1 for / */));
//		console.log(' * ', file.path);
//		console.log(' ===> ', result);
		return result;
	}
}

gulp.task('publicFolder', function() {
	return gulp.src(['public/**/*.*'])
		.pipe(gulp.dest(destTransform('out/public', 'public')));
});

gulp.task('clientResources', function() {
	return gulp.src(['src/client/**/*.{css,png}'])
		.pipe(gulp.dest(destTransform('out/public', 'src')));
});

gulp.task('clientScripts', function() {
	return gulp.src(['src/client/**/*.ts', 'src/common/**/*.ts', , 'lib/**/*.ts'])
		.pipe(ts(clientProject))
		.js.pipe(gulp.dest(destTransform('out/public', 'src')));
});

gulp.task('serverScripts', function() {
	return gulp.src(['src/server/**/*.ts', 'src/common/**/*.ts', 'lib/**/*.ts'])
			.pipe(ts(serverProject))
			.js.pipe(gulp.dest(destTransform('out/server', 'src')));
});

gulp.task('watch', ['clientScripts', 'serverScripts'], function() {
    gulp.watch('**/*.ts', ['clientScripts', 'serverScripts']);
});
gulp.task('watchPublic', ['publicFolder'], function() {
    gulp.watch('public/**/*.*', ['publicFolder']);
});
gulp.task('watchClientResources', ['clientResources'], function() {
    gulp.watch('src/client/**/*.{css,png}', ['clientResources']);
});


gulp.task('default', ['watch', 'watchPublic', 'watchClientResources']);