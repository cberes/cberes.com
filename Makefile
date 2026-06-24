all: build

build:
	npx @11ty/eleventy

serve:
	npx @11ty/eleventy --serve

init:
	npm install

