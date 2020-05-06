# Clades

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

Currently unit testing the counter example to create a guide for TDD workflow for NgRx Angular development.

## Table of contents

- [The @nxtend/ionic-react plugin](#the-@nxtend/ionic-react-plugin)
- [Re-implementing the Duncan](#re-implementing-the-Duncan)
- [Testing Ngrx](#testing-ngrx)
- [Implementing the counter example from the official docs](#implementing-the-counter-example-from-the-official-docs)
- [NgRx counter example](#ngRx-counter-example)
- [Steps for updated NgRx example enterprise app](#Steps-for-updated-NgRx-example-enterprise-app)
- [The Official NgRx project](#the-Official-NgRx-project)
- [Original automatically generated readme](#original-automatically-generated-readme)

## Workflows

Project scripts reference.

```bash
nx serve api # serve the API backend
nx serve luca # React Ionic test app
nx serve monophyletic # serve the React front end
nx serve stratum # Angular app with unit tests for the counter example
nx serve stromatolites # Angular app for the updated Duncan workshop code
nx test layout/products # test the layout or products libs used by stromatolites
nx test stratum --watch # run Angular Jest unit tests
nx test stromatolites --watch0
yarn run server # stromatolites server runs on http://localhost:3000
nx dep-graph # show the dependency graph
nx affected:dep-graph # show the deo-graph with updates needed
ng g @nrwl/angular:lib ui # Generate UI lib
ng g @nrwl/angular:component xyz --project ui # Add a component
nx dep-graph # open the dependency graph
ng affected:dep-graph # see what's been affected by changes
ng affected:test # run tests for current changes
ng affected:e2e # run e2e tests for current changes
```

## Testing a dispatch action

The Stratum app was created to test the Ngrx counter example from the official docs.

In the docs there is also a section on [integration testing](https://ngrx.io/guide/store/testing#integration-testing).

Nrwl out of the box creates a separate app for end-to-end tests which also has an integration directory: apps\stratum-e2e\src\integration\app.spec.ts. These tests use [the Cypress testing framework](https://www.cypress.io/).

It has a great dashboard and tools available for working with the end to end an integration tests, but the tests shown on the Ngrx testing page are a different kind of integration testing, so we wont be working in the stratum-e2e directory yet.

The directory structure in the docs show that they are in a tests directory. The recommendation for Angular is to colocate them with their components. Not wanting to create a file called counter.integration.spect.ts, I just created a directory in the app for a file like this: /app/tests/integration.spec.ts.

That's all nice but it doesn't say it's for the counter. I'm still undecided as to if these are actually e2e integration tests that can be interpreted into their Cypress equivalent, or they are actually just unit tests that can live in the same directory as the component under tests. I think there is an acronym for that.

Anyhow, they seem to duplicate the setup used for regular unit tests, so it would actually be trivial just to throw them in with the unit spec files.

The things tested in the initial batch of tests for the counter component were:

```txt
it('should create'
it('should return a default state using nonexistent action'
it('increment reducer should increment the state'
it('decrement reducer should decrement the state'
```

The integration spec:

```txt
it('should create the component'
it('should increment the counter value when increment is clicked'
it('should decrement the counter value when decrement is clicked'
it('should reset the counter value when reset is clicked'
```

Lots of overlap there. This what the official docs say: _integration test should verify that the Store coherently works together with our components and services that inject Store. An integration test will not mock the store or individual selectors, as unit tests do, but will instead integrate a Store by using StoreModule._

A regular unit test for the increment function looks like this:

```js
it('increment reducer should increment the state', () => {
  const incrementedState = counterReducer(0, increment);
  expect(incrementedState).toBe(1);
});
```

The integration tests:

```js
it('should increment the counter value when increment is clicked', () => {
  clickByCSS('#increment');
  expect(getCounterText()).toBe('Current Count: 1');
});
```

So that looks more like an e2e. It's using the dom to create an event and then test the outcome.

The helper function is similar to the page object, which is a pattern to isolate how the component is got from the dom. So if an id changes into a class or a div into whatever, you only have to change the page object and all the other tests that rely on it don't have to change.

Here is what is looks like included in the integration tests spec:

```js
function getCounterText() {
  const compiled = fixture.debugElement.nativeElement;
  return compiled.querySelector('div').textContent;
}
```

### Stratum workflow cheat-sheet

```bash
nx serve stratum # Angular app with unit tests for the counter example
nx test stratum --watch # run Angular Jest unit tests
nx e2e stratum-e2e --watch # run the end to end tests
```

## Testing a chain of actions

To test a series of actions chained in one way or another, we can use the unit/integration testing format by attaching a spinner, making an async call, then doing some calculation on the result then stopping the spinner.

If the initial async call is displayed in the ui, then we can test all the states and their results via basic unit tests without having to delve into Cypress.

However, if there were chained actions underneath the skin, so to speak, how would we test that?  That might require the observable actions that trigger when a certain action is called, such as "GET_ITEM_SUCCESS".

## The @nxtend/ionic-react plugin

After failing to create and then run an Ionic React app in the [Quallasuyu project](https://github.com/timofeysie/quallasuyu), using the updated workspace here succeeds using the following commands:

```bash
yarn add @nxtend/ionic-react
nx generate @nxtend/ionic-react:application luca
nx serve luca
```

This is a demo project to try out the [Ionic/React plugin](https://github.com/devinshoemaker/nxtend) featured in a [recent blog by the NrWl team](https://blog.nrwl.io/computation-caching-out-of-the-box-revamped-docs-community-plugins-and-more-in-nx-9-2-e97801116e02). No plans yet to develop anything with it.

## Re-implementing the Duncan

As the code from the GitBook: [Workshop: Enterprise Angular applications with NgRx and Nx](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/) is over two years old now, this is a tentative step by step implementation of the same code but using a currently generated nx workspace based on Nrwl 9.

Note the section numbers and the step numbers used here are not the same.

### Step 1: creating the Angular app

```bash
nx generate @nrwl/angular:app stromatolites --routing
? Which stylesheet format would you like to use? SASS(.scss)  [ http://sass-lang.com   ]
CREATE libs/auth/README.md (132 bytes)
CREATE libs/auth/tsconfig.lib.json (408 bytes)
CREATE libs/auth/tsconfig.lib.prod.json (97 bytes)
CREATE libs/auth/tslint.json (244 bytes)
CREATE libs/auth/src/index.ts (35 bytes)
CREATE libs/auth/src/lib/auth.module.ts (268 bytes)
CREATE libs/auth/src/lib/auth.module.spec.ts (338 bytes)
CREATE libs/auth/tsconfig.json (123 bytes)
CREATE libs/auth/jest.config.js (345 bytes)
CREATE libs/auth/tsconfig.spec.json (233 bytes)
CREATE libs/auth/src/test-setup.ts (30 bytes)
UPDATE workspace.json (20717 bytes)
UPDATE nx.json (1174 bytes)
UPDATE tsconfig.json (691 bytes)
```

The workflow commands now are:

```bash
nx serve stromatolites
nx test stromatolites
```

Commit: [Workshop Step 1: creating the Angular app](https://github.com/timofeysie/clades/issues/3).

[Original Workshop line](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/2-creating-an-nx-workspace)

### Step 2: Generate the auth lib

This command generates an Angular lib project:

```bash
nx generate @nrwl/angular:lib auth --routing
```

The previous command from the workshop was:

```bash
ng g lib auth --routing --prefix=app --parent-module=apps/stromatolites/src/app/app.module.ts
```

The updated version is:

```bash
nx generate lib auth --routing --prefix=app --parent-module=apps/stromatolites/src/app/app.module.ts
Could not match option 'routing' to the @nrwl/web:library schema.
Could not match option 'prefix' to the @nrwl/web:library schema.
Could not match option 'parentModule' to the @nrwl/web:library schema.
```

Trying this solution first:

```bash
yarn add @nrwl/web
```

This doesn't work. So those options don't exist anymore. There are no questions asked during the generation now:

```bash
nx generate lib auth
CREATE libs/auth/tslint.json (97 bytes)
CREATE libs/auth/README.md (162 bytes)
CREATE libs/auth/tsconfig.json (123 bytes)
CREATE libs/auth/tsconfig.lib.json (172 bytes)
CREATE libs/auth/src/index.ts (28 bytes)
CREATE libs/auth/src/lib/auth.ts (0 bytes)
CREATE libs/auth/jest.config.js (232 bytes)
CREATE libs/auth/tsconfig.spec.json (273 bytes)
UPDATE tsconfig.json (691 bytes)
UPDATE workspace.json (20555 bytes)
UPDATE nx.json (1174 bytes)
```

### step 3: Generate login container

These were the previous commands tried:

```bash
ng g c containers/login --project=auth
ng g c containers/login --project=auth --skip-import
```

Substituting nx for ng and:

```bash
> ng c containers/login --project=auth
Schematic "c" not found in collection "@nrwl/web".
```

Therefore the abbreviated version aren't available using nx.

```bash
nx generate @nrwl/angular:component containers/login --project=auth --skip-import
nx generate @nrwl/angular:component components/login-form --project=auth --skip-import
```

But when it comes time for the next step "Add a default route", there is no `libs/auth/src/auth.module.ts` file to add to.

[Source](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/3-generating-components-and-nx-lib)

It seems like they skipped the Angular module part. There these files, but the first one exports the empty second one.

```bash
libs\auth\src\index.ts
libs\auth\src\lib\auth.ts
```

So is there an extra flag now to create a lib with an Angular .module.ts file?

We would have done something like this in the monophyletic project.

```bash
ng g @nrwl/angular:lib ui
```

So do we need something like this?

```bash
nx generate @nrwl/angular:lib auth
```

We have already committed the auth module. Can --force the changes?

This is what was run:

```bash
nx generate lib auth
```

This is what we needed:

```bash
nx generate @nrwl/angular:lib auth --force:true
```

Options are:

```bash
Options:
  --name                  Library name
  --directory             A directory where the lib is placed
  --publishable           Generate a buildable library.
  --prefix                The prefix to apply to generated selectors.
  --skipFormat            Skip formatting files
  --simpleModuleName      Keep the module name simple (when using --directory)
  --skipPackageJson       Do not add dependencies to package.json.
  --skipTsConfig          Do not update tsconfig.json for development experience.
  --style                 The file extension to be used for style files. (default: css)
  --routing               Add router configuration. See lazy for more information.
  --lazy                  Add RouterModule.forChild when set to true, and a simple array of routes when set to false.
  --parentModule          Update the router configuration of the parent module using loadChildren or children, depending on what `lazy` is set to.
  --tags                  Add tags to the library (used for linting)
  --unitTestRunner        Test runner to use for unit tests (default: jest)
  --dryRun                undefined
  --help                  Show available options for project target.
```

### Step 4: Configure the Auth module

Import the new lib module into the project that will use it, in this case stromatolites.

```js
import { authRoutes, AuthModule } from '@clades/auth';
```

Add AuthModule to the imports array.

After this there was still one error in app.module.ts file:

```bash
Cannot find module '@nrwl/nx'.ts(2307)
```

Doing this will fix that:

```bash
yarn add @nrwl/nx
```

Now run the app:

```bash
nx serve stromatolites
ERROR in The target entry-point "@nrwl/nx" has missing dependencies:
 - @ngrx/effects
 - @ngrx/router-store
```

Adding those two dependencies like adding nx fixes the build and the app should run.

Next, test the app:

```bash
nx test stromatolites --watch
```

The tests should also pass as we haven't introduced any extra dependencies into the frontend project yet.

#### Configure presentational components

Add presentational component to container component

Add a login function to support the login action.

We have to change app-login to clades-login in the selector for the login.component.

### Step 5: The data-models lib

Add new folder for shared interfaces called data-models. The docs say to add this "manually in the libs folder". There were problems with this in the Quallasyuyu project, so going with the CLI lib creation method for now.

In that project we ran this command:

```bash
ng g lib data // create shared interfaces
```

One way would be to create another Angular library:

```bash
nx generate @nrwl/angular:lib data-models --force:true
```

But in this case we don't need it to be Angular. It would be nice to also use this in a React project at some point, so this is the simplest way to go.

```bash
nx generate lib data-models
CREATE libs/data-models/tslint.json (97 bytes)
CREATE libs/data-models/README.md (176 bytes)
CREATE libs/data-models/tsconfig.json (123 bytes)
CREATE libs/data-models/tsconfig.lib.json (172 bytes)
CREATE libs/data-models/src/index.ts (35 bytes)
CREATE libs/data-models/src/lib/data-models.ts (0 bytes)
CREATE libs/data-models/jest.config.js (246 bytes)
CREATE libs/data-models/tsconfig.spec.json (273 bytes)
UPDATE tsconfig.json (755 bytes)
UPDATE workspace.json (21511 bytes)
UPDATE nx.json (1219 bytes)
```

The workshop code shows two files added to this new lib:

```js
libs / data - models / src / authenticate.d.ts;
libs / data - models / index.ts;
```

Since we are using a slightly different approach for these data models by generating a lib with nx, we will have the following equivalent files:

```js
libslibs\data - modelsmodels\srcmodels\src\libmodels\src\lib\authenticate.d.ts;
libslibs\data - modelsmodels\srcmodels\src\libmodels\src\lib\data - models.ts;
```

Out of the box, the auth module can't import the data-models lib:

```js
import { Authenticate } from '@clades/data-models';
```

This had a red squiggly under it. Luckily, this is not my first rodeo, so I closed VSCode and opened it again and the problem was gone. TypeScript gets a little out of sync when adding new libraries that it then has to validate.

Creating the submit function as an output brings up a naming issue. This line:

```js
@Output() submit = new EventEmitter<Authenticate>();
```

Has this warning:

```js
In the class "LoginFormComponent", the output property "submit" should not be named or renamed as a native event (no-output-native)tslint(1)
```

We will think about changing that later.

Again, the standard or calling custom elements app-x-component now uses the workspace prefix. So

```html
<app-login-form></app-login-form>
```

becomes:

```html
<clades-login-form></clades-login-form>
```

This is the last part of the workshop part 3.

#### [6. Change the ChangeDetectionStrategy to OnPush](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/3-generating-components-and-nx-lib)

_Now that we are using the presentation and container component pattern and we know that we only need to check the child components for changes if a DOM event or a @Input or @Output passes new primitives or reference values. In this way we can tell Angular not check the whole component tree which can cause performance issues in larger applications._

The app serves without errors, and all the tests pass.

### Workshop part 4 - Add JSON server

I have mixed feelings on this step. On the one hand, a simple NodeJS Express app would only take a little bit more time. On the other hand, this could just be a front end only workshop, in which case, that is wasting people's time.

From the front end point of view, a step involving setting up AWS Cognito, Azure B2C, or even Firebase would be an improvement. Maybe optional modules would be a good idea.

Anyhow, this is how it's done in the current workshop:

```bash
npm i json-server ts-node --save-dev
yarn add json-server ts-node --save-dev
```

#### 4.2. Make a server.ts file in a new folder called server

Make a new folder called server and file called server.ts in the new server folder.

The db file mixes users and products, which is not ideal. The products need to be changed to items.

This will be the start of our divergence from the products example into a user designed model.

I will show what the products are, but provide an implementation for a different data model that is more useful for me. In my case, I want a list of categories and items in each category.

We will add strong typing between the server and the client in a later step.

To be honest, I'm still undecided about the exact shape of the items list. The current approach is to put all the items in one list with a category property. The category will provide filtering. Maybe this is the best way to go, or maybe we want separate category lists? Not sure yet. So for now, the products stay as they are.

#### 4. Add the below script to the scripts in the package.json

For now, just run the server and move on:

```bash
npm run server
yarn run server # live on http://localhost:3000
```

### Step 6: the auth service

#### [5 - Angular Services](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/5-angular-services)

The old workshop scaffolding command:

```bash
ng g service services/auth/auth --project=auth
```

The updated nx command:

```bash
nx generate @nrwl/angular:service services/auth/auth --project=auth --skip-import
CREATE libs/auth/src/lib/services/auth/auth.service.spec.ts (347 bytes)
CREATE libs/auth/src/lib/services/auth/auth.service.ts (133 bytes)
```

#### 5.2 Add HttpClientModule to Auth Module

libs/auth/src/lib/auth.module.ts

libs/auth/src/lib/services/auth/auth.service.ts

#### 5.3 Update Login component to call the service

Now the login can be tested somewhat. Go to: http://localhost:4200/auth/login and open the networks tab in the inspector.

Test credentials would be:

```text
username: admin (admin, duh!)
username: duncan (non admin user)
password: 123
```

```bash
nx serve stromatolites # Angular app for the updated Duncan workshop code
nx test stromatolites --watch # run Angular Jest unit tests
```

### Step 7: create a lib to hold all the Angular Material imports

This step will generate an Nx lib to hold all the common material components uses in the workspace apps.

#### [6 - Angular Material](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/6-angular-material)

```bash
npm install @angular/material @angular/cdk @angular/flex-layout @angular/animations
yarn add @angular/material @angular/cdk @angular/flex-layout @angular/animations
```

Add animations module to the main app module.

#### **`src/app/app.module.ts`**

```js
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
...
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ...
```

#### 6.2. Add a new Nx lib to hold all the common material components we will use in our apps

The workshop command:

```bash
ng g lib material
```

The updated lib creation nx command:

```bash
nx generate @nrwl/angular:lib material
CREATE libs/material/README.md (140 bytes)
CREATE libs/material/tsconfig.lib.json (408 bytes)
CREATE libs/material/tsconfig.lib.prod.json (97 bytes)
CREATE libs/material/tslint.json (244 bytes)
CREATE libs/material/src/index.ts (39 bytes)
CREATE libs/material/src/lib/material.module.ts (163 bytes)
CREATE libs/material/src/lib/material.module.spec.ts (358 bytes)
CREATE libs/material/tsconfig.json (123 bytes)
CREATE libs/material/jest.config.js (353 bytes)
CREATE libs/material/tsconfig.spec.json (233 bytes)
CREATE libs/material/src/test-setup.ts (30 bytes)
UPDATE workspace.json (22447 bytes)
UPDATE nx.json (1261 bytes)
UPDATE tsconfig.json (813 bytes)
```

There are some breaking changes in the way material imports are done. This was the error from the Quallasuyu project:

```bash
ERROR in libs/material/src/lib/material.module.ts(16,8): error TS2306: File 'C:/Users/timof/repos/timofeysie/quallasuyu/node_modules/@angular/material/index.d.ts' is not a module.
```

Thanks to [this SO answer](https://stackoverflow.com/questions/58594311/angular-material-index-d-ts-is-not-a-module), we know that it's a Angular 9 breaking change probably for tree shaking purposes. So instead of doing a single line import with stuff like this:

```bash
import {
  ...
  MatSelectModule
} from '@angular/material';
```

We have to do this:

```bash
...
import { MatSelectModule } from '@angular/material/select';
```

Next, Add material module to auth module

#### **`libs/auth/src/auth.module.ts`**

```js
import { MaterialModule } from '@clades/material';
```

And add it to the imports array as usual.

#### 6.3. Add material default styles

Update the login-form to use material components, and this section is done.

Duncan provides a [link for material demos here](https://tburleson-layouts-demos.firebaseapp.com/#/docs). Now the app runs, looks OK, and all the tests are still passing.

### Step 8: Reactive Forms and User interface

The work for this section is connected [to this issue](https://github.com/timofeysie/clades/issues/9) and it's associated commits.

#### Original source: part [7 - Reactive Forms](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/7-reactive-forms)

7.1. Add ReactiveFormsModule to Auth module

#### **`libs/auth/src/lib/auth.module.ts`**

libs/auth/src/lib/components/login-form/login-form.component.ts

```bash
import { ReactiveFormsModule } from '@angular/forms';  // Added
...
```

The reactive form looks something like this:

#### **`libs/auth/src/lib/components/login-form/login-form.component.ts`**

```js
import { FormGroup, FormControl, Validators } from '@angular/forms';
...
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  login() {
    this.submit.emit({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    } as Authenticate);
  }
```

#### **`libs/auth/src/lib/components/login-form/login-form.component.html`**

Reactive forms do a good job of keeping track of the form state, almost like a mini-Redux style state management feature inside of Angular. This makes validation of inputs pretty easy:

```html
<form [formGroup]="loginForm" fxLayout="column" fxLayoutAlign="center none">
  <mat-form-field>
    <input
      matInput
      placeholder="username"
      type="text"
      formControlName="username"
    />
    <mat-error>
      <span
        *ngIf="
          loginForm.get('username').hasError('required') &&
          loginForm.touched"
        >Required Field</span
      >
    </mat-error>
  </mat-form-field>
  ...
</form>
```

Room for improvement here would be an array or error messages in the class itself, or some other method for managing all those messages in one place. I suppose them being located where they are actually used, but the more structure you impose on an enterprise level application, the more these things are automated or even coming from the server, and so a centrally located source for these messages makes a lot of sense, which is why it's usually done.

This would be a good segway into what an enterprise level validation messaging system looks like. Add that to the list of potential things to do.

### Step 9 The User date model interface

This will go in the data-models lib and be used in auth.service.ts, layout.component.ts, auth actions, effects and reducers.

#### Original source: part [7 - Reactive Forms](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/7-reactive-forms).4: Add a User interface

#### **`libs/data-models/user.d.ts`**

```js
export interface User {
  username: string;
  id: number;
  country: string;
  token: string;
  role: string;
}
```

The auth service API call will use the interface twice to confirm what is returned from the result.

#### **`libs\auth\src\lib\services\auth\auth.service.ts`**

```js
login(authenticate: Authenticate): Observable<User> {
  return this.httpClient.post<User>('http://localhost:3000/login', authenticate);
}
```

### Step 10: The Layout lib

#### Original source: part [8 - Layout Lib and BehaviorSubjects](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/8-layout-lib-and-behaviorsubjects)

For this lib, we also want a Angular specific component library, so that is the schema used in the command.

```bash
nx generate @nrwl/angular:lib layout
? Which stylesheet format would you like to use? SASS(.scss)  [ http://sass-lang.com   ]
CREATE libs/layout/README.md (136 bytes)
CREATE libs/layout/tsconfig.lib.json (408 bytes)
CREATE libs/layout/tsconfig.lib.prod.json (97 bytes)
CREATE libs/layout/tslint.json (244 bytes)
CREATE libs/layout/src/index.ts (37 bytes)
CREATE libs/layout/src/lib/layout.module.ts (161 bytes)
CREATE libs/layout/src/lib/layout.module.spec.ts (348 bytes)
CREATE libs/layout/tsconfig.json (123 bytes)
CREATE libs/layout/jest.config.js (349 bytes)
CREATE libs/layout/tsconfig.spec.json (233 bytes)
CREATE libs/layout/src/test-setup.ts (30 bytes)
UPDATE workspace.json (23365 bytes)
UPDATE nx.json (1301 bytes)
UPDATE tsconfig.json (867 bytes)
```

The legacy workshop generation commands use a prefix of "app". Without this flag, we get the workspace name, which seems like a good idea. So as noted before, the components will be used with the "clades" prefix.

```bash
ng g lib layout --prefix app
ng g c containers/layout --project=layout
```

On area of interest here for a real work scenario might be to use a stencil component library which would work in React and Vue as well. That would be quite a tangent however. It's worth noting it here so that if wanted later it can go into any planning for a longer series depending on the skill level of the readers it would be targeting.

There are extras at the end of this section which should be done for good measure:

1. Convert Layout component into a pure container component

- Add a toolbar presentational component.
- Pass user into presentational component via inputs.

#### Fixing the unit tests

It's worth running all the tests again, not just the stromatolites app.

The data-models and material libs don't really count. Material has one passing test, but there are none yet for the data-models.

The auth lib currently has some failing tests.

```bash
nx test auth --watch
...
Tests:       3 failed, 1 passed, 4 total
```

The first failure is:

```bash
FAIL  libs/auth/src/lib/services/auth/auth.service.spec.ts
  ● AuthService › should be created
    NullInjectorError: StaticInjectorError(DynamicTestModule)[HttpClient]:
      StaticInjectorError(Platform: core)[HttpClient]:
        NullInjectorError: No provider for HttpClient!
```

This is an easy fix as the test just needs its dependencies updated.

```js
import { HttpClientTestingModule } from '@angular/common/http/testing';
...
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]});
      ...
```

That fixes two of the failures. The last one is also a missing dependency:

```bash
FAIL  libs/auth/src/lib/containers/login/login.component.spec.ts
  ● LoginComponent › should create
    Template parse errors:
    'clades-login-form' is not a known element:
    1. If 'clades-login-form' is an Angular component, then verify that it is part of this module.
    2. If 'clades-login-form' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message. ("<br />
```

After a weeks break on this project, running these tests again now shows two failures:

```bash
nx run auth:test --watch=true
...
  ● LoginComponent › should create
    Unexpected directive 'LoginFormComponent' imported by the module 'DynamicTestModule'. Please add a @NgModule annotation.
...
    Template parse errors:
    'mat-card-title' is not a known element:
    1. If 'mat-card-title' is an Angular component, then verify that it is part of this module.
```

The last one requires MaterialModule to be imported by the spec.

After that we see another failure:

```bash
    Template parse errors:
    Can't bind to 'formGroup' since it isn't a known property of 'form'. ("
      <mat-card-title>Login</mat-card-title>
      <mat-card-content>
        <form [ERROR ->][formGroup]="loginForm" fxLayout="column" fxLayoutAlign="center none">
```

This of course requires the forms stuff added to the imports array:

```js
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
```

The next failure:

```bash
  ● LoginFormComponent › should create
    Found the synthetic property @transitionMessages. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.
```

That's a weird one. Since @transitionMessages is not found in the project, it must be part of material which we just imported above. Stopping and starting the tests and closing and opening VSCode fixes this. Or, fixes one of them. Now the only test failing is the @transitionMessages one.

We have BrowserAnimationsModule imported in the app.module.ts file. [This issue](https://github.com/angular/angular/issues/18751) is still open on the Angular GitHub.

Solution from [this blog](https://onlyangular5.blogspot.com/2018/02/complete-angular-5-tutorial-for.html): _Use (submit) instead of (ngSubmit)._

We don't have a submit in the login form component. We do have this however:

```js
@Output() submit = new EventEmitter<Authenticate>();
```

There is a TypeScript warning on this: _In the class "LoginFormComponent", the output property "submit" should not be named or renamed as a native event (no-output-native)tslint(1)_

That was noticed before. Changed submit to submitLogin and the warning is gone. Also imported these in the login.component.spec.ts file, same as the form, and added them to the imports array.

```js
import { MaterialModule } from '@clades/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
```

Now the login component has this failure:

```bash
NullInjectorError: No provider for HttpClient!
```

This requires the testing module imported and added to the array:

```js
import { HttpClientTestingModule } from '@angular/common/http/testing';
```

Now both login and login-form component specs are failing with the _Found the synthetic property @transitionMessages._. Feels like a virus spreading.

Ran _yarn add @angular/animations_ and imported BrowserAnimationsModule into the auth module to see if it would help. It didn't.

About to give up and imported both MaterialModule and BrowserAnimationsModule in both failing specs and the tests pass! Finally can move on to the next step, which is?

### Add a layout container component

Original source: part [8 - Layout Lib and BehaviorSubjects](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/8-layout-lib-and-behaviorsubjects).

To add a layout container component

```bash
nx g @nrwl/angular:component  containers/layout --project=layout
CREATE libs/layout/src/lib/containers/layout/layout.component.html (21 bytes)
CREATE libs/layout/src/lib/containers/layout/layout.component.spec.ts (628 bytes)
CREATE libs/layout/src/lib/containers/layout/layout.component.ts (278 bytes)
CREATE libs/layout/src/lib/containers/layout/layout.component.css (0 bytes)
```

The previous command was:

```bash
ng g c containers/layout --project=layout
```

Add the usual imports to the new layout module:

```js
import { MaterialModule } from '@<workspace>/material';
import { RouterModule } from '@angular/router';
```

#### **`libs/layout/src/lib/containers/layout/layout.component.html`**

```html
<mat-toolbar color="primary" fxLayout="row">
  <span>Customer Portal</span>
</mat-toolbar>
<ng-content></ng-content>
```

After this, we see this error:

```bash
apps/stromatolites/src/app/app.component.html:1:1 - error NG8001: 'clades-layout' is not a known element:
```

I don't get it. The clades-layout component is imported and declared in the LayoutModule which is imported into the stromatolites app.module, so it should be available to any component there, shouldn't it?

Not sure what is going on. To debug this issue, I will create a new layout module and got step by step again using progressive enhancement to apply the changes. Making a commit now to start with a clean slate.

The missing piece was the export in the layout module.  It has to not only declare the layout component, but export it also!  Sorry for all the drama.  I was starting to blame nx!

### [Fixing the layout unit test](https://github.com/timofeysie/clades/issues/16)

Before moving on, let's let how the new libs tests are doing.

```bash
nx test layout --watch
...
FAIL  libs/layout/src/lib/containers/layout/layout.component.spec.ts (12.31s)
  ● LayoutComponent › should create
    Template parse errors:
    Can't bind to 'routerLink' since it isn't a known property of 'button'. (" as user">
```

Not so good.  Best fix it now before we end up with a giant mess of failing tests and give up on them altogether.

That required an import and add to the imports array.

```js
import { RouterModule } from '@angular/router';
...
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterModule, MaterialModule ],
```

Next failure:

```bash
    Template parse errors:
    'mat-toolbar' is not a known element:
```

```js
import { MaterialModule } from '@clades/material';
...
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterModule, MaterialModule ],
```

Next:

```js
  ● LayoutComponent › should create
    NullInjectorError: StaticInjectorError(DynamicTestModule)[HttpClient]:
      StaticInjectorError(Platform: core)[HttpClient]:
        NullInjectorError: No provider for HttpClient!
```

Then this again:

```bash
  ● LayoutComponent › should create
    NullInjectorError: StaticInjectorError(DynamicTestModule)[RouterLinkActive -> Router]:
      StaticInjectorError(Platform: core)[RouterLinkActive -> Router]:
        NullInjectorError: No provider for Router!
```

First it was the router-link, now it's the router.  Who knows this stuff beforehand?

```js
import { RouterTestingModule } from "@angular/router/testing";
...
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterModule, RouterTestingModule, MaterialModule, HttpClientModule ],
```

Then:

```bash
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        18.026s
```

There's actually two tests, another test for the module.  But that took 18 seconds?  Wow.  Run them all:

```bash
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        13.349s, estimated 16s
```

A little better this time.  Nrwl has some new features that boast never compile or test unchanged code again, probably as a feature of their cloud suite.

### [Route Guards and Products Lib](https://github.com/timofeysie/clades/issues/15)

Add a lazy loaded lib with routing and make the container component to navigate to on login.

Later we *will grow this new feature lib out with advance NgRx features later int he course but for now we will just* - Duncan Hunter.

#### 9 - Route Guards and Products Lib [link](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/9-route-guards-and-products-lib)

Add a lib for a products page

```bash
nx generate @nrwl/angular:lib products --routing --lazy --parent-module=apps/stromatolites/src/app/app.module.ts
? Which stylesheet format would you like to use? SASS(.scss)  [ http://sass-lang.com   ]
CREATE libs/products/README.md (140 bytes)
CREATE libs/products/tsconfig.lib.json (408 bytes)
CREATE libs/products/tsconfig.lib.prod.json (97 bytes)
CREATE libs/products/tslint.json (244 bytes)
CREATE libs/products/src/index.ts (39 bytes)
CREATE libs/products/src/lib/products.module.ts (334 bytes)
CREATE libs/products/src/lib/products.module.spec.ts (358 bytes)
CREATE libs/products/tsconfig.json (123 bytes)
CREATE libs/products/jest.config.js (353 bytes)
CREATE libs/products/tsconfig.spec.json (233 bytes)
CREATE libs/products/src/test-setup.ts (30 bytes)
UPDATE workspace.json (27690 bytes)
UPDATE nx.json (1463 bytes)
UPDATE tsconfig.json (925 bytes)
UPDATE apps/stromatolites/src/app/app.module.ts (983 bytes)
```

Generate the container component.

```bash
nx g @nrwl/angular:component  containers/products --project=products
CREATE libs/products/src/lib/containers/products/products.component.html (23 bytes)
CREATE libs/products/src/lib/containers/products/products.component.spec.ts (642 bytes)
CREATE libs/products/src/lib/containers/products/products.component.ts (286 bytes)
CREATE libs/products/src/lib/containers/products/products.component.css (0 bytes)
UPDATE libs/products/src/lib/products.module.ts (449 bytes)
```

The original commands were:

```bash
ng g lib products --routing --lazy --prefix=app --parent-module=apps/customer-portal/src/app/app.module.ts
ng g c containers/products --project=products
```

A default app route to always go to products page.  Check default routes added to AppModule.  Add a new default route to always load the products on app load

They look like this:

```js
{
  path: '',
  pathMatch: 'full', redirectTo: 'products' },
{
  path: 'products',
  loadChildren: '@demo-app/products#ProductsModule',
}
```

The ProductsModule route looks like this:

```js
{ path: '', component: ProductsComponent }
```

Now the the 'products' button in the main menu links to the new products component.

Make sure the tests are passing:

```bash
nx test products
```

#### Add a route guard to protect products page

```bash
nx g @nrwl/angular:guard  guards/auth/auth --project=auth
? Which interfaces would you like to implement? (Press <space> to select, <a> to toggle
 all, <i> to invert selection)CanActivate
CREATE libs/auth/src/lib/guards/auth/auth.guard.spec.ts (331 bytes)
CREATE libs/auth/src/lib/guards/auth/auth.guard.ts (456 bytes)
```

That's very nice that it will add some interfaces implementations for us.  How civilized!

The original command was:

```bash
ng g guard guards/auth/auth --project=auth
```

The aurthgaurd must be exported in the auth index file, and then added to the stromatolites module and used in the routing.

```js
{
  path: 'products',
  loadChildren: '@demo-app/products#ProductsModule',
  canActivate: [AuthGuard]
}
```

or this:

```js
{
  path: 'products',
  loadChildren: () =>
    import('@clades/products').then(module => module.ProductsModule),
  canActivate: [AuthGuard]
}
```

That looks like a new syntax for doing lazy loading.  It's shown in [the official docs])https://angular.io/guide/lazy-loading-ngmodules) as the --module option.

The docs also say it uses *loadChildren followed by a function that uses the browser's built-in import('...') syntax for dynamic imports. The import path is the relative path to the module.*

So that's something that has changed in the two years since Duncan did his workshop.

Now if you run the server and run the app in a new termainal, and without logging in go to http://localhost:4200/products, you will be denied.

#### Auth unit tests

I think so far the auth module has not been tested.  It's not on the workflow list yet at least.  Run the command and add it to the list.

```bash
nx test auth --watch
```

The result is expected:

```bash
 FAIL  libs/auth/src/lib/guards/auth/auth.guard.spec.ts (6.572s)
  AuthGuard
    × should be created (362ms)
  ● AuthGuard › should be created
    NullInjectorError: StaticInjectorError(DynamicTestModule)[Router]:
      StaticInjectorError(Platform: core)[Router]:
        NullInjectorError: No provider for Router!
```

There are no arrays at all in the configureTestingModule({}) object.  Add it now:

```js
import { RouterTestingModule } from '@angular/router/testing';
...
 imports: [RouterTestingModule]
```

The next error is:

```bash
NullInjectorError: No provider for HtHttpClient
tpClient!
```

That requires the HttpClientTestingModule.

```js
import { HttpClientTestingModule } from '@angular/common/http/testing';
...
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, 
        HttpClientTestingModule]
    });
    guard = TestBed.inject(AuthGuard);
  });
```

Now the tests pass.  It would be wise at this point to write a meaningful test to confirm the guard is working without having to test it manually.  This will give you some confidence that the app is still secure in the future after other devs start to add code to the app.

For now create a list of things to test and come back to that.  It will be nice to get through the whole workshop with updated code.  It's mainly the Ngrx that this is for, not auth guards at this point.

#### Cache the user in local storage to save logging in for the rest or the workshop.

Next time.

#### Workflow shortcuts for Stromatolites

Just a reminder of what needs to be run when working on this project.

```bash
yarn run server
nx serve stromatolites
nx test stromatolites --watch
nx test layout --watch
nx test products --watch
```

#### Potential to do list

Here is a growing list of items that highlight areas of improvement for a potential updated article about how to implement features the use NgRx.

- NodeJS Express app, AWS Cognito, Azure B2C, or Firebase to replace the JSON demo server.
- Centralize validation error messages as noted in step 8: Reactive Forms and User interface.
- Use a web components library instead of the Angular specific layout lib created in step 10: The Layout lib.

#### Things to test

- the auth guard

## Testing NgRx

[The official docs](https://ngrx.io/guide/store/testing) suggest using a Mock Store.

_The provideMockStore() function registers providers that allow you to mock out the Store for testing functionality that has a dependency on Store without setting up reducers. You can write tests validating behaviors corresponding to the specific state snapshot easily. All dispatched actions don't affect the state, but you can see them in the Actions stream._

The docs start off with testing a fictional auth component. Lets apply the mock store as shown there to the counter example.

Start up the tests in a terminal:

```bash
nx test stratum --watch
```

### Fix the failing tests

After adding the counter code, we will see an error like this on first run:

```bash
● AppComponent › should render title
  Template parse errors:
  'clades-counter' is not a known element:
```

Since the app.module.ts has the CounterComponent in it's provider array, the test must also include that in it's provider array.

The next failure will then be this:

```bash
NullInjectorError: StaticInjectorError(DynamicTestModule)[CounterComponent -> Store]:
  StaticInjectorError(Platform: core)[CounterComponent -> Store]:
    NullInjectorError: No provider for Store!
```

The obvious solution would be to add Store to the imports array of the unit spec. But since the Store is used in the class constructor like this:

```TypeScript
constructor(private store: Store<{ count: number }>) {
```

The test also has to have a provider array which includes Store, like this:

```TypeScript
TestBed.configureTestingModule({
  imports: [RouterTestingModule],
  declarations: [AppComponent, CounterComponent],
  providers: [Store]
}).compileComponents();
```

However, this is not enough. After that change we will see this failure:

```bash
● AppComponent › should create the app
  NullInjectorError: StaticInjectorError(DynamicTestModule)[Store -> StateObservable]:
    StaticInjectorError(Platform: core)[Store -> StateObservable]:
      NullInjectorError: No provider for StateObservable!
```

What we need to fix this is the StoreModule.

```TypeScript
TestBed.configureTestingModule({
  imports: [RouterTestingModule, StoreModule.forRoot({})],
```

The next failure will be the new component with this message:

```bash
● CounterComponent › should create
  NullInjectorError: StaticInjectorError(DynamicTestModule)[CounterComponent -> Store]:
    StaticInjectorError(Platform: core)[CounterComponent -> Store]:
      NullInjectorError: No provider for Store!
```

Since the automatically generated test has no imports or providers array, we need to create those ourselves like this:

```TypeScript
TestBed.configureTestingModule({
  imports: [StoreModule.forRoot({})],
  declarations: [ CounterComponent ],
  providers: [Store]
})
```

Then, all of the four tests pass.

Get used to working apps but failing tests with Angular. An improvement for this headache is to create a test ngrx module that does all that and then import that in any spec file that references Store. Put this on the list of things to do.

### Using the NgRx MockStore

Now there is a clean set of passing "smoke tests". The default 'should create' tests will at least tell us if the template is breaking and some other errors. It's time to write some more meaningful tests that confirm the behavior of the counter features.

Again starting with [the official NgRx testing docs](https://ngrx.io/guide/store/testing) as a guide.

Import the required libs, a MockStore object, configure the test bed with an initial state, then confirm that the initial state is what is expected.

#### **`apps\stratum\src\app\counter\counter.component.spec.ts`**

```TypeScript
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let store: MockStore;
  const initialState = { count: 0 };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [ CounterComponent ],
      providers: [Store, provideMockStore({ initialState })]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
  }));
  it('counter should start at 0',  done => {
    component.count$.subscribe( count => {
      expect(count).toEqual(0);
      done();
    });
  });
});
```

In this case, the count is 0, and we have the basics of testing a value from the store using the `done => { }` callback.

Next we will want to test the increment, decrement and reset actions. The easy path is just to set the count directly, like this:

#### **`apps\stratum\src\app\counter\counter.component.spec.ts` (partial)**

```TypeScript
it('counter should increment',  done => {
  component.count$.subscribe( count => {
    store.setState({ count: 1 });
    expect(count).toEqual(1);
    done();
  });
});
```

But really we want to test the actions, not the direct setting of the count. How do we do that? It seems like we could just do this:

```TypeScript
store.dispatch(increment());
component.count$.subscribe( count => {
  expect(count).toEqual(1);
  done();
});
```

Or put the dispatch() call inside the subscribe function? Either way, the count is 0 when we expect it to be 1. The docs show using the store.refreshState() function to updated the count, but that doesn't work either.

The testing docs show how to import a reducer, but that doesn't seem to work in this case.

```TypeScript
import * as fromAuth from './reducers';
...
let mockUsernameSelector: MemoizedSelector<fromAuth.State, string>;
```

However, don't know what fromAuth is as there is no code shown from what is being tested in the short docs.

This does not work:

```TypeScript
let mockCounterReducer: MemoizedSelector<fromCount.State, number>;
```

The TypeScript error is:

```text
Namespace '"c:/Users/timof/repos/timofeysie/clades/apps/stratum/src/app/store/counter.reducer"' has no exported member 'State'.ts(2694)
```

This is what is exported exported:

#### **`apps\stratum\src\app\store\counter.reducer.ts`**

```TypeScript
export function counterReducer(state, action) {
  return _counterReducer(state, action);
}
```

Using counterReducer.State instead of the fabricated fromCount.State doesn't help the sitch and the error remains the same.

Doing a little [research](https://christianlydemann.com/the-complete-guide-to-ngrx-testing/), it seems _Reducers are the easiest to test as they are pure functions, and you should simply assert that you get the right state given the provided inputs._

The sitch is that now either the 'counter should change', or the 'counter should increment' test will work, but not both at the same time. The second increment test is not actually incrementing the store value. It's strange because the second test appears to fail, but with the reported values of the _second_ test.

#### **`apps\stratum\src\app\counter\counter.component.spec.ts`(partial)**

```js
it('counter should change', done => {
  component.count$.subscribe(count => {
    store.setState({ count: 1 });
    expect(count).toEqual(1);
    done();
  });
});

it('counter should increment', done => {
  component.count$.subscribe(count => {
    counterReducer({ counter: 0 }, increment());
    expect(count).toEqual(0);
    done();
  });
});
```

The first test doesn't really help much, so we should focus on getting the increment action tested. That test actually shows this error when the value is different:

```bash
Error: Uncaught [Error: expect(received).toEqual(expected) // deep equality
```

It's not cool that just an expectation failure will look like an error with a long stack trace. It makes the results less readable and misleading. Is this an issue with a false positive? For example, if the returned value in null or undefined and the expectation code reads the value '0' as a match.

```js
expect(count).toEqual(0);
```

In any event, the following should work if the increment code works.

```js
expect(count).toEqual(1);
```

```bash
FAIL  apps/stratum/src/app/counter/counter.component.spec.ts
● Console
  console.error node_modules/jsdom/lib/jsdom/virtual-console.js:29
    Error: Uncaught [Error: expect(received).toEqual(expected) // deep equality
    Expected: 1
    Received: 0]
        at reportException (C:\Users\timof\repos\timofeysie\clades\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:62:24)
        at Timeout.callback [as _onTimeout] (C:\Users\timof\repos\timofeysie\clades\node_modules\jsdom\lib\jsdom\browser\Window.js:645:7)
        at listOnTimeout (internal/timers.js:531:17)
...
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 5 passed, 6 total
Snapshots:   0 total
Time:        5.178s
Ran all test suites.
```

Looks like a failing test not an error. What do you think? I'm not sure that the done callback code inside which we `component.count$.subscribe` is going to work with the mocked selector. It's time to detail what the docs say about this.

### Using mock selectors

The next section of the official docs on testing has this to say about selectors:

_overrideSelector() returns a MemoizedSelector. To update the mock selector to return a different value, use the MemoizedSelector's setResult() method. Updating a selector's mock value will not cause it to emit automatically. To trigger an emission from all selectors, use the MockStore.refreshState() method after updating the desired selectors._

The example code this time shows user-greeting.component.ts/.spec.ts files.

The component has this store:

```js
@Component({
  selector: 'user-greeting',
  template: `
    <div>Greetings, {{ username$ | async }}!</div>
  `,
})
export class UserGreetingComponent {
  username$ = this.store.pipe(select(fromAuth.getUsername));
```

The test mockUsernameSelector looks like this:

```js
let mockUsernameSelector: MemoizedSelector<fromAuth.State, string>;
const queryDivText = () =>
  fixture.debugElement.queryAll(By.css('div'))[0].nativeElement.textContent;
```

It would be better to use a test id, as is the norm for React tests like this:

```html
<div id="counter-test-id">Current Count: {{ count$ | async }}</div>
```

But there is no By.id, so change that id to class and that should work. If there different thing to use from @angular/platform-browser which will find by id? Another thing for the todo list (actual).

Creating our own version of the mock selector however has multiple problems:

```js
let mockCounterSelector: MemoizedSelector<counterReducer.State, string>;
```

```bash
Identifier 'mockCounterSelector' is never reassigned; use 'const' instead of 'let'. (prefer-const)tslint(1)
Cannot find namespace 'counterReducer'.ts(2503)
```

Changing the let to const doesn't help the first problem:

```bash
'const' declarations must be initialized.ts(1155)
```

The counterReducer.State we just pulled out of our nether regions, and is a more serious issue. What is our version of that demo code? Regarding the let vs. const errors, actually, that's legit. We were never giving it a value, so good call there TypeScript/VSCode. Let's look at how that's done first.

The overrideSelector API looks like this:

```js
(method) MockStore<object>.overrideSelector<any, string, string>(selector: any, value: string): MemoizedSelector<any, string, DefaultProjectorFn<string>> | MemoizedSelectorWithProps<any, any, string, DefaultProjectorFn<...>>
```

What is fromAuth? It's a selector from the reducer file.

```js
fromAuth.getUsername, 'John';
```

Because selectors are pure functions they can use an optimization technique called memoization where the selector stores the outputs in a cache, if the selector gets called again with the same input it immediately returns the cached output.

Backing up a bit. There is a simple way to test reducer actions. This is what the simplest test could look like:

```js
it('increment reducer should increment the state', () => {
  const incrementedState = counterReducer(0, increment);
  expect(incrementedState).toBe(1);
});
```

Do we need to re-use the initialState instead of the value 0? Not sure. Now, should we also be testing the way the actions are used?

```js
this.store.dispatch(increment());
```

Also, these tests for the reducers are in the counter component tests. Should these tests be moved to the store directory? I think the component tests might want to do something like snapshot testing. Is that done in Angular.

## Implementing the counter example from the official docs

Trying this our on the counter example form the official docs.

```bash
nx g @nrwl/angular:app stratum
Cannot find module '@nrwl\angular\package.json'
Require stack:
- C:\Users\timof\repos\timofey
...
```

Same for this:

```bash
nx generate @nrwl/angular:app
```

This fixed it:

```bash
yarn add @nrwl/angular
```

Next step:

### Install NgRx

Three methods are shown:

```bash
npm install @ngrx/store --save
yarn add @ngrx/store
ng add @ngrx/store
```

That only adds the package. The below will do a lot more:

```bash
ng add @ngrx/store --minimal false
The add command requires to be run in an Angular project, but a project definition could not be found.
```

Changing into the stratum directory, we get this error:
_The add command requires to be run in an Angular project, but a project definition could not be found._

Using that command is a nice idea, but not working and not necessary for our goal of creating unit tests for the counter example. So on with that for now.

### 1. Define actions to express events

Create a new file named counter.actions.ts to describe the counter actions to increment, decrement, and reset its value.

Creating a store directory to hold these files.

### 2. Define a reducer function to manage the state

Define a reducer function to handle changes in the counter value based on the provided actions.

The example shows creation of a counter.reducer.ts file.

### 3. Register the global state container that is available throughout the application

Import the StoreModule from @ngrx/store and the counter.reducer file in the app.module.ts file.

Add the StoreModule.forRoot function in the imports array of your AppModule with an object containing the count and the counterReducer that manages the state of the counter. The StoreModule.forRoot() method registers the global providers needed to access the Store throughout your application.

### 4. Inject the Store service to dispatch actions and select the current state

Create a new Component named my-counter in the app folder. Going to change the name a bit. I'm pretty over the "my-whatever" naming convention for tutorials, so we will just call it "counter" not "my-counter".

We can use nx for this step.

```bash
ng generate component counter --project=stratum
```

Another example shows this flag:

```bash
ng g c components/counter --project=stratum --skip-import
```

There is also the nx way of doing things:

```bash
nx g component counter --project=stratum
Schematic "component" not found in collection "@nrwl/web".
```

That error came up in the Quallasuyu project. It was fixed with something like this:

```bash
yarn add @schematics/angular
yarn add @schematics/web
>nx g component counter --project=stratum
Schematic "component" not found in collection "@nrwl/web".
```

Or not. Let's look at some more examples.

```bash
nx generate @nrwl/angular:component counter --project=stratum
```

This works. Took a while, but we have a counter component now. Should have put it in a components directory. Next time. The naming convention used by nx gives us this:

```bash
<clades-counter>
```

Inject the Store service into your component to dispatch the counter actions, and use the select operator to select data from the state.

Update the MyCounterComponent template with buttons to call the increment, decrement, and reset methods. Use the async pipe to subscribe to the count\$ observable.

Update the MyCounterComponent class with a selector for the count, and methods to dispatch the Increment, Decrement, and Reset actions.

Add the MyCounter component to your AppComponent template.

### Use the Redux devtools

Install the Redux devtools for the Chrome browser by finding the "add more tools" link which will open [this page](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

Currently, nothings shows up (unless you have another app open which uses a store, in which case you might see that store).

_No store found. Make sure to [follow the instructions](https://github.com/zalmoxisus/redux-devtools-extension#usage)._

The counter is working and using the store. So an extra few steps are required. Looking at [this article](*https://alligator.io/angular/ngrx-store-redux-devtools/).

```bash
yarn add @ngrx/store-devtools
npm install @ngrx/store-devtools --save
```

In the app.module.ts file, import StoreDevtoolsModule and add it to your NgModule’s imports:

After this, in the Chrome inspector/Redux tab, we see the actions working on the counter. How great is that?!

## NgRx counter example

Here is a brief walk through of the tutorial example from the official NgRx docs.
[The counter tutorial is briefly explained with](https://ngrx.io/guide/store#tutorial) some code. I have broken it down into four steps.0

1. Define actions to express events.
2. Define a reducer function to manage the state of the counter.
3. Register the global state container that is available throughout the application.
4. Inject the Store service to dispatch actions and select the current state of the counter.

In more detail.

### Step 1: Define actions to express events

Create a new file named counter.actions.ts to describe the counter actions to increment, decrement, and reset its value.

### Step 2: Define a reducer function to manage the state

Define a reducer function to handle changes in the counter value based on the provided actions.

### Step 3: Register the global state container that is available throughout the application

Import the StoreModule from @ngrx/store and the counter.reducer file.

Add the StoreModule.forRoot function in the imports array of your AppModule with an object containing the count and the counterReducer that manages the state of the counter. The StoreModule.forRoot() method registers the global providers needed to access the Store throughout your application.

### Step 4: Inject the Store service to dispatch actions and select the current state

Create a new Component named my-counter in the app folder. Inject the Store service into your component to dispatch the counter actions, and use the select operator to select data from the state.

Update the MyCounterComponent template with buttons to call the increment, decrement, and reset methods. Use the async pipe to subscribe to the count\$ observable.

Update the MyCounterComponent class with a selector for the count, and methods to dispatch the Increment, Decrement, and Reset actions.

Add the MyCounter component to your AppComponent template.

## Steps for updated NgRx example enterprise app

(This section is a work in progress)

Due to problems with the completed [Workshop: Enterprise Angular applications with NgRx and Nx](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/) which is more than two years out of date now, a new project following along the general steps of development used to create the customer portal there is the plan now.

The following is the structure of CLI commands and some extra details that, linked with commits containing the added code could become a guide for adding new features using the techniques Duncan sets out in his workshop.

### Installing the nx CLI

Documentation on getting started with the nx CLI can be found [here](https://nx.dev/angular/cli/overview).

```bash
npm install -g @nrwl/cli
yarn global add @nrwl/cli
```

Don't mix package managers. If you start with npm, always use those commands. If you start with yarn, stay with it. Multiple lock files and other issues can arise. Yarn might be better for monorepo purposes.

### Generate a new workspace

```bash
ng new clades --collection=@nrwl/schematics
```

### Create a new applications

In the Duncan Hunter workshop, the name was customer-portal, we will be creating an app called stromatolites.

```bash
ng g application stromatolites --style=scss --routing --prefix=app
```

```bash
>ng g application stromatolites --style=scss --routing --prefix=app
The generate command requires to be run in an Angular project, but a project definition could not be found.
```

The current docs show this CLI command to create an Angular app (notice it says node, not angular):

```bash
nx generate @nrwl/node:app stromatolites
```

Despite what the docs say, this will indeed create an NodeJS app. To create an Angular app, you do need to say 'angular' to the CLI:

```bash
nx generate @nrwl/angular:app stromatolites
```

Notes from the [official docs](https://nx.dev/angular/tutorial/01-create-application) show the method using npx and the CLI to answer these questions.

```bash
npx create-nx-workspace@latest
? Workspace name (e.g., org name)     myorg
? What to create in the new workspace angular
? Application name                    todos
? Default stylesheet format           CSS
```

When creating the first React app for this repo, this was also needed:

```bash
npm i @nrwl/workspace
```

The workflow commands now are:

```bash
nx serve stromatolites
nx run stromatolites:serve
```

They are equivalent commands.

### Issues with creating a new app

```bash
>ng g application stromatolites --style=scss --routing --prefix=app
The generate command requires to be run in an Angular project, but a project definition could not be found.
```

### Serve the app

```bash
ng s --project=customer-portal
```

```bash
nx serve todos
npm run nx -- serve todos
npm run nx -- serve todos
```

### step 3 login form

```bash
>ng g c components/login-form --project=auth --skip-import
CREATE libs/auth/src/lib/components/login-form/login-form.component.html/spec.ts/.ts.scss
```

### Generating a lib

```bash
ng g lib auth --routing --prefix=app --parent-module=apps/customer-portal/src/app/app.module.ts
ng s --project=customer-portal
```

### Demo server

```bash
npm i json-server ts-node --save-dev
```

### Create the auth service

```bash
ng g service services/auth/auth --project=auth
```

### Generate a shared data-model

See the appropriate section in the workshop.

### Setting up Material Design

```bash
npm install @angular/material @angular/cdk @angular/flex-layout @angular/animations
yarn add @angular/material @angular/cdk @angular/flex-layout @angular/animations
```

```bash
? What framework should this library use? Angular    [ https://angular.io/ ]
```

Next issue:

```bash
ERROR in libs/material/src/lib/material.module.ts(16,8): error TS2306: File 'C:/Users/timof/repos/timofeysie/quallasuyu/node_modules/@angular/material/index.d.ts' is not a module.
```

Thanks to [this SO answer](https://stackoverflow.com/questions/58594311/angular-material-index-d-ts-is-not-a-module), we know that it's a Angular 9 breaking change probably for tree shaking purposes. So instead of doing a single line import with stuff like this:

```bash
import {
  ...
  MatSelectModule
} from '@angular/material';
```

We have to do this:

```bash
...
import { MatSelectModule } from '@angular/material/select';
```

Then however, there are more errors:

```bash
ERROR in node_modules/@angular/cdk/coercion/array.d.ts(10,60): error TS1005: ',' expected.
node_modules/@angular/cdk/coercion/array.d.ts(10,61): error TS1005: ',' expected.
node_modules/@angular/cdk/coercion/array.d.ts(10,75): error TS1144: '{' or ';' expected.
node_modules/@angular/cdk/coercion/array.d.ts(10,77): error TS1011: An element access expression should take an argument.
```

We may not be so lucky this time, the only whiff of this on Google is this [as yet unanswered question](https://stackoverflow.com/questions/60949170/cannot-import-matdialogmodule-in-app-module). The asker has an Angular version mismatch:

```TypeScript
        "@angular/animations": "^7.2.16",
        "@angular/cdk": "^9.2.0",
        "@angular/common": "~7.2.0",
        "@angular/compiler": "~7.2.0",
        "@angular/core": "~7.2.0",
        "@angular/forms": "~7.2.0",
        "@angular/material": "^9.2.0",
```

Since we have Angular 7, we actually need to install Material 7. Duncan did actually point this out at the top of section 6: _Always use the same Major version of Material as your Angular CLI and packages._

Manually changed those imports to 7.0.0. Then got this error running yar (same as npm i by the way):

```bash
gyp ERR! configure error
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack   File \"<string>\", line 1
gyp ERR! stack     import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack SyntaxError: invalid syntax
gyp ERR! stack     at ChildProcess.exithandler (child_process.js:304:12)
```

However, this does not stop the serve and we get our styles, even with the separate imports. I was thinking I would have to revert all those import changes. Thanks Dunkan. Sorry about the earlier comment. There is even a link to some [flex examples](https://tburleson-layouts-demos.firebaseapp.com/#/docs).

Getting to the enterprise stuff, mainly, forms.

A nice comment Duncan makes at the start is great: _To save injecting the formBuilder and keeping this a presentational component with no injected dependencies we can just new up a simple FormGroup. You can read more about it here._

He's talking React there and functional components. I mean, keeping the constructor clear of injections as much as possible, and reducing member variables is the way to keep Angular from getting too "classy". I mean, a form group is like state management for a particular part of the app. Hello Redux.

A few errors to get through:

```bash
compiler.js:2430 Uncaught Error: Unexpected module 'ReactiveFormsModule' declared by the module 'AuthModule'. Please add a @Pipe/@Directive/@Component annotation.
```

Also, this line:

```bash
  <form [formGroup]="loginForm" fxLayout="column" fxLayoutAlign="center none">
```

Causes this VSCode squiggly mouseover error:

```bash
Can't bind to 'formGroup' since it isn't a known property of 'form'.
```

Should ReactiveFormsModule be in the imports, not the declarations? This went away after opening a different project in VSCode and then switching back here again. Faster than a restart.

Next, step 8 - Layout Lib and BehaviorSubjects.

```bash
ng g lib layout --prefix app
ng g c containers/layout --project=layout
warning Lockfile has incorrect entry for "@angular/flex-layout@^7.0.0". Ignoring it.
? Please choose a version of "@angular/flex-layout" from this list: (Use arrow keys)
The later version 7 choice on the list was 7.0.0-beta-24.  In fact all choices were beta.  If this was for work I would actually look into this a bit more.
```

Getting the gyp configure error which ends like this:

```bash
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.C:\\Users\\timof\\repos\\timofeysie\\quallasuyu\\node_modules\\@angular-devkit\\build-angular\\node_modules\\node-sass
```

Might just need to rebuild node-sass? As it is, the new layout "lib" is there and the app compiles and runs.

There are a few typos and mistakes on this step. Duncan! But, we do get some juicy stuff at the end when he says: _Extras: Convert Layout component into a pure container component Add a toolbar presentational component. Pass user into presentational component via inputs._

That's the functional stuff coming out again. Good idea. Except, who here is ready to get on with the NgRx state management implementation? I am! Only one more step to go: step 9 - Route Guards and Products Lib.

```bash
ng g lib products --routing --lazy --prefix=app --parent-module=apps/customer-portal/src/app/app.module.ts
ng g c containers/products --project=products
ng g guard guards/auth/auth --project=auth
```

Again had to choose the version and see the gyp error on the products generation line up there.
I chose a version of "@angular/flex-layout" from this list: 7.0.0-beta.24 again.

I saw this in the code for the previous section but there was no mention of adding it in any of the steps so far:

```bash
import { NxModule } from '@nrwl/nx';
```

Looks like it first showed up in step 6 when adding Material. It doesn't show up in the "// Added" comments that usually accompany new lines of code in the articles. It is a pretty long tutorial, and high difficulty level, so there's a lot to cover. I don't hold it against Duncan at all. It's just it pays to pay attention to the quality of samples from the internet to weigh the veracity of the concepts being used. Knowing Duncan personally through meetups, I can vouch for the accuracy of the material. However, again in step 9 there are some silly errors in the docs, such as repeated and unused imports. I know editing is hard. I don't like to edit which is why I never want to go the extra steps to publish any blogs although these readme files are almost blogs in themselves. It's good to be reminded of the level of work needed to produce a tutorial of this length, and what users feel like about the last 1% of editing.

The auth guard generation also asked some questions:
_? Which interfaces would you like to implement? CanActivate_. There are other interfaces to implement, but that is the only one used in the sample code.

Again there are Extras in this step, such as "Add logout functionality" and "Add angular interceptor".

If we want to update the auth service to set a token in local storage, we can come back to this later.

Finally, [step 10: NgRx](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/10-ngrx-introduction)

### Create the server

```bash
npm i json-server ts-node --save-dev
```

After problems with npm in a mono-repo setting, the new rule is yarn every time. There is a package-lock and a yarn.lock file already. Should package-lock go? The warning says:

```bash
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by un-synchronized lock files. To clear this warning, remove package-lock.json.
```

So, yes, it should go.

Without much explanation, we create a mock backend and it's on to 5 - Angular Services.

```bash
ng g service services/auth/auth --project=auth
```

The login component has this code with the comment: _.subscribe() is needed to make sure the observer is registered with the observable returned from our AuthService. Later in the workshop we will learn to use NgRx to get entities from a server, but for now this is normal angular code without NgRx_

```TypeScript
this.authService.login(authenticate).subscribe();
```

Looking forward to that NgRx part!

In the meantime, the serve is failing due to this:

```bash
ERROR in libs/auth/src/lib/components/login-form/login-form.component.ts(2,30): error TS2307: Cannot find module '@myorg/data-models'.
libs/auth/src/lib/containers/login/login.component.ts(3,30): error TS2307: Cannot find module '@myorg/data-models'.
libs/auth/src/lib/services/auth/auth.service.ts(2,30): error TS2307: Cannot find module '@myorg/data-models'.
```

I'm pretty sure this was running before. There is a list of myorg indexes in the tsconfig.json file. Try adding it there.

```bash
...
      "@myorg/auth": ["libs/auth/src/index.ts"],
      "@myorg/data-models": ["libs/data-models/src/index.ts"]
```

That doesn't help. Also, it's not in the complete tutorial code. The only thing needed seems to be a type definition .d.ts file and an index exporting it. Fine. We already have a data lib for the same purpose that has a todo interface in it. Just add the authentication interface there and move on.

```bash
npm install @angular/material @angular/cdk @angular/flex-layout @angular/animations
yarn add @angular/material @angular/cdk @angular/flex-layout @angular/animations
```

There was no indication of the kind of component lib to use. Just assuming Angular, but Duncan, dude, you could do a bit better with the explanations.

```bash
? What framework should this library use? Angular    [ https://angular.io/ ]
```

Next issue:

```bash
ERROR in libs/material/src/lib/material.module.ts(16,8): error TS2306: File 'C:/Users/timof/repos/timofeysie/quallasuyu/node_modules/@angular/material/index.d.ts' is not a module.
```

Thanks to [this SO answer](https://stackoverflow.com/questions/58594311/angular-material-index-d-ts-is-not-a-module), we know that it's a Angular 9 breaking change probably for tree shaking purposes. So instead of doing a single line import with stuff like this:

```bash
import {
  ...
  MatSelectModule
} from '@angular/material';
```

We have to do this:

```bash
...
import { MatSelectModule } from '@angular/material/select';
```

Then however, there are more errors:

```bash
ERROR in node_modules/@angular/cdk/coercion/array.d.ts(10,60): error TS1005: ',' expected.
node_modules/@angular/cdk/coercion/array.d.ts(10,61): error TS1005: ',' expected.
node_modules/@angular/cdk/coercion/array.d.ts(10,75): error TS1144: '{' or ';' expected.
node_modules/@angular/cdk/coercion/array.d.ts(10,77): error TS1011: An element access expression should take an argument.
```

We may not be so lucky this time, the only whiff of this on Google is this [as yet unanswered question](https://stackoverflow.com/questions/60949170/cannot-import-matdialogmodule-in-app-module). The asker has an Angular version mismatch:

```TypeScript
        "@angular/animations": "^7.2.16",
        "@angular/cdk": "^9.2.0",
        "@angular/common": "~7.2.0",
        "@angular/compiler": "~7.2.0",
        "@angular/core": "~7.2.0",
        "@angular/forms": "~7.2.0",
        "@angular/material": "^9.2.0",
```

Since we have Angular 7, we actually need to install Material 7. Duncan did actually point this out at the top of section 6: _Always use the same Major version of Material as your Angular CLI and packages._

Manually changed those imports to 7.0.0. Then got this error running yar (same as npm i by the way):

```bash
gyp ERR! configure error
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack   File \"<string>\", line 1
gyp ERR! stack     import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack SyntaxError: invalid syntax
gyp ERR! stack     at ChildProcess.exithandler (child_process.js:304:12)
```

However, this does not stop the serve and we get our styles, even with the separate imports. I was thinking I would have to revert all those import changes. Thanks Dunkan. Sorry about the earlier comment. There is even a link to some [flex examples](https://tburleson-layouts-demos.firebaseapp.com/#/docs).

Getting to the enterprise stuff, mainly, forms.

A nice comment Duncan makes at the start is great: _To save injecting the formBuilder and keeping this a presentational component with no injected dependencies we can just new up a simple FormGroup. You can read more about it here._

He's talking React there and functional components. I mean, keeping the constructor clear of injections as much as possible, and reducing member variables is the way to keep Angular from getting too "classy". I mean, a form group is like state management for a particular part of the app. Hello Redux.

A few errors to get through:

```bash
compiler.js:2430 Uncaught Error: Unexpected module 'ReactiveFormsModule' declared by the module 'AuthModule'. Please add a @Pipe/@Directive/@Component annotation.
```

Also, this line:

```bash
  <form [formGroup]="loginForm" fxLayout="column" fxLayoutAlign="center none">
```

Causes this VSCode squiggly mouseover error:

```bash
Can't bind to 'formGroup' since it isn't a known property of 'form'.
```

Should ReactiveFormsModule be in the imports, not the declarations? This went away after opening a different project in VSCode and then switching back here again. Faster than a restart.

Next, step 8 - Layout Lib and BehaviorSubjects.

```bash
ng g lib layout --prefix app
ng g c containers/layout --project=layout
```

warning Lockfile has incorrect entry for "@angular/flex-layout@^7.0.0". Ignoring it.
? Please choose a version of "@angular/flex-layout" from this list: (Use arrow keys)
The later version 7 choice on the list was 7.0.0-beta-24. In fact all choices were beta. If this was for work I would actually look into this a bit more.

Getting the gyp configure error which ends like this:

```bash
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.C:\\Users\\timof\\repos\\timofeysie\\quallasuyu\\node_modules\\@angular-devkit\\build-angular\\node_modules\\node-sass
```

Might just need to rebuild node-sass? As it is, the new layout "lib" is there and the app compiles and runs.

There are a few typos and mistakes on this step. Duncan! But, we do get some juicy stuff at the end when he says: _Extras: Convert Layout component into a pure container component Add a toolbar presentational component. Pass user into presentational component via inputs._

That's the functional stuff coming out again. Good idea. Except, who here is ready to get on with the NgRx state management implementation? I am! Only one more step to go: step 9 - Route Guards and Products Lib.

```bash
ng g lib products --routing --lazy --prefix=app --parent-module=apps/customer-portal/src/app/app.module.ts
ng g c containers/products --project=products
ng g guard guards/auth/auth --project=auth
```

Again had to choose the version and see the gyp error on the products generation line up there.
I chose a version of "@angular/flex-layout" from this list: 7.0.0-beta.24 again.

I saw this in the code for the previous section but there was no mention of adding it in any of the steps so far:

```bash
import { NxModule } from '@nrwl/nx';
```

Looks like it first showed up in step 6 when adding Material. It doesn't show up in the "// Added" comments that usually accompany new lines of code in the articles. It is a pretty long tutorial, and high difficulty level, so there's a lot to cover. I don't hold it against Duncan at all. It's just it pays to pay attention to the quality of samples from the internet to weigh the veracity of the concepts being used. Knowing Duncan personally through meetups, I can vouch for the accuracy of the material. However, again in step 9 there are some silly errors in the docs, such as repeated and unused imports. I know editing is hard. I don't like to edit which is why I never want to go the extra steps to publish any blogs although these readme files are almost blogs in themselves. It's good to be reminded of the level of work needed to produce a tutorial of this length, and what users feel like about the last 1% of editing.

The auth guard generation also asked some questions:
_? Which interfaces would you like to implement? CanActivate_. There are other interfaces to implement, but that is the only one used in the sample code.

Again there are Extras in this step, such as "Add logout functionality" and "Add angular interceptor".

If we want to update the auth service to set a token in local storage, we can come back to this later.

Finally, [step 10: NgRx](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/10-ngrx-introduction)

#

# Adding NgRx to the customer portal

```bash
> ng g ngrx app --module=apps/customer-portal/src/app/app.module.ts  --onlyEmptyRoot
> ng generate ngrx auth --module=libs/auth/src/lib/auth.module.ts
```

Answered no to both of these questions:

```bash
? Is this the root state of the application? No
? Would you like to add a Facade to your ngrx state No
```

Is this a typo?
_Add NgRx Auth lib making it0 a state state_

Whichever, the second command creates the plus directory:

```bash
libs/auth/src/lib/+state/auth.x
```

The x is for these x.ts files:

- actions
- effects/spec
- reducer/spec
- selectors/spec

And that's it for that section. Next is _Strong Typing the State and Actions_. I think it's worth a commit just so we have a record of what the changes for the strong typing are.

Aside from the strong typings, the actions are more specific. The generic actions were:

```bash
  LoadAuth = '[Auth] Load Auth',
  AuthLoaded = '[Auth] Auth Loaded',
  AuthLoadError = '[Auth] Auth Load Error'
```

The new actions are:

```bash
  Login = '[Auth Page] Login',
  LoginSuccess = '[Auth API] Login Success',
  LoginFail = '[Auth API] Login Fail'
```

The errors now on serve are:

```bash
ERROR in libs/auth/src/lib/+state/auth.effects.ts(7,3): error TS2305:
Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.actions"' has no exported member 'LoadAuth'.

libs/auth/src/lib/+state/auth.effects.ts(8,3): error TS2305:
Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.actions"' has no exported member 'AuthLoaded'.

libs/auth/src/lib/+state/auth.effects.ts(9,3): error TS2305:
Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.actions"' has no exported member 'AuthLoadError'.

libs/auth/src/lib/+state/auth.effects.ts(15,68): error TS2339:
Property 'LoadAuth' does not exist on type 'typeof AuthActionTypes'.

libs/auth/src/lib/+state/auth.reducer.ts(1,10): error TS2724:
Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.actions"' has no exported member 'AuthAction'. Did you mean 'AuthActions'?

libs/auth/src/lib/+state/auth.reducer.ts(37,26): error TS2339:
Property 'AuthLoaded' does not exist on type 'typeof AuthActionTypes'.
```

The default actions created do not match what is imported in the default reducer.

```bash
import { AuthAction, AuthActionTypes } from './auth.actions';
```

```bash
export type AuthActions = Login | LoginSuccess | LoginFail;
```

So yes, we need an 's'. Then we get this:

```bash
WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/auth.module.ts 28:39-55
"export 'AUTH_FEATURE_KEY' was not found in './+state/auth.reducer'

WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.selectors.ts 4:41-57
"export 'AUTH_FEATURE_KEY' was not found in './auth.reducer'

WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.effects.ts 17:27-40
"export 'AuthLoadError' was not found in './auth.actions'

WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.effects.ts 13:27-37
"export 'AuthLoaded' was not found in './auth.actions'

WARNING in Duplicated path in loadChildren detected during a rebuild. We will take the latest version detected and override it to save rebuild time. You should perform a full build to validate that your routes don't overlap.
i ｢wdm｣: Compiled with warnings.
```

The app also has this in the console:

```bash
Error: StaticInjectorError(AppModule)[AuthEffects -> DataPersistence]:
  StaticInjectorError(Platform: core)[AuthEffects -> DataPersistence]:
    NullInjectorError: No provider for DataPersistence!
```

There are still some changes missing from this section. Step 12 just finishes with the action file and some partial reduces. Looking at the code for the completed project, there is no auth.selectors.ts file. After removing that, the app runs, and there are just these warnings remaining:

```bash
WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/auth.module.ts 28:39-55
"export 'AUTH_FEATURE_KEY' was not found in './+state/auth.reducer'

WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.selectors.ts 4:41-57
"export 'AUTH_FEATURE_KEY' was not found in './auth.reducer'
```

At this point, we have logged and logged out states, and we can see this in the Redux Chrome dev tools tab.

That says:

```bash
[Auth Page] Login {
  undefined: {
    loading: false => true
  }
}
[Auth API] Login Success {
  undefined: {
    loading: true => false
  }
}
```

So that's true. Login succeeds, and the loader turns false.

But, the undefined is not helpful, and it seems that the Login action should not be about loading. Shouldn't it say something like "authenticated: false => true"?

Other things to notice at this point is that the logout function doesn't register in the Redux tab. After a break, starting the server again, we see this error:

```bash
ERROR in libs/auth/src/lib/auth.module.ts(12,3): error TS2305: Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.reducer"' has no exported member 'AUTH_FEATURE_KEY'.
```

That was some old code in the auth module. After that, a new Effect action was added to navigate on LoginSuccess, update AuthGuard to use the store and in the customer portal component on-load, check local storage and dispatch a LoginSuccess action and we navigate to the products page, which is still not implemented.

Next, selectors. [The first step](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/14-ngrx-selectors) is to create in index file for the store. Wait, didn't we have a selector file and delete it? Why not call it auth.selector.ts, and not index.ts, which is like a barrel file?

The sample code shows the libs/auth/src/lib/+state/products.selectors.ts file. In this file, it references files that don't exist yet.

```TypeScript
import { ProductsState, ProductsData } from './products.reducer';
import * as fromProduct from './products.reducer';
```

There is actually an auth reducer in the source file. Maybe Duncan made a mistake with the source files he posted? The next step is to add the products feature module, so instead of trying to figure out what was intended in this short step with almost no explanations, it might be just better to move on to step 15 for now.

Moving on, there is a typo on the next step brief: _In this section we challenge you understanding by adding a Products module like we did for login_. "You" should be "your".

Going along with it,

```bash
ng generate ngrx products --module=libs/products/src/lib/products.module.ts
? Is this the root state of the application? No
? Would you like to add a Facade to your ngrx state No
```

Not sure if those are the correct answers. It would be nice if the Duncan prepared the reader for this kind of thing, or most likely, these questions were added to the schema after he wrote this tutorial. And the scale of the tutorial made updating it troublesome.

Add Products Action Creators

```TypeScript
  LoadProducts = '[Products Page] Load Products',
  LoadProductsSuccess = '[Products API] Load Products Success',
  LoadProductsFail = '[Products API] LoadProducts Fail'
```

Next, make a new ProductsService in products module, add an effect, a reducer

```bash
ng g service services/products/products --project=products
```

Decided to change the non-standard class urls from this:

```TypeScript
selector: 'demo-app-products',
```

To this:

```TypeScript
selector: 'app-products',
```

Also tried to change this:

```bash
import { productsQuery } from './../../+state';
```

To this:

```bash
import { productsQuery } from '../../+state/products.selectors';
```

The productsQuery is used like this:

```bash
this.products$ = this.store.pipe(select(productsQuery.getProducts)
```

But that causes this mouseover VSCode TypeScript error:

```bash
Property 'getProducts' does not exist on type '{ getLoaded: MemoizedSelector<object, any>; getError: MemoizedSelector<object, any>; getAllProducts: MemoizedSelector<object, any>; getSelectedProducts: MemoizedSelector<...>; }'.ts(2339)
```

getProducts is in effects, but productsQuery is in selectors.

The selector looks like this:

```TypeScript
import { productsQuery } from '../../+state/products.selectors';
export const productsQuery = {

  getLoaded,
  getError,
  getAllProducts,
  getSelectedProducts
};
...
this.products$ = this.store.pipe(select(productsQuery.getAllProducts))
```

See, no getProducts. Can we use getAllProducts?

There is another error after a bit more work:

```bash
ERROR in C:/Users/timof/repos/timofeysie/quallasuyu/libs/products/src/lib/containers/products/products.component.ts
Module not found: Error: Can't resolve '../../+state/products.selectors' in 'C:\Users\timof\repos\timofeysie\quallasuyu\libs\products\src\lib\containers\products'
```

Instead of the productsQuery import shown above, this works:

```bash
import { getProducts } from './../../+state';
...
this.products$ = this.store.pipe(select(getProducts));
```

That was just trial an error there. And then the product list shows up.

This is looking good for a follow up article which focuses on setting up NgRx with Nx.

### Use the entity adapter in the products reducer

To get the previous step going we jumped ahead to the code from the completed project. It's worth noting some details about this step, since there actually is a bit of a description this time.
Duncan says: _Extend ProductState with EntityState. By default it will make an entities and ids dictionary. You Add to this any state properties you desire. Create an adapter and use it 's getInitialState method to make the initial state._

Why would we need this? The name is a bit deceiving. If you look at the products component template from the previous step, you can see that it just dumps the json into the page. Why is this? Material design would make it easy to create a beautiful list, right?

```TypeScript
<div *ngFor="let product of products">
  {{product.name}}
</div>
```

The real reson you need entity is that the above causes this classic error:

```bash
Cannot find a differ supporting object '[object Object]' of type 'object'. NgFor only supports binding to Iterables such as Arrays.
```

Making a commit and getting the serve starting again showed this error on the previously working code:

```bash
Cannot find module '@angular/compiler'
Require stack:
- C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\@angular\compiler-cli\index.js
```

Tried this:

```bash
yarn
```

Then there was this error:

```bash
ERROR in libs/layout/src/lib/containers/layout/layout.component.ts(8,10): error TS2305: Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src"' has no exported member 'productsQuery'.
libs/products/src/index.ts(2,15): error TS2307: Cannot find module './lib/+state/products.selectors'.0
```

Restarted and also restarted the editor and the same code now runs.

So back to entity, it's installed like this:

```bash
npm install @ngrx/entity
```

[The official docs](https://ngrx.io/guide/entity) say _Entity State adapter for managing record collections._

There is no code on that page. Despite the one line to install it, the following link is provided: _Detailed installation instructions can be found on the Installation page._. Thanks. That's not what we need more detail on.

There is actually a lot of details [thanks to Duncan's like](https://github.com/ngrx/platform/blob/master/docs/entity/adapter.md).

Here are some more detail:

```TypeScript
export interface ProductsData extends EntityState<Product> {
```

This is the first time I notice that the whole project in the complete project code in named user-portal and not customer-portal like it is here. That could be why the file in the Duncan code shows a file called users.reducer.ts. So we should be able to just change the name of the file, which is all about products anyhow. I'm waiting for the product list component by the way.

There were some intermittent errors that were soled by running yarn, restarting the server and restarting VSCode. Not sure what's causing this and wish I knew exactly when and how to fix this kind of issue:

```bash
ERROR in libs/layout/src/lib/containers/layout/layout.component.ts(8,10): error TS2305: Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src"' has no exported member 'productsQuery'.
```

That was an old issue, so I'm guessing there is a compiled file somewhere that wasn't updated.

Anyhow, on to the next step. The last for the development side of things.

### Step 17 - Router Store

It says it's about the router, but includes the needed product list component.

```bash
ng g c components/product-list --project=products
```

It's nice that the CLI adds the new component to the products module for us.

When the markup to pass down the product is added to the container components template, we get another classic Angular error:

```VSCode
Can't bind to 'products' since it isn't a known property of 'app-product-list'.
```

That's because we need to add an Input reference in the list component. Then we can add the list markup to the template, although Duncan lists the file as product-list.component.ts, not .html. Getting used to this by the end of the tutorial.

After implementing all the steps, we have our products list, and a selector to filter by category. No explanation of any of the steps except for the header of each step. And when it's all done, nothing. Just a link to the next section, which is about deployments.

```bash
> ng build --prod -a=admin-portal
Unknown option: '-a'
```

I think that should either be customer-portal as it shows in step 2, or user-portal as it's called in the completed project code.

As for the error, try a double dash:

```bash
C:\Users\timof\repos\timofeysie\quallasuyu>ng build --prod --a=customer-portal
You seem to not be depending on "@angular/core" and/or "rxjs". This is an error.
```

That's not good. What I think Duncan means is "--app=customer-portal":

But the error remains. Worse still, the serve is broken with this error:

```bash
Error: Cannot find module '@angular/compiler'
```

The usual yarn and restart doesn't work now. Trying this long and drawn out approach:

```bash
> yarn add @angular/compiler-cli --save-dev
*delete node_modules?*
> yarn cache clean
> ng serve customer-portal
Object prototype may only be an Object or null: undefined
TypeError: Object prototype may only be an Object or null: undefined
    at setPrototypeOf (<anonymous>)
    at Object.__extends (C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\tslib\tslib.js:64:9)
```

That was a nice idea. I recommend not to use a folder to delete node_modules on Windows. It goes through this discovery process for about a minute and then deleting the 141,242 files it "discovered".

According to [these answers](https://stackoverflow.com/questions/57421582/typeerror-object-prototype-may-only-be-an-object-or-null-undefined-angular-8), it's an Angular issue fixed by an upgrade. Not a bad idea actually. According to [this answer](https://stackoverflow.com/questions/53122751/typeerror-object-prototype-may-only-be-an-object-or-null-undefined/53123468), it's a circular dependency.

The code was running before stopping the serve and doing the last commit. So it's something that was compiling before, but not now, for whatever reason.

There is not that much on Google about this. Things like _I suspect that many will see this error in the future, because a lot of us reexport from a central index.ts. Since we are doing that, it's tempting to import from index.ts in order to shorten the import path instead of importing the module directly._ from [the TS GitHub](https://github.com/Microsoft/TypeScript/issues/283140).

And _We find that they essentially always indicate poor layering in the engineering design._ as a duplicate [of this](https://github.com/microsoft/TypeScript/pull/21780).

If _cyclical dependencies lead to maintainability problems_, but the app was working fine at this point, could we ignore this particular instance? There is nothing helpful in the stack trace to let us know where the problem lies.

There is a noImportCycles option. Not sure how to set it, but this doesn't work:

```TypeScript
    "eslint.options": {
        "rules": {
            "noImportCycles": false
        }
    }
```

At this point, it's worth just committing the code. It did work. It might for someone else, who knows. Until I can either fix the circular dependencies or upgrade Angular to fix it, right now, not sure.

Here are the remaining commands from step 18:

```bash
npm install  --save-dev webpack-bundle-analyzer
ng build --prod -a=customer-portal --stats-json
npm run bundle-report-customer-portal
npm run dep-graph
```

Then, the 18 step guide is done. No thank you, no debrief. Nothing. Feeling like I can contribute to this subject on my own now. Might try and write a blog about the RxJs used in the effects which is difficult to read for someone who may not be so familiar with the subject.

## The Official NgRx project

This workspace was first created while following along with the [official video tutorial](https://www.youtube.com/watch?v=Y9ZgpvcFUXs&list=PLakNactNC1dH38AfqmwabvOszDmKriGco&index=4).

```bash
>npx create-nx-workspace@latest clades
npx: installed 199 in 23.278s
? What to create in the new workspace web components    [a workspace with a single app
built using web components]
? Application name                    clades
? Default stylesheet format           CSS
...
> nx generate @nrwl/react:app
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

Tried a number of different approaches, but couldn't get the app to run again. It was serving and I was able to include the ui-header page title component in the app. [This article](https://dev.to/stereobooster/typescript-monorepo-for-react-project-3cpa) suggests using yarn instead of npm in a monorepo because _it supports workspaces to link cross-dependencies._ That's a decent reason to use yarn, which I have used for another monorepo before, but without having a good reason to use yarn. Just it was a popular choice amon devs at the time.

So if yarn is the answer here, do I have to go back and re-run some of those commands above with it?
Such as adding express. But this results in the same error:

```bash
yarn add @nrwl/express
> nx g @nrwl/express: app api --frontendProject=monophyletic
Schematic "@nrwl/express" not found in collection "@nrwl/web".
```

Then I actually read the output from the terminal which said you shouldn't mix package managers and to remove the package-lock.json file and run the command again. This done, and our generate command works. On with the show.

```bash
nx g @nrwl/workspace:lib api-interface
```

## Original automatically generated readme

### Adding capabilities to your workspace

The following is from the original readme created with the workspace.

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are some plugins which you can add to your workspace:

- [React](https://reactjs.org) - `npm install --save-dev @nrwl/react`
- Web (no framework frontends) - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io) - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com) - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com) - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org) - `npm install --save-dev @nrwl/node`

### Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@clades/mylib`.

### Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

### Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
