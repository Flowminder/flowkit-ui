[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)&nbsp;
[![CircleCI](https://circleci.com/gh/Flowminder/flowkit-ui/tree/main.svg?style=shield&circle-token=a319701d765a44c98b33420b81ee902c415f6acf)](https://circleci.com/gh/Flowminder/flowkit-ui/tree/main)&nbsp;
[![codecov](https://codecov.io/gh/Flowminder/flowkit-ui/branch/main/graph/badge.svg?token=86SxebZAPq)](https://codecov.io/gh/Flowminder/flowkit-ui)&nbsp;

# Flowkit UI

This is a generic web application that allows a non-expert user to make queries to [FlowAPI](https://github.com/Flowminder/FlowKit) and have the results presented to them visually.

## Branches

This repository uses a branching model, whereby a number of main branches have automatically deployed live pages.
Any other branches can be manually deployed to the special `gh-pages` branch, but only by authorised developers.
The `gh-pages` branch itself is protected, meaning deletions or other direct manual modifications (i.e. not through the `deploy` target) can also only be done by authorised developers.

The workflow is as follows:

To contribute code, please check out the dev branch.
Branch off that into a "feature branch", e.g. `feature/my-new-awesome-feature`. Push all your commits to that branch. This will not trigger the CI but you can still run tests manually.
When you're done, make sure all tests pass. Then make a pull request for your feature to be merged into `dev`. This will trigger the CI to also run all tests. If they still pass, an authorised developer will review your pull request and merge it into `dev`.

Currently, the branches are:

### dev

This is the main branch, containing the latest code where all unit tests pass.
Features should be developed on feature branches and merged into `dev` upon completion.

### staging

This branch serves as a release candidate.
It should not be pushed to and only merged to from `staging`.
It's expected to be used for manual testing before a release.

### production

This is the production branch, containing stable, versioned releases.
It should not be pushed to and only merged to from `staging`.
Merges require code reviews.

### Project-specific branches

Projects may have individual branches with project-specific features or omitting features from the main branches.
Currently, the project-specific branches are:

-   `opal`: A bespoke UI for the [OPAL](https://opalproject.org/) project

## Environment variables

The main `.env` file specifies various variables, styles, branding etc. that are usually defined on a per-branch basis.

There are several other `.env.*` files that can be used to override these variables:

-   `.env.development` is only used when running the application locally using yarn start
-   `.env.test` is only used when testing the application using yarn test
-   `.env.production` is used when the application is bundled

Environment variable changes are currently the only exception in which commits can be pushed directly to a protected branch.

## Available Scripts

In the project directory, you can run:

```
yarn upgrade
```

Upgrades all packages.

```
yarn audit
```

Find vulnerabilities in dependencies.

```
yarn start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload automatically if you make edits.<br />
You will also see any lint errors in the console.

```
yarn lint
```

Runs a code formatter which reformats all project files.
This is also done automatically as a git commit hook.

```
yarn test
```

Launches the test runner to run all unit tests.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```
yarn test1 [test-name]
```

This runs just one single test suite. If none is given, all unit tests will be run.

```
yarn e2etest
```

Runs the integration tests - **warning**: they can take a very long time!

```
yarn badges
```

Generates SVG badges for displaying on the repository README.
This happens automatially during deployment.

```
yarn build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.\

See the `deploy` target below.

```
yarn predeploy
```

This target runs automatically before the `deploy` target. However, it can also be run independently as a "dry run", i.e. without actually publishing the files to the server.
The steps for this target are:

-   run all tests
-   only if the tests pass create badges and build the project
-   create a fresh copy of the `./deploy` directory, which contains static content to be deployed. This copy, `./deployment`, is generated for each new deployment. The static content consists of
    -   a HTML page that forwards to the latest version of the stable branch
-   copy the coverage report into the build directory so they stay together for later deployment
-   make a separate copy of the coverage report into the `./deployment` directory to allow the Github README to always show the latest coverage reports
-   copy the built project in a subdirectory named after the branch from which it was built, (e.g. `./deployment/dev`)
-   create a text file containing the name of the deployed branch and the current date. This file will be copied to the server, thus providing information about the latest deployment.

The finished `./deployment` can then be used by the `deploy` target to be copied onto the server, see below.

```
yarn deploy
```

Deploy the tool to Github pages. This will cause `yarn predeploy` to run as described above.

Before deployment, this will delete the previous deployment of the current branch but leave all previous deployments from other branches untouched.\
It will then copy the `./deployment` directory onto the server, updating any existing (static) files where required and installing the latest version of the current branch.

This is run either

-   by the CI upon pushing to a set of predefined branches (currently: `release` and `dev`) or
-   from within a branch that is to be deployed manually - **IMPORTANT: Please remember all manually deployed branches will have to be deleted manually when they are no longer required.**

## React components

All components are stored inside their own directory inside `./src/components`. Components should be self-contained, i.e. they should not depend on/include files from another component. Shared resources should live either in `./public` or `./src/app`.

Each component can have a number of files:

-   `MyComponent.js` (required):

    The main component file. This should contain the HTML/JSX for the component and act as the controller.

-   `MyComponent.test.js` (required):

    Unit tests associated with the component. Use this to test functionality defined in the main component file, e.g. clicking controls, making selections etc, but _not_ operations on data.

-   `MyComponent.module.css` (optional):

    A react CSS file, which is loaded through React. This means all class names will be scrambled up and unique every time webpack runs. Definitions should only be for parts of the component - not general styles or branding. CSS variables from `./src/app/branding.css` can be used.

-   `MyComponent.scss` (optional):

    A SASS file, allowing you to use features such as mixins, nesting or operators. CSS variables from `./src/app/branding.css` can be used.

-   `myComponentSlice.js` (optional):

    A slice of the Redux store, in which state can be stored for the component. It needs to be plugged into `./src/app/store.js` and can then be used from within any component to get the state for this component. The slice should define the initial state for the component's state, a set of reducers to alter state ("setters") and export them.

-   `myComponentSlice.test.js` (required if the slice exists):

    Unit tests for the reducers. It should check that they work as intended, i.e. feed in some data and check if the output is correct.

-   `myComponentSlice.selectors.js` (required if the slice exists):

    This contains selectors ("getters") for the slice. It should make use of other selectors where possible to avoid code duplication.

-   `myComponentSlice.selectors.test.js` (required if the slice exists):

    Unit tests for the selectors. Here we test with a mocked store whether the selector retrieves the correct state.

## Credits

&copy; Flowminder Foundation 2021
