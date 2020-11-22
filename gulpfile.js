const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemap = require(`gulp-sourcemaps`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const sync = require(`browser-sync`).create();
const sassGlob = require(`gulp-sass-glob`);
// const csso = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const imageMin = require(`gulp-imagemin`);
const imageWebp = require(`gulp-webp`);
const svgStore = require(`gulp-svgstore`);
const del = require(`del`);
// const minify = require(`gulp-minify`);
// const htmlMin = require(`gulp-htmlmin`);

// Css

const css = () => {
  return gulp.src(`source/sass/style.scss`)
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    // .pipe(csso())
    // .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`source/css`))
    .pipe(sync.stream());
};

exports.css = css;

// Images

const images = () => {
  return gulp.src(`source/img/**/*.{jpg,png,svg}`)
    .pipe(imageMin([
      imageMin.optipng({
        optimizationLevel: 3
      }),
      imageMin.mozjpeg({
        progressive: true
      }),
      imageMin.svgo(),
    ]))
    .pipe(gulp.dest(`source/img`));
};

exports.images = images;

// WebP

const webp = () => {
  return gulp.src(`source/img/**/logo.png`)
    .pipe(imageWebp({
      quality: 70
    }))
    .pipe(gulp.dest(`source/img/webp`));
};

exports.webp = webp;

// Sprite

const sprite = () => {
  return gulp.src(`source/img/**/*.svg`)
    .pipe(svgStore())
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`source/img`));
};

exports.sprite = sprite;

// HTML

const html = () => {
  return gulp.src(`source/**/*.html`)
    // .pipe(htmlMin({
    //   removeComments: true,
    //   collapseWhitespace: true
    // }))
    .pipe(gulp.dest(`build`))
    .pipe(sync.stream());
};

exports.html = html;

// JS

const jsMin = () => {
  return gulp.src(`source/js/**/*.js`)
    // .pipe(minify({
    //   ext: {
    //     min: `.min.js`
    //   }
    // }))
    .pipe(gulp.dest(`build/js`))
    .pipe(sync.stream());
};

exports.jsMin = jsMin;

// Copy

const copy = () => {
  return gulp.src([
    `source/fonts/**/*`,
    `source/css/**/{style.css,style.min.css}`,
    `source/img/**/*`
  ], {
    base: `source`
  })
    .pipe(gulp.dest(`build`));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del(`build`);
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: `build`
    },
    port: 8080,
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Watcher

const watch = () => {
  gulp.watch(`source/sass/**/*.scss`, gulp.series(`css`));
  gulp.watch(`source/js/**/*.js`, gulp.series(`jsMin`));
  gulp.watch(`source/*.html`, gulp.series(`html`));
};

const build = gulp.series(
    clean,
    html,
    css,
    jsMin,
    copy
);

exports.build = build;

// Start

exports.default = gulp.series(
    gulp.parallel(
        build
    ),
    gulp.parallel(
        watch,
        server
    )
);
