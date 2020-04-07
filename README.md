# Clades

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

## Workflows

```bash
> nx serve api // serve the API backend
> nx serve monophyletic // serve the React front end
> nx dep-graph // show the dependency graph
> nx affected:dep-graph // show the deo-graph with updates needed
```

## Getting started

Following along with the [official video tutorial](https://www.youtube.com/watch?v=Y9ZgpvcFUXs&list=PLakNactNC1dH38AfqmwabvOszDmKriGco&index=4).

```bash
>npx create-nx-workspace@latest clades
npx: installed 199 in 23.278s
? What to create in the new workspace web components    [a workspace with a single app
built using web components]
? Application name                    clades
? Default stylesheet format           CSS
...
>nx generate @nrwl/react:app
? What name would you like to use for the application? monophyletic
? Which stylesheet format would you like to use? CSS
? Would you like to add React Router to this application? Yes

> nx serve monophyletic
> nx g @nrwl/react:lib ui-header
> nx g @nrwl/react:component --project=ui-header page-title
> nx dep-graph
> npm i @nrwl/express
> npm i @nrwl/express --help
> nx g @nrwl/express: app api --frontendProject=monophyletic
> nx serve api
```

Some errors during this process.

```bash
> nx g @nrwl/express: app api --frontendProject=monophyletic
Schematic "@nrwl/express" not found in collection "@nrwl/web".
>
> npm i @nrwl/workspace
> nx serve monophyletic
ERROR in ./app/app.tsx
Module not found: Error: Can't resolve 'react-router-dom' in 'C:\Users\timof\repos\timofeysie\nrwl\clades\apps\monophyletic\src\app'
> npm i -D @types/react
> npm i -D @types/react-router-dom
> npm i -D @types/react --save
> npm install -S react-router-dom
```

Tried a number of different approaches, but couldn't get the app to run again.  It was serving and I was able to include the ui-header page title component in the app.  [This article](https://dev.to/stereobooster/typescript-monorepo-for-react-project-3cpa) suggests using yarn instead of npm in a monorepo because *it supports workspaces to link cross-dependencies.*  That's a decent reason to use yarn, which I have used for another monorepo before, but without having a good reason to use yarn.  Just it was a popular choice amon devs at the time.

So if yarn is the answer here, do I have to go back and re-run some of those commands above with it?
Such as adding express.  But this results in the same error:

```bash
yarn add @nrwl/express
> nx g @nrwl/express: app api --frontendProject=monophyletic
Schematic "@nrwl/express" not found in collection "@nrwl/web".
```

Then I actually read the output from the terminal which said you shouldn't mix package managers and to remove the package-lock.json file and run the command again.  This done, and our generate command works.  On with the show.

```bash
nx g @nrwl/workspace:lib api-interface
```

## Adding capabilities to your workspace

The following is from the original readme created with the workspace.

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are some plugins which you can add to your workspace:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@clades/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
