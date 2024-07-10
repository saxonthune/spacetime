const markdownIt = require("markdown-it");
const pluginImages = require("./eleventy.config.images.js");
const pluginShortcodes = require("./eleventy.config.shortCodes.js");

module.exports = function(eleventyConfig) {

    const md = markdownIt({
        html: true,
        linkify: true
    }).use(require("markdown-it-footnote"));

    eleventyConfig.setLibrary("md", md);


    eleventyConfig.addPassthroughCopy("./public");

    eleventyConfig.addWatchTarget("public/**/*.{svg,webp,png,jpeg}");

    eleventyConfig.addPlugin(pluginImages);
    eleventyConfig.addPlugin(pluginShortcodes);
};
