const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const del = require("del");
const autoprefixer = require("gulp-autoprefixer");

gulp.task("clean", async function () {
  await del("dist");
});

gulp.task("scss", function () {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 versions"],
        grid: true,
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

gulp.task("css", function () {
  return gulp
    .src([
      "node_modules/normalize.css/normalize.css",
      "node_modules/slick-carousel/slick/slick.css",
      "node_modules/animate.css/animate.css",
    ])
    .pipe(concat("_libs.scss"))
    .pipe(gulp.dest("app/scss"))
    .pipe(browserSync.stream());
});

gulp.task("html", function () {
  return gulp.src("app/*.html").pipe(browserSync.stream());
});

gulp.task("js", function () {
  return gulp
    .src([
      "node_modules/slick-carousel/slick/slick.js",
      "node_modules/wowjs/dist/wow.js",
    ])
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("app/js"))
    .pipe(browserSync.stream());
});

gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
});

gulp.task("export", async function () {
  await Promise.all([
    gulp.src("app/**/*.html").pipe(gulp.dest("dist")),
    gulp.src("app/css/**/*.css").pipe(gulp.dest("dist/css")),
    gulp.src("app/js/**/*.js").pipe(gulp.dest("dist/js")),
    gulp.src("app/fonts/**/*.*").pipe(gulp.dest("dist/fonts")),
    gulp.src("app/img/**/*.*").pipe(gulp.dest("dist/img")),
  ]);
});

gulp.task("watch", function () {
  gulp.watch("app/scss/**/*.scss", gulp.series("scss"));
  gulp.watch("app/*.html", gulp.series("html"));
  gulp.watch("app/js/*.js", gulp.series("js"));
});

gulp.task("build", gulp.series("clean", "export"));

gulp.task("default", gulp.parallel("css", "scss", "js", "browser-sync", "watch"));
