const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');

gulp.task('clean', async function () {
    await del('lib/**');
    await del('es/**');
    await del('dist/**');
});

gulp.task('cjs', function () {
    const tsProject = ts.createProject('tsconfig.json', {
        module: 'CommonJS',
    });
    return tsProject
        .src()
        .pipe(tsProject())
        .pipe(
            babel({
                configFile: '../../.babelrc',
            }),
        )
        .pipe(gulp.dest('lib/'));
});

gulp.task('es', function () {
    const tsProject = ts.createProject('tsconfig.json', {
        module: 'ESNext',
    });
    return tsProject
        .src()
        .pipe(tsProject())
        .pipe(
            babel({
                configFile: '../../.babelrc',
            }),
        )
        .pipe(gulp.dest('es/'));
});

gulp.task('declaration', function () {
    const tsProject = ts.createProject('tsconfig.json', {
        declaration: true,
        emitDeclarationOnly: true,
    });
    return tsProject.src().pipe(tsProject()).pipe(gulp.dest('es/')).pipe(gulp.dest('lib/'));
});

gulp.task('copyReadme', async function () {
    await gulp.src('../../README.md').pipe(gulp.dest('../../packages/hooks'));
});

gulp.task('copyLICENSE', async function () {
    await gulp.src('../../LICENSE').pipe(gulp.dest('../../packages/hooks'));
});

gulp.task('unpkg', function() {
    return gulp.src('es/index.js')
        .pipe(webpack(require('./packages/hooks/webpack.config.js')))
        .pipe(gulp.dest('dist/'));
});

exports.default = gulp.series('clean', 'cjs', 'es', 'declaration', 'copyReadme', 'copyLICENSE', 'unpkg');