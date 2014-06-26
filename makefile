################################################################################
# sitecues Fallback Library Makefile
################################################################################

################################################################################
# DEFAULT TARGET: all
# 	(To keep this target as the defauly target, this target must be
#	 declared before all other targets).
# 	Clean the target direcetory, update Node.js dependecies, and build the
#	JavaScript library.
################################################################################
all: clean build

################################################################################
# Command line options.
################################################################################
# Whether or not to minify the generated sitecues.js file.
min=true

# The build version.
export version=$(default-version)

################################################################################
# Tools
################################################################################
export md5sum:=$(shell which 'md5sum' > /dev/null 2>&1 && echo 'md5sum' || echo 'md5 -q')
export rmd5=$(shell echo "$$(hostname)$$(date +'%s%N')" | $(md5sum) | cut -f 1 -d ' ')
export to-upper=tr '[:lower:]' '[:upper:]'

################################################################################
# Settings/constants.
################################################################################

# The name of the project.
export product-name=sitecues-fallback

# The default version, used in absence of a supplied version.
default-version:=$(shell date -u +'%Y%m%d%H%M%S')-LOCAL

build-dir:=target
package-name:=$(product-name)-$(version)
package-file-name:=$(package-name).tgz
package-basedir:=$(build-dir)/package
package-dir:=$(package-basedir)/$(package-name)

################################################################################
# Processed and conditional settings.
################################################################################

# If the 'min' option is 'false', set uglify-js options that beautify the
# code. Otherwise set uglify-js options that minify the code. 
ifeq ($(min), false)
	export uglifyjs-args+=-b
	export min-label:=" \(files were not minified\)"
else
	export uglifyjs-args+=-m
	export min-label:=
endif

################################################################################
# TARGET: build
#	Build the compressed file and, optionally, run gjslint.
################################################################################
build:
	@echo "===== STARTING: Building fallback library"
	@mkdir -p $(build-dir)/src/js
	@sed 's%UNVERSIONED%'$(version)'%g' src/js/sitecues-fallback.js > $(build-dir)/src/js/sitecues-fallback.js
	@mkdir -p $(build-dir)/compile/js
	@uglifyjs $(uglifyjs-args) -o $(build-dir)/compile/js/sitecues-fallback.js --src-map $(build-dir)/compile/js/sitecues-fallback.js.map --src-map-url sitecues-fallback.js.map $(build-dir)/src/js/sitecues-fallback.js
	@(for F in `ls -d src/* | grep -Ev '^src/js$$'` ; do cp -r $$F $(build-dir)/etc ; done)
	@echo "Creating compressed (gzipped) JavaScript files."
	@(cd $(build-dir)/compile/js ; for FILE in *.js ; do \
		gzip -c $$FILE > $$FILE.gz ; \
	done)
ifneq ($(dev), true)
	@echo "* File sizes$(min-label):"
	@(cd $(build-dir)/compile/js ; \
	for FILE in `ls *.js *.js.gz | sort` ; do \
		printf "*  %-16s $$(ls -lh $$FILE | awk '{print($$5);}')\n" $$FILE ; \
	done)
endif
	@echo "===== COMPLETE: Building fallback library"
	@echo

################################################################################
# TARGET: package
#	Package up the files into a deployable bundle, and create a manifest for local file deployment
################################################################################
package: build
ifeq ($(dev), true)
	$(error Unable to package a development build)
endif
	@echo "===== STARTING: Packaging fallback library"
	@mkdir -p $(package-dir)
	@echo $(version) > $(package-dir)/VERSION.TXT
	@cp -R $(build-dir)/compile/* $(package-dir)
	@cp -R src/css $(package-dir)
	@cp -R src/img $(package-dir)
	@tar -C $(package-basedir) -zcf $(build-dir)/$(package-file-name) $(package-name)
	@echo "===== COMPLETE: Packaging fallback library"
	@echo

################################################################################
# TARGET: clean
#	Clean the target directory.
################################################################################
clean:
	@echo "Cleaning started."
	@rm -fr target
	@echo "Cleaning completed."

