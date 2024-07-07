module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./public");

    eleventyConfig.addWatchTarget("public/**/*.{svg,webp,png,jpeg}");
};
