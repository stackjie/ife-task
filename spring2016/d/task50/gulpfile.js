var gulp  = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-clean-css');

gulp.task('js',function(){
    gulp.src('js/*')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.')) 
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css',function(){
    gulp.src('less/main/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: true
        }))
        .pipe(sourcemaps.init())
        .pipe(minifyCss({
            compatibility: 'ie8',
            advanced: false,
            keepSpecialComments: '*'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.')) 
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch',function(){
    gulp.watch('less/**/*.less',['css'])
});

gulp.task('default',['css','js']);
