const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPairedAsyncShortcode(
        "aside-md", 
        async function(content, cssClass) {
            const md = markdownIt();
            const renderedContent = await md.render(content);
            return `<aside class="${cssClass}">${renderedContent}</aside>`;
        
        }
    );
};