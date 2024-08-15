# riotjs-simple-typescript

A slightly different take on working with TypeScript in RiotJS.

Write controllers in TypeScript, use mocha/jest to test them together with headless virtual rendering
of templates.

## Design

    1. Keep all logic out of `.riot` templates.
        For every state change call a function in the controller to make update toi state.
        For every HTML element value init do not do `value={props.name}`, instead
        do that in `onMounted`: `this.$("#name").value = props.name`.
    2. The template `<script>` tag does two things:
        1. Import any CSS which webpack is to process
        2. Import and return instance of the controller class.


Doing this it becomes easy to unit test the controllers using mocha/jest.
Using `Wrapped` class the `.riot` template is processed with `linkedom` and can be interacted
with by the controller as usual using for example `this.$(...)`.

Extend TypeScript component controllers from `Base`. `tsc` all `.ts` files into `.js` files alongside their source `.ts` file, then those `.js` files are the ones included by the `.riot` file.

The `Base` class has the interface of a RiotJS component with two extra fields: `router (riotjs-simple-router)` and `stateController (riotjs-simple-state)` which can optionally be used in your project. See those modules for further explanations.


## Installation
```sh
npm i riotjs-simple-typescript
```

## Usage

In your component:

`./src/my-component.riot`:  
```html
<my-component>
    <div>
        <p>{state.text}</p>
    </div>

    <style>
        p {
            font-size: 10em;
        }
    </style>

    <script>
        import "my-component.css";
        import {MyComponent} from "./MyComponent";

        return new MyComponent();
    </script>
</my-component>
```

`./src/MyComponent.ts`:  
```typescript
import {
    Base,
} from "riotjs-simple-typescript";

export interface MyComponentPropsI {
    // Put expected props fields here
}

export interface MyComponentStateI {
    text: string,
}

export class MyComponent extends Base<MyComponentPropsI, MyComponentStateI> {
    public onMounted(props: MyComponentPropsI, state: MyComponentStateI) {
        state.text = "Hello World from TypeScript";

        this.update();
    }
}
```

First build the `.ts` fils into `./build`, then build your RiotJS application so it can import the transpiled `.js` files from `./build` directory.
