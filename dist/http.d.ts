import { HttpRequestInit, HttpRequestInput } from '@bitbeater/ecma-utils/http';
/**
 * Downloads from url and save on fs, optimal for big files because uses streams.
 * If the file directory does not exist, it will be recursively created.
 * Once the download is complete, IncomingMessage is returned
 * @param reqOpts
 * @param file
 * @returns
 */
export declare function downloadOnFs(filePath: string, request: HttpRequestInput, requestInit?: HttpRequestInit): Promise<{
    response: Response;
    sha256: string;
    size: number;
}>;
/**
 * @link https://nodejs.dev/learn/the-nodejs-http-module#httpmethods
 */
//# sourceMappingURL=http.d.ts.map