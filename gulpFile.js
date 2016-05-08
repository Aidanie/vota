var gulp = require('gulp');
var browserify = require('browserify');
var gutil = require('gulp-util');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var babel = require('babelify');
var eslint = require('gulp-eslint');

gulp.task('js', function(){

  return gulp.src('js/*.js', {read: false}) // no need of reading file because browserify does.
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())

   // transform file objects using gulp-tap plugin
   .pipe(tap(function (file) {

     gutil.log('bundling ' + file.path);

     // replace file contents with browserify's bundle stream
     file.contents = browserify(file.path, {debug: true}).transform(babel).bundle();

   }))

   // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
   .pipe(buffer())

   // load and init sourcemaps
   .pipe(sourcemaps.init({loadMaps: true}))

   .pipe(uglify())

   // write sourcemaps
   .pipe(sourcemaps.write('./'))

   .pipe(gulp.dest('public/dist'));

});
