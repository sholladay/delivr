# delivr [![Build status for delivr on Circle CI.](https://img.shields.io/circleci/project/sholladay/delivr/master.svg "Circle Build Status")](https://circleci.com/gh/sholladay/delivr "Delivr Builds")

> Build your code and ship it to S3.

## Why?

 - Easy to set up and configure.
 - Encourages cache-safe URLs.
 - Provides both versioned and `latest` copies.
 - Composable with other build tools.

## Install

```sh
npm install delivr --save
```

## Usage

Get it into your program.

```js
const delivr = require('delivr');
```

Run the build.

```js
delivr.prepare().then((build) => {
    // Put stuff in here:
    console.log('Temp dir:', build.path);

    // ... some time later ...

    // Move the temp dir to its permanent home, set up symlinks,
    // and upload the files on disk to S3.
    return build.finalize();
});
```

## API

Please see Amazon's [API documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html) for details on bucket names and authenticating with AWS.

### delivr.prepare(option)

Returns a promise for an object with these fields:

 - `path` is a newly created temporary directory for you to write the build to.
 - `finalize()` moves `path` to its final location, [links](https://github.com/sholladay/build-dir#builddirlinkoption) it, and uploads it to S3.

#### option

Type: `object`

Settings and known [build data](https://github.com/sholladay/build-data).

##### cwd

Type: `string`<br>
Default: `process.cwd()`

The parent directory of the build root.

##### branch

Type: `string`

The branch name to use, instead of asking git.

##### version

Type: `string`

The version to use, instead of asking [build-version](https://github.com/sholladay/build-version).

##### bucket

Type: `string`

The bucket name to use for deploying the build files to S3.

##### deploy

Type: `boolean`<br>
Default: `true` if running in CI

Whether to deploy the build files to S3.

## Related

 - [scube](https://github.com/sholladay/scube) - Manage your S3 buckets.
 - [build-files](https://github.com/sholladay/build-files) - Read the files from your build.
 - [build-keys](https://github.com/sholladay/build-keys) - Get the paths of files from your build.
 - [build-dir](https://github.com/sholladay/build-dir) - Get a place to put your build.
 - [build-data](https://github.com/sholladay/build-data) - Get metadata for your build.
 - [build-path](https://github.com/sholladay/build-path) - Get a path for the given build.
 - [build-version](https://github.com/sholladay/build-version) - Get a version for your build.
 - [branch-name](https://github.com/sholladay/branch-name) - Get the current branch name.

## Contributing

See our [contributing guidelines](https://github.com/sholladay/delivr/blob/master/CONTRIBUTING.md "The guidelines for participating in this project.") for more details.

1. [Fork it](https://github.com/sholladay/delivr/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/delivr/compare "Submit code to this project for review.").

## License

[MPL-2.0](https://github.com/sholladay/delivr/blob/master/LICENSE "The license for delivr.") © [Seth Holladay](http://seth-holladay.com "Author of delivr.")

Go make something, dang it.
