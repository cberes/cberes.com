import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import { JSDOM } from 'jsdom';
import slugify from '@sindresorhus/slugify';
import tags from './tags.js';

export default function (eleventyConfig) {
  // Global data
  eleventyConfig.addGlobalData('windowTitle', 'cberes');
  eleventyConfig.addGlobalData('siteTitle', 'Corey Beres');

  // Copy files
  eleventyConfig.addPassthroughCopy({assets: '/'});
  eleventyConfig.addPassthroughCopy('articles/**/*.png');

  // Collections
  eleventyConfig.addCollection('tagsList', collectionApi => {
    const knownTags = new Set(tags);
    const tagMap = collectionApi.getAll()
      .flatMap(item => item.data.tags || [])
      .reduce((acc, tag) => {
        if (!acc.has(tag)) {
          acc.set(tag, { name: tag, count: 0 });
        }
        acc.get(tag).count += 1;
        return acc;
      }, new Map());
    tagMap.delete('articles'); // all items have this tag

    // check that we know all tags and all known tags are actually used
    const foundTags = new Set(tagMap.keys());
    if (!setEquals(knownTags, foundTags)) {
      const tagsToAdd = foundTags.difference(knownTags);
      const tagsToRemove = knownTags.difference(foundTags);
      throw new Error(`Update list of tags! Add: ${[...tagsToAdd]} Remove: ${[...tagsToRemove]}`);
    }

    // return values only, sorted by name
    return [...tagMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  // add templates for all tags
  tags.forEach(tag => {
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

function setEquals(a, b) {
  return a === b || (a.size === b.size && [...a].every((it => b.has(it))));
}
