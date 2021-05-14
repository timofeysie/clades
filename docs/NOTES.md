# Notes

## 2021 May

Looking at the git log for the past five commits, looks like we have to confirm if 15 was finished or if not what needs to be done:

Date:   Sat Dec 19 12:23:18 2020 +1100

- #29 work done on the section 14 and 15 reorder
- #29 notes on the section 14 & 15 mixup
- #29 adding more notes for section 14/15 reversal
- #29 adding notes of WIP
- closes #27 finished changes for effects section 13

### Current versions

The state of the required packages and what the current version are:

node 12 -> Stable release: 16.0.0 April 20, 2021
npm 6.9.0 -> Stable release: 7.10.0 / 15 April 2021
nx 9.2.2 -> 12.1.1 Stable release: 30 April 2021
@angular-devkit/core 9.1.0 -> 11
rxjs 6.5.5 -> 7.0.0-beta.1
typescript 3.8.3 -> 4.2.4
webpack 4.42.0 -> 5.36.2

## nx migrate

I've never used the migrate command before, so here goes.

```txt
nx migrate
Provide the correct package name and version. E.g., @nrwl/workspace@9.0.0.
```

Since we are at nx 9, let's try this:

```txt
> nx migrate 10
Fetching meta data about packages.
It may take a few minutes.
Fetching @nrwl/workspace@10.0.0
Fetching prettier@2.0.4
Fetching @ngrx/store@9.1.0
Fetching @ngrx/effects@9.1.0
Fetching @ngrx/entity@9.1.0
Fetching @ngrx/router-store@9.1.0
Fetching @ngrx/schematics@9.1.0
Fetching @ngrx/store-devtools@9.1.0
Fetching typescript@~3.9.3
Fetching @angular-devkit/architect@~0.1000.0
Fetching @angular-devkit/build-angular@~0.1000.0
Fetching @angular-devkit/build-webpack@~0.1000.0
Fetching @angular-devkit/build-optimizer@~0.1000.0
Fetching @angular-devkit/core@~10.0.0
Fetching @angular-devkit/schematics@~10.0.0
Fetching @schematics/angular@~10.0.0
Fetching rxjs@~6.5.4
Fetching @angular/core@^10.0.0
Fetching @angular/common@^10.0.0
Fetching @angular/forms@^10.0.0
Fetching @angular/compiler@^10.0.0
Fetching @angular/compiler-cli@^10.0.0
Fetching @angular/platform-browser@^10.0.0
Fetching @angular/platform-browser-dynamic@^10.0.0
Fetching @angular/router@^10.0.0
Fetching @angular/language-service@^10.0.0
Fetching @angular/animations@^10.0.0
Fetching @nrwl/angular@10.0.0
Fetching @nrwl/cypress@10.0.0
Fetching @nrwl/eslint-plugin-nx@10.0.0
Fetching @nrwl/express@10.0.0
Fetching @nrwl/jest@10.0.0
Fetching @nrwl/linter@10.0.0
Fetching @nrwl/node@10.0.0
Fetching @nrwl/react@10.0.0
Fetching @nrwl/tao@10.0.0
Fetching @nrwl/web@10.0.0
Fetching rxjs@~6.5.5
Fetching react@16.13.1
Fetching react-dom@16.13.1
Fetching react-is@16.13.1
Fetching @types/react@16.9.38
Fetching @types/react-dom@16.9.8
Fetching react-router-dom@5.2.0
Fetching @types/react-router-dom@5.1.5
Fetching @testing-library/react@10.4.1
Fetching eslint-plugin-import@2.21.2
Fetching eslint-plugin-react@7.20.0
Fetching eslint-plugin-react-hooks@4.0.4
The migrate command failed. Try the following to migrate your workspace:
> npm install --save-dev @nrwl/workspace@latest
> nx migrate @nrwl/workspace@10.0.0 --from="@nrwl/workspace@9.2.2"
This will use the newest version of the migrate functionality, which might have your issue resolved.
----------------------------------------------------------------------------------------------------
Command failed: npm install @angular-devkit/build-angular@~0.1000.0 --prefix=C:\Users\timof\AppData\Local\Temp\tmp-17976dEtmnVPIH4Mj        
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! While resolving: undefined@undefined
npm ERR! Found: typescript@4.0.7
npm ERR! node_modules/typescript
npm ERR!   peer typescript@">=3.9 <4.1" from @angular/compiler-cli@10.2.5
npm ERR!   node_modules/@angular/compiler-cli
npm ERR!     peer @angular/compiler-cli@">=10.0.0-next.0 < 11" from @angular-devkit/build-angular@0.1000.8
npm ERR!     node_modules/@angular-devkit/build-angular
npm ERR!       @angular-devkit/build-angular@"~0.1000.0" from the root project
npm ERR! Could not resolve dependency:
npm ERR! peer typescript@">=3.9 < 3.10" from @angular-devkit/build-angular@0.1000.8
npm ERR! node_modules/@angular-devkit/build-angular
npm ERR!   @angular-devkit/build-angular@"~0.1000.0" from the root project
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
npm ERR! See C:\Users\timof\AppData\Local\npm-cache\eresolve-report.txt for a full report.
npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\timof\AppData\Local\npm-cache\_logs\2021-05-11T09_34_40_878Z-debug.log

C:\Users\timof\repos\timofeysie\clades\node_modules\@nrwl\workspace\node_modules\yargs\yargs.js:1109
      else throw err
           ^
Error: Command failed: .\node_modules\.bin\tao migrate 10
    at checkExecSyncError (node:child_process:707:11)
    ...0\node_modules\nx\node_modules\v8-compile-cache\v8-compile-cache.js:192:30)    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10) {
  status: 1,
  signal: null,
  output: [ null, null, null ],
  pid: 15048,
  stdout: null,
  stderr: null
}
```

OK.  No harm going for the latest.  If this works, I will be impressed.

```txt
nx migrate latest
...
The migrate command has run successfully.
- package.json has been updated
- migrations.json has been generated
Next steps:
- Make sure package.json changes make sense and then run 'npm install' or 'yarn'
- Run 'nx migrate --run-migrations=migrations.json'
```

Wow.  No errors this time.  I skipped the package version because they can all be seen in the package.json.

Suffice it to say, Angular 11 is installed but TypeScript is still at 3.9.3 and I saw the deprecated TSLint in there.

The proof is in the pudding, which means we don't know if the migrate command worked until we try to run it.

The 'yarn' command (npm i for others) completed without error.

```txt
Build at: 2021-05-11T10:24:22.553Z - Hash: b7be8203d77a3507fd57 - Time: 18851ms
Error: libs/auth/src/lib/+state/auth.effects.ts:14:5 - error TS2345: Argument of type '(source: ActionStateStream<unknown, never>) => Observable<Action>' is not assignable to parameter of type 'OperatorFunction<[never, unknown], Action>'.
  Types of parameters 'source' and 'source' are incompatible.
    Type 'Observable<[never, unknown]>' is not assignable to type 'ActionStateStream<unknown, never>'.
      The types of 'source.operator.call' are incompatible between these types.
        Type '(subscriber: import("C:/Users/timof/repos/timofeysie/clades/node_modules/rxjs/internal/Subscriber").Subscriber<any>, source: any) => import("C:/Users/timof/repos/timofeysie/clades/node_modules/rxjs/internal/types").TeardownLogic' is not assignable to type '(subscriber: import("C:/Users/timof/repos/timofeysie/clades/node_modules/@nrwl/angular/node_modules/rxjs/internal/Subscriber").Subscriber<any>, source: any) => import("C:/Users/timof/repos/timofeysie/clades/node_modules/@nrwl/angular/node_modules/rxjs/internal/types").TeardownLogic'.     
          Types of parameters 'subscriber' and 'subscriber' are incompatible.
            Type 'import("C:/Users/timof/repos/timofeysie/clades/node_modules/@nrwl/angular/node_modules/rxjs/internal/Subscriber").Subscriber<any>' is not assignable to type 'import("C:/Users/timof/repos/timofeysie/clades/node_modules/rxjs/internal/Subscriber").Subscriber<any>'.              Property 'isStopped' is protected but type 'Subscriber<T>' is not a class derived from 'Subscriber<T>'.
 14     fetch({
        ~~~~~~~
 15       run: action => {
    ~~~~~~~~~~~~~~~~~~~~~~
...
 20       }
    ~~~~~~~
 21     })
    ~~~~~~
Error: libs/products/src/lib/+state/products.effects.ts:13:7 - error TS2345: Argument of type '(source: ActionStateStream<unknown, TypedAction<ProductsActionTypes.LoadProducts>>) => Observable<Action>' is not assignable to parameter of type 'OperatorFunction<ActionOrActionWithState<unknown, TypedAction<ProductsActionTypes.LoadProducts>>, Action>'.
  Types of parameters 'source' and 'source' are incompatible.
    Type 'Observable<ActionOrActionWithState<unknown, TypedAction<ProductsActionTypes.LoadProducts>>>' is not assignable to type 'ActionStateStream<unknown, TypedAction<ProductsActionTypes.LoadProducts>>'.
      Types of property 'source' are incompatible.
        Type 'import("C:/Users/timof/repos/timofeysie/clades/node_modules/rxjs/internal/Observable").Observable<any>' is not assignable to type 'import("C:/Users/timof/repos/timofeysie/clades/node_modules/@nrwl/angular/node_modules/rxjs/internal/Observable").Observable<any>'.    
 13       fetch({
          ~~~~~~~
 14         run: action => {
    ~~~~~~~~~~~~~~~~~~~~~~~~
...
 22         }
    ~~~~~~~~~
 23       })
    ~~~~~~~~
Error: libs/products/src/lib/+state/products.reducer.ts:48:21 - error TS2339: Property 'addAll' does not exist on type 'EntityAdapter<ProductsEntity>'.
48     productsAdapter.addAll(products, { ...state, loaded: true })
                       ~~~~~~
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```

Is that only two errors?  I am impressed.

"Argument of type x is not assignable to parameter of type y" x 2.

### Migration error #1

Build at: 2021-05-11T10:24:22.553Z - Hash: b7be8203d77a3507fd57 - Time: 18851ms
Error: libs/auth/src/lib/+state/auth.effects.ts:14:5 - error TS2345: Argument of type '(source: ActionStateStream<unknown, never>) => Observable<Action>' is not assignable to parameter of type 'OperatorFunction<[never, unknown], Action>'.

```ts
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    fetch({
-->   run: action => {
        return AuthActions.loginSuccess(action);
      },
      onError: (error) => {
        return AuthActions.loginFailure(error);
      }
    })
  );
```

Let's break that down:

```txt
'(source: ActionStateStream<unknown, never>) => Observable<Action>'
'OpertorFunction<[never, unknown], Action>'.
```

Is 'Opertor' a typo of an abbreviation for 'Operator'?  Interesting that the error message also includes the string: OperatorFunction.  Neither of those strings appear in the project.

I think the run inclusion was a point of contention with Duncan.  No, that was fetch he was asking about.

What does google say?  "Argument of type '(source: ActionStateStream" "is not assignable to parameter of".

Not really the easiest thing to search for.

Duncan asked: Where does the fetch symbol come from is there an import?
Me: Using the generate command such as ng g nrgx products will create effects with this operator. So I assumed that is the way it should be shown now.

But now, things seem to have changed.  I think when I started this course update project, it was based on NgRx.  It's not only deprecated now, it's not compiling.

(alias) Effect(config?: EffectConfig): <T extends Object, K extends Exclude<keyof T, "constructor" | "toString" | "toLocaleString" | "valueOf" | "hasOwnProperty" | "isPrototypeOf" | "propertyIsEnumerable">>(target: T, propertyName: K) => void
import Effect

@deprecated The Effect decorator (@Effect) is deprecated in favor for the createEffect method. See the docs for more info https://ngrx.io/guide/migration/v11#the-effect-decorator

BEFORE:

```js
content_copy
@Effect()
login$ = this.actions$.pipe(...);
```

AFTER:

```js
content_copy
login$ = createEffect(() => {
  return this.actions$.pipe(...);
});
```

There is again, you guessed it, a command line, well, command, that will make that migration for us.

```txt
ng generate @ngrx/schematics:create-effect-migration
The generate command requires to be run in an Angular project, but a project definition could not be found.
```

That's correct.  So what is the nx way to run the command, or do we have to pass it the project name (stromatolites).

The original was something like this:

```js
@Effect()
login$ = this.actions$.pipe(
  ofType(AuthActionTypes.Login),
  mergeMap((action: authActions.Login) =>
    this.authService.login(action.payload).pipe(
      map((user: User) => new authActions.LoginSuccess(user)),
      catchError(error => of(new authActions.LoginFail(error)))
    )
  )
);
```

```js
@Effect()
login$ = this.actions$.pipe(
  ofType(AuthActionTypes.Login),
  fetch({
    run: action => {
      return AuthActions.loginSuccess(action);
    },
    onError: (action, error) => {
      return AuthActions.loginFailure(error);
    }
  })
)
```

So actually, the migration docs don't seem to match what our interim code looks like.  Might have to look at some more examples for new counter code.

```js
  loadMovies$ = createEffect(() => this.actions$.pipe(
    ofType('[Movies Page] Load Movies'),
    mergeMap(() => this.moviesService.getAll()
      .pipe(
        map(movies => ({ type: '[Movies API] Movies Loaded Success', payload: movies })),
        catchError(() => EMPTY)
      ))
    )
  );
```

I have no idea where loadMovies$ is being defined.

No fetch there.  Back to the old mergeMap.  So how did I get the fetch to work before?

After a bit more work, this compiles without errors:

```js
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActionTypes.Login),
      switchMap(({ payload }) =>
        this.authService.login(payload).pipe(
          map((user: User) => AuthActions.loginSuccess({ payload: user })),
          catchError((error) => of(AuthActions.loginFailure(error)))
        )
      )
    );
  });
```

### Migration Error #2

Error: libs/products/src/lib/+state/products.effects.ts:13:7 - error TS2345: Argument of type '(source: ActionStateStream<unknown, TypedAction<ProductsActionTypes.LoadProducts>>)  => Observable<Action>' is not assignable to parameter of type 'OperatorFunction<ActionOrActionWithState<unknown, TypedAction<ProductsActionTypes.LoadProducts>>, Action>'.

### Migration Errors #3

Not sure what happened to error #2, but after fixing the auth.effects, it is gone.

These two errors however show up now:

```txt
Error: libs/products/src/lib/+state/products.effects.ts:13:7 - error TS2345: Argument of type '(source: ActionStateStream<unknown, TypedAction<ProductsActionTypes.LoadProducts>>) => Observable<Action>' is not assignable to parameter of type 'OperatorFunction<ActionOrActionWithState<unknown, TypedAction<ProductsActionTypes.LoadProducts>>, Action>'.
  Types of parameters 'source' and 'source' are incompatible.
    Type 'Observable<ActionOrActionWithState<unknown, TypedAction<ProductsActionTypes.LoadProducts>>>' is not assignable to type 'ActionStateStream<unknown, TypedAction<ProductsActionTypes.LoadProducts>>'.
      The types of 'source.operator.call' are incompatible between these types.
        Type '(subscriber: import("C:/Users/timof/repos/timofeysie/clades/node_modules/rxjs/internal/Subscriber").Subscriber<any>, source: any) => import("C:/Users/timof/repos/timofeysie/clades/node_modules/rxjs/internal/types").TeardownLogic' is not assignable to type '(subscriber: import("C:/Users/timof/repos/timofeysie/clades/node_modules/@nrwl/angular/node_modules/rxjs/internal/Subscriber").Subscriber<any>, source: any) => import("C:/Users/timof/repos/timofeysie/clades/node_modules/@nrwl/angular/node_modules/rxjs/internal/types").TeardownLogic'.     
          Types of parameters 'subscriber' and 'subscriber' are incompatible.
            Type 'import("C:/Users/timof/repos/timofeysie/clades/node_modules/@nrwl/angular/node_modules/rxjs/internal/Subscriber").Subscriber<any>' is not assignable to type 'import("C:/Users/timof/repos/timofeysie/clades/node_modules/rxjs/internal/Subscriber").Subscriber<any>'.              Property 'isStopped' is protected but type 'Subscriber<T>' is not a class derived from 'Subscriber<T>'.
 13       fetch({
          ~~~~~~~
 14         run: action => {
    ~~~~~~~~~~~~~~~~~~~~~~~~
...
 22         }
    ~~~~~~~~~
 23       })
    ~~~~~~~~
Error: libs/products/src/lib/+state/products.reducer.ts:48:21 - error TS2339: Property 'addAll' does not exist on type 'EntityAdapter<ProductsEntity>'.
48     productsAdapter.addAll(products, { ...state, loaded: true })
                       ~~~~~~
```

For these two I did the same for the products.effects as I did to the auth.effects, namely getting rid of fetch and run.
I used map instead of mergeMap or switchMap this time.  Will have to sort out what is the standard approach in the current NgRx 11.

For the last error, I replaced addAll with addMany and then all the errors were gone and the app appears to be working as expected.

```js
productsAdapter.addMany(products, { ...state, loaded: true })
```

Not sure if that was a migration issue that got skipped or what.

## Issues

### Replacement for fetch

Why does the cli create effects with fetch?

What should it be replaced with, switchMap, mergeMap, or just map?

### Remaining sections

- 14 - NgRx Selectors
- 15 - Add Products NgRx Feature Module
- 16 - Entity State Adapter
- 17 - Router Store

The last merge request for the course update is this:

[Finished 12 and 13 update #15](https://github.com/duncanhunter/Enterprise-Angular-Applications-With-NgRx-and-Nx-Book/pull/15)

### The Auth is broken

```js
user (props) => (Object.assign(Object.assign({}, props), { type }))
```

## The GitBook issue

I was surprised to see an new issue on the GitBook GitHub:

[Chapter 10 - NgRx has missing imports/exports that are difficult to guess](https://github.com/duncanhunter/Enterprise-Angular-Applications-With-NgRx-and-Nx-Book/issues/16)

```txt
samspot commented on Jan 5
Hi, great book so far! I've been able to get everything working up to this point. I think a small update to this file in chapter 10 would enhance the book.
counter.action.ts is missing the import for createAction. I believe it should be 

import { Action, createAction } from '@ngrx/store';

counter.action.ts does not export anything for CounterActions which are later used in counter.reducer.ts I've had no success figuring this one out and wasn't able to complete the exercise.
```

I'm also surprised that there are 16 issues.  Have to look at the closed ones one of these days.
