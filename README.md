# KofCUI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.6.

## Project Setup

A few suggested VS Code extensions are these:
Prettier
ESLint
Angular Files

Go to the C:\Windows\System32\drivers\etc\hosts file and add the following for tenants.
127.0.0.1    mynewtenant.localhost

In the src/environments/environments.ts file, add a new tenant in the tenants array like the following.
{
    tenantName: "mynewtenant",
    tenantId: "mytenantID"
}

To Start up locally, run the command
ng serve --disable-host-check --configuration development
ng serve --host mynewtenant.localhost --port 4200 --open --configuration development

## When Ran From Docker
mynewtenant.localhost:9081

## Eslint & Prettier
https://eslint.org/docs/latest/use/getting-started
Run the command `npx eslint ./` from a terminal.

https://prettier.io/docs/en/configuration.html
https://www.boag.online/notepad/post/full-prettier-prettierrc-config
Run the command `npx prettier . --check` from a terminal to check stylings.
Run the command `npm prettier . --write` from a terminal to fix stylings.

## Updating Angular
Run the following commands at Powershell:
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest

Then create a new project:
ng new TestAngularUI
or the easier thing to do when updating from a version that has not reached end of life.
ng update


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
