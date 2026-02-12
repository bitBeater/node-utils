"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadOnFs = downloadOnFs;
const http_1 = require("@bitbeater/ecma-utils/http");
const files_1 = require("./fs/files");
const crypto_1 = require("crypto");
// export interface HttpResponse<T> {
// 	response: IncomingMessage;
// 	data: T;
// }
// export function httpSimpleReq(
// 	reqOpts: HttpRequestOptions | string | URL,
// 	callback?: (res: IncomingMessage, payload?: unknown) => void
// ): ClientRequest {
// 	reqOpts = adaptRequestOpts(reqOpts);
// 	const reqFn = getRequestFn(reqOpts);
// 	const req = reqFn(reqOpts, callback);
// 	// req.flushHeaders();
// 	// req.end();
// 	return req;
// }
// export function httpRequest(reqOpts: HttpRequestOptions | string | URL, payload?: unknown): Promise<HttpResponse<string>> {
// 	return new Promise<HttpResponse<string>>((resolve, reject) => {
// 		const req = httpSimpleReq(reqOpts, response => {
// 			let data = '';
// 			// a data chunk has been received.
// 			response.on('data', chunk => {
// 				data += chunk.toString();
// 			});
// 			// complete response has been received.
// 			response.on('end', () => {
// 				resolve({ response, data });
// 			});
// 		}).on('error', err => {
// 			reject(err);
// 		});
// 		if (payload) req.write(payload);
// 		req.flushHeaders();
// 		req.end();
// 	});
// }
// export function httpRawRequest(reqOpts: HttpRequestOptions | string | URL, payload?: any): Promise<HttpResponse<string>> {
// 	return new Promise<HttpResponse<string>>((resolve, reject) => {
// 		reqOpts = adaptRequestOpts(reqOpts);
// 		const reqFn = getRequestFn(reqOpts);
// 		const req = reqFn(reqOpts, response => {
// 			let data = '';
// 			// a data chunk has been received.
// 			response.on('data', chunk => {
// 				data += chunk;
// 			});
// 			// complete response has been received.
// 			response.on('end', () => {
// 				resolve({ response, data });
// 			});
// 		}).on('error', err => {
// 			reject(err);
// 		});
// 		if (payload) req.write(payload);
// 		req.flushHeaders();
// 		req.end();
// 	});
// }
// export function httpJsonRequest<T>(
// 	req: HttpRequestOptions | string | URL,
// 	data?: object | string,
// 	revivers: Reviver<any>[] = []
// ): Promise<HttpResponse<T>> {
// 	const payload = JSON.stringify(data);
// 	const reqOptions = toRequestOpts(req);
// 	const headers = { ...(reqOptions.headers || {}) };
// 	headers[Header['Content-Type']] = 'application/json; charset=utf-8';
// 	headers[Header['Content-Length']] = payload?.length || 0;
// 	reqOptions.headers = headers;
// 	return httpRequest(req, payload).then(resp => {
// 		if (resp?.data?.length && resp?.response?.headers?.[Header['Content-Type'].toLowerCase()]?.includes('application/json')) {
// 			const rev = mergeRevivers(...revivers);
// 			return { ...resp, data: JSON.parse(resp.data, rev) };
// 		}
// 		return resp;
// 	});
// }
// function getProtocol(req: RequestOptions | string | URL): 'https' | 'http' {
// 	let rq = req;
// 	if (typeof rq === 'string') {
// 		rq = new URL(rq);
// 	}
// 	return rq?.protocol?.replace(/\:/gm, '') as 'https' | 'http';
// }
// export function getRequestFn(
// 	req: RequestOptions | string | URL
// ): (options: RequestOptions | string | URL, callback?: (res: IncomingMessage) => void) => ClientRequest {
// 	const protocol = getProtocol(req);
// 	if (typeof req === 'string' || req instanceof URL) {
// 		if (protocol === 'http') return get;
// 		if (protocol === 'https') return httpsGet;
// 		return get;
// 	}
// 	if (protocol === 'http') return request;
// 	if (protocol === 'https') return httpsRequest;
// 	return request;
// }
/**
 * Downloads from url and save on fs, optimal for big files because uses streams.
 * If the file directory does not exist, it will be recursively created.
 * Once the download is complete, IncomingMessage is returned
 * @param reqOpts
 * @param file
 * @returns
 */
async function downloadOnFs(filePath, request, requestInit) {
    const response = await (0, http_1.http)(request, requestInit);
    const hash = (0, crypto_1.createHash)('sha256');
    const shaProxy = new TransformStream({
        transform(chunk, controller) {
            hash.update(chunk);
            controller.enqueue(chunk);
        }
    });
    const size = await (0, files_1.streamToFile)(response.body.pipeThrough(shaProxy), filePath);
    const sha256 = hash.digest('hex');
    return { response, sha256, size };
}
//--------------------------------------------------------------------------------------------------------------------------------
// export function objToCookies(obj: any): string {
// 	let retVal = '';
// 	let cookies: string[] = [];
// 	for (const key of Object.keys(obj)) if (obj[key]) cookies.push(`${key}=${obj[key]}`);
// 	retVal = cookies.join(';');
// 	return retVal;
// }
// export function cookiesToObj(cookiesStr: string): object {
// 	if (!cookiesStr) return;
// 	let cookiesObj: any = {};
// 	let cookiesArr = cookiesStr.split(';');
// 	for (const cookieStr of cookiesArr) {
// 		const [key, value] = cookieStr.split('=');
// 		cookiesObj[key.trim()] = value.trim();
// 	}
// 	return cookiesObj;
// }
// function adaptRequestOpts(reqOpts: string | HttpRequestOptions | URL): string | RequestOptions | URL {
// 	if (!reqOpts) return;
// 	if (typeof reqOpts === 'string' || reqOpts instanceof URL) return reqOpts;
// 	if (!reqOpts.url) return reqOpts;
// 	const url = new URL(reqOpts.url);
// 	reqOpts.protocol = url.protocol;
// 	reqOpts.port = url.port;
// 	reqOpts.host = url.host;
// 	reqOpts.hostname = url.hostname;
// 	reqOpts.path = url.pathname;
// 	if (reqOpts?.searchParams) reqOpts.path += '?' + stringify(reqOpts?.searchParams);
// 	return reqOpts;
// }
// function toRequestOpts(reqOpts: string | HttpRequestOptions | URL): RequestOptions {
// 	if (!reqOpts) return;
// 	if (typeof reqOpts === 'object') return reqOpts;
// 	const url = typeof reqOpts === 'string' ? new URL(reqOpts) : reqOpts;
// 	const retVal: HttpRequestOptions = {};
// 	retVal.protocol = url.protocol;
// 	retVal.port = url.port;
// 	retVal.host = url.host;
// 	retVal.hostname = url.hostname;
// 	retVal.path = url.pathname;
// 	return retVal;
// }
//---------------------------------------------------------------------------------------------------------------------------------
/**
 * @link https://nodejs.dev/learn/the-nodejs-http-module#httpmethods
 */
// export enum Method {
// 	ACL = 'ACL',
// 	BIND = 'BIND',
// 	CHECKOUT = 'CHECKOUT',
// 	CONNECT = 'CONNECT',
// 	COPY = 'COPY',
// 	DELETE = 'DELETE',
// 	GET = 'GET',
// 	HEAD = 'HEAD',
// 	LINK = 'LINK',
// 	LOCK = 'LOCK',
// 	'M-SEARCH' = 'M-SEARCH',
// 	MERGE = 'MERGE',
// 	MKACTIVITY = 'MKACTIVITY',
// 	MKCALENDAR = 'MKCALENDAR',
// 	MKCOL = 'MKCOL',
// 	MOVE = 'MOVE',
// 	NOTIFY = 'NOTIFY',
// 	OPTIONS = 'OPTIONS',
// 	PATCH = 'PATCH',
// 	POST = 'POST',
// 	PROPFIND = 'PROPFIND',
// 	PROPPATCH = 'PROPPATCH',
// 	PURGE = 'PURGE',
// 	PUT = 'PUT',
// 	REBIND = 'REBIND',
// 	REPORT = 'REPORT',
// 	SEARCH = 'SEARCH',
// 	SUBSCRIBE = 'SUBSCRIBE',
// 	TRACE = 'TRACE',
// 	UNBIND = 'UNBIND',
// 	UNLINK = 'UNLINK',
// 	UNLOCK = 'UNLOCK',
// 	UNSUBSCRIBE = 'UNSUBSCRIBE',
// }
// /**
//  * @link https://www.iana.org/assignments/http-fields/http-fields.xhtml
//  */
// export enum Header {
// 	'Accept-Datetime' = 'Accept-Datetime',
// 	'Accept-Encoding' = 'Accept-Encoding',
// 	'Accept-Features' = 'Accept-Features',
// 	'Accept-Language' = 'Accept-Language',
// 	'Accept-Patch' = 'Accept-Patch',
// 	'Accept-Post' = 'Accept-Post',
// 	'Accept-Ranges' = 'Accept-Ranges',
// 	'Access-Control' = 'Access-Control',
// 	'Access-Control-Allow-Credentials' = 'Access-Control-Allow-Credentials',
// 	'Access-Control-Allow-Headers' = 'Access-Control-Allow-Headers',
// 	'Access-Control-Allow-Methods' = 'Access-Control-Allow-Methods',
// 	'Access-Control-Allow-Origin' = 'Access-Control-Allow-Origin',
// 	'Access-Control-Expose-Headers' = 'Access-Control-Expose-Headers',
// 	'Access-Control-Max-Age' = 'Access-Control-Max-Age',
// 	'Access-Control-Request-Headers' = 'Access-Control-Request-Headers',
// 	'Access-Control-Request-Method' = 'Access-Control-Request-Method',
// 	'Age' = 'Age',
// 	'Allow' = 'Allow',
// 	'ALPN' = 'ALPN',
// 	'Alt-Svc' = 'Alt-Svc',
// 	'Alt-Used' = 'Alt-Used',
// 	'Alternates' = 'Alternates',
// 	'AMP-Cache-Transform' = 'AMP-Cache-Transform',
// 	'Apply-To-Redirect-Ref' = 'Apply-To-Redirect-Ref',
// 	'Authentication-Control' = 'Authentication-Control',
// 	'Authentication-Info' = 'Authentication-Info',
// 	'Authorization' = 'Authorization',
// 	'C-Ext' = 'C-Ext',
// 	'C-Man' = 'C-Man',
// 	'C-Opt' = 'C-Opt',
// 	'C-PEP' = 'C-PEP',
// 	'C-PEP-Info' = 'C-PEP-Info',
// 	'Cache-Control' = 'Cache-Control',
// 	'Cache-Status' = 'Cache-Status',
// 	'Cal-Managed-ID' = 'Cal-Managed-ID',
// 	'CalDAV-Timezones' = 'CalDAV-Timezones',
// 	'CDN-Cache-Control' = 'CDN-Cache-Control',
// 	'CDN-Loop' = 'CDN-Loop',
// 	'Cert-Not-After' = 'Cert-Not-After',
// 	'Cert-Not-Before' = 'Cert-Not-Before',
// 	'Clear-Site-Data' = 'Clear-Site-Data',
// 	'Close' = 'Close',
// 	'Configuration-Context' = 'Configuration-Context',
// 	'Connection' = 'Connection',
// 	'Content-Base' = 'Content-Base',
// 	'Content-Disposition' = 'Content-Disposition',
// 	'Content-Encoding' = 'Content-Encoding',
// 	'Content-ID' = 'Content-ID',
// 	'Content-Language' = 'Content-Language',
// 	'Content-Length' = 'Content-Length',
// 	'Content-Location' = 'Content-Location',
// 	'Content-MD5' = 'Content-MD5',
// 	'Content-Range' = 'Content-Range',
// 	'Content-Script-Type' = 'Content-Script-Type',
// 	'Content-Security-Policy' = 'Content-Security-Policy',
// 	'Content-Security-Policy-Report-Only' = 'Content-Security-Policy-Report-Only',
// 	'Content-Style-Type' = 'Content-Style-Type',
// 	'Content-Transfer-Encoding' = 'Content-Transfer-Encoding',
// 	'Content-Type' = 'Content-Type',
// 	'Content-Version' = 'Content-Version',
// 	'Cookie' = 'Cookie',
// 	'Cookie2' = 'Cookie2',
// 	'Cost' = 'Cost',
// 	'Cross-Origin-Embedder-Policy' = 'Cross-Origin-Embedder-Policy',
// 	'Cross-Origin-Embedder-Policy-Report-Only' = 'Cross-Origin-Embedder-Policy-Report-Only',
// 	'Cross-Origin-Opener-Policy' = 'Cross-Origin-Opener-Policy',
// 	'Cross-Origin-Opener-Policy-Report-Only' = 'Cross-Origin-Opener-Policy-Report-Only',
// 	'Cross-Origin-Resource-Policy' = 'Cross-Origin-Resource-Policy',
// 	'DASL' = 'DASL',
// 	'Date' = 'Date',
// 	'DAV' = 'DAV',
// 	'Default-Style' = 'Default-Style',
// 	'Delta-Base' = 'Delta-Base',
// 	'Depth' = 'Depth',
// 	'Derived-From' = 'Derived-From',
// 	'Destination' = 'Destination',
// 	'Differential-ID' = 'Differential-ID',
// 	'Digest' = 'Digest',
// 	'Early-Data' = 'Early-Data',
// 	'EDIINT-Features' = 'EDIINT-Features',
// 	'ETag' = 'ETag',
// 	'Expect' = 'Expect',
// 	'Expect-CT' = 'Expect-CT',
// 	'Expires' = 'Expires',
// 	'Ext' = 'Ext',
// 	'Forwarded' = 'Forwarded',
// 	'From' = 'From',
// 	'GetProfile' = 'GetProfile',
// 	'Hobareg' = 'Hobareg',
// 	'Host' = 'Host',
// 	'HTTP2-Settings' = 'HTTP2-Settings',
// 	'If' = 'If',
// 	'If-Match' = 'If-Match',
// 	'If-Modified-Since' = 'If-Modified-Since',
// 	'If-None-Match' = 'If-None-Match',
// 	'If-Range' = 'If-Range',
// 	'If-Schedule-Tag-Match' = 'If-Schedule-Tag-Match',
// 	'If-Unmodified-Since' = 'If-Unmodified-Since',
// 	'IM' = 'IM',
// 	'Include-Referred-Token-Binding-ID' = 'Include-Referred-Token-Binding-ID',
// 	'Isolation' = 'Isolation',
// 	'Keep-Alive' = 'Keep-Alive',
// 	'Label' = 'Label',
// 	'Last-Event-ID' = 'Last-Event-ID',
// 	'Last-Modified' = 'Last-Modified',
// 	'Link' = 'Link',
// 	'Location' = 'Location',
// 	'Lock-Token' = 'Lock-Token',
// 	'Man' = 'Man',
// 	'Max-Forwards' = 'Max-Forwards',
// 	'Memento-Datetime' = 'Memento-Datetime',
// 	'Message-ID' = 'Message-ID',
// 	'Meter' = 'Meter',
// 	'Method-Check' = 'Method-Check',
// 	'Method-Check-Expires' = 'Method-Check-Expires',
// 	'MIME-Version' = 'MIME-Version',
// 	'Negotiate' = 'Negotiate',
// 	'OData-EntityId' = 'OData-EntityId',
// 	'OData-Isolation' = 'OData-Isolation',
// 	'OData-MaxVersion' = 'OData-MaxVersion',
// 	'OData-Version' = 'OData-Version',
// 	'Opt' = 'Opt',
// 	'Optional-WWW-Authenticate' = 'Optional-WWW-Authenticate',
// 	'Ordering-Type' = 'Ordering-Type',
// 	'Origin' = 'Origin',
// 	'Origin-Agent-Cluster' = 'Origin-Agent-Cluster',
// 	'OSCORE' = 'OSCORE',
// 	'OSLC-Core-Version' = 'OSLC-Core-Version',
// 	'Overwrite' = 'Overwrite',
// 	'P3P' = 'P3P',
// 	'PEP' = 'PEP',
// 	'Pep-Info' = 'Pep-Info',
// 	'PICS-Label' = 'PICS-Label',
// 	'Ping-From' = 'Ping-From',
// 	'Ping-To' = 'Ping-To',
// 	'Position' = 'Position',
// 	'Pragma' = 'Pragma',
// 	'Prefer' = 'Prefer',
// 	'Preference-Applied' = 'Preference-Applied',
// 	'Priority' = 'Priority',
// 	'ProfileObject' = 'ProfileObject',
// 	'Protocol' = 'Protocol',
// 	'Protocol-Info' = 'Protocol-Info',
// 	'Protocol-Query' = 'Protocol-Query',
// 	'Protocol-Request' = 'Protocol-Request',
// 	'Proxy-Authenticate' = 'Proxy-Authenticate',
// 	'Proxy-Authentication-Info' = 'Proxy-Authentication-Info',
// 	'Proxy-Authorization' = 'Proxy-Authorization',
// 	'Proxy-Features' = 'Proxy-Features',
// 	'Proxy-Instruction' = 'Proxy-Instruction',
// 	'Proxy-Status' = 'Proxy-Status',
// 	'Public' = 'Public',
// 	'Public-Key-Pins' = 'Public-Key-Pins',
// 	'Public-Key-Pins-Report-Only' = 'Public-Key-Pins-Report-Only',
// 	'Range' = 'Range',
// 	'Redirect-Ref' = 'Redirect-Ref',
// 	'Referer' = 'Referer',
// 	'Referer-Root' = 'Referer-Root',
// 	'Refresh' = 'Refresh',
// 	'Repeatability-Client-ID' = 'Repeatability-Client-ID',
// 	'Repeatability-First-Sent' = 'Repeatability-First-Sent',
// 	'Repeatability-Request-ID' = 'Repeatability-Request-ID',
// 	'Repeatability-Result' = 'Repeatability-Result',
// 	'Replay-Nonce' = 'Replay-Nonce',
// 	'Retry-After' = 'Retry-After',
// 	'Safe' = 'Safe',
// 	'Schedule-Reply' = 'Schedule-Reply',
// 	'Schedule-Tag' = 'Schedule-Tag',
// 	'Sec-GPC' = 'Sec-GPC',
// 	'Sec-Token-Binding' = 'Sec-Token-Binding',
// 	'Sec-WebSocket-Accept' = 'Sec-WebSocket-Accept',
// 	'Sec-WebSocket-Extensions' = 'Sec-WebSocket-Extensions',
// 	'Sec-WebSocket-Key' = 'Sec-WebSocket-Key',
// 	'Sec-WebSocket-Protocol' = 'Sec-WebSocket-Protocol',
// 	'Sec-WebSocket-Version' = 'Sec-WebSocket-Version',
// 	'Security-Scheme' = 'Security-Scheme',
// 	'Server' = 'Server',
// 	'Server-Timing' = 'Server-Timing',
// 	'Set-Cookie' = 'Set-Cookie',
// 	'Set-Cookie2' = 'Set-Cookie2',
// 	'SetProfile' = 'SetProfile',
// 	'SLUG' = 'SLUG',
// 	'SoapAction' = 'SoapAction',
// 	'Status-URI' = 'Status-URI',
// 	'Strict-Transport-Security' = 'Strict-Transport-Security',
// 	'Sunset' = 'Sunset',
// 	'Surrogate-Capability' = 'Surrogate-Capability',
// 	'Surrogate-Control' = 'Surrogate-Control',
// 	'TCN' = 'TCN',
// 	'TE' = 'TE',
// 	'Timeout' = 'Timeout',
// 	'Timing-Allow-Origin' = 'Timing-Allow-Origin',
// 	'Title' = 'Title',
// 	'Topic' = 'Topic',
// 	'Traceparent' = 'Traceparent',
// 	'Tracestate' = 'Tracestate',
// 	'Trailer' = 'Trailer',
// 	'Transfer-Encoding' = 'Transfer-Encoding',
// 	'TTL' = 'TTL',
// 	'Upgrade' = 'Upgrade',
// 	'Urgency' = 'Urgency',
// 	'URI' = 'URI',
// 	'User-Agent' = 'User-Agent',
// 	'Variant-Vary' = 'Variant-Vary',
// 	'Vary' = 'Vary',
// 	'Version' = 'Version',
// 	'Via' = 'Via',
// 	'Want-Digest' = 'Want-Digest',
// 	'Warning' = 'Warning',
// 	'WWW-Authenticate' = 'WWW-Authenticate',
// 	'X-Content-Type-Options' = 'X-Content-Type-Options',
// 	'X-Device-Accept' = 'X-Device-Accept',
// 	'X-Device-Accept-Charset' = 'X-Device-Accept-Charset',
// 	'X-Device-Accept-Encoding' = 'X-Device-Accept-Encoding',
// 	'X-Device-Accept-Language' = 'X-Device-Accept-Language',
// 	'X-Device-User-Agent' = 'X-Device-User-Agent',
// 	'X-Frame-Options' = 'X-Frame-Options',
// 	'*' = '*',
// }
//# sourceMappingURL=http.js.map