var gulp = require('gulp');
var compass = require('gulp-compass');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var _scss = "./scss/main.scss";
var _css = "./css";

var files = {
    scss: "./scss/**/*.scss",
    js: ["./js/**/*.js", "./js/**/*.jsx", "!./js/libs/*.js", "!./js/production/**/*.js"],
    jsEntry: "./js/App.js"
};

gulp.task('compass', function() {
    return gulp.src(_scss)
        .pipe(compass({
            sass: 'scss'
        }))
        .pipe(gulp.dest( _css ));
});

gulp.task('js', function(){
    browserify({
        extensions: ['.js','.jsx'],
        debug: false,
        entries: files.jsEntry
    }).transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .pipe(source('App.js'))
        .pipe(gulp.dest('./js/production'));
});

gulp.task('minify', function() {
    gulp.src('./js/production/App.js')
    .pipe(uglify())
    .pipe(rename("App.min.js"))
    .pipe(gulp.dest('./js/production/'));
});

gulp.task('browserify_tutorial', function(){
    var b = browserify();
    b.transform(reactify);
    b.add("./tutorial/js/app.js");
    return b.bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./tutorial/js/build'));
});

gulp.task('watch', function(){
    gulp.watch(files.scss, ['compass']);
    gulp.watch(files.js, ['js', 'minify']);
});

gulp.task('default',['js', 'minify','browserify_tutorial', 'compass']);