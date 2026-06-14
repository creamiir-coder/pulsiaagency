module.exports = function(eleventyConfig) {

  // Static assets
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Filters
  eleventyConfig.addFilter("activeOnly", (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => item.active !== false);
  });

  eleventyConfig.addFilter("featuredOnly", (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => item.featured === true && item.active !== false);
  });

  eleventyConfig.addFilter("limit", (arr, n) => {
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, n);
  });

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
