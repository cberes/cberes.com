import { feedPlugin } from '@11ty/eleventy-plugin-rss';

export default function (eleventyConfig) {
  eleventyConfig.addGlobalData('windowTitle', 'cberes');
  eleventyConfig.addGlobalData('siteTitle', 'Corey Beres');
  eleventyConfig.addPassthroughCopy('assets/*');
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/rss.xml",
		collection: {
			name: "articles", // iterate over `collections.posts`
			limit: 0,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "cberes",
			subtitle: "Personal homepage for Corey Beres. Mostly thoughts about software and skateboards.",
			base: "https://cberes.com/",
			author: {
				name: "Corey Beres",
				email: "", // Optional
			}
		}
	});

  eleventyConfig.addNunjucksFilter("firstItems", function(array, count) {
    return array.slice(0, count);
  });
};
