module.exports = function(eleventyConfig) {

  // Копируем папку assets как есть
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
