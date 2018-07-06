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
    concat = require('gulp-concat'),
    webp = require('gulp-webp'),
    responsive = require('gulp-responsive'),
    // critical = require('critical'),
    pump = require('pump');

const bases = {
    src: 'src/',
    dist: 'dist/'
};

const paths = {
    html: ['**/*.html', 'index.html', 'restaurants.html'],
    sass: ['scss/', 'scss/**/*.scss'],
    css: ['css/', 'css/**/*.css'],
    js: ['js/', 'js/*.js', 'js/dbhelper.js', 'js/main.js', 'js/restaurant_info.js', 'js/offline.js'],
    vendor: ['js/vendor','js/vendor/**/*.min.js', 'js/vendor/idb.js'],
    assets: ['img/', 'img/**/*.jpg', 'img/*.jpg', 'img/webp/'],
    icons: ['icons/**/*'],
    sw: ['sw.js'],
    manifest: ['manifest.json']
};


// Copy and minify HTML, send to dist
gulp.task('html', () => {
    return gulp.src(bases.src + paths.html[0])
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(bases.dist));
});

// Copy,compile, minify SASS/CSS
gulp.task('css', function() {
    var plugins = [
        autoprefixer({ browsers: ['last 2 versions'], cascade: false }),
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

// // Critical CSS: Index.html
// gulp.task('critical:main', ['build'], () => {
//     return critical.generate({
//         base: 'dist/',
//         src: 'index.html',
//         dest: 'index.html',
//         inline: true,
//         css: ['dist/css/app-main.css', 'dist/css/app-600.css'],
//         // minify: true,
//         width: 320,
//         height: 730
//         })
// });

// JS
gulp.task('js', () => {
    return gulp.src(bases.src + paths.js[1])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(bases.dist + paths.js[0]));
});

// Copy Service Worker
gulp.task('sw', () => {
    return gulp.src(bases.src + paths.sw[0])
        .pipe(sourcemaps.init())
        .pipe(babel())
    	.pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(bases.dist));
});

// Copy Manifest
gulp.task('manifest', () => {
    return gulp.src(bases.src + paths.manifest[0])
    .pipe(gulp.dest(bases.dist));
});

// Convert to webp
gulp.task('webp', () => {
    return gulp.src(bases.src + paths.assets[1])
        .pipe(webp())
        .pipe(gulp.dest(bases.src + paths.assets[3]));
});

gulp.task('assets', ['webp'], () => {
    return gulp.src('src/img/**/*')
        .pipe(responsive({
            '**/*.webp': [{
                    width: 400,
                    rename: { suffix: '-400' }
                },
                {
                    width: 600,
                    rename: { suffix: '-600' }
                },
                {
                    width: 800,
                    rename: { suffix: '-800' }
                }],
              '*.jpg': [{
              		width: 600,
                    rename: { suffix: '-600' }
              }]
        },{
            // Global configuration for all images
            // The output quality for JPEG, WebP and TIFF output formats
            quality: 85,
            // Use progressive (interlace) scan for JPEG and PNG output
            progressive: true,
            // Strip all metadata
            withMetadata: false,
        }))
        .pipe(gulp.dest(bases.dist + paths.assets[0]));
})

/* Icons */
gulp.task('icons', () => {
    return gulp.src(bases.src + paths.icons[0])
    .pipe(gulp.dest(bases.dist + 'icons/'));
});

gulp.task('vendor', ['uglify:vendor'], () => {
	return gulp.src(bases.src + paths.vendor[1])
	.pipe(gulp.dest(bases.dist + paths.vendor[0]));
});

gulp.task('uglify:vendor', () => {
	return gulp.src(bases.src + paths.vendor[2])
	.pipe(uglify())
	.pipe(rename("idb.min.js"))
	.pipe(gulp.dest(bases.src + paths.vendor[0]));
});

/* Watch */
gulp.task('watch', ['build'], () => {
    gulp.watch(bases.src + paths.js[1], ['js']);
    gulp.watch(bases.src + paths.sass[1], ['css']);
    gulp.watch(bases.src + paths.html[0], ['html']);
    gulp.watch(bases.src + paths.sw[0], ['sw']);
    gulp.watch(bases.src + paths.manifest[0], ['manifest']);
    gulp.watch(bases.src + 'icons/*.png', ['icons']);

});

/* Build task */
gulp.task('build', ['js', 'vendor','sw', 'manifest', 'css', 'html', 'assets', 'icons']);

/* Default task */
gulp.task('default', ['watch']);