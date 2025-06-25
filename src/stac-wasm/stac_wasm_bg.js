let wasm;
export function __wbg_set_wasm(val) {
  wasm = val;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null ||
    cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

const lTextEncoder =
  typeof TextEncoder === "undefined"
    ? (0, module.require)("util").TextEncoder
    : TextEncoder;

let cachedTextEncoder = new lTextEncoder("utf-8");

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8ArrayMemory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
  if (
    cachedDataViewMemory0 === null ||
    cachedDataViewMemory0.buffer.detached === true ||
    (cachedDataViewMemory0.buffer.detached === undefined &&
      cachedDataViewMemory0.buffer !== wasm.memory.buffer)
  ) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}

function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_export_3.set(idx, obj);
  return idx;
}

function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0;
  for (let i = 0; i < array.length; i++) {
    const add = addToExternrefTable0(array[i]);
    getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
  }
  WASM_VECTOR_LEN = array.length;
  return ptr;
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}

const lTextDecoder =
  typeof TextDecoder === "undefined"
    ? (0, module.require)("util").TextDecoder
    : TextDecoder;

let cachedTextDecoder = new lTextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len),
  );
}

function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_3.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
/**
 * @param {any} table
 * @returns {any}
 */
export function arrowToStacJson(table) {
  const ret = wasm.arrowToStacJson(table);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
}

function getArrayJsValueFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  const mem = getDataViewMemory0();
  const result = [];
  for (let i = ptr; i < ptr + 4 * len; i += 4) {
    result.push(wasm.__wbindgen_export_3.get(mem.getUint32(i, true)));
  }
  wasm.__externref_drop_slice(ptr, len);
  return result;
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
  if (
    cachedUint32ArrayMemory0 === null ||
    cachedUint32ArrayMemory0.byteLength === 0
  ) {
    cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
 * Returns a handle to this wasm instance's `WebAssembly.Memory`
 * @returns {Memory}
 */
export function wasmMemory() {
  const ret = wasm.wasmMemory();
  return ret;
}

/**
 * Returns a handle to this wasm instance's `WebAssembly.Table` which is the indirect function
 * table used by Rust
 * @returns {FunctionTable}
 */
export function _functionTable() {
  const ret = wasm._functionTable();
  return ret;
}

/**
 * @enum {0 | 1 | 2 | 3}
 */
export const BufferType = Object.freeze({
  /**
   *
   *     * used in List type, Dense Union and variable length primitive types (String, Binary)
   *
   */
  Offset: 0,
  0: "Offset",
  /**
   *
   *     * actual data, either fixed width primitive types in slots or variable width delimited by an OFFSET vector
   *
   */
  Data: 1,
  1: "Data",
  /**
   *
   *     * Bit vector indicating if each value is null
   *
   */
  Validity: 2,
  2: "Validity",
  /**
   *
   *     * Type vector used in Union type
   *
   */
  Type: 3,
  3: "Type",
});
/**
 * @enum {0 | 1}
 */
export const DateUnit = Object.freeze({
  Day: 0,
  0: "Day",
  Millisecond: 1,
  1: "Millisecond",
});
/**
 * @enum {0 | 1 | 2}
 */
export const IntervalUnit = Object.freeze({
  YearMonth: 0,
  0: "YearMonth",
  DayTime: 1,
  1: "DayTime",
  MonthDayNano: 2,
  2: "MonthDayNano",
});
/**
 * @enum {0 | 1 | 2}
 */
export const Precision = Object.freeze({
  Half: 0,
  0: "Half",
  Single: 1,
  1: "Single",
  Double: 2,
  2: "Double",
});
/**
 * @enum {0 | 1 | 2 | 3}
 */
export const TimeUnit = Object.freeze({
  Second: 0,
  0: "Second",
  Millisecond: 1,
  1: "Millisecond",
  Microsecond: 2,
  2: "Microsecond",
  Nanosecond: 3,
  3: "Nanosecond",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18}
 */
export const Type = Object.freeze({
  /**
   * The default placeholder type
   */
  NONE: 0,
  0: "NONE",
  /**
   * A NULL type having no physical storage
   */
  Null: 1,
  1: "Null",
  /**
   * Signed or unsigned 8, 16, 32, or 64-bit little-endian integer
   */
  Int: 2,
  2: "Int",
  /**
   * 2, 4, or 8-byte floating point value
   */
  Float: 3,
  3: "Float",
  /**
   * Variable-length bytes (no guarantee of UTF8-ness)
   */
  Binary: 4,
  4: "Binary",
  /**
   * UTF8 variable-length string as List<Char>
   */
  Utf8: 5,
  5: "Utf8",
  /**
   * Boolean as 1 bit, LSB bit-packed ordering
   */
  Bool: 6,
  6: "Bool",
  /**
   * Precision-and-scale-based decimal type. Storage type depends on the parameters.
   */
  Decimal: 7,
  7: "Decimal",
  /**
   * int32_t days or int64_t milliseconds since the UNIX epoch
   */
  Date: 8,
  8: "Date",
  /**
   * Time as signed 32 or 64-bit integer, representing either seconds, milliseconds,
   * microseconds, or nanoseconds since midnight since midnight
   */
  Time: 9,
  9: "Time",
  /**
   * Exact timestamp encoded with int64 since UNIX epoch (Default unit millisecond)
   */
  Timestamp: 10,
  10: "Timestamp",
  /**
   * YEAR_MONTH or DAY_TIME interval in SQL style
   */
  Interval: 11,
  11: "Interval",
  /**
   * A list of some logical data type
   */
  List: 12,
  12: "List",
  /**
   * Struct of logical types
   */
  Struct: 13,
  13: "Struct",
  /**
   * Union of logical types
   */
  Union: 14,
  14: "Union",
  /**
   * Fixed-size binary. Each value occupies the same number of bytes
   */
  FixedSizeBinary: 15,
  15: "FixedSizeBinary",
  /**
   * Fixed-size list. Each value occupies the same number of bytes
   */
  FixedSizeList: 16,
  16: "FixedSizeList",
  /**
   * Map of named logical types
   */
  Map: 17,
  17: "Map",
  /**
   * Measure of elapsed time in either seconds, milliseconds, microseconds or nanoseconds.
   */
  Duration: 18,
  18: "Duration",
});
/**
 * @enum {0 | 1}
 */
export const UnionMode = Object.freeze({
  Sparse: 0,
  0: "Sparse",
  Dense: 1,
  1: "Dense",
});

const BinaryFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_binary_free(ptr >>> 0, 1));
/**
 * Opaque binary data of variable length.
 *
 * A single Binary array can store up to [`i32::MAX`] bytes
 * of binary data in total
 */
export class Binary {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Binary.prototype);
    obj.__wbg_ptr = ptr;
    BinaryFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    BinaryFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_binary_free(ptr, 0);
  }
}

const BooleanFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_boolean_free(ptr >>> 0, 1));
/**
 * A boolean datatype representing the values `true` and `false`.
 */
export class Boolean {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Boolean.prototype);
    obj.__wbg_ptr = ptr;
    BooleanFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    BooleanFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_boolean_free(ptr, 0);
  }
}

const DataFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_data_free(ptr >>> 0, 1));
/**
 * A representation of an Arrow `Data` instance in WebAssembly memory.
 *
 * This has the same underlying representation as an Arrow JS `Data` object.
 */
export class Data {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DataFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_data_free(ptr, 0);
  }
  /**
   * Export this to FFI.
   * @returns {FFIData}
   */
  toFFI() {
    const ret = wasm.data_toFFI(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return FFIData.__wrap(ret[0]);
  }
  /**
   * Copy the values of this `Data` instance to a TypedArray in the JavaScript heap.
   *
   * This will silently ignore any null values. This will error on non-primitive data types for
   * which a TypedArray does not exist in JavaScript.
   * @returns {any}
   */
  toTypedArray() {
    const ret = wasm.data_toTypedArray(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
}

const Date32Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_date32_free(ptr >>> 0, 1));
/**
 * A 32-bit date representing the elapsed time since UNIX epoch (1970-01-01)
 * in days (32 bits).
 */
export class Date32 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Date32.prototype);
    obj.__wbg_ptr = ptr;
    Date32Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Date32Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_date32_free(ptr, 0);
  }
}

const Date64Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_date64_free(ptr >>> 0, 1));
/**
 * A 64-bit date representing the elapsed time since UNIX epoch (1970-01-01)
 * in milliseconds (64 bits). Values are evenly divisible by 86400000.
 */
export class Date64 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Date64.prototype);
    obj.__wbg_ptr = ptr;
    Date64Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Date64Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_date64_free(ptr, 0);
  }
}

const Decimal128Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_decimal128_free(ptr >>> 0, 1),
      );
/**
 * Exact 128-bit width decimal value with precision and scale
 *
 * * precision is the total number of digits
 * * scale is the number of digits past the decimal
 *
 * For example the number 123.45 has precision 5 and scale 2.
 *
 * In certain situations, scale could be negative number. For
 * negative scale, it is the number of padding 0 to the right
 * of the digits.
 *
 * For example the number 12300 could be treated as a decimal
 * has precision 3 and scale -2.
 */
export class Decimal128 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Decimal128.prototype);
    obj.__wbg_ptr = ptr;
    Decimal128Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Decimal128Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_decimal128_free(ptr, 0);
  }
}

const Decimal256Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_decimal256_free(ptr >>> 0, 1),
      );
/**
 * Exact 256-bit width decimal value with precision and scale
 *
 * * precision is the total number of digits
 * * scale is the number of digits past the decimal
 *
 * For example the number 123.45 has precision 5 and scale 2.
 *
 * In certain situations, scale could be negative number. For
 * negative scale, it is the number of padding 0 to the right
 * of the digits.
 *
 * For example the number 12300 could be treated as a decimal
 * has precision 3 and scale -2.
 */
export class Decimal256 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Decimal256.prototype);
    obj.__wbg_ptr = ptr;
    Decimal256Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Decimal256Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_decimal256_free(ptr, 0);
  }
}

const DictionaryFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_dictionary_free(ptr >>> 0, 1),
      );
/**
 * A dictionary encoded array (`key_type`, `value_type`), where
 * each array element is an index of `key_type` into an
 * associated dictionary of `value_type`.
 *
 * Dictionary arrays are used to store columns of `value_type`
 * that contain many repeated values using less memory, but with
 * a higher CPU overhead for some operations.
 *
 * This type mostly used to represent low cardinality string
 * arrays or a limited set of primitive types as integers.
 */
export class Dictionary {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Dictionary.prototype);
    obj.__wbg_ptr = ptr;
    DictionaryFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DictionaryFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_dictionary_free(ptr, 0);
  }
}

const DurationFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_duration_free(ptr >>> 0, 1));
/**
 * Measure of elapsed time in either seconds, milliseconds, microseconds or nanoseconds.
 */
export class Duration {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Duration.prototype);
    obj.__wbg_ptr = ptr;
    DurationFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DurationFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_duration_free(ptr, 0);
  }
}

const FFIDataFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_ffidata_free(ptr >>> 0, 1));
/**
 * An Arrow array exported to FFI.
 *
 * Using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi), you can view or copy Arrow
 * these objects to JavaScript.
 *
 * Note that this also includes an ArrowSchema C struct as well, so that extension type
 * information can be maintained.
 * ## Memory management
 *
 * Note that this array will not be released automatically. You need to manually call `.free()` to
 * release memory.
 */
export class FFIData {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(FFIData.prototype);
    obj.__wbg_ptr = ptr;
    FFIDataFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    FFIDataFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_ffidata_free(ptr, 0);
  }
  /**
   * Access the pointer to the
   * [`ArrowArray`](https://arrow.apache.org/docs/format/CDataInterface.html#structure-definitions)
   * struct. This can be viewed or copied (without serialization) to an Arrow JS `RecordBatch` by
   * using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi). You can access the
   * [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory)
   * instance by using {@linkcode wasmMemory}.
   *
   * **Example**:
   *
   * ```ts
   * import { parseRecordBatch } from "arrow-js-ffi";
   *
   * const wasmRecordBatch: FFIRecordBatch = ...
   * const wasmMemory: WebAssembly.Memory = wasmMemory();
   *
   * // Pass `true` to copy arrays across the boundary instead of creating views.
   * const jsRecordBatch = parseRecordBatch(
   *   wasmMemory.buffer,
   *   wasmRecordBatch.arrayAddr(),
   *   wasmRecordBatch.schemaAddr(),
   *   true
   * );
   * ```
   * @returns {number}
   */
  arrayAddr() {
    const ret = wasm.ffidata_arrayAddr(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * Access the pointer to the
   * [`ArrowSchema`](https://arrow.apache.org/docs/format/CDataInterface.html#structure-definitions)
   * struct. This can be viewed or copied (without serialization) to an Arrow JS `Field` by
   * using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi). You can access the
   * [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory)
   * instance by using {@linkcode wasmMemory}.
   *
   * **Example**:
   *
   * ```ts
   * import { parseRecordBatch } from "arrow-js-ffi";
   *
   * const wasmRecordBatch: FFIRecordBatch = ...
   * const wasmMemory: WebAssembly.Memory = wasmMemory();
   *
   * // Pass `true` to copy arrays across the boundary instead of creating views.
   * const jsRecordBatch = parseRecordBatch(
   *   wasmMemory.buffer,
   *   wasmRecordBatch.arrayAddr(),
   *   wasmRecordBatch.schemaAddr(),
   *   true
   * );
   * ```
   * @returns {number}
   */
  schemaAddr() {
    const ret = wasm.ffidata_schemaAddr(this.__wbg_ptr);
    return ret >>> 0;
  }
}

const FFISchemaFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_ffischema_free(ptr >>> 0, 1),
      );

export class FFISchema {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(FFISchema.prototype);
    obj.__wbg_ptr = ptr;
    FFISchemaFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    FFISchemaFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_ffischema_free(ptr, 0);
  }
  /**
   * Access the pointer to the
   * [`ArrowSchema`](https://arrow.apache.org/docs/format/CDataInterface.html#structure-definitions)
   * struct. This can be viewed or copied (without serialization) to an Arrow JS `Field` by
   * using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi). You can access the
   * [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory)
   * instance by using {@linkcode wasmMemory}.
   *
   * **Example**:
   *
   * ```ts
   * import { parseRecordBatch } from "arrow-js-ffi";
   *
   * const wasmRecordBatch: FFIRecordBatch = ...
   * const wasmMemory: WebAssembly.Memory = wasmMemory();
   *
   * // Pass `true` to copy arrays across the boundary instead of creating views.
   * const jsRecordBatch = parseRecordBatch(
   *   wasmMemory.buffer,
   *   wasmRecordBatch.arrayAddr(),
   *   wasmRecordBatch.schemaAddr(),
   *   true
   * );
   * ```
   * @returns {number}
   */
  addr() {
    const ret = wasm.ffischema_addr(this.__wbg_ptr);
    return ret >>> 0;
  }
}

const FFIStreamFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_ffistream_free(ptr >>> 0, 1),
      );
/**
 * A representation of an Arrow C Stream in WebAssembly memory exposed as FFI-compatible
 * structs through the Arrow C Data Interface.
 *
 * Unlike other Arrow implementations outside of JS, this always stores the "stream" fully
 * materialized as a sequence of Arrow chunks.
 */
export class FFIStream {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(FFIStream.prototype);
    obj.__wbg_ptr = ptr;
    FFIStreamFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    FFIStreamFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_ffistream_free(ptr, 0);
  }
  /**
   * Get the total number of elements in this stream
   * @returns {number}
   */
  numArrays() {
    const ret = wasm.ffistream_numArrays(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * Get the pointer to the ArrowSchema FFI struct
   * @returns {number}
   */
  schemaAddr() {
    const ret = wasm.ffistream_schemaAddr(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * Get the pointer to one ArrowArray FFI struct for a given chunk index and column index
   *
   * Access the pointer to one
   * [`ArrowArray`](https://arrow.apache.org/docs/format/CDataInterface.html#structure-definitions)
   * struct representing one of the internal `RecordBatch`es. This can be viewed or copied (without serialization) to an Arrow JS `RecordBatch` by
   * using [`arrow-js-ffi`](https://github.com/kylebarron/arrow-js-ffi). You can access the
   * [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory)
   * instance by using {@linkcode wasmMemory}.
   *
   * **Example**:
   *
   * ```ts
   * import * as arrow from "apache-arrow";
   * import { parseRecordBatch } from "arrow-js-ffi";
   *
   * const wasmTable: FFITable = ...
   * const wasmMemory: WebAssembly.Memory = wasmMemory();
   *
   * const jsBatches: arrow.RecordBatch[] = []
   * for (let i = 0; i < wasmTable.numBatches(); i++) {
   *   // Pass `true` to copy arrays across the boundary instead of creating views.
   *   const jsRecordBatch = parseRecordBatch(
   *     wasmMemory.buffer,
   *     wasmTable.arrayAddr(i),
   *     wasmTable.schemaAddr(),
   *     true
   *   );
   *   jsBatches.push(jsRecordBatch);
   * }
   * const jsTable = new arrow.Table(jsBatches);
   * ```
   *
   * @param chunk number The chunk index to use
   * @returns number pointer to an ArrowArray FFI struct in Wasm memory
   * @param {number} chunk
   * @returns {number}
   */
  arrayAddr(chunk) {
    const ret = wasm.ffistream_arrayAddr(this.__wbg_ptr, chunk);
    return ret >>> 0;
  }
  /**
   * @returns {Uint32Array}
   */
  arrayAddrs() {
    const ret = wasm.ffistream_arrayAddrs(this.__wbg_ptr);
    var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  drop() {
    const ptr = this.__destroy_into_raw();
    wasm.ffistream_drop(ptr);
  }
}

const FieldFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_field_free(ptr >>> 0, 1));

export class Field {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Field.prototype);
    obj.__wbg_ptr = ptr;
    FieldFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    FieldFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_field_free(ptr, 0);
  }
  /**
   * Export this field to an `FFISchema`` object, which can be read with arrow-js-ffi.
   * @returns {FFISchema}
   */
  toFFI() {
    const ret = wasm.field_toFFI(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return FFISchema.__wrap(ret[0]);
  }
  /**
   * Returns the `Field`'s name.
   * @returns {string}
   */
  name() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.field_name(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Sets the name of this `Field` and returns a new object
   * @param {string} name
   * @returns {Field}
   */
  withName(name) {
    const ptr0 = passStringToWasm0(
      name,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.field_withName(this.__wbg_ptr, ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return Field.__wrap(ret[0]);
  }
  /**
   * @returns {any}
   */
  dataType() {
    const ret = wasm.field_dataType(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * Indicates whether this [`Field`] supports null values.
   * @returns {boolean}
   */
  isNullable() {
    const ret = wasm.field_isNullable(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * @returns {FieldMetadata}
   */
  metadata() {
    const ret = wasm.field_metadata(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * Sets the metadata of this `Field` to be `metadata` and returns a new object
   * @param {FieldMetadata} metadata
   * @returns {Field}
   */
  withMetadata(metadata) {
    const ret = wasm.field_withMetadata(this.__wbg_ptr, metadata);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return Field.__wrap(ret[0]);
  }
}

const FixedSizeBinaryFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_fixedsizebinary_free(ptr >>> 0, 1),
      );
/**
 * Opaque binary data of fixed size.
 * Enum parameter specifies the number of bytes per value.
 */
export class FixedSizeBinary {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(FixedSizeBinary.prototype);
    obj.__wbg_ptr = ptr;
    FixedSizeBinaryFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    FixedSizeBinaryFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_fixedsizebinary_free(ptr, 0);
  }
}

const FixedSizeListFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_fixedsizelist_free(ptr >>> 0, 1),
      );
/**
 * A list of some logical data type with fixed length.
 */
export class FixedSizeList {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(FixedSizeList.prototype);
    obj.__wbg_ptr = ptr;
    FixedSizeListFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    FixedSizeListFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_fixedsizelist_free(ptr, 0);
  }
}

const Float16Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_float16_free(ptr >>> 0, 1));
/**
 * A 16-bit floating point number.
 */
export class Float16 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Float16.prototype);
    obj.__wbg_ptr = ptr;
    Float16Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Float16Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_float16_free(ptr, 0);
  }
}

const Float32Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_float32_free(ptr >>> 0, 1));
/**
 * A 32-bit floating point number.
 */
export class Float32 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Float32.prototype);
    obj.__wbg_ptr = ptr;
    Float32Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Float32Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_float32_free(ptr, 0);
  }
}

const Float64Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_float64_free(ptr >>> 0, 1));
/**
 * A 64-bit floating point number.
 */
export class Float64 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Float64.prototype);
    obj.__wbg_ptr = ptr;
    Float64Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Float64Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_float64_free(ptr, 0);
  }
}

const Int16Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_int16_free(ptr >>> 0, 1));
/**
 * A signed 16-bit integer.
 */
export class Int16 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Int16.prototype);
    obj.__wbg_ptr = ptr;
    Int16Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Int16Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_int16_free(ptr, 0);
  }
}

const Int32Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_int32_free(ptr >>> 0, 1));
/**
 * A signed 32-bit integer.
 */
export class Int32 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Int32.prototype);
    obj.__wbg_ptr = ptr;
    Int32Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Int32Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_int32_free(ptr, 0);
  }
}

const Int64Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_int64_free(ptr >>> 0, 1));
/**
 * A signed 64-bit integer.
 */
export class Int64 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Int64.prototype);
    obj.__wbg_ptr = ptr;
    Int64Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Int64Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_int64_free(ptr, 0);
  }
}

const Int8Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_int8_free(ptr >>> 0, 1));
/**
 * A signed 8-bit integer.
 */
export class Int8 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Int8.prototype);
    obj.__wbg_ptr = ptr;
    Int8Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Int8Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_int8_free(ptr, 0);
  }
}

const IntervalFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_interval_free(ptr >>> 0, 1));
/**
 * A "calendar" interval which models types that don't necessarily
 * have a precise duration without the context of a base timestamp (e.g.
 * days can differ in length during day light savings time transitions).
 */
export class Interval {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Interval.prototype);
    obj.__wbg_ptr = ptr;
    IntervalFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    IntervalFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_interval_free(ptr, 0);
  }
}

const LargeBinaryFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_largebinary_free(ptr >>> 0, 1),
      );
/**
 * Opaque binary data of variable length and 64-bit offsets.
 *
 * A single LargeBinary array can store up to [`i64::MAX`] bytes
 * of binary data in total
 */
export class LargeBinary {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(LargeBinary.prototype);
    obj.__wbg_ptr = ptr;
    LargeBinaryFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    LargeBinaryFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_largebinary_free(ptr, 0);
  }
}

const LargeListFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_largelist_free(ptr >>> 0, 1),
      );
/**
 * A list of some logical data type with variable length and 64-bit offsets.
 *
 * A single LargeList array can store up to [`i64::MAX`] elements in total
 */
export class LargeList {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(LargeList.prototype);
    obj.__wbg_ptr = ptr;
    LargeListFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    LargeListFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_largelist_free(ptr, 0);
  }
}

const LargeUtf8Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_largeutf8_free(ptr >>> 0, 1),
      );
/**
 * A variable-length string in Unicode with UFT-8 encoding and 64-bit offsets.
 *
 * A single LargeUtf8 array can store up to [`i64::MAX`] bytes
 * of string data in total
 */
export class LargeUtf8 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(LargeUtf8.prototype);
    obj.__wbg_ptr = ptr;
    LargeUtf8Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    LargeUtf8Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_largeutf8_free(ptr, 0);
  }
}

const ListFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_list_free(ptr >>> 0, 1));
/**
 * A list of some logical data type with variable length.
 *
 * A single List array can store up to [`i32::MAX`] elements in total
 */
export class List {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(List.prototype);
    obj.__wbg_ptr = ptr;
    ListFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    ListFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_list_free(ptr, 0);
  }
}

const Map_Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_map__free(ptr >>> 0, 1));
/**
 * A Map is a logical nested type that is represented as
 *
 * `List<entries: Struct<key: K, value: V>>`
 *
 * The keys and values are each respectively contiguous.
 * The key and value types are not constrained, but keys should be
 * hashable and unique.
 * Whether the keys are sorted can be set in the `bool` after the `Field`.
 *
 * In a field with Map type, the field has a child Struct field, which then
 * has two children: key type and the second the value type. The names of the
 * child fields may be respectively "entries", "key", and "value", but this is
 * not enforced.
 */
export class Map_ {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Map_.prototype);
    obj.__wbg_ptr = ptr;
    Map_Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Map_Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_map__free(ptr, 0);
  }
}

const NullFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_null_free(ptr >>> 0, 1));
/**
 * Null type
 */
export class Null {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Null.prototype);
    obj.__wbg_ptr = ptr;
    NullFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    NullFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_null_free(ptr, 0);
  }
}

const RecordBatchFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_recordbatch_free(ptr >>> 0, 1),
      );
/**
 * A group of columns of equal length in WebAssembly memory with an associated {@linkcode Schema}.
 */
export class RecordBatch {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(RecordBatch.prototype);
    obj.__wbg_ptr = ptr;
    RecordBatchFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    RecordBatchFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_recordbatch_free(ptr, 0);
  }
  /**
   * The number of rows in this RecordBatch.
   * @returns {number}
   */
  get numRows() {
    const ret = wasm.recordbatch_numRows(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * The number of columns in this RecordBatch.
   * @returns {number}
   */
  get numColumns() {
    const ret = wasm.recordbatch_numColumns(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * The {@linkcode Schema} of this RecordBatch.
   * @returns {Schema}
   */
  get schema() {
    const ret = wasm.recordbatch_schema(this.__wbg_ptr);
    return Schema.__wrap(ret);
  }
  /**
   * Export this RecordBatch to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does not consume** the RecordBatch, so you must remember to call {@linkcode
   * RecordBatch.free} to release the resources. The underlying arrays are reference counted, so
   * this method does not copy data, it only prevents the data from being released.
   * @returns {FFIData}
   */
  toFFI() {
    const ret = wasm.recordbatch_toFFI(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return FFIData.__wrap(ret[0]);
  }
  /**
   * Export this RecordBatch to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does consume** the RecordBatch, so the original RecordBatch will be
   * inaccessible after this call. You must still call {@linkcode FFIRecordBatch.free} after
   * you've finished using the FFIRecordBatch.
   * @returns {FFIData}
   */
  intoFFI() {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.recordbatch_intoFFI(ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return FFIData.__wrap(ret[0]);
  }
  /**
   * Consume this RecordBatch and convert to an Arrow IPC Stream buffer
   * @returns {Uint8Array}
   */
  intoIPCStream() {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.recordbatch_intoIPCStream(ptr);
    if (ret[3]) {
      throw takeFromExternrefTable0(ret[2]);
    }
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
  }
  /**
   * Override the schema of this [`RecordBatch`]
   *
   * Returns an error if `schema` is not a superset of the current schema
   * as determined by [`Schema::contains`]
   * @param {Schema} schema
   * @returns {RecordBatch}
   */
  withSchema(schema) {
    _assertClass(schema, Schema);
    var ptr0 = schema.__destroy_into_raw();
    const ret = wasm.recordbatch_withSchema(this.__wbg_ptr, ptr0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return RecordBatch.__wrap(ret[0]);
  }
  /**
   * Return a new RecordBatch where each column is sliced
   * according to `offset` and `length`
   * @param {number} offset
   * @param {number} length
   * @returns {RecordBatch}
   */
  slice(offset, length) {
    const ret = wasm.recordbatch_slice(this.__wbg_ptr, offset, length);
    return RecordBatch.__wrap(ret);
  }
  /**
   * Returns the total number of bytes of memory occupied physically by this batch.
   * @returns {number}
   */
  getArrayMemorySize() {
    const ret = wasm.recordbatch_getArrayMemorySize(this.__wbg_ptr);
    return ret >>> 0;
  }
}

const RunEndEncodedFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_runendencoded_free(ptr >>> 0, 1),
      );
/**
 * A run-end encoding (REE) is a variation of run-length encoding (RLE). These
 * encodings are well-suited for representing data containing sequences of the
 * same value, called runs. Each run is represented as a value and an integer giving
 * the index in the array where the run ends.
 *
 * A run-end encoded array has no buffers by itself, but has two child arrays. The
 * first child array, called the run ends array, holds either 16, 32, or 64-bit
 * signed integers. The actual values of each run are held in the second child array.
 *
 * These child arrays are prescribed the standard names of "run_ends" and "values"
 * respectively.
 */
export class RunEndEncoded {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(RunEndEncoded.prototype);
    obj.__wbg_ptr = ptr;
    RunEndEncodedFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    RunEndEncodedFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_runendencoded_free(ptr, 0);
  }
}

const SchemaFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_schema_free(ptr >>> 0, 1));
/**
 * A named collection of types that defines the column names and types in a RecordBatch or Table
 * data structure.
 *
 * A Schema can also contain extra user-defined metadata either at the Table or Column level.
 * Column-level metadata is often used to define [extension
 * types](https://arrow.apache.org/docs/format/Columnar.html#extension-types).
 */
export class Schema {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Schema.prototype);
    obj.__wbg_ptr = ptr;
    SchemaFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    SchemaFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_schema_free(ptr, 0);
  }
  /**
   * Export this schema to an FFISchema object, which can be read with arrow-js-ffi.
   *
   * This method **does not consume** the Schema, so you must remember to call {@linkcode
   * Schema.free} to release the resources. The underlying arrays are reference counted, so
   * this method does not copy data, it only prevents the data from being released.
   * @returns {FFISchema}
   */
  toFFI() {
    const ret = wasm.schema_toFFI(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return FFISchema.__wrap(ret[0]);
  }
  /**
   * Export this Table to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does consume** the Table, so the original Table will be
   * inaccessible after this call. You must still call {@linkcode FFITable.free} after
   * you've finished using the FFITable.
   * @returns {FFISchema}
   */
  intoFFI() {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.schema_intoFFI(ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return FFISchema.__wrap(ret[0]);
  }
  /**
   * Consume this schema and convert to an Arrow IPC Stream buffer
   * @returns {Uint8Array}
   */
  intoIPCStream() {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.schema_intoIPCStream(ptr);
    if (ret[3]) {
      throw takeFromExternrefTable0(ret[2]);
    }
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
  }
  /**
   * Returns an immutable reference of a specific [`Field`] instance selected using an
   * offset within the internal `fields` vector.
   * @param {number} i
   * @returns {Field}
   */
  field(i) {
    const ret = wasm.schema_field(this.__wbg_ptr, i);
    return Field.__wrap(ret);
  }
  /**
   * Returns an immutable reference of a specific [`Field`] instance selected by name.
   * @param {string} name
   * @returns {Field}
   */
  fieldWithName(name) {
    const ptr0 = passStringToWasm0(
      name,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.schema_fieldWithName(this.__wbg_ptr, ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return Field.__wrap(ret[0]);
  }
  /**
   * Sets the metadata of this `Schema` to be `metadata` and returns a new object
   * @param {SchemaMetadata} metadata
   * @returns {Schema}
   */
  withMetadata(metadata) {
    const ret = wasm.schema_withMetadata(this.__wbg_ptr, metadata);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return Schema.__wrap(ret[0]);
  }
  /**
   * Find the index of the column with the given name.
   * @param {string} name
   * @returns {number}
   */
  indexOf(name) {
    const ptr0 = passStringToWasm0(
      name,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.schema_indexOf(this.__wbg_ptr, ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] >>> 0;
  }
  /**
   * Returns an immutable reference to the Map of custom metadata key-value pairs.
   * @returns {SchemaMetadata}
   */
  metadata() {
    const ret = wasm.schema_metadata(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
}

const StructFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_struct_free(ptr >>> 0, 1));
/**
 * A nested datatype that contains a number of sub-fields.
 */
export class Struct {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Struct.prototype);
    obj.__wbg_ptr = ptr;
    StructFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    StructFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_struct_free(ptr, 0);
  }
}

const TableFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_table_free(ptr >>> 0, 1));
/**
 * A Table in WebAssembly memory conforming to the Apache Arrow spec.
 *
 * A Table consists of one or more {@linkcode RecordBatch} objects plus a {@linkcode Schema} that
 * each RecordBatch conforms to.
 */
export class Table {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Table.prototype);
    obj.__wbg_ptr = ptr;
    TableFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    TableFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_table_free(ptr, 0);
  }
  /**
   * Access the Table's {@linkcode Schema}.
   * @returns {Schema}
   */
  get schema() {
    const ret = wasm.table_schema(this.__wbg_ptr);
    return Schema.__wrap(ret);
  }
  /**
   * Access a RecordBatch from the Table by index.
   *
   * @param index The positional index of the RecordBatch to retrieve.
   * @returns a RecordBatch or `null` if out of range.
   * @param {number} index
   * @returns {RecordBatch | undefined}
   */
  recordBatch(index) {
    const ret = wasm.table_recordBatch(this.__wbg_ptr, index);
    return ret === 0 ? undefined : RecordBatch.__wrap(ret);
  }
  /**
   * @returns {RecordBatch[]}
   */
  recordBatches() {
    const ret = wasm.table_recordBatches(this.__wbg_ptr);
    var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  /**
   * The number of batches in the Table
   * @returns {number}
   */
  get numBatches() {
    const ret = wasm.table_numBatches(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * Export this Table to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does not consume** the Table, so you must remember to call {@linkcode
   * Table.free} to release the resources. The underlying arrays are reference counted, so
   * this method does not copy data, it only prevents the data from being released.
   * @returns {FFIStream}
   */
  toFFI() {
    const ret = wasm.table_toFFI(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return FFIStream.__wrap(ret[0]);
  }
  /**
   * Export this Table to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does consume** the Table, so the original Table will be
   * inaccessible after this call. You must still call {@linkcode FFITable.free} after
   * you've finished using the FFITable.
   * @returns {FFIStream}
   */
  intoFFI() {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.table_intoFFI(ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return FFIStream.__wrap(ret[0]);
  }
  /**
   * Consume this table and convert to an Arrow IPC Stream buffer
   * @returns {Uint8Array}
   */
  intoIPCStream() {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.table_intoIPCStream(ptr);
    if (ret[3]) {
      throw takeFromExternrefTable0(ret[2]);
    }
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
  }
  /**
   * Create a table from an Arrow IPC Stream buffer
   * @param {Uint8Array} buf
   * @returns {Table}
   */
  static fromIPCStream(buf) {
    const ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.table_fromIPCStream(ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return Table.__wrap(ret[0]);
  }
  /**
   * Returns the total number of bytes of memory occupied physically by all batches in this
   * table.
   * @returns {number}
   */
  getArrayMemorySize() {
    const ret = wasm.table_getArrayMemorySize(this.__wbg_ptr);
    return ret >>> 0;
  }
}

const Time32Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_time32_free(ptr >>> 0, 1));
/**
 * A 32-bit time representing the elapsed time since midnight in the unit of `TimeUnit`.
 */
export class Time32 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Time32.prototype);
    obj.__wbg_ptr = ptr;
    Time32Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Time32Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_time32_free(ptr, 0);
  }
}

const Time64Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_time64_free(ptr >>> 0, 1));
/**
 * A 64-bit time representing the elapsed time since midnight in the unit of `TimeUnit`.
 */
export class Time64 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Time64.prototype);
    obj.__wbg_ptr = ptr;
    Time64Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Time64Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_time64_free(ptr, 0);
  }
}

const TimestampFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_timestamp_free(ptr >>> 0, 1),
      );
/**
 * A timestamp with an optional timezone.
 *
 * Time is measured as a Unix epoch, counting the seconds from
 * 00:00:00.000 on 1 January 1970, excluding leap seconds,
 * as a 64-bit integer.
 *
 * The time zone is a string indicating the name of a time zone, one of:
 *
 * * As used in the Olson time zone database (the "tz database" or
 *   "tzdata"), such as "America/New_York"
 * * An absolute time zone offset of the form +XX:XX or -XX:XX, such as +07:30
 *
 * Timestamps with a non-empty timezone
 * ------------------------------------
 *
 * If a Timestamp column has a non-empty timezone value, its epoch is
 * 1970-01-01 00:00:00 (January 1st 1970, midnight) in the *UTC* timezone
 * (the Unix epoch), regardless of the Timestamp's own timezone.
 *
 * Therefore, timestamp values with a non-empty timezone correspond to
 * physical points in time together with some additional information about
 * how the data was obtained and/or how to display it (the timezone).
 *
 *   For example, the timestamp value 0 with the timezone string "Europe/Paris"
 *   corresponds to "January 1st 1970, 00h00" in the UTC timezone, but the
 *   application may prefer to display it as "January 1st 1970, 01h00" in
 *   the Europe/Paris timezone (which is the same physical point in time).
 *
 * One consequence is that timestamp values with a non-empty timezone
 * can be compared and ordered directly, since they all share the same
 * well-known point of reference (the Unix epoch).
 *
 * Timestamps with an unset / empty timezone
 * -----------------------------------------
 *
 * If a Timestamp column has no timezone value, its epoch is
 * 1970-01-01 00:00:00 (January 1st 1970, midnight) in an *unknown* timezone.
 *
 * Therefore, timestamp values without a timezone cannot be meaningfully
 * interpreted as physical points in time, but only as calendar / clock
 * indications ("wall clock time") in an unspecified timezone.
 *
 *   For example, the timestamp value 0 with an empty timezone string
 *   corresponds to "January 1st 1970, 00h00" in an unknown timezone: there
 *   is not enough information to interpret it as a well-defined physical
 *   point in time.
 *
 * One consequence is that timestamp values without a timezone cannot
 * be reliably compared or ordered, since they may have different points of
 * reference.  In particular, it is *not* possible to interpret an unset
 * or empty timezone as the same as "UTC".
 *
 * Conversion between timezones
 * ----------------------------
 *
 * If a Timestamp column has a non-empty timezone, changing the timezone
 * to a different non-empty value is a metadata-only operation:
 * the timestamp values need not change as their point of reference remains
 * the same (the Unix epoch).
 *
 * However, if a Timestamp column has no timezone value, changing it to a
 * non-empty value requires to think about the desired semantics.
 * One possibility is to assume that the original timestamp values are
 * relative to the epoch of the timezone being set; timestamp values should
 * then adjusted to the Unix epoch (for example, changing the timezone from
 * empty to "Europe/Paris" would require converting the timestamp values
 * from "Europe/Paris" to "UTC", which seems counter-intuitive but is
 * nevertheless correct).
 */
export class Timestamp {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Timestamp.prototype);
    obj.__wbg_ptr = ptr;
    TimestampFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    TimestampFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_timestamp_free(ptr, 0);
  }
}

const UInt16Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_uint16_free(ptr >>> 0, 1));
/**
 * An unsigned 16-bit integer.
 */
export class UInt16 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(UInt16.prototype);
    obj.__wbg_ptr = ptr;
    UInt16Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    UInt16Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_uint16_free(ptr, 0);
  }
}

const UInt32Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_uint32_free(ptr >>> 0, 1));
/**
 * An unsigned 32-bit integer.
 */
export class UInt32 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(UInt32.prototype);
    obj.__wbg_ptr = ptr;
    UInt32Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    UInt32Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_uint32_free(ptr, 0);
  }
}

const UInt64Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_uint64_free(ptr >>> 0, 1));
/**
 * An unsigned 64-bit integer.
 */
export class UInt64 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(UInt64.prototype);
    obj.__wbg_ptr = ptr;
    UInt64Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    UInt64Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_uint64_free(ptr, 0);
  }
}

const UInt8Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_uint8_free(ptr >>> 0, 1));
/**
 * An unsigned 8-bit integer.
 */
export class UInt8 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(UInt8.prototype);
    obj.__wbg_ptr = ptr;
    UInt8Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    UInt8Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_uint8_free(ptr, 0);
  }
}

const UnionFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_union_free(ptr >>> 0, 1));
/**
 * A nested datatype that can represent slots of differing types. Components:
 *
 * 1. [`UnionFields`]
 * 2. The type of union (Sparse or Dense)
 */
export class Union {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Union.prototype);
    obj.__wbg_ptr = ptr;
    UnionFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    UnionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_union_free(ptr, 0);
  }
}

const Utf8Finalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_utf8_free(ptr >>> 0, 1));
/**
 * A variable-length string in Unicode with UTF-8 encoding
 *
 * A single Utf8 array can store up to [`i32::MAX`] bytes
 * of string data in total
 */
export class Utf8 {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Utf8.prototype);
    obj.__wbg_ptr = ptr;
    Utf8Finalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    Utf8Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_utf8_free(ptr, 0);
  }
}

const VectorFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_vector_free(ptr >>> 0, 1));

export class Vector {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    VectorFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vector_free(ptr, 0);
  }
}

export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
  const ret = String(arg1);
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_batches_55a91d20a2559b07(arg0, arg1) {
  const ret = arg1.batches;
  const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_binary_new(arg0) {
  const ret = Binary.__wrap(arg0);
  return ret;
}

export function __wbg_bitWidth_1efcbca8c45e887c(arg0) {
  const ret = arg0.bitWidth;
  return ret;
}

export function __wbg_bitWidth_714495d6d85c07f5(arg0) {
  const ret = arg0.bitWidth;
  return ret;
}

export function __wbg_boolean_new(arg0) {
  const ret = Boolean.__wrap(arg0);
  return ret;
}

export function __wbg_buffer_5202ed8aa838233b(arg0) {
  const ret = arg0.buffer;
  return ret;
}

export function __wbg_buffer_609cc3eee51ed158(arg0) {
  const ret = arg0.buffer;
  return ret;
}

export function __wbg_byteLength_bf8346a16247355b(arg0) {
  const ret = arg0.byteLength;
  return ret;
}

export function __wbg_byteOffset_3b815c29981fc7fa(arg0) {
  const ret = arg0.byteOffset;
  return ret;
}

export function __wbg_byteWidth_72769f194ab39bac(arg0) {
  const ret = arg0.byteWidth;
  return ret;
}

export function __wbg_call_672a4d21634d4a24() {
  return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
  }, arguments);
}

export function __wbg_children_458479ece9e3ca92(arg0, arg1) {
  const ret = arg1.children;
  const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_children_82b7547519ead8ba(arg0, arg1) {
  const ret = arg1.children;
  const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_children_be22fb924c4031d9(arg0, arg1) {
  const ret = arg1.children;
  const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_children_cb6eb2622a110a2f(arg0, arg1) {
  const ret = arg1.children;
  const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_children_e0cc873fe6bea315(arg0, arg1) {
  const ret = arg1.children;
  const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_children_f67236ad0f88e8e7(arg0, arg1) {
  const ret = arg1.children;
  const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_data_cfcaee6ed5340120(arg0) {
  const ret = arg0.data;
  return ret;
}

export function __wbg_date32_new(arg0) {
  const ret = Date32.__wrap(arg0);
  return ret;
}

export function __wbg_date64_new(arg0) {
  const ret = Date64.__wrap(arg0);
  return ret;
}

export function __wbg_decimal128_new(arg0) {
  const ret = Decimal128.__wrap(arg0);
  return ret;
}

export function __wbg_decimal256_new(arg0) {
  const ret = Decimal256.__wrap(arg0);
  return ret;
}

export function __wbg_dictionary_new(arg0) {
  const ret = Dictionary.__wrap(arg0);
  return ret;
}

export function __wbg_done_769e5ede4b31c67b(arg0) {
  const ret = arg0.done;
  return ret;
}

export function __wbg_duration_new(arg0) {
  const ret = Duration.__wrap(arg0);
  return ret;
}

export function __wbg_entries_3265d4158b33e5dc(arg0) {
  const ret = Object.entries(arg0);
  return ret;
}

export function __wbg_fields_c2015732bde14df7(arg0, arg1) {
  const ret = arg1.fields;
  const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_fixedsizebinary_new(arg0) {
  const ret = FixedSizeBinary.__wrap(arg0);
  return ret;
}

export function __wbg_fixedsizelist_new(arg0) {
  const ret = FixedSizeList.__wrap(arg0);
  return ret;
}

export function __wbg_float16_new(arg0) {
  const ret = Float16.__wrap(arg0);
  return ret;
}

export function __wbg_float32_new(arg0) {
  const ret = Float32.__wrap(arg0);
  return ret;
}

export function __wbg_float64_new(arg0) {
  const ret = Float64.__wrap(arg0);
  return ret;
}

export function __wbg_get_67b2ba62fc30de12() {
  return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
  }, arguments);
}

export function __wbg_get_b9b93047fe3cf45b(arg0, arg1) {
  const ret = arg0[arg1 >>> 0];
  return ret;
}

export function __wbg_instanceof_ArrayBuffer_e14585432e3737fc(arg0) {
  let result;
  try {
    result = arg0 instanceof ArrayBuffer;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_instanceof_Uint8Array_17156bcf118086a9(arg0) {
  let result;
  try {
    result = arg0 instanceof Uint8Array;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_int16_new(arg0) {
  const ret = Int16.__wrap(arg0);
  return ret;
}

export function __wbg_int32_new(arg0) {
  const ret = Int32.__wrap(arg0);
  return ret;
}

export function __wbg_int64_new(arg0) {
  const ret = Int64.__wrap(arg0);
  return ret;
}

export function __wbg_int8_new(arg0) {
  const ret = Int8.__wrap(arg0);
  return ret;
}

export function __wbg_interval_new(arg0) {
  const ret = Interval.__wrap(arg0);
  return ret;
}

export function __wbg_isSigned_e1d54aed72ffe455(arg0) {
  const ret = arg0.isSigned;
  return ret;
}

export function __wbg_iterator_9a24c88df860dc65() {
  const ret = Symbol.iterator;
  return ret;
}

export function __wbg_keysSorted_fc261fbbbddcf0c8(arg0) {
  const ret = arg0.keysSorted;
  return ret;
}

export function __wbg_largebinary_new(arg0) {
  const ret = LargeBinary.__wrap(arg0);
  return ret;
}

export function __wbg_largelist_new(arg0) {
  const ret = LargeList.__wrap(arg0);
  return ret;
}

export function __wbg_largeutf8_new(arg0) {
  const ret = LargeUtf8.__wrap(arg0);
  return ret;
}

export function __wbg_length_07e0772b8084db33(arg0) {
  const ret = arg0.length;
  return ret;
}

export function __wbg_length_259f372e0f0a7e90(arg0) {
  const ret = arg0.length;
  return ret;
}

export function __wbg_length_a446193dc22c12f8(arg0) {
  const ret = arg0.length;
  return ret;
}

export function __wbg_length_e2d2a49132c1b256(arg0) {
  const ret = arg0.length;
  return ret;
}

export function __wbg_listSize_f75928dbdf97b8cf(arg0) {
  const ret = arg0.listSize;
  return ret;
}

export function __wbg_list_new(arg0) {
  const ret = List.__wrap(arg0);
  return ret;
}

export function __wbg_map__new(arg0) {
  const ret = Map_.__wrap(arg0);
  return ret;
}

export function __wbg_metadata_0b70189dff49fcf0(arg0) {
  const ret = arg0.metadata;
  return ret;
}

export function __wbg_metadata_473cc93a1788d572(arg0) {
  const ret = arg0.metadata;
  return ret;
}

export function __wbg_mode_a9325af19d207011(arg0) {
  const ret = arg0.mode;
  return ret;
}

export function __wbg_name_bf509d63aef80ebd(arg0, arg1) {
  const ret = arg1.name;
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_new_2626a2990a9762f6(arg0) {
  const ret = new Int16Array(arg0);
  return ret;
}

export function __wbg_new_405e22f390576ce2() {
  const ret = new Object();
  return ret;
}

export function __wbg_new_5e0be73521bc8c17() {
  const ret = new Map();
  return ret;
}

export function __wbg_new_780abee5c1739fd7(arg0) {
  const ret = new Float32Array(arg0);
  return ret;
}

export function __wbg_new_78c8a92080461d08(arg0) {
  const ret = new Float64Array(arg0);
  return ret;
}

export function __wbg_new_78feb108b6472713() {
  const ret = new Array();
  return ret;
}

export function __wbg_new_8de0180919aeafa0(arg0) {
  const ret = new Int8Array(arg0);
  return ret;
}

export function __wbg_new_9fee97a409b32b68(arg0) {
  const ret = new Uint16Array(arg0);
  return ret;
}

export function __wbg_new_a12002a7f91c75be(arg0) {
  const ret = new Uint8Array(arg0);
  return ret;
}

export function __wbg_new_bd268764cefc60c9(arg0) {
  const ret = new BigInt64Array(arg0);
  return ret;
}

export function __wbg_new_e3b321dcfef89fc7(arg0) {
  const ret = new Uint32Array(arg0);
  return ret;
}

export function __wbg_new_e5efeb1e59f0eb60(arg0) {
  const ret = new BigUint64Array(arg0);
  return ret;
}

export function __wbg_new_e9a4a67dbababe57(arg0) {
  const ret = new Int32Array(arg0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_095d65baacc373dd(
  arg0,
  arg1,
  arg2,
) {
  const ret = new BigUint64Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_840f3c038856d4e9(
  arg0,
  arg1,
  arg2,
) {
  const ret = new Int8Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_93c8e0c1a479fa1a(
  arg0,
  arg1,
  arg2,
) {
  const ret = new Float64Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_999332a180064b59(
  arg0,
  arg1,
  arg2,
) {
  const ret = new Int32Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_d4a86622320ea258(
  arg0,
  arg1,
  arg2,
) {
  const ret = new Uint16Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a(
  arg0,
  arg1,
  arg2,
) {
  const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_e6b7e69acd4c7354(
  arg0,
  arg1,
  arg2,
) {
  const ret = new Float32Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_f1dead44d1fc7212(
  arg0,
  arg1,
  arg2,
) {
  const ret = new Uint32Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_f254047f7e80e7ff(
  arg0,
  arg1,
  arg2,
) {
  const ret = new Int16Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_fe845a3aab7ef15e(
  arg0,
  arg1,
  arg2,
) {
  const ret = new BigInt64Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_next_25feadfc0913fea9(arg0) {
  const ret = arg0.next;
  return ret;
}

export function __wbg_next_6574e1a8a62d1055() {
  return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
  }, arguments);
}

export function __wbg_nullBitmap_2fc9b0597a7e3d42(arg0) {
  const ret = arg0.nullBitmap;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_null_new(arg0) {
  const ret = Null.__wrap(arg0);
  return ret;
}

export function __wbg_nullable_9611879fc6150794(arg0) {
  const ret = arg0.nullable;
  return ret;
}

export function __wbg_offset_c96b3ac1aced8a64(arg0) {
  const ret = arg0.offset;
  return ret;
}

export function __wbg_precision_588bffcb443398b7(arg0) {
  const ret = arg0.precision;
  return ret;
}

export function __wbg_precision_e8b5c4cb01d69531(arg0) {
  const ret = arg0.precision;
  return ret;
}

export function __wbg_recordbatch_new(arg0) {
  const ret = RecordBatch.__wrap(arg0);
  return ret;
}

export function __wbg_runendencoded_new(arg0) {
  const ret = RunEndEncoded.__wrap(arg0);
  return ret;
}

export function __wbg_scale_eeb2152b73520a56(arg0) {
  const ret = arg0.scale;
  return ret;
}

export function __wbg_schema_83276bc5dbc44e66(arg0) {
  const ret = arg0.schema;
  return ret;
}

export function __wbg_set_37837023f3d740e8(arg0, arg1, arg2) {
  arg0[arg1 >>> 0] = arg2;
}

export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
  arg0[arg1] = arg2;
}

export function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
  arg0.set(arg1, arg2 >>> 0);
}

export function __wbg_set_8fc6bf8a5b1071d1(arg0, arg1, arg2) {
  const ret = arg0.set(arg1, arg2);
  return ret;
}

export function __wbg_set_958acb46280370e5(arg0, arg1, arg2) {
  arg0.set(arg1, arg2 >>> 0);
}

export function __wbg_struct_new(arg0) {
  const ret = Struct.__wrap(arg0);
  return ret;
}

export function __wbg_time32_new(arg0) {
  const ret = Time32.__wrap(arg0);
  return ret;
}

export function __wbg_time64_new(arg0) {
  const ret = Time64.__wrap(arg0);
  return ret;
}

export function __wbg_timestamp_new(arg0) {
  const ret = Timestamp.__wrap(arg0);
  return ret;
}

export function __wbg_timezone_c8bc20b7339594c7(arg0, arg1) {
  const ret = arg1.timezone;
  var ptr1 = isLikeNone(ret)
    ? 0
    : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_typeId_c29807e97b39207e(arg0) {
  const ret = arg0.typeId;
  return ret;
}

export function __wbg_typeIds_20ea354ac671fd00(arg0) {
  const ret = arg0.typeIds;
  return ret;
}

export function __wbg_type_0cb15a1551b59fda(arg0) {
  const ret = arg0.type;
  return ret;
}

export function __wbg_type_a6bc7606fe237f78(arg0) {
  const ret = arg0.type;
  return ret;
}

export function __wbg_uint16_new(arg0) {
  const ret = UInt16.__wrap(arg0);
  return ret;
}

export function __wbg_uint32_new(arg0) {
  const ret = UInt32.__wrap(arg0);
  return ret;
}

export function __wbg_uint64_new(arg0) {
  const ret = UInt64.__wrap(arg0);
  return ret;
}

export function __wbg_uint8_new(arg0) {
  const ret = UInt8.__wrap(arg0);
  return ret;
}

export function __wbg_union_new(arg0) {
  const ret = Union.__wrap(arg0);
  return ret;
}

export function __wbg_unit_0e1f5378c779a911(arg0) {
  const ret = arg0.unit;
  return ret;
}

export function __wbg_unit_24c97359c1d54658(arg0) {
  const ret = arg0.unit;
  return ret;
}

export function __wbg_unit_4aa5825844a20eb5(arg0) {
  const ret = arg0.unit;
  return ret;
}

export function __wbg_unit_7e712ae8a1309590(arg0) {
  const ret = arg0.unit;
  return ret;
}

export function __wbg_unit_b3853578953b2a30(arg0) {
  const ret = arg0.unit;
  return ret;
}

export function __wbg_utf8_new(arg0) {
  const ret = Utf8.__wrap(arg0);
  return ret;
}

export function __wbg_valueOffsets_cd94043589fb56ce(arg0) {
  const ret = arg0.valueOffsets;
  return ret;
}

export function __wbg_value_cd1ffa7b1ab794f1(arg0) {
  const ret = arg0.value;
  return ret;
}

export function __wbg_values_c2d1c6a91498057b(arg0) {
  const ret = arg0.values;
  return ret;
}

export function __wbindgen_bigint_from_i64(arg0) {
  const ret = arg0;
  return ret;
}

export function __wbindgen_bigint_from_u64(arg0) {
  const ret = BigInt.asUintN(64, arg0);
  return ret;
}

export function __wbindgen_boolean_get(arg0) {
  const v = arg0;
  const ret = typeof v === "boolean" ? (v ? 1 : 0) : 2;
  return ret;
}

export function __wbindgen_debug_string(arg0, arg1) {
  const ret = debugString(arg1);
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbindgen_error_new(arg0, arg1) {
  const ret = new Error(getStringFromWasm0(arg0, arg1));
  return ret;
}

export function __wbindgen_function_table() {
  const ret = wasm.__wbindgen_export_5;
  return ret;
}

export function __wbindgen_init_externref_table() {
  const table = wasm.__wbindgen_export_3;
  const offset = table.grow(4);
  table.set(0, undefined);
  table.set(offset + 0, undefined);
  table.set(offset + 1, null);
  table.set(offset + 2, true);
  table.set(offset + 3, false);
}

export function __wbindgen_is_function(arg0) {
  const ret = typeof arg0 === "function";
  return ret;
}

export function __wbindgen_is_object(arg0) {
  const val = arg0;
  const ret = typeof val === "object" && val !== null;
  return ret;
}

export function __wbindgen_is_string(arg0) {
  const ret = typeof arg0 === "string";
  return ret;
}

export function __wbindgen_jsval_loose_eq(arg0, arg1) {
  const ret = arg0 == arg1;
  return ret;
}

export function __wbindgen_memory() {
  const ret = wasm.memory;
  return ret;
}

export function __wbindgen_number_get(arg0, arg1) {
  const obj = arg1;
  const ret = typeof obj === "number" ? obj : undefined;
  getDataViewMemory0().setFloat64(
    arg0 + 8 * 1,
    isLikeNone(ret) ? 0 : ret,
    true,
  );
  getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}

export function __wbindgen_number_new(arg0) {
  const ret = arg0;
  return ret;
}

export function __wbindgen_string_get(arg0, arg1) {
  const obj = arg1;
  const ret = typeof obj === "string" ? obj : undefined;
  var ptr1 = isLikeNone(ret)
    ? 0
    : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return ret;
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}
