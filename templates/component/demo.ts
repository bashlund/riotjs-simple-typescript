import {
    riot,
} from "riotjs-simple-typescript";

import {
    CLASSNAMEProps,
} from "./CLASSNAME";

//@ts-expect-error no typings
import riotComponentWrapper from "./TAGNAME.riot";



const props: CLASSNAMEProps = {};

if (!riotComponentWrapper.name) {
    throw new Error("Expected RiotComponentWrapper.name to be set");
}

const elm = document.createElement(riotComponentWrapper.name);

if (!elm) {
    throw new Error(`Expected ${riotComponentWrapper.name} element to have been created`);
}

document.querySelector("body")?.append(elm)

riot.component(riotComponentWrapper)(elm, props);
