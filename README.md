# Clades

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

Currently unit testing the counter example to create a guide for TDD workflow for NgRx Angular development.

## Table of contents

* [Testing Ngrx](#testing-ngrx)
* [Implementing the counter example from the official docs](#implementing-the-counter-example-from-the-official-docs)
* [NgRx counter example](#ngRx-counter-example)
* [Steps for updated NgRx example enterprise app](#Steps-for-updated-NgRx-example-enterprise-app)
* [The Official NgRx project](#the-Official-NgRx-project)
* [Original automatically generated readme](#original-automatically-generated-readme)

## Workflows

Project scripts reference.

```bash
nx serve api # serve the API backend
nx serve monophyletic # serve the React front end
nx serve stratum # Angular app with unit tests for the counter example
nx serve stromatolites # Angular app for the updated Duncan workshop code
nx test stratum --watch # run Angular Jest unit tests
nx test stromatolites --watch
nx dep-graph # show the dependency graph
nx affected:dep-graph # show the deo-graph with updates needed
ng g @nrwl/angular:lib ui # Generate UI lib
ng g @nrwl/angular:component xyz --project ui # Add a component
nx dep-graph # open the dependency graph
ng affected:dep-graph # see what's been affected by changes
ng affected:test # run tests for current changes
ng affected:e2e # run e2e tests for current changes
```

## Re-implementing the Duncan

As the code from the  GitBook: [Workshop: Enterprise Angular applications with NgRx and Nx](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/) is over two years old now, this is a tentative step by step implementation of the same code but using a currently generated nx workspace.

Note the section numbers and the step numbers used here are not the same.

### Workshop Step 1: creating the Angular app

```bash
nx generate @nrwl/angular:app stromatolites
```

The workflow commands now are:

```bash
nx serve stromatolites
nx test stromatolites
```

## Testing NgRx

[The official docs](https://ngrx.io/guide/store/testing) suggest using a Mock Store.

*The provideMockStore() function registers providers that allow you to mock out the Store for testing functionality that has a dependency on Store without setting up reducers. You can write tests validating behaviors corresponding to the specific state snapshot easily.  All dispatched actions don't affect the state, but you can see them in the Actions stream.*

The docs start off with testing a fictional auth component.  Lets apply the mock store as shown there to the counter example.

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

The obvious solution would be to add Store to the imports array of the unit spec.  But since the Store is used in the class constructor like this:

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

However, this is not enough.  After that change we will see this failure:

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

Get used to working apps but failing tests with Angular.  An improvement for this headache is to create a test ngrx module that does all that and then import that in any spec file that references Store.  Put this on the list of things to do.

### Using the NgRx MockStore

Now there is a clean set of passing "smoke tests".  The default 'should create' tests will at least tell us if the template is breaking and some other errors.  It's time to write some more meaningful tests that confirm the behavior of the counter features.

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

In this case, the count is 0, and we have the basics of testing a value from the store using the ```done => { }``` callback.

Next we will want to test the increment, decrement and reset actions.  The easy path is just to set the count directly, like this:

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

But really we want to test the actions, not the direct setting of the count.  How do we do that?  It seems like we could just do this:

```TypeScript
store.dispatch(increment());
component.count$.subscribe( count => {
  expect(count).toEqual(1);
  done();
});
```

Or put the dispatch() call inside the subscribe function?  Either way, the count is 0 when we expect it to be 1.  The docs show using the store.refreshState() function to updated the count, but that doesn't work either.

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

Doing a little [research](https://christianlydemann.com/the-complete-guide-to-ngrx-testing/), it seems *Reducers are the easiest to test as they are pure functions, and you should simply assert that you get the right state given the provided inputs.*

The sitch is that now either the 'counter should change', or the 'counter should increment' test will work, but not both at the same time.  The second increment test is not actually incrementing the store value.  It's strange because the second test appears to fail, but with the reported values of the *second* test.

#### **`apps\stratum\src\app\counter\counter.component.spec.ts` (partial) **

```js
  it('counter should change',  done => {
    component.count$.subscribe( count => {
      store.setState({ count: 1 });
      expect(count).toEqual(1);
      done();
    });
  });

  it('counter should increment',  done => {
    component.count$.subscribe( count => {
      counterReducer({counter: 0}, increment());
      expect(count).toEqual(0);
      done();
    });
  });
```

The first test doesn't really help much, so we should focus on getting the increment action tested.  That test actually shows this error when the value is different:

```bash
Error: Uncaught [Error: expect(received).toEqual(expected) // deep equality
```

It's not cool that just an expectation failure will look like an error with a long stack trace.  It makes the results less readable and misleading.  Is this an issue with a false positive?  For example, if the returned value in null or undefined and the expectation code reads the value '0' as a match.

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

Looks like a failing test not an error.  What do you think?  I'm not sure that the done callback code inside which we ```component.count$.subscribe``` is going to work with the mocked selector.  It's time to detail what the docs say about this.

### Using mock selectors

The next section of the official docs on testing has this to say about selectors:

*overrideSelector() returns a MemoizedSelector. To update the mock selector to return a different value, use the MemoizedSelector's setResult() method. Updating a selector's mock value will not cause it to emit automatically. To trigger an emission from all selectors, use the MockStore.refreshState() method after updating the desired selectors.*

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

But there is no By.id, so change that id to class and that should work.  If there different thing to use from @angular/platform-browser which will find by id?  Another thing for the todo list (actual).

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

The counterReducer.State we just pulled out of our nether regions, and is a more serious issue.  What is our version of that demo code?  Regarding the let vs. const errors, actually, that's legit.  We were never giving it a value, so good call there TypeScript/VSCode.  Let's look at how that's done first.

The overrideSelector API looks like this:

```js
(method) MockStore<object>.overrideSelector<any, string, string>(selector: any, value: string): MemoizedSelector<any, string, DefaultProjectorFn<string>> | MemoizedSelectorWithProps<any, any, string, DefaultProjectorFn<...>>
```

What is fromAuth?  It's a selector from the reducer file.

```js
      fromAuth.getUsername,
      'John'
```

Because selectors are pure functions they can use an optimization technique called memoization where the selector stores the outputs in a cache, if the selector gets called again with the same input it immediately returns the cached output.

Backing up a bit.  There is a simple way to test reducer actions.  This is what the simplest test could look like:

```js
it('increment reducer should increment the state', () => {
  const incrementedState = counterReducer(0, increment);
  expect(incrementedState).toBe(1);
});
```

Do we need to re-use the initialState instead of the value 0?  Not sure.  Now, should we also be testing the way the actions are used?

```js
this.store.dispatch(increment());
```

Also, these tests for the reducers are in the counter component tests.  Should these tests be moved to the store directory?  I think the component tests might want to do something like snapshot testing.  Is that done in Angular.

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

That only adds the package.  The below will do a lot more:

```bash
ng add @ngrx/store --minimal false
The add command requires to be run in an Angular project, but a project definition could not be found.
```

Changing into the stratum directory, we get this error:
*The add command requires to be run in an Angular project, but a project definition could not be found.*

Using that command is a nice idea, but not working and not necessary for our goal of creating unit tests for the counter example.  So on with that for now.

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

Create a new Component named my-counter in the app folder.  Going to change the name a bit.  I'm pretty over the "my-whatever" naming convention for tutorials, so we will just call it "counter" not "my-counter".

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

That error came up in the Quallasuyu project.  It was fixed with something like this:

```bash
yarn add @schematics/angular
yarn add @schematics/web
>nx g component counter --project=stratum
Schematic "component" not found in collection "@nrwl/web".
```

Or not.  Let's look at some more examples.

```bash
nx generate @nrwl/angular:component counter --project=stratum
```

This works.  Took a while, but we have a counter component now.  Should have put it in a components directory.  Next time.  The naming convention used by nx gives us this:

```bash
<clades-counter>
```

Inject the Store service into your component to dispatch the counter actions, and use the select operator to select data from the state.

Update the MyCounterComponent template with buttons to call the increment, decrement, and reset methods. Use the async pipe to subscribe to the count$ observable.

Update the MyCounterComponent class with a selector for the count, and methods to dispatch the Increment, Decrement, and Reset actions.

Add the MyCounter component to your AppComponent template.

### Use the Redux devtools

Install the Redux devtools for the Chrome browser by finding the "add more tools" link which will open [this page](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

Currently, nothings shows up (unless you have another app open which uses a store, in which case you might see that store).

*No store found. Make sure to [follow the instructions](https://github.com/zalmoxisus/redux-devtools-extension#usage).*

The counter is working and using the store.  So an extra few steps are required.  Looking at [this article](*https://alligator.io/angular/ngrx-store-redux-devtools/).

```bash
yarn add @ngrx/store-devtools
npm install @ngrx/store-devtools --save
```

In the app.module.ts file, import StoreDevtoolsModule and add it to your NgModule’s imports:

After this, in the Chrome inspector/Redux tab, we see the actions working on the counter.  How great is that?!

## NgRx counter example

Here is a brief walk through of the tutorial example from the official NgRx docs.
[The counter tutorial is briefly explained with](https://ngrx.io/guide/store#tutorial) some code.  I have broken it down into four steps.0

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

Update the MyCounterComponent template with buttons to call the increment, decrement, and reset methods. Use the async pipe to subscribe to the count$ observable.

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

Don't mix package managers.  If you start with npm, always use those commands.  If you start with yarn, stay with it.  Multiple lock files and other issues can arise.  Yarn might be better for monorepo purposes.

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

Despite what the docs say, this will indeed create an NodeJS app.  To create an Angular app, you do need to say 'angular' to the CLI:

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

Thanks to [this SO answer](https://stackoverflow.com/questions/58594311/angular-material-index-d-ts-is-not-a-module), we know that it's a Angular 9 breaking change probably for tree shaking purposes.  So instead of doing a single line import with stuff like this:

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

We may not be so lucky this time, the only whiff of this on Google is this [as yet unanswered question](https://stackoverflow.com/questions/60949170/cannot-import-matdialogmodule-in-app-module).  The asker has an Angular version mismatch:

```TypeScript
        "@angular/animations": "^7.2.16",
        "@angular/cdk": "^9.2.0",
        "@angular/common": "~7.2.0",
        "@angular/compiler": "~7.2.0",
        "@angular/core": "~7.2.0",
        "@angular/forms": "~7.2.0",
        "@angular/material": "^9.2.0",
```

Since we have Angular 7, we actually need to install Material 7.  Duncan did actually point this out at the top of section 6: *Always use the same Major version of Material as your Angular CLI and packages.*

Manually changed those imports to 7.0.0.  Then got this error running yar (same as npm i by the way):

```bash
gyp ERR! configure error
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack   File \"<string>\", line 1
gyp ERR! stack     import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack SyntaxError: invalid syntax
gyp ERR! stack     at ChildProcess.exithandler (child_process.js:304:12)
```

However, this does not stop the serve and we get our styles, even with the separate imports.  I was thinking I would have to revert all those import changes.  Thanks Dunkan.  Sorry about the earlier comment.  There is even a link to some [flex examples](
https://tburleson-layouts-demos.firebaseapp.com/#/docs).

Getting to the enterprise stuff, mainly, forms.

A nice comment Duncan makes at the start is great: *To save injecting the formBuilder and keeping this a presentational component with no injected dependencies we can just new up a simple FormGroup. You can read more about it here.*

He's talking React there and functional components.  I mean, keeping the constructor clear of injections as much as possible, and reducing member variables is the way to keep Angular from getting too "classy".  I mean, a form group is like state management for a particular part of the app.  Hello Redux.

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

Should ReactiveFormsModule be in the imports, not the declarations?  This went away after opening a different project in VSCode and then switching back here again.  Faster than a restart.

Next, step 8 - Layout Lib and BehaviorSubjects.

```bash
ng g lib layout --prefix app
ng g c containers/layout --project=layout
```

warning Lockfile has incorrect entry for "@angular/flex-layout@^7.0.0". Ignoring it.
? Please choose a version of "@angular/flex-layout" from this list: (Use arrow keys)
The later version 7 choice on the list was 7.0.0-beta-24.  In fact all choices were beta.  If this was for work I would actually look into this a bit more.

Getting the gyp configure error which ends like this:
```bash
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.C:\\Users\\timof\\repos\\timofeysie\\quallasuyu\\node_modules\\@angular-devkit\\build-angular\\node_modules\\node-sass
```

Might just need to rebuild node-sass?  As it is, the new layout "lib" is there and the app compiles and runs.  

There are a few typos and mistakes on this step.  Duncan!  But, we do get some juicy stuff at the end when he says: *Extras: Convert Layout component into a pure container component  Add a toolbar presentational component. Pass user into presentational component via inputs.*

That's the functional stuff coming out again.  Good idea.  Except, who here is ready to get on with the NgRx state management implementation?  I am!  Only one more step to go: step 9 - Route Guards and Products Lib.

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

Looks like it first showed up in step 6 when adding Material.  It doesn't show up in the "// Added" comments that usually accompany new lines of code in the articles.  It is a pretty long tutorial, and high difficulty level, so there's a lot to cover.  I don't hold it against Duncan at all.  It's just it pays to pay attention to the quality of samples from the internet to weigh the veracity of the concepts being used.  Knowing Duncan personally through meetups, I can vouch for the accuracy of the material.  However, again in step 9 there are some silly errors in the docs, such as repeated and unused imports.  I know editing is hard.  I don't like to edit which is why I never want to go the extra steps to publish any blogs although these readme files are almost blogs in themselves.  It's good to be reminded of the level of work needed to produce a tutorial of this length, and what users feel like about the last 1% of editing.

The auth guard generation also asked some questions:
*? Which interfaces would you like to implement? CanActivate*.  There are other interfaces to implement, but that is the only one used in the sample code.

Again there are Extras in this step, such as "Add logout functionality" and "Add angular interceptor".

If we want to update the auth service to set a token in local storage, we can come back to this later.

Finally, [step 10: NgRx](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/10-ngrx-introduction)

### Create the server

```bash
npm i json-server ts-node --save-dev
```

After problems with npm in a mono-repo setting, the new rule is yarn every time.  There is a package-lock and a yarn.lock file already.  Should package-lock go?  The warning says:

```bash
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by un-synchronized lock files. To clear this warning, remove package-lock.json.
```

So, yes, it should go.

Without much explanation, we create a mock backend and it's on to 5 - Angular Services.

```bash
ng g service services/auth/auth --project=auth
```

The login component has this code with the comment: *.subscribe() is needed to make sure the observer is registered with the observable returned from our AuthService.  Later in the workshop we will learn to use NgRx to get entities from a server, but for now this is normal angular code without NgRx*

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

I'm pretty sure this was running before.  There is a list of myorg indexes in the tsconfig.json file.  Try adding it there.

```bash
...
      "@myorg/auth": ["libs/auth/src/index.ts"],
      "@myorg/data-models": ["libs/data-models/src/index.ts"]
```

That doesn't help.  Also, it's not in the complete tutorial code.  The only thing needed seems to be a type definition .d.ts file and an index exporting it.  Fine.  We already have a data lib for the same purpose that has a todo interface in it.  Just add the authentication interface there and move on.

```bash
npm install @angular/material @angular/cdk @angular/flex-layout @angular/animations
yarn add @angular/material @angular/cdk @angular/flex-layout @angular/animations
```

There was no indication of the kind of component lib to use.  Just assuming Angular, but Duncan, dude, you could do a bit better with the explanations.

```bash
? What framework should this library use? Angular    [ https://angular.io/ ]
```

Next issue:

```bash
ERROR in libs/material/src/lib/material.module.ts(16,8): error TS2306: File 'C:/Users/timof/repos/timofeysie/quallasuyu/node_modules/@angular/material/index.d.ts' is not a module.
```

Thanks to [this SO answer](https://stackoverflow.com/questions/58594311/angular-material-index-d-ts-is-not-a-module), we know that it's a Angular 9 breaking change probably for tree shaking purposes.  So instead of doing a single line import with stuff like this:

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

We may not be so lucky this time, the only whiff of this on Google is this [as yet unanswered question](https://stackoverflow.com/questions/60949170/cannot-import-matdialogmodule-in-app-module).  The asker has an Angular version mismatch:

```TypeScript
        "@angular/animations": "^7.2.16",
        "@angular/cdk": "^9.2.0",
        "@angular/common": "~7.2.0",
        "@angular/compiler": "~7.2.0",
        "@angular/core": "~7.2.0",
        "@angular/forms": "~7.2.0",
        "@angular/material": "^9.2.0",
```

Since we have Angular 7, we actually need to install Material 7.  Duncan did actually point this out at the top of section 6: *Always use the same Major version of Material as your Angular CLI and packages.*

Manually changed those imports to 7.0.0.  Then got this error running yar (same as npm i by the way):

```bash
gyp ERR! configure error
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack   File \"<string>\", line 1
gyp ERR! stack     import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack SyntaxError: invalid syntax
gyp ERR! stack     at ChildProcess.exithandler (child_process.js:304:12)
```

However, this does not stop the serve and we get our styles, even with the separate imports.  I was thinking I would have to revert all those import changes.  Thanks Dunkan.  Sorry about the earlier comment.  There is even a link to some [flex examples](
https://tburleson-layouts-demos.firebaseapp.com/#/docs).

Getting to the enterprise stuff, mainly, forms.

A nice comment Duncan makes at the start is great: *To save injecting the formBuilder and keeping this a presentational component with no injected dependencies we can just new up a simple FormGroup. You can read more about it here.*

He's talking React there and functional components.  I mean, keeping the constructor clear of injections as much as possible, and reducing member variables is the way to keep Angular from getting too "classy".  I mean, a form group is like state management for a particular part of the app.  Hello Redux.

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

Should ReactiveFormsModule be in the imports, not the declarations?  This went away after opening a different project in VSCode and then switching back here again.  Faster than a restart.

Next, step 8 - Layout Lib and BehaviorSubjects.

```bash
ng g lib layout --prefix app
ng g c containers/layout --project=layout
```

warning Lockfile has incorrect entry for "@angular/flex-layout@^7.0.0". Ignoring it.
? Please choose a version of "@angular/flex-layout" from this list: (Use arrow keys)
The later version 7 choice on the list was 7.0.0-beta-24.  In fact all choices were beta.  If this was for work I would actually look into this a bit more.

Getting the gyp configure error which ends like this:
```bash
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.C:\\Users\\timof\\repos\\timofeysie\\quallasuyu\\node_modules\\@angular-devkit\\build-angular\\node_modules\\node-sass
```

Might just need to rebuild node-sass?  As it is, the new layout "lib" is there and the app compiles and runs.  

There are a few typos and mistakes on this step.  Duncan!  But, we do get some juicy stuff at the end when he says: *Extras: Convert Layout component into a pure container component  Add a toolbar presentational component. Pass user into presentational component via inputs.*

That's the functional stuff coming out again.  Good idea.  Except, who here is ready to get on with the NgRx state management implementation?  I am!  Only one more step to go: step 9 - Route Guards and Products Lib.

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

Looks like it first showed up in step 6 when adding Material.  It doesn't show up in the "// Added" comments that usually accompany new lines of code in the articles.  It is a pretty long tutorial, and high difficulty level, so there's a lot to cover.  I don't hold it against Duncan at all.  It's just it pays to pay attention to the quality of samples from the internet to weigh the veracity of the concepts being used.  Knowing Duncan personally through meetups, I can vouch for the accuracy of the material.  However, again in step 9 there are some silly errors in the docs, such as repeated and unused imports.  I know editing is hard.  I don't like to edit which is why I never want to go the extra steps to publish any blogs although these readme files are almost blogs in themselves.  It's good to be reminded of the level of work needed to produce a tutorial of this length, and what users feel like about the last 1% of editing.

The auth guard generation also asked some questions:
*? Which interfaces would you like to implement? CanActivate*.  There are other interfaces to implement, but that is the only one used in the sample code.

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
*Add NgRx Auth lib making it0 a state state*

Whichever, the second command creates the plus directory:
```bash
libs/auth/src/lib/+state/auth.x
```

The x is for these x.ts files:

* actions
* effects/spec
* reducer/spec
* selectors/spec

And that's it for that section.  Next is *Strong Typing the State and Actions*.  I think it's worth a commit just so we have a record of what the changes for the strong typing are.

Aside from the strong typings, the actions are more specific.  The generic actions were:

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

So yes, we need an 's'.  Then we get this:
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

There are still some changes missing from this section.  Step 12 just finishes with the action file and some partial reduces.  Looking at the code for the completed project, there is no auth.selectors.ts file.  After removing that, the app runs, and there are just these warnings remaining:

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

So that's true.  Login succeeds, and the loader turns false.

But, the undefined is not helpful, and it seems that the Login action should not be about loading.  Shouldn't it say something like "authenticated: false => true"?

Other things to notice at this point is that the logout function doesn't register in the Redux tab.  After a break, starting the server again, we see this error:

```bash
ERROR in libs/auth/src/lib/auth.module.ts(12,3): error TS2305: Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.reducer"' has no exported member 'AUTH_FEATURE_KEY'.
```

That was some old code in the auth module.  After that, a new Effect action was added to navigate on LoginSuccess, update AuthGuard to use the store and in the customer portal component on-load, check local storage and dispatch a LoginSuccess action and we navigate to the products page, which is still not implemented.

Next, selectors.  [The first step](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/14-ngrx-selectors) is to create in index file for the store.  Wait, didn't we have a selector file and delete it?  Why not call it auth.selector.ts, and not index.ts, which is like a barrel file?

The sample code shows the libs/auth/src/lib/+state/products.selectors.ts file.  In this file, it references files that don't exist yet.

```TypeScript
import { ProductsState, ProductsData } from './products.reducer';
import * as fromProduct from './products.reducer';
```

There is actually an auth reducer in the source file.  Maybe Duncan made a mistake with the source files he posted?  The next step is to add the products feature module, so instead of trying to figure out what was intended in this short step with almost no explanations, it might be just better to move on to step 15 for now.

Moving on, there is a typo on the next step brief: *In this section we challenge you understanding by adding a Products module like we did for login*.  "You" should be "your".

Going along with it,

```bash
ng generate ngrx products --module=libs/products/src/lib/products.module.ts
? Is this the root state of the application? No
? Would you like to add a Facade to your ngrx state No
```

Not sure if those are the correct answers.  It would be nice if the Duncan prepared the reader for this kind of thing, or most likely, these questions were added to the schema after he wrote this tutorial.  And the scale of the tutorial made updating it troublesome.

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

See, no getProducts.  Can we use getAllProducts?

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

That was just trial an error there.  And then the product list shows up.

This is looking good for a follow up article which focuses on setting up NgRx with Nx.

### Use the entity adapter in the products reducer

To get the previous step going we jumped ahead to the code from the completed project.  It's worth noting some details about this step, since there actually is a bit of a description this time.
Duncan says:  *Extend ProductState with EntityState. By default it will make an entities and ids dictionary. You Add to this any state properties you desire.  Create an adapter and use it 's getInitialState method to make the initial state.*

Why would we need this?  The name is a bit deceiving.  If you look at the products component template from the previous step, you can see that it just dumps the json into the page.  Why is this?  Material design would make it easy to create a beautiful list, right?

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

[The official docs](https://ngrx.io/guide/entity) say *Entity State adapter for managing record collections.*

There is no code on that page.  Despite the one line to install it, the following link is provided: *Detailed installation instructions can be found on the Installation page.*.  Thanks.  That's not what we need more detail on.

There is actually a lot of details [thanks to Duncan's like](https://github.com/ngrx/platform/blob/master/docs/entity/adapter.md).

Here are some more detail:

```TypeScript
export interface ProductsData extends EntityState<Product> {
```

This is the first time I notice that the whole project in the complete project code in named user-portal and not customer-portal like it is here.  That could be why the file in the Duncan code shows a file called users.reducer.ts.  So we should be able to just change the name of the file, which is all about products anyhow.  I'm waiting for the product list component by the way.

There were some intermittent errors that were soled by running yarn, restarting the server and restarting VSCode.  Not sure what's causing this and wish I knew exactly when and how to fix this kind of issue:

```bash
ERROR in libs/layout/src/lib/containers/layout/layout.component.ts(8,10): error TS2305: Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src"' has no exported member 'productsQuery'.
```

That was an old issue, so I'm guessing there is a compiled file somewhere that wasn't updated.

Anyhow, on to the next step.  The last for the development side of things.

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

That's because we need to add an Input reference in the list component.  Then we can add the list markup to the template, although Duncan lists the file as product-list.component.ts, not .html.  Getting used to this by the end of the tutorial.

After implementing all the steps, we have our products list, and a selector to filter by category.  No explanation of any of the steps except for the header of each step.  And when it's all done, nothing.  Just a link to the next section, which is about deployments.

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

That's not good.  What I think Duncan means is "--app=customer-portal":

But the error remains.  Worse still, the serve is broken with this error:

```bash
Error: Cannot find module '@angular/compiler'
```

The usual yarn and restart doesn't work now.  Trying this long and drawn out approach:

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

That was a nice idea.  I recommend not to use a folder to delete node_modules on Windows.  It goes through this discovery process for about a minute and then deleting the 141,242 files it "discovered".

According to [these answers](https://stackoverflow.com/questions/57421582/typeerror-object-prototype-may-only-be-an-object-or-null-undefined-angular-8), it's an Angular issue fixed by an upgrade.  Not a bad idea actually.  According to [this answer](https://stackoverflow.com/questions/53122751/typeerror-object-prototype-may-only-be-an-object-or-null-undefined/53123468), it's a circular dependency.

The code was running before stopping the serve and doing the last commit.  So it's something that was compiling before, but not now, for whatever reason.

There is not that much on Google about this.  Things like *I suspect that many will see this error in the future, because a lot of us reexport from a central index.ts. Since we are doing that, it's tempting to import from index.ts in order to shorten the import path instead of importing the module directly.* from [the TS GitHub](https://github.com/Microsoft/TypeScript/issues/283140).

And *We find that they essentially always indicate poor layering in the engineering design.* as a duplicate [of this](https://github.com/microsoft/TypeScript/pull/21780).

If *cyclical dependencies lead to maintainability problems*, but the app was working fine at this point, could we ignore this particular instance?  There is nothing helpful in the stack trace to let us know where the problem lies.

There is a noImportCycles option.  Not sure how to set it, but this doesn't work:

```TypeScript
    "eslint.options": {
        "rules": {
            "noImportCycles": false
        }
    }
```

At this point, it's worth just committing the code.  It did work.  It might for someone else, who knows.  Until I can either fix the circular dependencies or upgrade Angular to fix it, right now, not sure.

Here are the remaining commands from step 18:

```bash
npm install  --save-dev webpack-bundle-analyzer
ng build --prod -a=customer-portal --stats-json
npm run bundle-report-customer-portal
npm run dep-graph
```

Then, the 18 step guide is done.  No thank you, no debrief.  Nothing.  Feeling like I can contribute to this subject on my own now.  Might try and write a blog about the RxJs used in the effects which is difficult to read for someone who may not be so familiar with the subject.

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

## Original automatically generated readme

### Adding capabilities to your workspace

The following is from the original readme created with the workspace.

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are some plugins which you can add to your workspace:

* [React](https://reactjs.org)  - `npm install --save-dev @nrwl/react`
* Web (no framework frontends)  - `npm install --save-dev @nrwl/web`
* [Angular](https://angular.io)  - `npm install --save-dev @nrwl/angular`
* [Nest](https://nestjs.com)  - `npm install --save-dev @nrwl/nest`
* [Express](https://expressjs.com) - `npm install --save-dev @nrwl/express`
* [Node](https://nodejs.org) - `npm install --save-dev @nrwl/node`

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
