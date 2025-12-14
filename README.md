# cberes.com

My (Corey Beres) personal homepage at https://cberes.com.

## Building

You need [Perl](https://www.perl.org/), at least version 5.34.

Install dependencies:

    cpan -I Template::Toolkit XML::RSS

Run the build script:

    ./build

By default this will build the website in the `_site` directory.

### 11ty

Build the website to the `_site` directory:

    npx @11ty/eleventy

Build the website with a local web server:

    npx @11ty/eleventy --serve
