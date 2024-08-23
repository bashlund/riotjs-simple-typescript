/**
 * Extend controllers from this base class to give them the riotjs types.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SlotBindingData,
} from '@riotjs/dom-bindings'

import {
    RiotComponent,
    RiotComponentsMap,
} from "riot";

/**
 * Base class to extend for riot controllers.
 */
export class RiotBase<Props, State> implements RiotComponent<Props, State> {
    //@ts-expect-error set by the outside
    readonly props: Props;

    //@ts-expect-error set by the outside
    state: State;

    components?: RiotComponentsMap;

    //@ts-expect-error set by the outside
    readonly root: HTMLElement;

    readonly name?: string;

    //@ts-expect-error set by the outside
    readonly slots: SlotBindingData[];

    mount(element: HTMLElement, initialState?: State, parentScope?: object): RiotComponent<Props, State> {
        throw new Error("mount expected to be overridden");
    }

    unmount(keepRootElement?: boolean): RiotComponent<Props, State> {
        throw new Error("unmount expected to be overridden");
    }

    update(newState?: Partial<State>, parentScope?: object): RiotComponent<Props, State> {
        throw new Error("update expected to be overridden");
    }

    // Helpers
    //
    $(selector: string): Element | null {
        throw new Error("$ expected to be overridden");
    }

    $$(selector: string): Element[] {
        throw new Error("$$ expected to be overridden");
    }

    // state handling methods
    shouldUpdate?(newProps: Props, oldProps: Props): boolean;

    // lifecycle methods
    //
    onBeforeMount?(props: Props, state: State): void
    onMounted?(props: Props, state: State): void
    onBeforeUpdate?(props: Props, state: State): void
    onUpdated?(props: Props, state: State): void
    onBeforeUnmount?(props: Props, state: State): void
    onUnmounted?(props: Props, state: State): void
}
