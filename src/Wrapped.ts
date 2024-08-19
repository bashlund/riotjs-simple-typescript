/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Base,
} from "./Base";

import {StateController} from "riotjs-simple-state";

import {
    Router,
    RouterCtrl,
} from "riotjs-simple-router";

import {parseHTML} from "linkedom";

export {
    StateController,
    Router,
    RouterCtrl,
};

export class Wrapped<ComponentClass extends Base<any, any>> {
    public component: ComponentClass;
    protected onRenderFn?: () => void;

    constructor(c: { new (): ComponentClass }, html: string, props: ComponentClass["props"],
        stateController?: StateController,
        router?: Router)
    {
        const stripped = this.stripTemplate(html);

        const {document} = parseHTML(stripped);

        const component = new c();

        component.$ = (selectors: string) => document.querySelector(selectors);

        component.$$ = (selectors: string) =>
            document.querySelectorAll(selectors) as unknown as Element[];

        component.update =
            (partialState: Record<string, any> | undefined, parentScope?: object | undefined) => {
                if (partialState) {
                    Object.keys(partialState).forEach( key => {
                        component.state[key] = partialState[key];
                    });
                }

            component.onBeforeUpdate?.(component.props, component.state);

            this.render();

            component.onUpdated?.(component.props, component.state);

            return component;
        };

        //@ts-expect-error readonly property
        component.props = props;

        component.state = {};

        if (stateController) {
            component.stateController = stateController;
        }

        if (router) {
            component.router = router;
        }

        component.mount = function() { throw new Error("component.mount not support in test") };

        component.unmount = (keepRootElement?: boolean) => {
            component.onBeforeUnmount?.(component.props, component.state);
            component.onUnmounted?.(component.props, component.state);

            return component;
        };

        //@ts-expect-error readonly property
        component.root = document.documentElement;

        component.onBeforeMount?.(component.props, component.state);

        component.onMounted?.(component.props, component.state);

        this.component = component;
    }

    protected render() {
        this.onRenderFn?.();
    }

    public onRender(fn: () => void) {
        this.onRenderFn = fn;
    }

    public updateProps(newProps: ComponentClass["props"]) {
        if (this.component.shouldUpdate) {
            if (!this.component.shouldUpdate(newProps, this.component.props)) {
                return;
            }
        }

        //@ts-expect-error readonly property
        this.component.props = newProps;

        this.component.update();
    }

    protected stripTemplate(html: string): string {
        return html.
            replace(/<[ ]*template\b[\s\S]*?>+/gi,"").
            replace(/<[ ]*\/[ ]*template\b[\s\S]*?>+/gi,"");
    }
}

