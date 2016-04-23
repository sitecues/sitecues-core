'use strict';

const
    rollup = require('rollup'),
    path = require('path'),
    buildDir = require('build-dir');

function build() {
    return rollup.rollup({
            entry : 'lib/run.js'
        })
        .then((bundle) => {
            return buildDir.prepare().then((dir) => {
                return bundle.write({
                        format : 'iife',
                        dest   : path.join(dir.path, 'sitecues-fallback.js'),
                        sourceMap : true
                    })
                    .then(() => {
                        // Move the temp dir to its permanent home and set up
                        // latest links.
                        return dir.finalize();
                    });
            });
        });
}

module.exports = build;
