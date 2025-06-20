/* tslint:disable */
/* eslint-disable */
export function arrowToStacJson(table: any): any;
/**
 * Returns a handle to this wasm instance's `WebAssembly.Memory`
 */
export function wasmMemory(): Memory;
/**
 * Returns a handle to this wasm instance's `WebAssembly.Table` which is the indirect function
 * table used by Rust
 */
export function _functionTable(): FunctionTable;
export enum BufferType {
  /**
   *
   *     * used in List type, Dense Union and variable length primitive types (String, Binary)
   *     
   */
  Offset = 0,
  /**
   *
   *     * actual data, either fixed width primitive types in slots or variable width delimited by an OFFSET vector
   *     
   */
  Data = 1,
  /**
   *
   *     * Bit vector indicating if each value is null
   *     
   */
  Validity = 2,
  /**
   *
   *     * Type vector used in Union type
   *     
   */
  Type = 3,
}
export enum DateUnit {
  Day = 0,
  Millisecond = 1,
}
export enum IntervalUnit {
  YearMonth = 0,
  DayTime = 1,
  MonthDayNano = 2,
}
export enum Precision {
  Half = 0,
  Single = 1,
  Double = 2,
}
export enum TimeUnit {
  Second = 0,
  Millisecond = 1,
  Microsecond = 2,
  Nanosecond = 3,
}
export enum Type {
  /**
   * The default placeholder type
   */
  NONE = 0,
  /**
   * A NULL type having no physical storage
   */
  Null = 1,
  /**
   * Signed or unsigned 8, 16, 32, or 64-bit little-endian integer
   */
  Int = 2,
  /**
   * 2, 4, or 8-byte floating point value
   */
  Float = 3,
  /**
   * Variable-length bytes (no guarantee of UTF8-ness)
   */
  Binary = 4,
  /**
   * UTF8 variable-length string as List<Char>
   */
  Utf8 = 5,
  /**
   * Boolean as 1 bit, LSB bit-packed ordering
   */
  Bool = 6,
  /**
   * Precision-and-scale-based decimal type. Storage type depends on the parameters.
   */
  Decimal = 7,
  /**
   * int32_t days or int64_t milliseconds since the UNIX epoch
   */
  Date = 8,
  /**
   * Time as signed 32 or 64-bit integer, representing either seconds, milliseconds,
   * microseconds, or nanoseconds since midnight since midnight
   */
  Time = 9,
  /**
   * Exact timestamp encoded with int64 since UNIX epoch (Default unit millisecond)
   */
  Timestamp = 10,
  /**
   * YEAR_MONTH or DAY_TIME interval in SQL style
   */
  Interval = 11,
  /**
   * A list of some logical data type
   */
  List = 12,
  /**
   * Struct of logical types
   */
  Struct = 13,
  /**
   * Union of logical types
   */
  Union = 14,
  /**
   * Fixed-size binary. Each value occupies the same number of bytes
   */
  FixedSizeBinary = 15,
  /**
   * Fixed-size list. Each value occupies the same number of bytes
   */
  FixedSizeList = 16,
  /**
   * Map of named logical types
   */
  Map = 17,
  /**
   * Measure of elapsed time in either seconds, milliseconds, microseconds or nanoseconds.
   */
  Duration = 18,
}
export enum UnionMode {
  Sparse = 0,
  Dense = 1,
}

export type SchemaMetadata = Map<string, string>;



export type FieldMetadata = Map<string, string>;



export type FunctionTable = WebAssembly.Table;



export type Memory = WebAssembly.Memory;


/**
 * Opaque binary data of variable length.
 *
 * A single Binary array can store up to [`i32::MAX`] bytes
 * of binary data in total
 */
export class Binary {
  private constructor();
  free(): void;
}
/**
 * A boolean datatype representing the values `true` and `false`.
 */
export class Boolean {
  private constructor();
  free(): void;
}
/**
 * A representation of an Arrow `Data` instance in WebAssembly memory.
 *
 * This has the same underlying representation as an Arrow JS `Data` object.
 */
export class Data {
  private constructor();
  free(): void;
  /**
   * Export this to FFI.
   */
  toFFI(): FFIData;
  /**
   * Copy the values of this `Data` instance to a TypedArray in the JavaScript heap.
   *
   * This will silently ignore any null values. This will error on non-primitive data types for
   * which a TypedArray does not exist in JavaScript.
   */
  toTypedArray(): any;
}
/**
 * A 32-bit date representing the elapsed time since UNIX epoch (1970-01-01)
 * in days (32 bits).
 */
export class Date32 {
  private constructor();
  free(): void;
}
/**
 * A 64-bit date representing the elapsed time since UNIX epoch (1970-01-01)
 * in milliseconds (64 bits). Values are evenly divisible by 86400000.
 */
export class Date64 {
  private constructor();
  free(): void;
}
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
  private constructor();
  free(): void;
}
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
  private constructor();
  free(): void;
}
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
  private constructor();
  free(): void;
}
/**
 * Measure of elapsed time in either seconds, milliseconds, microseconds or nanoseconds.
 */
export class Duration {
  private constructor();
  free(): void;
}
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
  private constructor();
  free(): void;
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
   */
  arrayAddr(): number;
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
   */
  schemaAddr(): number;
}
export class FFISchema {
  private constructor();
  free(): void;
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
   */
  addr(): number;
}
/**
 * A representation of an Arrow C Stream in WebAssembly memory exposed as FFI-compatible
 * structs through the Arrow C Data Interface.
 *
 * Unlike other Arrow implementations outside of JS, this always stores the "stream" fully
 * materialized as a sequence of Arrow chunks.
 */
export class FFIStream {
  private constructor();
  free(): void;
  /**
   * Get the total number of elements in this stream
   */
  numArrays(): number;
  /**
   * Get the pointer to the ArrowSchema FFI struct
   */
  schemaAddr(): number;
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
   */
  arrayAddr(chunk: number): number;
  arrayAddrs(): Uint32Array;
  drop(): void;
}
export class Field {
  private constructor();
  free(): void;
  /**
   * Export this field to an `FFISchema`` object, which can be read with arrow-js-ffi.
   */
  toFFI(): FFISchema;
  /**
   * Returns the `Field`'s name.
   */
  name(): string;
  /**
   * Sets the name of this `Field` and returns a new object
   */
  withName(name: string): Field;
  dataType(): any;
  /**
   * Indicates whether this [`Field`] supports null values.
   */
  isNullable(): boolean;
  metadata(): FieldMetadata;
  /**
   * Sets the metadata of this `Field` to be `metadata` and returns a new object
   */
  withMetadata(metadata: FieldMetadata): Field;
}
/**
 * Opaque binary data of fixed size.
 * Enum parameter specifies the number of bytes per value.
 */
export class FixedSizeBinary {
  private constructor();
  free(): void;
}
/**
 * A list of some logical data type with fixed length.
 */
export class FixedSizeList {
  private constructor();
  free(): void;
}
/**
 * A 16-bit floating point number.
 */
export class Float16 {
  private constructor();
  free(): void;
}
/**
 * A 32-bit floating point number.
 */
export class Float32 {
  private constructor();
  free(): void;
}
/**
 * A 64-bit floating point number.
 */
export class Float64 {
  private constructor();
  free(): void;
}
/**
 * A signed 16-bit integer.
 */
export class Int16 {
  private constructor();
  free(): void;
}
/**
 * A signed 32-bit integer.
 */
export class Int32 {
  private constructor();
  free(): void;
}
/**
 * A signed 64-bit integer.
 */
export class Int64 {
  private constructor();
  free(): void;
}
/**
 * A signed 8-bit integer.
 */
export class Int8 {
  private constructor();
  free(): void;
}
/**
 * A "calendar" interval which models types that don't necessarily
 * have a precise duration without the context of a base timestamp (e.g.
 * days can differ in length during day light savings time transitions).
 */
export class Interval {
  private constructor();
  free(): void;
}
/**
 * Opaque binary data of variable length and 64-bit offsets.
 *
 * A single LargeBinary array can store up to [`i64::MAX`] bytes
 * of binary data in total
 */
export class LargeBinary {
  private constructor();
  free(): void;
}
/**
 * A list of some logical data type with variable length and 64-bit offsets.
 *
 * A single LargeList array can store up to [`i64::MAX`] elements in total
 */
export class LargeList {
  private constructor();
  free(): void;
}
/**
 * A variable-length string in Unicode with UFT-8 encoding and 64-bit offsets.
 *
 * A single LargeUtf8 array can store up to [`i64::MAX`] bytes
 * of string data in total
 */
export class LargeUtf8 {
  private constructor();
  free(): void;
}
/**
 * A list of some logical data type with variable length.
 *
 * A single List array can store up to [`i32::MAX`] elements in total
 */
export class List {
  private constructor();
  free(): void;
}
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
  private constructor();
  free(): void;
}
/**
 * Null type
 */
export class Null {
  private constructor();
  free(): void;
}
/**
 * A group of columns of equal length in WebAssembly memory with an associated {@linkcode Schema}.
 */
export class RecordBatch {
  private constructor();
  free(): void;
  /**
   * Export this RecordBatch to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does not consume** the RecordBatch, so you must remember to call {@linkcode
   * RecordBatch.free} to release the resources. The underlying arrays are reference counted, so
   * this method does not copy data, it only prevents the data from being released.
   */
  toFFI(): FFIData;
  /**
   * Export this RecordBatch to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does consume** the RecordBatch, so the original RecordBatch will be
   * inaccessible after this call. You must still call {@linkcode FFIRecordBatch.free} after
   * you've finished using the FFIRecordBatch.
   */
  intoFFI(): FFIData;
  /**
   * Consume this RecordBatch and convert to an Arrow IPC Stream buffer
   */
  intoIPCStream(): Uint8Array;
  /**
   * Override the schema of this [`RecordBatch`]
   *
   * Returns an error if `schema` is not a superset of the current schema
   * as determined by [`Schema::contains`]
   */
  withSchema(schema: Schema): RecordBatch;
  /**
   * Return a new RecordBatch where each column is sliced
   * according to `offset` and `length`
   */
  slice(offset: number, length: number): RecordBatch;
  /**
   * Returns the total number of bytes of memory occupied physically by this batch.
   */
  getArrayMemorySize(): number;
  /**
   * The number of rows in this RecordBatch.
   */
  readonly numRows: number;
  /**
   * The number of columns in this RecordBatch.
   */
  readonly numColumns: number;
  /**
   * The {@linkcode Schema} of this RecordBatch.
   */
  readonly schema: Schema;
}
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
  private constructor();
  free(): void;
}
/**
 * A named collection of types that defines the column names and types in a RecordBatch or Table
 * data structure.
 *
 * A Schema can also contain extra user-defined metadata either at the Table or Column level.
 * Column-level metadata is often used to define [extension
 * types](https://arrow.apache.org/docs/format/Columnar.html#extension-types).
 */
export class Schema {
  private constructor();
  free(): void;
  /**
   * Export this schema to an FFISchema object, which can be read with arrow-js-ffi.
   *
   * This method **does not consume** the Schema, so you must remember to call {@linkcode
   * Schema.free} to release the resources. The underlying arrays are reference counted, so
   * this method does not copy data, it only prevents the data from being released.
   */
  toFFI(): FFISchema;
  /**
   * Export this Table to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does consume** the Table, so the original Table will be
   * inaccessible after this call. You must still call {@linkcode FFITable.free} after
   * you've finished using the FFITable.
   */
  intoFFI(): FFISchema;
  /**
   * Consume this schema and convert to an Arrow IPC Stream buffer
   */
  intoIPCStream(): Uint8Array;
  /**
   * Returns an immutable reference of a specific [`Field`] instance selected using an
   * offset within the internal `fields` vector.
   */
  field(i: number): Field;
  /**
   * Returns an immutable reference of a specific [`Field`] instance selected by name.
   */
  fieldWithName(name: string): Field;
  /**
   * Sets the metadata of this `Schema` to be `metadata` and returns a new object
   */
  withMetadata(metadata: SchemaMetadata): Schema;
  /**
   * Find the index of the column with the given name.
   */
  indexOf(name: string): number;
  /**
   * Returns an immutable reference to the Map of custom metadata key-value pairs.
   */
  metadata(): SchemaMetadata;
}
/**
 * A nested datatype that contains a number of sub-fields.
 */
export class Struct {
  private constructor();
  free(): void;
}
/**
 * A Table in WebAssembly memory conforming to the Apache Arrow spec.
 *
 * A Table consists of one or more {@linkcode RecordBatch} objects plus a {@linkcode Schema} that
 * each RecordBatch conforms to.
 */
export class Table {
  private constructor();
  free(): void;
  /**
   * Access a RecordBatch from the Table by index.
   *
   * @param index The positional index of the RecordBatch to retrieve.
   * @returns a RecordBatch or `null` if out of range.
   */
  recordBatch(index: number): RecordBatch | undefined;
  recordBatches(): RecordBatch[];
  /**
   * Export this Table to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does not consume** the Table, so you must remember to call {@linkcode
   * Table.free} to release the resources. The underlying arrays are reference counted, so
   * this method does not copy data, it only prevents the data from being released.
   */
  toFFI(): FFIStream;
  /**
   * Export this Table to FFI structs according to the Arrow C Data Interface.
   *
   * This method **does consume** the Table, so the original Table will be
   * inaccessible after this call. You must still call {@linkcode FFITable.free} after
   * you've finished using the FFITable.
   */
  intoFFI(): FFIStream;
  /**
   * Consume this table and convert to an Arrow IPC Stream buffer
   */
  intoIPCStream(): Uint8Array;
  /**
   * Create a table from an Arrow IPC Stream buffer
   */
  static fromIPCStream(buf: Uint8Array): Table;
  /**
   * Returns the total number of bytes of memory occupied physically by all batches in this
   * table.
   */
  getArrayMemorySize(): number;
  /**
   * Access the Table's {@linkcode Schema}.
   */
  readonly schema: Schema;
  /**
   * The number of batches in the Table
   */
  readonly numBatches: number;
}
/**
 * A 32-bit time representing the elapsed time since midnight in the unit of `TimeUnit`.
 */
export class Time32 {
  private constructor();
  free(): void;
}
/**
 * A 64-bit time representing the elapsed time since midnight in the unit of `TimeUnit`.
 */
export class Time64 {
  private constructor();
  free(): void;
}
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
  private constructor();
  free(): void;
}
/**
 * An unsigned 16-bit integer.
 */
export class UInt16 {
  private constructor();
  free(): void;
}
/**
 * An unsigned 32-bit integer.
 */
export class UInt32 {
  private constructor();
  free(): void;
}
/**
 * An unsigned 64-bit integer.
 */
export class UInt64 {
  private constructor();
  free(): void;
}
/**
 * An unsigned 8-bit integer.
 */
export class UInt8 {
  private constructor();
  free(): void;
}
/**
 * A nested datatype that can represent slots of differing types. Components:
 *
 * 1. [`UnionFields`]
 * 2. The type of union (Sparse or Dense)
 */
export class Union {
  private constructor();
  free(): void;
}
/**
 * A variable-length string in Unicode with UTF-8 encoding
 *
 * A single Utf8 array can store up to [`i32::MAX`] bytes
 * of string data in total
 */
export class Utf8 {
  private constructor();
  free(): void;
}
export class Vector {
  private constructor();
  free(): void;
}
