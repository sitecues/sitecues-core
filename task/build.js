'use strict';

const fs = require('fs');
const path = require('path');
const { rollup } = require('rollup');
const buildDir = require('build-dir');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const appName = require('../package.json').name;

let banner;
let bundle;
let dir;

const build = () => {
    return rollup({
        entry   : 'lib/run.js',
        plugins : [
            json({
                include : [
                    'package.json'
                ]
            }),
            babel({
                exclude : [
                    'node_modules/**'
                ],
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

            const babelPolyfill = new Promise((resolve, reject) => {
                const polyfillPath = require.resolve('babel-polyfill/dist/polyfill');
                fs.readFile(polyfillPath, 'utf8', (err, content) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(content);
                });
            });

            const fetchPolyfill = new Promise((resolve, reject) => {
                const fetchPath = require.resolve('whatwg-fetch');
                fs.readFile(fetchPath, 'utf8', (err, content) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(content);
                });
            });

            return Promise.all([
                babelPolyfill,
                fetchPolyfill
            ]);
        })
        .then((polyfills) => {
            banner = polyfills.join('');
            return buildDir.prepare();
        })
        .then((dirData) => {
            dir = dirData;
            return bundle.write({
                format    : 'iife',
                banner,
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
