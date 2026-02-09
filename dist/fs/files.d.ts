import { Abortable } from 'events';
import { FSWatcher, Mode, ObjectEncodingOptions, OpenMode, PathLike, WriteFileOptions } from 'fs';
import { FileHandle, FlagAndOpenMode } from 'fs/promises';
import { Stream } from 'stream';
import { ZlibOptions } from 'zlib';
import { Reviver, Replacer } from '@bitbeater/ecma-utils/revivers';
/** *
 * If `data` is a plain object, it must have an own (not inherited) `toString`function property.
 *
 * The `mode` option only affects the newly created file. See {@link open} for more details.
 *
 * For detailed information, see the documentation of the asynchronous version of
 * this API: {@link writeFile}.
 * @param file filename or file descriptor
 */
export declare function writeSync(file: PathLike, data?: string | NodeJS.ArrayBufferView, options?: WriteFileOptions): void;
/**
 * Writes the given object as JSON to the specified file path synchronously.
 * @param path - The file path where the JSON should be written.
 * @param object - The object to be written as JSON.
 */
export declare function writeJsonSync(path: string, object: any): void;
/**
 * Reads and parses a JSON file synchronously.
 *
 * @template T - The type of the parsed JSON object.
 * @param {string} path - The path to the JSON file.
 * @param {reviver.Reviver<any>} [reviver] - Optional reviver function for JSON.parse.
 * @returns {T} - The parsed JSON object.
 */
export declare function readJsonSync<T>(path: string, reviver?: Reviver<any>): T;
/**
 * Inserts the specified data between the given placeholders in the file synchronously.
 * If the file does not exist, it creates the file and inserts the data.
 *
 * @param filePath - The path of the file.
 * @param data - The data to be inserted between the placeholders.
 * @param beginPlaceHolder - The beginning placeholder.
 * @param endPlaceHolder - The ending placeholder.
 */
export declare function insertBetweenPlacweHoldersSync(filePath: string, data: string, beginPlaceHolder: string, endPlaceHolder: string): void;
/**
 * Reads a file and returns an array of string lines.
 *
 * @param path - The path to the file.
 * @param lineSeparator - The regular expression used to split the file into lines. Defaults to /[\n|\r]/.
 * @returns An array of lines from the file, or null if the file cannot be read.
 */
export declare function fileLinesSync(path: string, lineSeparator?: RegExp): string[];
/**
 * Writes the given data to a file in GZip format synchronously.
 *
 * @param filePath - The path to the file.
 * @param data - The data to be written to the file. It can be a string or a Buffer.
 * @param writeFileOptions - The options for writing the file (optional).
 * @param zLibOptions - The options for compressing the data using zlib (optional).
 */
export declare function writeGZipSync(filePath: string, data: string | Buffer, writeFileOptions?: WriteFileOptions, zLibOptions?: ZlibOptions): void;
/**
 * Reads a gzipped file synchronously and returns the uncompressed data as a Buffer.
 *
 * @param path - The path to the gzipped file.
 * @param readFileOptions - The options to pass to the `readFileSync` function.
 * @param zlibOptions - The options to pass to the `unzipSync` function.
 * @returns The uncompressed data as a Buffer.
 */
export declare function readGZipSync(path: string, readFileOptions?: {
    encoding?: null;
    flag?: string;
}, zlibOptions?: ZlibOptions): Buffer;
/**
 * Serializes an object to JSON and writes it to a file synchronously.
 * @param filePath - The path of the file to write.
 * @param object - The object to serialize and write to the file.
 */
export declare function serealizeObjectSync(filePath: string, object: any): void;
/**
 * Deserializes an object from a file synchronously.
 *
 * @param filePath - The path to the file.
 * @returns The deserialized object.
 */
export declare function deserealizeObjectSync(filePath: string): any;
/**
 * Synchronous [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2.html). Returns `undefined`.
 * @return `undefined` upon success.
 * @see {@link unlinkSync}
 */
export declare function removeSync(path: PathLike): void;
/**
 * check if file exists
 *
 *
 * @param path file path
 * @returns true if exists false otherwise
 *
 * @see{@link stat}
 */
export declare const exists: (path: PathLike) => Promise<boolean>;
/**
 * add to file, if the file or folder does not exist it will be recursively created
 * @param path
 * @param data
 * @param options
 * @returns
 */
export declare function append(path: PathLike | FileHandle, data: string | Uint8Array, options?: (ObjectEncodingOptions & FlagAndOpenMode) | BufferEncoding | null): Promise<void>;
/**
 * write to file, if the folder does not exist it will be recursively created
 *
 * @param file filename or `FileHandle`
 * @param data
 * @param options
 * @return Fulfills with `undefined` upon success.
 *
 *
 * @see{@link exists}
 * @see{@link mkdir}
 * @see{@link writeFile}
 */
export declare function write(file: PathLike | FileHandle, data?: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream, options?: (ObjectEncodingOptions & {
    mode?: Mode | undefined;
    flag?: OpenMode | undefined;
} & Abortable) | BufferEncoding | null): Promise<void>;
/**
 * Asynchronously reads the entire contents of a file that contains a valid JSON string, and converts the content into an object.
 *
 * @param file filename or `FileHandle`
 * @param options
 * @param reviver A function that transforms the results. This function is called for each member of the object.
 * If a member contains nested objects, the nested objects are transformed before the parent object is.
 *
 * @see{@link readFile}
 * @see{@link JSON.parse}
 */
export declare function readJson<T>(file: PathLike | FileHandle, options?: ({
    encoding?: null | undefined;
    flag?: OpenMode | undefined;
} & Abortable) | null, reviver?: Reviver<any>): Promise<T>;
/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string, and asynchronously writes data to a file, replacing the file if it already exists.
 *
 * @param file filename or `FileHandle`
 * @param obj A JavaScript value, usually an object or array, to be converted.
 * @param replacer A function that transforms the results.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 * @returns
 * @see {@link JSON.stringify}
 * @see {@link write}
 */
export declare function writeJson(file: PathLike | FileHandle, obj: any, options?: (ObjectEncodingOptions & {
    mode?: Mode | undefined;
    flag?: OpenMode | undefined;
} & Abortable) | BufferEncoding | null, replacer?: Replacer<any>, space?: string | number): Promise<void>;
/**
 * If `path` refers to a symbolic link, then the link is removed without affecting
 * the file or directory to which that link refers. If the `path` refers to a file
 * path that is not a symbolic link, the file is deleted. See the POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2.html) documentation for more detail.
 * @return Fulfills with `undefined` upon success.
 * @see {@link unlink}
 */
export declare function remove(path: PathLike): Promise<void>;
/**
 * Writes data to a file and creates the necessary directory structure if it doesn't exist.
 *
 * @param path - The path to the file.
 * @param data - The data to write to the file.
 * @param options - The options for writing the file.
 */
export declare function writeFileAndDir(path: string, data?: Uint8Array | string, options?: WriteFileOptions): void;
export declare function copyFileRecursive(origPath: string, destPath: string): void;
/**
 * remove sync, without throwing NotFound error if it doesn't exist
 * @param path
 * @param options
 */
export declare function silentRemove(path: string | URL, options?: FileSystemRemoveOptions): void;
/**
 * Calculates the SHA256 hash of a file.
 *
 * @param filePath - The path to the file.
 * @returns The SHA256 hash of the file as a hexadecimal string.
 */
export declare function sha256(filePath: string): string;
/**
 * Tails a file and calls the callback with new data when the file is appended.
 * @param filePath
 * @param cb
 * @returns
 */
export declare function tail(filePath: string, cb: (chunk: Uint8Array) => void): FSWatcher;
/**
 * Creates a readable stream that tails a file, emitting new data as it is appended.
 * @example
 * ```ts
 * const [readableTailStream, stopTailFn] = tailStream('path/to/file.txt');
 * for await (const chunk of readableTailStream) {
 *    console.log('New data appended:', Buffer.from(chunk).toString());
 * }
 *
 * // To stop tailing the file, call the stopTailFn() function
 * ```
 *
 * @param filePath
 * @param cb
 * @returns  A tuple containing the readable stream and a cancel function to stop tailing the file.
 */
export declare function tailStream(filePath: string): [ReadableStream<Uint8Array>, () => void];
/**
 * Streams data to a file, creating the file and necessary directories if they do not exist.
 * The function handles backpressure by pausing the readable stream when the writable stream's internal buffer is full, and resuming it when the buffer is drained.
 *
 * @param readableStream
 * @param filePath
 * @returns
 */
export declare function streamToFile(readableStream: ReadableStream<Uint8Array>, filePath: string): Promise<number>;
//# sourceMappingURL=files.d.ts.map