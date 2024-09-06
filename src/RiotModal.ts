import {
    RiotComponent,
    RiotComponentWrapper,
} from "riot";

import {
    RiotBase,
} from "./RiotBase";

import {
    riot,
} from "./riotInstance";

export type ModalOptions = {
    /** Optional DOM ID of the modal element. */
    id?: string,

    /** Set to element to not have modal cover the whole body element. */
    parentElm?: HTMLElement,

    /** Set to true to not allow modal to be dismissed by Escape key or mouse click outside component. */
    undismissable?: boolean,

    /** CSS class of the modal overlay, defaults to "overlay". */
    class?: string,
};

export class RiotModal<Props, State, Result> extends RiotBase<Props, State> {
    protected static components: RiotComponent[] = [];

    // Set by the static open() function
    protected _resolve?: (result?: Result) => void;

    // Set by the static open() function
    protected _overlayUnmount?: () => void;

    protected _modalClosed: boolean = false;

    /**
     * Close the modal component, remove its associated overlay div
     * and resolve the promise returned by open().
     */
    public close(result?: Result) {
        if (!this._modalClosed) {
            this._modalClosed = true;

            RiotModal.components = RiotModal.components.filter( component => component !== this);

            this._overlayUnmount?.();

            this.unmount();

            this._resolve?.(result);
        }
    }

    /**
     * Open modal
     * @param name name of registered component to mount
     * @param props props object passed to mounted component, muts be same type as Props.
     * @param options
     * @returns Promise
     */
    protected static openModal<Props, Result>(
        props: Props,
        options: ModalOptions = {},
        riotComponentWrapper: RiotComponentWrapper): Promise<Result | undefined>
    {
        const body = document.querySelector("body") as HTMLElement;

        const parentElm = options.parentElm ?? body;

        if (!parentElm) {
            throw new Error("Expected parent element");
        }

        const overlay = document.createElement("div");

        overlay.setAttribute("class", options.class ?? "overlay");

        parentElm.append(overlay);

        // key down on overlay, mute event.
        //
        const keydown = (e: KeyboardEvent) => {
            if (e.key == "Escape") {
                if (!options.undismissable) {
                    if (RiotModal.components.slice(-1)[0] === component) {
                        RiotModal.closeModal();
                    }
                }
            }

            e.stopPropagation();
        };

        const bodyKeydown = (e: KeyboardEvent) => {
            if (e.key == "Escape") {
                if (!options.undismissable) {
                    if (RiotModal.components.slice(-1)[0] === component) {
                        RiotModal.closeModal();
                    }
                }
            }

            e.stopPropagation();

            e.preventDefault();
        };

        // mouse click on overlay, close modal.
        //
        const muteClick = (e: Event) => {
            if (e.target === overlay && RiotModal.components.slice(-1)[0] === component) {
                e.stopPropagation();

                if (!options.undismissable) {
                    RiotModal.closeModal();
                }
            }
        };

        overlay.addEventListener("click", muteClick);

        overlay.addEventListener("keydown", keydown);

        const overlayUnmount = () => {
            overlay.removeEventListener("keydown", keydown);

            overlay.removeEventListener("click", muteClick);

            overlay.remove();

            if (parentElm === body) {
                body.removeEventListener("keydown", bodyKeydown);
            }
        };

        if (!riotComponentWrapper.name) {
            throw new Error("Expected RiotComponentWrapper.name to be set");
        }

        const elm = document.createElement(riotComponentWrapper.name);

        if (!elm) {
            throw new Error(`Expected ${riotComponentWrapper.name} element to have been created`);
        }

        if (options.id) {
            elm.setAttribute("id", options.id);
        }

        overlay.append(elm);

        const component = riot.component(riotComponentWrapper)(elm, props);

        // @ts-expect-error no type for this
        component._overlayUnmount = overlayUnmount;

        if (parentElm === body) {
            // Also hook body for ESC keypress if modal covers whole window.
            //
            body.addEventListener("keydown", bodyKeydown);
        }

        RiotModal.components.push(component);

        return new Promise<Result>( resolve => {
            // @ts-expect-error no type for this
            component._resolve = resolve;
        });
    }

    /**
     * Close the top-most modal instance of the modal class type.
     */
    public static closeModal() {
        // @ts-expect-error no type for this
        RiotModal.components.pop()?.close();
    }
}
