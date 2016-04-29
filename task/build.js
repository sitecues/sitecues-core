'use strict';

const
    fs = require('fs'),
    rollup = require('rollup'),
    path = require('path'),
    buildDir = require('build-dir'),
    babel = require("rollup-plugin-babel");

function build() {
    return rollup.rollup({
            entry : 'lib/start.js',
            plugins : [
                babel({
                    plugins : [
                        ['transform-es2015-classes', {loose: true}]
                    ],
                    presets : [
                        'es2015-rollup'
                    ]
                })
            ]
        })
        .then((bundle) => {
            return buildDir.prepare().then((dir) => {
                return bundle.write({
                        format : 'iife',
                        banner : fs.readFileSync('./lib/polyfill.js', 'utf8'),
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
