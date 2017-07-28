'use strict';

const path = require('path');
const buildFiles = require('build-files');
const buildDir = require('build-dir');
const buildData = require('build-data');
const Scube = require('scube');
const mimeTypes = require('mime-types');
const maxAge = require('./lib/max-age');

const delivr = {};

delivr.prepare = async (option) => {
    const config = Object.assign({}, option);
    const cwd = config.cwd = path.resolve(config.cwd || '');

    if (!config.bucket) {
        throw new Error('A bucket name is required to upload build files.');
    }

    const willDeploy = Boolean(config.deploy || (typeof config.deploy === 'undefined' && process.env.CI));

    const awsClient = new Scube({
        bucket : config.bucket
    });

    const buildConf = Object.assign({ cwd }, await buildData(config));

    const dir = await buildDir.prepare(buildConf);

    return {
        path : dir.path,
        async finalize() {
            await dir.finalize();

            if (!willDeploy) {
                return;
            }

            const files = await buildFiles.latest(buildConf);

            const uploadFile = (file) => {
                const payload = {
                    key          : file.path,
                    body         : file.content,
                    aCL          : 'public-read',
                    cacheControl : 'public, max-age=' + maxAge(file.path)
                };
                const type = mimeTypes.contentType(path.extname(file.path));
                if (type) {
                    payload.contentType = type;
                }

                return awsClient.upload(payload);
            };

            await Promise.all([
                awsClient.deleteDir({
                    prefix : path.posix.join(buildConf.branch, buildConf.version)
                }),
                awsClient.deleteDir({
                    prefix : path.posix.join(buildConf.branch, 'latest')
                })
            ]);

            return Promise.all(files.map(uploadFile));
        }
    };
};

module.exports = delivr;
