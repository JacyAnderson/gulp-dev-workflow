const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const concat = require('gulp-concat');
const minifyCss = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');

// File paths
const DIST_PATH = 'public/dist';
const SCRIPTS_PATH = 'public/scripts/**/*.js'
const SCSS_PATH = 'public/scss/**/*.scss';

// Styles For SCSS
gulp.task('styles', () => {
    console.log('Starting styles task');
    return gulp.src(['public/scss/styles.scss'])
        .pipe(plumber(function (err) {
            console.log('Style Task Error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())        
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8'],
            cascade: false
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())  
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

// Scripts
gulp.task('scripts', () => {
    console.log('Starting scripts task');
    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function(err) {
            console.log('Scripts Task Error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});
// Images
gulp.task('images', () => {
    console.log('Starting images task');
});

gulp.task('default', () => {
    console.log('Starting default task');
});

gulp.task('watch', () => {
    console.log('Starting watch task'); 
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(SCSS_PATH, ['styles']);    
});