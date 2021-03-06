'use strict'

import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import livereload from 'gulp-livereload';
import concat from 'gulp-concat';
import minifyCss from 'gulp-minify-css';
import postcss from 'gulp-postcss';
import scss from 'postcss-scss';
import stripInlineComments from 'postcss-strip-inline-comments';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import del from 'del';
import zip from 'gulp-zip';

// Image Compression
import imagemin from 'gulp-imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';

// File paths
const DIST_PATH = 'public/dist';
const SRC_PATH = 'public/src'
const SCRIPTS_PATH = `${SRC_PATH}/scripts/**/*.js`
const SCSS_PATH = `${SRC_PATH}/scss/**/*.scss`;
const IMAGES_PATH = `${SRC_PATH}/images/**/*.{png,jpeg,jpg,svg,gif}`;
const SERVER_PATH = './server.js';

// Helpers
const siteName = 'archive';

// Styles For SCSS
gulp.task('styles', () => {
    let processors = [stripInlineComments];
    return gulp.src([`${SRC_PATH}/scss/main.scss`])
        .pipe(postcss(processors, {syntax: scss}))
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
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngquant(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest(`${DIST_PATH}/images`));
});

gulp.task('clean', () => {
    // Removes dist folder everytime it is run, starting from a clean slate.    
    return del.sync([
        DIST_PATH
    ]);
});

gulp.task('default', ['clean', 'images', 'styles', 'scripts'], () => {

});

gulp.task('export', () => {
    return gulp.src('public/**/*')
        .pipe(zip(`${siteName}.zip`))
        .pipe(gulp.dest('./'))
});

gulp.task('watch', ['default'], () => {
    require(SERVER_PATH);
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(SCSS_PATH, ['styles']);    
});