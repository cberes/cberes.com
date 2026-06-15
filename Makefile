all: build

build:
	npx @11ty/eleventy

dev:
	npx @11ty/eleventy --serve

init:
	npm install

