'use strict';

const fs = require('fs');
const path = require('path');
const cpy = require('cpy');
const delivr = require('delivr');
const buildVersion = require('build-version');
const appName = require('read-pkg-up').sync(__dirname).pkg.name;
const { rollup } = require('rollup');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');

const readDep = (depName) => {
    return new Promise((resolve, reject) => {
        const filePath = require.resolve(depName);
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(content);
        });
    });
};

const build = () => {
    const bundleConf = {
        entry   : 'lib/js/run.js',
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
    };

    let version;
    const createBundle = () => {
        return buildVersion().then((ver) => {
            version = ver;
            bundleConf.plugins.unshift(replace({
                include    : 'lib/js/meta.js',
                delimiters : ['<@', '@>'],
                values     : {
                    BUILD_VERSION : version
                }
            }));
            return rollup(bundleConf);
        });
    };

    return Promise.all([
        createBundle(),
        Promise.all([
            'babel-polyfill/dist/polyfill',
            'whatwg-fetch'
        ].map(readDep))
    ]).then((prereq) => {
        const [bundle, polyfills] = prereq;
        const delivrConfig = {
            version,
            bucket : appName
        };
        return delivr.prepare(delivrConfig).then((dir) => {
            return Promise.all([
                cpy(['{html,css,img}/**'], dir.path, {
                    cwd     : 'lib',
                    parents : true,
                    nodir   : true
                }),
                bundle.write({
                    format    : 'iife',
                    banner    : polyfills.join(''),
                    dest      : path.join(dir.path, 'js', 'sitecues.js'),
                    sourceMap : true
                })
            ]).then(() => {
                // Move the temp dir to its permanent home and set up
                // latest links.
                return dir.finalize();
            });
        });
    });
};

module.exports = build;
