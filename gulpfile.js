const gulp = require('gulp'),
	imageResize = require('gulp-image-resize'),
	rename = require('gulp-rename'),
	htmlmin = require('gulp-htmlmin'),
	sass = require('gulp-sass'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano'),
	postcss = require('gulp-postcss'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	webp = require('gulp-webp'),
	pump = require('pump');

const bases = {
	src: 'src/',
	dist: 'dist/'
};

const paths = {
	html: ['*.html','index.html', 'restaurants.html'],
	sass: ['scss/', 'scss/**/*.scss', 'scss/app-main.scss', 'scss/app-restaurant.scss', 'scss/app-600.scss'],
	css: ['css/','css/**/*.css'],
	js: ['js/','js/**/*.js','js/dbhelper.js', 'js/main.js', 'js/restaurant_info.js'],
	assets: ['img/','img/*.jpg','img/tmp/','img/tmp/**/*.jpg'],
	vendor: ['lib/', 'lib/**/*.js'],
	sw: ['sw.js']
};

const sizes = [400, 600, 800, 1200, 1500, 2000];
const resizeImageTasks = [];



/* Minify HTML files*/
gulp.task('minify-html', () => {
	return gulp.src(bases.src + paths.html[0])
	.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(bases.dist));
});

// Look here for sass gulp task setup: https://www.npmjs.com/package/node-normalize-scss
gulp.task('sass', function () {
	var plugins = [
		autoprefixer({browsers:['last 2 versions'], cascade: false}),
		cssnano()
	];
  return gulp.src([bases.src + paths.sass[1]])
  	.pipe(sourcemaps.init())
    .pipe(sass({
    	outputStyle: 'expanded',
    	includePaths: require('node-normalize-scss').includePaths
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(bases.dist + paths.css[0]));
});

/* Make responsive images*/
sizes.forEach((size) => {
	const prefix = "-" + size;
	gulp.task(prefix, () => {
	return gulp.src(bases.src + paths.assets[1])
		.pipe(imageResize({
			width: size
		}))
		.pipe(rename(function (path){path.basename += prefix;}))
		.pipe(gulp.dest(bases.src + paths.assets[2]));
	});
	resizeImageTasks.push(prefix);
});

gulp.task('resize-images', resizeImageTasks);

/* Optimize images */
gulp.task('optimize-images', ['resize-images'], () => {
	return gulp.src(bases.src + paths.assets[3])
	.pipe(webp())
	.pipe(gulp.dest(bases.dist + paths.assets[0]));
});

/* Minify JS, sourcemaps, uglify */
gulp.task('minify-js', () => {
	return gulp.src(bases.src + paths.js[1])
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(bases.dist + paths.js[0]));
});

/* Copy service worker*/
gulp.task('copy-sw', () => {
	return gulp.src(bases.src + paths.sw[0])
	.pipe(gulp.dest(bases.dist));
});

/* Copy service worker*/
gulp.task('copy-lib', () => {
	return gulp.src(bases.src + paths.vendor[1])
	.pipe(gulp.dest(bases.dist + paths.vendor[0]));
});


/* Watch */
gulp.task('watch', ['build'], () => {
    gulp.watch(bases.src + paths.js[1], ['minify-js']);
    gulp.watch(bases.src + paths.sass[1], ['sass']);
    gulp.watch(bases.src + paths.html[0], ['minify-html']);
    gulp.watch(bases.src + paths.sw[0], ['copy-sw']);
    gulp.watch(bases.src + paths.vendor[1], ['copy-lib']);

});

/* Build task */
gulp.task('build', ['minify-js', 'copy-sw', 'copy-lib', 'sass', 'minify-html', 'optimize-images']);

/* Default task */
gulp.task('default', ['watch']);



