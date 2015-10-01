# grunt-stackhub-publish

> Grunt plugin to publish your package versions to StackHub

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-stackhub-publish --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('stackhub-publish');
```

## The "stackhub-publish" task

### Overview
In your project's Gruntfile, add a section named `stackhub-publish` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'stackhub-publish': {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.shuser
Type: `String`
Default value: `''`

The StackHub username - usually the email address - of the user account to which the package
version should be published. If omitted, the task will prompt for a value.

#### options.shpass
Type: `String`
Default value: `''`

The StackHub password for the given username. For security reasons this option should not be
used. If omitted, the task will prompt for a value.

#### options.host
Type: `String`
Default value: `'https://stackhub.org'`

The host at which to publish the package version. An alternate value is 'https://sandbox.stackhub.org'.

#### options.releaseStatus
Type: `String`
Default value: `'released'`

The status of this package version. Valid values are 'alpha', 'beta', and 'released'.

#### options.filepath (Required)
Type: `String`
Default value: `''`

The path to the package version file. 

#### options.onComplete
Type: `Function`
Default value: `'function(data) {}'`

A function to call if the upload was successful. The parameter is hash representing the package version
row returned by the server.


### Usage Examples

#### Default Options
In this example only the filepath is supplied. The user will be prompted for the username and password.

```js
grunt.initConfig({
  'stackhub-publish': {
    options: {},
    myPod: {
      options: {
        filepath: './build/myPodExt.pod',
      }
    }
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  'stackhub-publish': {
    options: {
      shuser: 'matthew@stackhub.org'
    },
    myPod: {
      options: {
        filepath: './build/myPodExt.pod',
      }
    },
    myOtherPod: {
      options: {
        filepath: './build/myOtherPodExt.pod',
      }
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 0.1.0 - 2015-10-01: Initial contribution
