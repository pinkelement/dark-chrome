# Copyright 2019 Pink Element. All rights reserved.


PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

fixrefs := sed -i 's/\(\.js\|\.css\)/.min\1/g'
rwildcard = $(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2) $(filter $(subst *,%,$2),$d))

source_files := $(call rwildcard,src/,*)
build_files  := $(patsubst %.css,%.min.css,$(patsubst %.js,%.min.js,$(source_files:src/%=build/%)))


.PHONY: all dist build clean

all: dist
dist: dist/dark-chrome.crx
build: $(build_files)

dist/dark-chrome.crx: $(build_files)
	mkdir -p dist
	crx pack -o dist/dark-chrome.crx build

build/manifest.json: src/manifest.json
build/popup.html: src/popup.html

build/manifest.json build/popup.html:
	mkdir -p build
	cp $< $@
	$(fixrefs) $@

build/images/%: src/images/%
	mkdir -p build/images
	cp $< $@

build/%.min.css: src/%.css
	mkdir -p build
	cleancss --skip-rebase -o $@ $<

build/%.min.js: src/%.js
	mkdir -p build
	terser --comments -o $@ $<
	$(fixrefs) $@

clean:
	rm -rf build dist
