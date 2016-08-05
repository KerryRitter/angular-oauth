var gulp = require('gulp');
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");

var paths = {
    sass: ['./scss/**/*.scss']
};

gulp.task('default', ["compile:ts"]);

gulp.task('watch', function() {
    gulp.watch(["./**/*.ts"], ["compile:ts"]);
});

gulp.task("lint:ts", function() {
    return gulp.src("angular-future-app.ts")
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

var tsProject = ts.createProject("tsconfig.json", {
    outFile: "angular-oauth.js"
});
gulp.task("compile:ts", ["lint:ts"], function() {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js
        .pipe(gulp.dest("dist"));
});