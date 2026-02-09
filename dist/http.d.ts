import { IncomingMessage } from 'http';
import { HttpRequestInit, HttpRequestInput } from '@bitbeater/ecma-utils/http';
import { URL } from 'url';
export type HttpRequest = {
    input: string | URL | Request;
    init?: RequestInit;
} | string | URL;
/**
 * Downloads from url and save on fs, optimal for big files because uses streams.
 * If the file directory does not exist, it will be recursively created.
 * Once the download is complete, IncomingMessage is returned
 * @param reqOpts
 * @param file
 * @returns
 */
export declare function downloadOnFs(filePath: string, request: HttpRequestInput, requestInit?: HttpRequestInit): Promise<IncomingMessage>;
/**
 * @link https://nodejs.dev/learn/the-nodejs-http-module#httpmethods
 */
//# sourceMappingURL=http.d.ts.map