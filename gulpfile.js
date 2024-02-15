
const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const pug = require('gulp-pug');

function scripts() {
  return src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(concat('style.min.scss'))
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function pugToHtml() {
  return src('app/pug/*.pug')
    .pipe(pug())
    .pipe(dest('app'))
    .pipe(browserSync.stream());
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  })
  watch(['app/scss/style.scss'], styles);
  watch(['app/js/main.js'], scripts);
  watch(['app/pug//*.pug'], pugToHtml);
  watch(['app/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
  return src('dist').pipe(clean())
}

function images() {
  return src(['app/images/*.*'])
    .pipe(newer('app/images/dist'))
    // .pipe(src('app/images/src/*.*'))
    // .pipe(newer('app/images/dist'))
    .pipe(imagemin())
    .pipe(dest('app/images/dist'))
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app//*.html'
  ], { base: 'app' })
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;

exports.build = series(cleanDist, parallel(styles, scripts, pugToHtml, images), building)
exports.default = parallel(styles, scripts, pugToHtml, watching)
