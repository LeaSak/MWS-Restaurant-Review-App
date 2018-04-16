const gulp = require('gulp'),
	imageResize = require('gulp-image-resize'),
	rename = require('gulp-rename'),
	htmlmin = require('gulp-htmlmin'),
	cssnano = require('gulp-cssnano'),
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
	css: ['css/','css/styles.css'],
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

/* Minify CSS */
gulp.task('minify-css', () => {
	return gulp.src(bases.src + paths.css[1])
		.pipe(sourcemaps.init())
		.pipe(cssnano())
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
    gulp.watch(bases.src + paths.css[1], ['minify-css']);
    gulp.watch(bases.src + paths.html[0], ['minify-html']);
    gulp.watch(bases.src + paths.sw[0], ['copy-sw']);
    gulp.watch(bases.src + paths.vendor[1], ['copy-lib']);

});

/* Build task */
gulp.task('build', ['minify-js', 'copy-sw', 'copy-lib', 'minify-css', 'minify-html', 'optimize-images']);

/* Default task */
gulp.task('default', ['watch']);



