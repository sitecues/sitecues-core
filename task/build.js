'use strict';

const fs = require('fs');
const path = require('path');
const { rollup } = require('rollup');
const buildDir = require('build-dir');
const babel = require('rollup-plugin-babel');
const appName = require('../package.json').name;

let polyfill;
let bundle;
let dir;

const build = () => {
    return rollup({
        entry   : 'lib/start.js',
        plugins : [
            babel({
                plugins : [
                    ['transform-es2015-classes', { loose : true }]
                ],
                presets : [
                    'es2015-rollup'
                ]
            })
        ]
    })
        .then((bundleData) => {
            bundle = bundleData;
            return new Promise((resolve, reject) => {
                const polyfillPath = path.resolve(__dirname, '..', 'lib', 'polyfill.js');
                fs.readFile(polyfillPath, 'utf8', (err, content) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(content);
                });
            });
        })
        .then((polyfilleData) => {
            polyfill = polyfillData;
            return buildDir.prepare();
        })
        .then((dirData) => {
            dir = dirData;
            return bundle.write({
                format    : 'iife',
                banner    : polyfill,
                dest      : path.join(dir.path, appName + '.js'),
                sourceMap : true
            });
        })
        .then(() => {
            // Move the temp dir to its permanent home and set up
            // latest links.
            return dir.finalize();
        });
};

module.exports = build;
