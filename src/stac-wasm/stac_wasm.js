import * as wasm from "./stac_wasm_bg.wasm";
export * from "./stac_wasm_bg.js";
import { __wbg_set_wasm } from "./stac_wasm_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
