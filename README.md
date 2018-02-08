# delivr [![Build status for delivr](https://img.shields.io/circleci/project/sholladay/delivr/master.svg "Build Status")](https://circleci.com/gh/sholladay/delivr "Builds")

> Build your code and ship it to S3

This is a multi-version release and deployment system, optimized for client-side applications.

Your builds are locally stored during development and automatically sent to Amazon S3 in CI. Your git branch is used to namespace each build and versioning is handled gracefully, with immutable, meaningful version numbers derived from package.json and your git repository state.

All branches are treated equally, all versions are kept around, and symlinks for the `latest` build of a given branch are provided. This makes both development and release extremely simple. Your app server can release a build simply by deciding which branch it wants to point to. And it can either use the `latest` build of that branch or a specific version. Because builds are immutable, they are cached for long periods of time, and rollbacks are easy.

## Why?

 - No more complicated, untested, handwritten release scripts!
 - [Smart versioning](https://github.com/sholladay/build-version) that works well across environments.
 - Composable with other build tools.
 - Easy to set up and configure.

## Install

```sh
npm install delivr --save
```

## Usage

First, `delivr.prepare()` makes a secure temporary directory for you to put your build files in. When you are done, just call `build.finalize()` and the directory will be deployed to `build/<branch>/<version>`, locally and (if in CI) to S3.

```js
const fs = require('fs');
const util = require('util');
const delivr = require('delivr');

const writeFile = util.promisify(fs.writeFile);

const run = async () => {
    const build = await delivr.prepare();
    console.log('Temporary build directory:', build.path);

    await writeFile(path.join(build.path, 'hello.txt'), 'Hello, world!');

    // Move the temp dir to its permanent home, set up symlinks,
    // and upload the files on disk to S3.
    await build.finalize();
};
run();
```

## API

Please see Amazon's [API documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html) for details on bucket names and authenticating with AWS.

### delivr.prepare(option)

Returns a `Promise` for an object with these fields:

 - `path` is a newly created temporary directory for you to write the build to.
 - `finalize()` moves `path` to its final location, [links](https://github.com/sholladay/build-dir#builddirlinkoption) it, and uploads it to S3.

#### option

Type: `object`

Settings and known [build data](https://github.com/sholladay/build-data).

##### cwd

Type: `string`<br>
Default: `process.cwd()`

Parent directory of the build root.

##### branch

Type: `string`

A git branch name, can be provided to improve performance or override git. Used to create paths for writing and deploying the build.

##### version

Type: `string`

A [build version](https://github.com/sholladay/build-version), can be provided to improve performance or use a specific version. Defaults to a newly generated version. Used to create paths for writing and deploying the build.

##### bucket

Type: `string`

Bucket name to use for deploying the build files to S3.

##### deploy

Type: `boolean`<br>
Default: `true` if running in CI

Whether to deploy the build files to S3.

## Related

 - [scube](https://github.com/sholladay/scube) - Manage your [S3](https://aws.amazon.com/s3/) buckets
 - [build-files](https://github.com/sholladay/build-files) - Read the files from your build
 - [build-keys](https://github.com/sholladay/build-keys) - Get the paths of files from your build
 - [build-dir](https://github.com/sholladay/build-dir) - Get a place to put your build
 - [build-data](https://github.com/sholladay/build-data) - Get metadata for your build
 - [build-path](https://github.com/sholladay/build-path) - Get a path for the given build
 - [build-version](https://github.com/sholladay/build-version) - Get a version for your build
 - [branch-name](https://github.com/sholladay/branch-name) - Get the current branch name

## Contributing

See our [contributing guidelines](https://github.com/sholladay/delivr/blob/master/CONTRIBUTING.md "Guidelines for participating in this project") for more details.

1. [Fork it](https://github.com/sholladay/delivr/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/delivr/compare "Submit code to this project for review").

## License

[MPL-2.0](https://github.com/sholladay/delivr/blob/master/LICENSE "License for delivr") © [Seth Holladay](https://seth-holladay.com "Author of delivr")

Go make something, dang it.
