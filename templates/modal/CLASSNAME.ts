import {
    RiotModal,
    ModalOptions,
    riot,
} from "riotjs-simple-typescript";

//@ts-expect-error no typings
import riotComponentWrapper from "./TAGNAME.riot";

export interface CLASSNAMEProps {}

export interface CLASSNAMEState {}

export type CLASSNAMEResult = {};

export class CLASSNAME extends RiotModal<CLASSNAMEProps, CLASSNAMEState, CLASSNAMEResult> {
    public static open(props: CLASSNAMEProps, options?: ModalOptions) {
        return CLASSNAME.openModal<CLASSNAMEProps, CLASSNAMEResult>(props, options,
            riotComponentWrapper);
    }

    public onBeforeMount(props: CLASSNAMEProps, state: CLASSNAMEState) {}

    public onMounted(props: CLASSNAMEProps, state: CLASSNAMEState) {}

    public onBeforeUpdate(props: CLASSNAMEProps, state: CLASSNAMEState) {}

    public onUpdated(props: CLASSNAMEProps, state: CLASSNAMEState) {}

    public onBeforeUnmount(props: CLASSNAMEProps, state: CLASSNAMEState) {}

    public onUnmounted(props: CLASSNAMEProps, state: CLASSNAMEState) {}
}
