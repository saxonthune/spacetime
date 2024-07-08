const pluginImages = require("./eleventy.config.images.js");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./public");

    eleventyConfig.addWatchTarget("public/**/*.{svg,webp,png,jpeg}");

    eleventyConfig.addPlugin(pluginImages);
};
