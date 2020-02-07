[![Known Vulnerabilities](https://snyk.io/test/github/sallf/react-npm-boilerplate/badge.svg)](https://snyk.io/test/github/sallf/react-npm-boilerplate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# React, NPM and CircleCI Boilerplate
Boilerplate template for building `npm` modules with React and JSX. Also includes a script from CircleCI to deploy to AWS S3.
1. Run a testing server for local development.
2. Build with babel and webpack for production ready code.
3. Use CircleCI to deploy to AWS S3.

## Getting Started
Clone the repo.
```
$ git clone https://github.com/sallf/react-npm-boilerplate.git
```
Install packages.
```
$ npm install
```

## Development
We're using Hot Module Replacement (HMR), with `webpack-dev-server`. HMR exchanges, adds, or removes modules while an application is running, without a full reload which can significantly speed up development
```
$ npm start
```

## Build
Compiles code to `public/` folder.
```
$ npm run dev
```

## Deploy to AWS
This template includes a `config.yml` file which will help you deploy to your AWS S3 bucket. If you don't need this functionality, just delete the `.circleci/` folder.

After you've followed the setup steps below, any merge to `master` branch should trigger a buid on CircleCI.

### Setup a CircleCI Account
You'll need to setup an account with [CircleCI](https://circleci.com/) and link to your GitHub account.

### Add Access Keys to CircleCI
In your CircleCI account you'll need to add your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY as Environment Variables in a Context called `AWS` (Organization Settings > Contexts > Create Context). If you name your Context something different, be sure to update the `context` value in the `.circleci/confg.yml` file.

You can create [access keys](https://aws.amazon.com/blogs/security/how-to-find-update-access-keys-password-mfa-aws-management-console/) on AWS through your IAM profile.

### Configure yml File
We'll be using CircleCI's new [aws-s3 orb](https://circleci.com/orbs/registry/orb/circleci/aws-s3) which does most of the heavy lifting.
1. By default the file is setup to track your `master` branch. Adjust this as needed.
2. Add your S3 bucket URL to the last line in the file.

## Packages
### Dependencies
- [React](https://www.npmjs.com/package/react)
- [React DOM](https://www.npmjs.com/package/react-dom)

### Dev Dependencies
- [Babel](https://www.npmjs.com/package/@babel/core) Makes ECMAScript 2015+ backwards compatible
- [Clean Webpack Plugin](https://www.npmjs.com/package/clean-webpack-plugin) Removes unused files on each build
- [Cross Env](https://www.npmjs.com/package/cross-env) Allows environment variables
- [CSS Loader](https://www.npmjs.com/package/css-loader) Allows CSS imports
- [ESLint](https://www.npmjs.com/package/eslint) Linter
- [File Loader](https://www.npmjs.com/package/file-loader) Handles import/require() on files
- [HTML Webpack Plugin](https://www.npmjs.com/package/html-webpack-plugin) Simplifies creation of HTML files
- [SASS Loader](https://www.npmjs.com/package/sass-loader) SCSS files to CSS
- [Style Loader](https://www.npmjs.com/package/style-loader) Inject CSS into the DOM.
- [URL Loader](https://www.npmjs.com/package/url-loader) Transforms files into base64 URIs
- [Webpack](https://www.npmjs.com/package/webpack) Bundler
- [Webpack CLI](https://www.npmjs.com/package/webpack-cli) Webpack on the command line
- [Webpack Dev Server](https://www.npmjs.com/package/webpack) Webpack on a development server

## License

The code is available under the [MIT license](LICENSE).
