# riotjs-simple-typescript

A slightly different take on working with TypeScript in RiotJS.

Write controllers in TypeScript and include their compiled `.js` version from the `<script>` tag in the `.riot` templates.

Use mocha or jest to test TypeScript controller together with headless virtual rendering of `.riot` templates.

## Benefits

    1. Write controllers in `.ts` files.
    2. Test controllers using traditional unit testing framworks, together with virtual HTML rendering of the `.riot` template.
    3. Always have `this`, `props` and `state` properly typed for all components.
    4. Clear seperation of controllers and views (if you are into this).

## Caveats and design choices

    1. Be aware of that in the `.riot` template there is NO type checking when accessing `this`, `props`, or `state`.

    2. Keep all logic out of the `.riot` templates.
        OK: `<a onclick={(e) => update({name: e.target.value})}>`
        OK: `<a onclick={handleClick}>`
        AVOID: `<a onclick={(e) => {this.myVar = e.target.value; state.count++; update()}}>`

        This is so that the unit tests can focus on testing the controller and not the view.

    3. Be aware of that when unit testing and virtually rendering the `.riot` template using `linkedom` riot expression are NOT executed in the template meaning that HTML element value initializing will not run which may or may not effect your tests.
        `<input id="name" value={props.name} />` when read from the virtual DOM as `this.$("#name").value` in a unit test will be the string "{props.name}" (not the value of props.name as expected).

        So, if reading from DOM input element in the unit tests first adopt the pattern in the controller class to init the DOM element value using `this.$(...).value = props.name`.
        Do that in `onMounted` as: `this.$("#name").value = props.name`.

    4. The `.riot` template `<script>` tag does two things:
        1. Import any CSS which webpack is to process:  
            `import "./my-component.css`

        2. Import and return instance of the controller class:  
            ```js
            import {MyComponent} from "./MyComponent";
            return new MyComponent();
            ```

            Note that this replaces the common riotjs pattern of:  
            ```js
            export default {
                onMounted(props, state) {}
                ...
            }
            ```

        Also `<script>` tags do NOT run in testing when rendering with `linkedom`.

    5. Since riotjs expression are not run in the templates when testing conditionals as `<div if={state.visible}>` will not do anything and the `<div>` will be present always.
        Also `<template>` and `</template>` tags are cut from the HTML and not present in the virtually rendered DOM, however their content is present.

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
        import "./my-component.css";

        // This will implicitly import the compiled .js version of the controller.
        import {MyComponent} from "./MyComponent";

        return new MyComponent();
    </script>
</my-component>
```

`./src/MyComponent.ts`:  
```typescript
import {
    RiotBase,
} from "riotjs-simple-typescript";

export interface MyComponentProps {
    // Put expected props fields here
}

export interface MyComponentState {
    text: string;
}

export class MyComponent extends RiotBase<MyComponentProps, MyComponentState> {
    public onMounted(props: MyComponentProps, state: MyComponentState) {
        state.text = "Hello World from TypeScript";

        this.update();
    }
}
```

Run `tsc` and let it place all compiled `.js` files alongside their `.ts` source files. Riot will pick up the `.js` file and our unit testing will pick up the `.ts` file.

## Testing

Use the `Wrapped` class for testing components.

```typescript
import fs from "fs";  // we use this only to read .riot files from disk.

// NOTE: .ts here to not get the .js version.
// This will require allowImportingTsExtensions to be true for tsc to accept import .ts explicitly.
/
import {MyComponent} from "./MyComponent.ts";  // .ts

import {Wrapped} from "riotjs-simple-typescript";

describe("my-component", function() {
    it("should work, period.", function() {
        const props = {};

        const viewpath = `${__dirname}/my-component.riot`;
        const html = fs.readFileSync(viewpath, "utf-8");

        const wrapped = new Wrapped(MyComponent, html, props);

        assert(wrapped.component.state.text === "Hello World from TypeScript");
    });

    it("should not init values until mounted", function() {
        const props = {};

        const viewpath = `${__dirname}/my-component.riot`;
        const html = fs.readFileSync(viewpath, "utf-8");

        // passing false as fourth argument will not run onBeforeMount and onMounted.
        //
        const wrapped = new Wrapped(MyComponent, html, props, false);

        assert(wrapped.component.state.text === undefined);

        // Will call onBeforeMount and onMounted on the component.
        //
        wrapped.mount();

        assert(wrapped.component.state.text === "Hello World from TypeScript");
    });
});
```

The `Wrapped` class has the public field `component`, `mount()`, `onRender(callback)`, `updateProps(newProps)` to help mimic the riotjs environment.

Run the tests with the compiler option set as:  
```sh
TS_NODE_COMPILER_OPTIONS='{"allowImportingTsExtensions": true}' npx mocha -r ts-node/register
```

## License

MIT
