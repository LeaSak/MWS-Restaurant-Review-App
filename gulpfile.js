const gulp = require('gulp'),
	imageResize = require('gulp-image-resize'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	changed = require('gulp-changed');

const bases = {
	src: 'src/',
	dist: 'dist/'
};

const paths = {
	html: ['index.html', 'restaurants.html'],
	css: ['css','css/styles'],
	js: ['js','js/dbhelper.js', 'js/main.js', 'js/restaurant_info.js'],
	assets: ['img/','img/**/*.jpg'],
	data: ['restaurants.json']
};

const sizes = [400, 600, 800, 1200, 1500, 2000];
const resizeImageTasks = [];

gulp.task('default', () => {
  // place code for your default task here
  console.log("Gulp is set up");
});

sizes.forEach((size) => {
	const prefix = "-" + size;
	gulp.task(prefix, () => {
	return gulp.src(bases.src + paths.assets[1])
		/*.pipe(changed(bases.dist + paths.assets[0]))*/
		.pipe(imageResize({
			width: size
		}))
		.pipe(rename(function (path){path.basename += prefix;}))
		.pipe(gulp.dest(bases.src + paths.assets[0]))
	});
	resizeImageTasks.push(prefix);
});

gulp.task('optimize-images', ['resizeImages'], () => {
	return gulp.src(bases.src + paths.assets[1])
	.pipe(imagemin([imagemin.jpegtran({progressive: true, optimizationLevel: 7})]))
	.pipe(gulp.dest(bases.dist))
});

gulp.task('resizeImages', resizeImageTasks);