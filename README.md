# delivr [![Build status for delivr](https://img.shields.io/circleci/project/sholladay/delivr/master.svg "Build Status")](https://circleci.com/gh/sholladay/delivr "Builds")

> Build your code and ship it to S3

This is a multi-version release and deployment system, optimized for client-side web applications.

Your builds are stored locally during development and automatically uploaded to Amazon S3 in CI. Your git branch is used to namespace each build and versioning is handled gracefully, with immutable, meaningful version numbers derived from package.json and your git repository state.

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

First, `delivr.prepare()` makes a secure temporary directory for you to put some files in. When you are done, just call `build.finalize()` and the directory will be moved to `build/<branch>/<version>` and (if in CI) deployed to S3.

```js
const fs = require('fs');
const util = require('util');
const delivr = require('delivr');

const writeFile = util.promisify(fs.writeFile);

const run = async () => {
    // Make a temporary directory to put files in!
    const build = await delivr.prepare();

    // Write some files to disk!
    await writeFile(path.join(build.path, 'hello.txt'), 'Hello, world!');

    // Deploy the build!
    await build.finalize();
};
run();
```

## API

Please see Amazon's [API documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html) for details on authenticating with AWS.

### build = await delivr.prepare(option)

Returns an object representing a newly created temporary directory.

You should write files to be included in the build by putting them inside `build.path`. When you are done writing files, you should call `build.finalize()`.

#### option

Type: `object`

Settings and known [build data](https://github.com/sholladay/build-data).

##### cwd

Type: `string`<br>
Default: `process.cwd()`

Parent directory of the build root. Typically, this would be the root directory of your app.

##### branch

Type: `string`<br>
Default: [git HEAD or `master`](https://github.com/sholladay/branch-name#assumemasteroption)

A prefix used to group builds together, so that "release lines" can more easily be maintained.

The branch becomes part of the path used to store the build when the build is finalized. For example, if the branch is `my-feature` and the version is `1.0.0`, the build will be stored in `build/my-feature/1.0.0`.

You probably don't need to set this option yourself! Providing a custom branch name is mostly useful to improve performance, if you happen to know the current branch name ahead of time.

##### version

Type: `string`<br>
Default: a new [build version](https://github.com/sholladay/build-version#buildversionoption)

A version identifier used to separate this build from others on the same branch. Ideally, it should be unique, such that only builds with the same content ever have the same version (the default algorithm guarantees this).

The version becomes part of the path used to store the build when the build is finalized. For example, if the branch is `master` and the version is `1.2.3`, the build will be stored in `build/master/1.2.3`.

You probably don't need to set this option yourself! Providing a custom version is mostly useful to improve performance, if you happen to have a version number you want to use ahead of time.

##### bucket

Type: `string`<br>
Example: `my-app`

Name of the Amazon S3 bucket where the build files should be deployed to (if `deploy` is enabled).

For tips on naming your bucket, see Amazon's [Rules for Bucket Naming](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules).

##### deploy

Type: `boolean`<br>
Default: `true` if running in CI

Whether to upload the build files to Amazon S3.

The path of the build on S3 will be identical to your local build. For example, if the bucket is `my-app` and branch is `master` and the version is `1.0.0`, the build will be available at `https://s3.amazonaws.com/my-app/master/1.0.0`.

### build.path

A newly created and [secure temporary directory](https://security.openstack.org/guidelines/dg_using-temporary-files-securely.html) for you to write files in to be included with the build.

Example on macOS: `/var/folders/gr/qfsxs2gj0fq1ypdsfd8rj8tr0000gn/T/vwjBJb`

### await build.finalize()

Moves the temporary directory from `buiild.path` to `build/<version>/<branch>` within the current working directory, where `<version>` and `<branch>` are decided by the `version` and `branch` options given to `delivr.prepare(option)`.

This also sets up symlinks to the build via `latest-build` and `build/<branch>/latest` (see also [`buildDir.link()`](https://github.com/sholladay/build-dir#builddirlinkoption)).

Finally, the build is uploaded to Amazon S3, based on the `deploy` option given to `delivr.prepare(option)`.

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
