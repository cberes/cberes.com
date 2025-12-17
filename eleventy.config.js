import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import { JSDOM } from 'jsdom';

export default function (eleventyConfig) {
  // Global data
  eleventyConfig.addGlobalData('windowTitle', 'cberes');
  eleventyConfig.addGlobalData('siteTitle', 'Corey Beres');

  // Copy files
  eleventyConfig.addPassthroughCopy({assets: '/'});
  eleventyConfig.addPassthroughCopy('articles/**/*.png');

  // Collections
  eleventyConfig.addCollection('tagsList', collectionApi => {
    const tags = collectionApi.getAll()
      .flatMap(item => item.data.tags || [])
      .reduce((acc, tag) => {
        acc.add(tag);
        return acc;
      }, new Set());
    tags.delete('articles');
    return [...tags];
  });

  // RSS
  eleventyConfig.addPlugin(feedPlugin, {
    type: 'atom',       // or 'rss', 'json'
    outputPath: '/rss.xml',
    collection: {
      name: 'articles', // iterate over `collections.articles`
      limit: 0,         // 0 means no limit
    },
    metadata: {
      language: 'en',
      title: 'cberes',
      subtitle: 'Personal homepage for Corey Beres. Mostly thoughts about software and skateboards.',
      base: 'https://cberes.com/',
      author: {
        name: 'Corey Beres',
        email: '',      // Optional
      }
    }
  });

  // Summary shortcode
  eleventyConfig.addShortcode('summarize', function (item) {
    const dom = new JSDOM(item.content);
    const summary = dom.window.document.getElementById('summary'); 
    return (summary || dom.window.document.querySelector('p')).textContent;
  });

  // Nunjucks filters
  eleventyConfig.addNunjucksFilter('firstItems', function(array, count) {
    return array.slice(0, count);
  });
};
