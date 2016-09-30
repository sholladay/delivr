'use strict';

const path = require('path');
const buildFiles = require('build-files');
const buildDir = require('build-dir');
const buildData = require('build-data');
const Scube = require('scube');
const contentType = require('./lib/content-type');
const maxAge = require('./lib/max-age');

const delivr = {};

delivr.prepare = (option) => {
    const config = Object.assign({}, option);
    const cwd = config.cwd = path.resolve(config.cwd || '');

    if (!config.bucket) {
        throw new Error('A bucket name is required to upload build files.');
    }

    const willDeploy = Boolean(config.deploy || (typeof config.deploy === 'undefined' && process.env.CI));

    const awsClient = new Scube({
        bucket : config.bucket
    });

    return buildData(config).then((data) => {
        const buildConfig = Object.assign({ cwd }, data);

        return buildDir.prepare(buildConfig).then((dir) => {
            return {
                path : dir.path,
                finalize() {
                    if (!willDeploy) {
                        return dir.finalize();
                    }

                    return dir.finalize()
                        .then(() => {
                            return buildFiles.latest(buildConfig);
                        })
                        .then((files) => {
                            const uploadFile = (file) => {
                                const payload = {
                                    key          : file.path,
                                    body         : file.content,
                                    aCL          : 'public-read',
                                    cacheControl : 'public, max-age=' + maxAge(file.path)
                                };
                                const type = contentType(file.path);
                                if (type) {
                                    payload.contentType = type;
                                }

                                return awsClient.upload(payload);
                            };

                            return Promise.all([
                                awsClient.deleteDir({
                                    prefix : path.posix.join(data.branch, data.version)
                                }),
                                awsClient.deleteDir({
                                    prefix : path.posix.join(data.branch, 'latest')
                                })
                            ]).then(() => {
                                return Promise.all(files.map(uploadFile));
                            });
                        });
                }
            };
        });
    });
};

module.exports = delivr;
