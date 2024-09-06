import {
    riot,
    ModalOptions,
} from "riotjs-simple-typescript";

import {
    CLASSNAME,
    CLASSNAMEProps,
} from "./CLASSNAME";

const props: CLASSNAMEProps = {};

const options: ModalOptions = {};

CLASSNAME.open(props, options).then( console.log );
