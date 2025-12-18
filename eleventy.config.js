import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import { JSDOM } from 'jsdom';
import slugify from '@sindresorhus/slugify';

function setEquals(a, b) {
  return a === b || (a.size === b.size && [...a].every((it => b.has(it))));
}

export default function (eleventyConfig) {
  // Global data
  eleventyConfig.addGlobalData('windowTitle', 'cberes');
  eleventyConfig.addGlobalData('siteTitle', 'Corey Beres');

  // Copy files
  eleventyConfig.addPassthroughCopy({assets: '/'});
  eleventyConfig.addPassthroughCopy('articles/**/*.png');

  const knownTags = new Set(['skateboarding', 'software', 'attention']);

  // Collections
  eleventyConfig.addCollection('tagsList', collectionApi => {
    const tags = collectionApi.getAll()
      .flatMap(item => item.data.tags || [])
      .reduce((acc, tag) => {
        acc.add(tag);
        return acc;
      }, new Set());
    tags.delete('articles');

    // check that we know all tags and all known tags are actually used
    if (!setEquals(knownTags, tags)) {
      const tagsToAdd = tags.difference(knownTags);
      const tagsToRemove = knownTags.difference(tags);
      throw new Error(`Update list of tags! Add: ${[...tagsToAdd]} Remove: ${[...tagsToRemove]}`);
    }
    return [...tags];
  });

  // add templates for all tags
  knownTags.forEach(tag => {
    eleventyConfig.addTemplate(`tags/${slugify(tag)}.njk`, `<p>All articles with the tag <em>${tag}</em></p>`, {
      layout: 'paged.njk',
      title: tag,
      pagination: {
        data: `collections.${tag}`,
        reverse: true,
        size: 6
      }
    });
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
