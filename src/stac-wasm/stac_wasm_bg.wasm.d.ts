/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const arrowToStacJson: (a: any) => [number, number, number];
export const __wbg_null_free: (a: number, b: number) => void;
export const __wbg_boolean_free: (a: number, b: number) => void;
export const __wbg_int8_free: (a: number, b: number) => void;
export const __wbg_int16_free: (a: number, b: number) => void;
export const __wbg_int32_free: (a: number, b: number) => void;
export const __wbg_int64_free: (a: number, b: number) => void;
export const __wbg_uint8_free: (a: number, b: number) => void;
export const __wbg_uint16_free: (a: number, b: number) => void;
export const __wbg_uint32_free: (a: number, b: number) => void;
export const __wbg_uint64_free: (a: number, b: number) => void;
export const __wbg_float16_free: (a: number, b: number) => void;
export const __wbg_float32_free: (a: number, b: number) => void;
export const __wbg_float64_free: (a: number, b: number) => void;
export const __wbg_timestamp_free: (a: number, b: number) => void;
export const __wbg_date32_free: (a: number, b: number) => void;
export const __wbg_date64_free: (a: number, b: number) => void;
export const __wbg_time32_free: (a: number, b: number) => void;
export const __wbg_time64_free: (a: number, b: number) => void;
export const __wbg_duration_free: (a: number, b: number) => void;
export const __wbg_interval_free: (a: number, b: number) => void;
export const __wbg_binary_free: (a: number, b: number) => void;
export const __wbg_fixedsizebinary_free: (a: number, b: number) => void;
export const __wbg_largebinary_free: (a: number, b: number) => void;
export const __wbg_utf8_free: (a: number, b: number) => void;
export const __wbg_largeutf8_free: (a: number, b: number) => void;
export const __wbg_list_free: (a: number, b: number) => void;
export const __wbg_fixedsizelist_free: (a: number, b: number) => void;
export const __wbg_largelist_free: (a: number, b: number) => void;
export const __wbg_struct_free: (a: number, b: number) => void;
export const __wbg_union_free: (a: number, b: number) => void;
export const __wbg_dictionary_free: (a: number, b: number) => void;
export const __wbg_decimal128_free: (a: number, b: number) => void;
export const __wbg_decimal256_free: (a: number, b: number) => void;
export const __wbg_map__free: (a: number, b: number) => void;
export const __wbg_runendencoded_free: (a: number, b: number) => void;
export const __wbg_recordbatch_free: (a: number, b: number) => void;
export const recordbatch_numRows: (a: number) => number;
export const recordbatch_numColumns: (a: number) => number;
export const recordbatch_schema: (a: number) => number;
export const recordbatch_toFFI: (a: number) => [number, number, number];
export const recordbatch_intoFFI: (a: number) => [number, number, number];
export const recordbatch_intoIPCStream: (
  a: number,
) => [number, number, number, number];
export const recordbatch_withSchema: (
  a: number,
  b: number,
) => [number, number, number];
export const recordbatch_slice: (a: number, b: number, c: number) => number;
export const recordbatch_getArrayMemorySize: (a: number) => number;
export const __wbg_table_free: (a: number, b: number) => void;
export const table_schema: (a: number) => number;
export const table_recordBatch: (a: number, b: number) => number;
export const table_recordBatches: (a: number) => [number, number];
export const table_numBatches: (a: number) => number;
export const table_toFFI: (a: number) => [number, number, number];
export const table_intoFFI: (a: number) => [number, number, number];
export const table_intoIPCStream: (
  a: number,
) => [number, number, number, number];
export const table_fromIPCStream: (
  a: number,
  b: number,
) => [number, number, number];
export const table_getArrayMemorySize: (a: number) => number;
export const __wbg_data_free: (a: number, b: number) => void;
export const data_toFFI: (a: number) => [number, number, number];
export const data_toTypedArray: (a: number) => [number, number, number];
export const __wbg_ffischema_free: (a: number, b: number) => void;
export const ffischema_addr: (a: number) => number;
export const __wbg_ffidata_free: (a: number, b: number) => void;
export const ffidata_arrayAddr: (a: number) => number;
export const ffidata_schemaAddr: (a: number) => number;
export const __wbg_schema_free: (a: number, b: number) => void;
export const schema_toFFI: (a: number) => [number, number, number];
export const schema_intoFFI: (a: number) => [number, number, number];
export const schema_intoIPCStream: (
  a: number,
) => [number, number, number, number];
export const schema_field: (a: number, b: number) => number;
export const schema_fieldWithName: (
  a: number,
  b: number,
  c: number,
) => [number, number, number];
export const schema_withMetadata: (
  a: number,
  b: any,
) => [number, number, number];
export const schema_indexOf: (
  a: number,
  b: number,
  c: number,
) => [number, number, number];
export const schema_metadata: (a: number) => [number, number, number];
export const __wbg_field_free: (a: number, b: number) => void;
export const field_toFFI: (a: number) => [number, number, number];
export const field_name: (a: number) => [number, number];
export const field_withName: (
  a: number,
  b: number,
  c: number,
) => [number, number, number];
export const field_dataType: (a: number) => [number, number, number];
export const field_isNullable: (a: number) => number;
export const field_metadata: (a: number) => [number, number, number];
export const field_withMetadata: (
  a: number,
  b: any,
) => [number, number, number];
export const __wbg_ffistream_free: (a: number, b: number) => void;
export const ffistream_numArrays: (a: number) => number;
export const ffistream_schemaAddr: (a: number) => number;
export const ffistream_arrayAddr: (a: number, b: number) => number;
export const ffistream_arrayAddrs: (a: number) => [number, number];
export const ffistream_drop: (a: number) => void;
export const __wbg_vector_free: (a: number, b: number) => void;
export const wasmMemory: () => any;
export const _functionTable: () => any;
export const __wbindgen_malloc: (a: number, b: number) => number;
export const __wbindgen_realloc: (
  a: number,
  b: number,
  c: number,
  d: number,
) => number;
export const __externref_table_alloc: () => number;
export const __wbindgen_export_3: WebAssembly.Table;
export const __wbindgen_exn_store: (a: number) => void;
export const __wbindgen_export_5: WebAssembly.Table;
export const __externref_table_dealloc: (a: number) => void;
export const __wbindgen_free: (a: number, b: number, c: number) => void;
export const __externref_drop_slice: (a: number, b: number) => void;
export const __wbindgen_start: () => void;
