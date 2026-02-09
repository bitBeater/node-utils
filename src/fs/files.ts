import { Abortable } from 'events';
import {
	closeSync,
	copyFileSync,
	createWriteStream,
	existsSync,
	FSWatcher,
	mkdirSync,
	Mode,
	ObjectEncodingOptions,
	OpenMode,
	openSync,
	PathLike,
	readFileSync,
	readSync,
	rmSync,
	statSync,
	unlinkSync,
	watch,
	WriteFileOptions,
	writeFileSync
} from 'fs';
import { appendFile, FileHandle, FlagAndOpenMode, mkdir, readFile, stat, unlink, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { Stream } from 'stream';

import { createHash } from 'crypto';
import { gzipSync, unzipSync, ZlibOptions } from 'zlib';
import { Reviver, Replacer } from '@bitbeater/ecma-utils/revivers';
import { of } from '@bitbeater/ecma-utils/promises';
// import { promises, reviver } from 'iggs-utils';

/** *
 * If `data` is a plain object, it must have an own (not inherited) `toString`function property.
 *
 * The `mode` option only affects the newly created file. See {@link open} for more details.
 *
 * For detailed information, see the documentation of the asynchronous version of
 * this API: {@link writeFile}.
 * @param file filename or file descriptor
 */
export function writeSync(file: PathLike, data?: string | NodeJS.ArrayBufferView, options?: WriteFileOptions) {
	const dirPath = dirname(file.toString());
	if (!existsSync(dirPath)) mkdirSync(dirname(dirPath));
	writeFileSync(file, data || '');
}

/**
 * Writes the given object as JSON to the specified file path synchronously.
 * @param path - The file path where the JSON should be written.
 * @param object - The object to be written as JSON.
 */
export function writeJsonSync(path: string, object: any) {
	writeFileSync(path, JSON.stringify(object));
}

/**
 * Reads and parses a JSON file synchronously.
 *
 * @template T - The type of the parsed JSON object.
 * @param {string} path - The path to the JSON file.
 * @param {reviver.Reviver<any>} [reviver] - Optional reviver function for JSON.parse.
 * @returns {T} - The parsed JSON object.
 */
export function readJsonSync<T>(path: string, reviver?: Reviver<any>): T {
	const data = readFileSync(path);
	if (!data) return;

	const retVal = JSON.parse(data.toString(), reviver);

	return retVal;
}

/**
 * Inserts the specified data between the given placeholders in the file synchronously.
 * If the file does not exist, it creates the file and inserts the data.
 *
 * @param filePath - The path of the file.
 * @param data - The data to be inserted between the placeholders.
 * @param beginPlaceHolder - The beginning placeholder.
 * @param endPlaceHolder - The ending placeholder.
 */
export function insertBetweenPlacweHoldersSync(filePath: string, data: string, beginPlaceHolder: string, endPlaceHolder: string) {
	const writeData = readFileSync(filePath, 'utf-8');
	if (!existsSync(filePath)) {
		writeFileSync(filePath, writeData);
	}

	const fileContent = readFileSync(filePath).toString();

	const top = fileContent?.split?.(beginPlaceHolder)?.[0];
	const bottom = fileContent?.split?.(endPlaceHolder).reverse?.()?.[0];

	writeFileSync(filePath, `${top}\n\r${beginPlaceHolder}\n\r${data}\n\r${endPlaceHolder}\n\r${bottom}`);
}

/**
 * Reads a file and returns an array of string lines.
 *
 * @param path - The path to the file.
 * @param lineSeparator - The regular expression used to split the file into lines. Defaults to /[\n|\r]/.
 * @returns An array of lines from the file, or null if the file cannot be read.
 */
export function fileLinesSync(path: string, lineSeparator = /[\n|\r]/): string[] {
	try {
		const data = readFileSync(path)?.toString();
		if (!data) return null;
		return data.split(lineSeparator);
	} catch (error) {
		console.error(error);
	}
}

/**
 * Writes the given data to a file in GZip format synchronously.
 *
 * @param filePath - The path to the file.
 * @param data - The data to be written to the file. It can be a string or a Buffer.
 * @param writeFileOptions - The options for writing the file (optional).
 * @param zLibOptions - The options for compressing the data using zlib (optional).
 */
export function writeGZipSync(
	filePath: string,
	data: string | Buffer,
	writeFileOptions?: WriteFileOptions,
	zLibOptions?: ZlibOptions
) {
	const buffer = data instanceof Buffer ? data : Buffer.from(data);
	const zippBuffer = gzipSync((buffer as unknown as ArrayBuffer), zLibOptions) as unknown as any;
	writeFileSync(filePath, zippBuffer, writeFileOptions);
}

/**
 * Reads a gzipped file synchronously and returns the uncompressed data as a Buffer.
 *
 * @param path - The path to the gzipped file.
 * @param readFileOptions - The options to pass to the `readFileSync` function.
 * @param zlibOptions - The options to pass to the `unzipSync` function.
 * @returns The uncompressed data as a Buffer.
 */
export function readGZipSync(
	path: string,
	readFileOptions?: { encoding?: null; flag?: string },
	zlibOptions?: ZlibOptions
): Buffer {
	const data = readFileSync(path, readFileOptions);
	return unzipSync(data as any, zlibOptions);
}

/**
 * Serializes an object to JSON and writes it to a file synchronously.
 * @param filePath - The path of the file to write.
 * @param object - The object to serialize and write to the file.
 */
export function serealizeObjectSync(filePath: string, object: any) {
	writeGZipSync(filePath, JSON.stringify(object));
}

/**
 * Deserializes an object from a file synchronously.
 * 
 * @param filePath - The path to the file.
 * @returns The deserialized object.
 */
export function deserealizeObjectSync(filePath: string) {
	return JSON.parse(readGZipSync(filePath).toString());
}

/**
 * Synchronous [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2.html). Returns `undefined`.
 * @return `undefined` upon success.
 * @see {@link unlinkSync}
 */
export function removeSync(path: PathLike): void {
	try {
		unlinkSync(path);
	} catch (e: any) {
		if (e?.code !== 'ENOENT') throw e;
	}
}

/**
 * check if file exists
 *
 *
 * @param path file path
 * @returns true if exists false otherwise
 *
 * @see{@link stat}
 */
export const exists = (path: PathLike): Promise<boolean> =>
	stat(path)
		.then(() => true)
		.catch(e => {
			if (e?.code === 'ENOENT') return false;
			throw e;
		});

/**
 * add to file, if the file or folder does not exist it will be recursively created
 * @param path
 * @param data
 * @param options
 * @returns
 */
export function append(
	path: PathLike | FileHandle,
	data: string | Uint8Array,
	options?: (ObjectEncodingOptions & FlagAndOpenMode) | BufferEncoding | null
): Promise<void> {
	return appendFile(path, data, options).catch(error => {
		if (error.code === 'ENOENT')
			return mkdir(dirname(path.toString()), { recursive: true }).then(() => append(path, data, options));
		return error;
	});
}

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
export function write(
	file: PathLike | FileHandle,
	data?:
		| string
		| NodeJS.ArrayBufferView
		| Iterable<string | NodeJS.ArrayBufferView>
		| AsyncIterable<string | NodeJS.ArrayBufferView>
		| Stream,
	options?:
		| (ObjectEncodingOptions & {
			mode?: Mode | undefined;
			flag?: OpenMode | undefined;
		} & Abortable)
		| BufferEncoding
		| null
): Promise<void> {
	const dirPath = dirname(file.toString());
	return exists(dirPath).then(exist => {
		const _opt = typeof options === 'string' ? { encoding: options } : options;
		let promise = of();
		if (!exist) promise = mkdir(dirPath, { ..._opt, recursive: true });
		return promise.then(() => writeFile(file, data || '', options));
	});
}

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
export function readJson<T>(
	file: PathLike | FileHandle,
	options?:
		| ({
			encoding?: null | undefined;
			flag?: OpenMode | undefined;
		} & Abortable)
		| null,
	reviver?: Reviver<any>
): Promise<T> {
	return readFile(file, options).then(fileContent => JSON.parse(fileContent.toString(), reviver) as T);
}

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
export function writeJson(
	file: PathLike | FileHandle,
	obj: any,
	options?:
		| (ObjectEncodingOptions & {
			mode?: Mode | undefined;
			flag?: OpenMode | undefined;
		} & Abortable)
		| BufferEncoding
		| null,
	replacer?: Replacer<any>,
	space?: string | number
): Promise<void> {
	const data = JSON.stringify(obj, replacer as any, space);
	return write(file, data, options);
}

/**
 * If `path` refers to a symbolic link, then the link is removed without affecting
 * the file or directory to which that link refers. If the `path` refers to a file
 * path that is not a symbolic link, the file is deleted. See the POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2.html) documentation for more detail.
 * @return Fulfills with `undefined` upon success.
 * @see {@link unlink}
 */
export function remove(path: PathLike): Promise<void> {
	return unlink(path).catch(e => (e.code === 'ENOENT' ? undefined : e));
}



/**
 * Writes data to a file and creates the necessary directory structure if it doesn't exist.
 *
 * @param path - The path to the file.
 * @param data - The data to write to the file.
 * @param options - The options for writing the file.
 */
export function writeFileAndDir(path: string, data?: Uint8Array | string, options?: WriteFileOptions) {
	const parentDir = resolve(path, '..');

	if (!existsSync(parentDir)) {
		mkdirSync(parentDir, { recursive: true });
	}

	data = typeof data === 'string' ? new TextEncoder().encode(data) : data;
	writeFileSync(path, data, options);
}

export function copyFileRecursive(origPath: string, destPath: string) {

	const destParentDir = resolve(destPath, '..');

	if (!existsSync(destParentDir)) {
		mkdirSync(destParentDir, { recursive: true });
	}

	copyFileSync(origPath, destPath);
}




/**
 * remove sync, without throwing NotFound error if it doesn't exist
 * @param path
 * @param options
 */
export function silentRemove(path: string | URL, options?: FileSystemRemoveOptions) {

	try {
		rmSync(path, options);
	} catch (error: any) {
		if ((error.code !== 'ENOENT')) throw error;
	}
}

/**
 * Calculates the SHA256 hash of a file.
 * 
 * @param filePath - The path to the file.
 * @returns The SHA256 hash of the file as a hexadecimal string.
 */
export function sha256(filePath: string): string {

	const hash = createHash('sha256');
	const input = readFileSync(filePath);
	hash.update(input as any);

	return hash.digest('hex');
}


/**
 * Tails a file and calls the callback with new data when the file is appended.
 * @param filePath 
 * @param cb 
 * @returns 
 */

export function tail(filePath: string, cb: (chunk: Uint8Array) => void) {
	let previousFileSize = statSync(filePath).size;
	let previousCheckTime = 0;

	return watch(filePath, () => {
		if (previousCheckTime === Date.now()) return;

		previousCheckTime = Date.now();

		const fileSize = statSync(filePath).size;
		if (fileSize === 0) return;

		const tailSize = fileSize - previousFileSize;
		previousFileSize = fileSize;

		if (tailSize <= 0) return;

		const buffer = new Uint8Array(tailSize);
		const fd = openSync(filePath, 'r');
		readSync(fd, buffer, 0, tailSize, fileSize - tailSize);
		closeSync(fd);

		cb(buffer);
	});
}

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

export function tailStream(filePath: string): [ReadableStream<Uint8Array>, () => void] {
	var fileWatcher: FSWatcher;
	var _controller: ReadableStreamDefaultController<Uint8Array>;



	const tailReadStream = new ReadableStream<Uint8Array>({
		start(controller) {
			_controller = controller;

			fileWatcher = tail(filePath, chunk => {
				controller.enqueue(chunk);
			});
		},
	});

	const stopTail = () => {
		_controller?.close();
		fileWatcher?.close();
	};

	return [tailReadStream, stopTail];
}

/**
 * Streams data to a file, creating the file and necessary directories if they do not exist.
 * The function handles backpressure by pausing the readable stream when the writable stream's internal buffer is full, and resuming it when the buffer is drained.
 * 
 * @param readableStream 
 * @param filePath 
 * @returns 
 */
export async function streamToFile(readableStream: ReadableStream<Uint8Array>, filePath: string): Promise<number> {
	if (!existsSync(dirname(filePath))) {
		mkdirSync(dirname(filePath), { recursive: true });
	}

	let writtenBytes = 0;
	const writableStream = createWriteStream(filePath);

	try {
		for await (const chunk of readableStream) {
			const canContinue = writableStream.write(chunk);

			// Apply backpressure if needed
			if (!canContinue) {
				await new Promise<void>(resolve => writableStream.once('drain', resolve));
			}

			writtenBytes += chunk.length;
		}

		// Wait for stream to finish
		await new Promise<void>((resolve, reject) => {
			writableStream.end();
			writableStream.on('finish', resolve);
			writableStream.on('error', reject);
		});

		return writtenBytes;
	} catch (err) {
		writableStream.destroy();
		throw err;
	}
}