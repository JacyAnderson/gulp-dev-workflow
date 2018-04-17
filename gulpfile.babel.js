import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import livereload from 'gulp-livereload';
import concat from 'gulp-concat';
import minifyCss from 'gulp-minify-css';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';

// Image Compression
import imagemin from 'gulp-imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';

// File paths
const DIST_PATH = 'public/dist';
const SCRIPTS_PATH = 'public/scripts/**/*.js'
const SCSS_PATH = 'public/scss/**/*.scss';
const IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

// Styles For SCSS
gulp.task('styles', () => {
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

gulp.task('default', ['images', 'styles', 'scripts'], () => {
});

gulp.task('watch', ['default'], () => {
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(SCSS_PATH, ['styles']);    
});