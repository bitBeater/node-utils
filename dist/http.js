"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = exports.Method = void 0;
exports.httpSimpleReq = httpSimpleReq;
exports.httpRequest = httpRequest;
exports.httpRawRequest = httpRawRequest;
exports.httpJsonRequest = httpJsonRequest;
exports.getRequestFn = getRequestFn;
exports.downloadOnFs = downloadOnFs;
exports.objToCookies = objToCookies;
exports.cookiesToObj = cookiesToObj;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const http_1 = require("http");
const https_1 = require("https");
const revivers_1 = require("@bitbeater/ecma-utils/revivers");
const path_1 = require("path");
const querystring_1 = require("querystring");
const url_1 = require("url");
function httpSimpleReq(reqOpts, callback) {
    reqOpts = adaptRequestOpts(reqOpts);
    const reqFn = getRequestFn(reqOpts);
    const req = reqFn(reqOpts, callback);
    // req.flushHeaders();
    // req.end();
    return req;
}
function httpRequest(reqOpts, payload) {
    return new Promise((resolve, reject) => {
        const req = httpSimpleReq(reqOpts, response => {
            let data = '';
            // a data chunk has been received.
            response.on('data', chunk => {
                data += chunk.toString();
            });
            // complete response has been received.
            response.on('end', () => {
                resolve({ response, data });
            });
        }).on('error', err => {
            reject(err);
        });
        if (payload)
            req.write(payload);
        req.flushHeaders();
        req.end();
    });
}
function httpRawRequest(reqOpts, payload) {
    return new Promise((resolve, reject) => {
        reqOpts = adaptRequestOpts(reqOpts);
        const reqFn = getRequestFn(reqOpts);
        const req = reqFn(reqOpts, response => {
            let data = '';
            // a data chunk has been received.
            response.on('data', chunk => {
                data += chunk;
            });
            // complete response has been received.
            response.on('end', () => {
                resolve({ response, data });
            });
        }).on('error', err => {
            reject(err);
        });
        if (payload)
            req.write(payload);
        req.flushHeaders();
        req.end();
    });
}
function httpJsonRequest(req, data, revivers = []) {
    const payload = JSON.stringify(data);
    const reqOptions = toRequestOpts(req);
    const headers = { ...(reqOptions.headers || {}) };
    headers[Header['Content-Type']] = 'application/json; charset=utf-8';
    headers[Header['Content-Length']] = payload?.length || 0;
    reqOptions.headers = headers;
    return httpRequest(req, payload).then(resp => {
        if (resp?.data?.length && resp?.response?.headers?.[Header['Content-Type'].toLowerCase()]?.includes('application/json')) {
            const rev = (0, revivers_1.mergeRevivers)(...revivers);
            return { ...resp, data: JSON.parse(resp.data, rev) };
        }
        return resp;
    });
}
function getProtocol(req) {
    let rq = req;
    if (typeof rq === 'string') {
        rq = new url_1.URL(rq);
    }
    return rq?.protocol?.replace(/\:/gm, '');
}
function getRequestFn(req) {
    const protocol = getProtocol(req);
    if (typeof req === 'string' || req instanceof url_1.URL) {
        if (protocol === 'http')
            return http_1.get;
        if (protocol === 'https')
            return https_1.get;
        return http_1.get;
    }
    if (protocol === 'http')
        return http_1.request;
    if (protocol === 'https')
        return https_1.request;
    return http_1.request;
}
/**
 * Downloads from url and save on fs, optimal for big files because uses streams.
 * If the file directory does not exist, it will be recursively created.
 * Once the download is complete, IncomingMessage is returned
 * @param reqOpts
 * @param file
 * @returns
 */
function downloadOnFs(reqOpts, file, body) {
    const dirPath = (0, path_1.dirname)(file.toString());
    return new Promise((resolve, reject) => {
        (0, promises_1.stat)(dirPath)
            .catch(err => {
            if (err.code === 'ENOENT') {
                return (0, promises_1.mkdir)(dirPath, { recursive: true });
            }
            else
                reject(err);
        })
            .then(() => {
            const fsWriteStream = (0, fs_1.createWriteStream)(file);
            const req = httpSimpleReq(reqOpts, (res) => {
                res
                    .pipe(fsWriteStream)
                    .on('error', e => reject(e))
                    .on('finish', () => resolve(res));
            });
            req.on('error', e => reject(e));
            if (body)
                req.write(body);
            req.flushHeaders();
            req.end();
        });
    });
}
//--------------------------------------------------------------------------------------------------------------------------------
function objToCookies(obj) {
    let retVal = '';
    let cookies = [];
    for (const key of Object.keys(obj))
        if (obj[key])
            cookies.push(`${key}=${obj[key]}`);
    retVal = cookies.join(';');
    return retVal;
}
function cookiesToObj(cookiesStr) {
    if (!cookiesStr)
        return;
    let cookiesObj = {};
    let cookiesArr = cookiesStr.split(';');
    for (const cookieStr of cookiesArr) {
        const [key, value] = cookieStr.split('=');
        cookiesObj[key.trim()] = value.trim();
    }
    return cookiesObj;
}
function adaptRequestOpts(reqOpts) {
    if (!reqOpts)
        return;
    if (typeof reqOpts === 'string' || reqOpts instanceof url_1.URL)
        return reqOpts;
    if (!reqOpts.url)
        return reqOpts;
    const url = new url_1.URL(reqOpts.url);
    reqOpts.protocol = url.protocol;
    reqOpts.port = url.port;
    reqOpts.host = url.host;
    reqOpts.hostname = url.hostname;
    reqOpts.path = url.pathname;
    if (reqOpts?.searchParams)
        reqOpts.path += '?' + (0, querystring_1.stringify)(reqOpts?.searchParams);
    return reqOpts;
}
function toRequestOpts(reqOpts) {
    if (!reqOpts)
        return;
    if (typeof reqOpts === 'object')
        return reqOpts;
    const url = typeof reqOpts === 'string' ? new url_1.URL(reqOpts) : reqOpts;
    const retVal = {};
    retVal.protocol = url.protocol;
    retVal.port = url.port;
    retVal.host = url.host;
    retVal.hostname = url.hostname;
    retVal.path = url.pathname;
    return retVal;
}
//---------------------------------------------------------------------------------------------------------------------------------
/**
 * @link https://nodejs.dev/learn/the-nodejs-http-module#httpmethods
 */
var Method;
(function (Method) {
    Method["ACL"] = "ACL";
    Method["BIND"] = "BIND";
    Method["CHECKOUT"] = "CHECKOUT";
    Method["CONNECT"] = "CONNECT";
    Method["COPY"] = "COPY";
    Method["DELETE"] = "DELETE";
    Method["GET"] = "GET";
    Method["HEAD"] = "HEAD";
    Method["LINK"] = "LINK";
    Method["LOCK"] = "LOCK";
    Method["M-SEARCH"] = "M-SEARCH";
    Method["MERGE"] = "MERGE";
    Method["MKACTIVITY"] = "MKACTIVITY";
    Method["MKCALENDAR"] = "MKCALENDAR";
    Method["MKCOL"] = "MKCOL";
    Method["MOVE"] = "MOVE";
    Method["NOTIFY"] = "NOTIFY";
    Method["OPTIONS"] = "OPTIONS";
    Method["PATCH"] = "PATCH";
    Method["POST"] = "POST";
    Method["PROPFIND"] = "PROPFIND";
    Method["PROPPATCH"] = "PROPPATCH";
    Method["PURGE"] = "PURGE";
    Method["PUT"] = "PUT";
    Method["REBIND"] = "REBIND";
    Method["REPORT"] = "REPORT";
    Method["SEARCH"] = "SEARCH";
    Method["SUBSCRIBE"] = "SUBSCRIBE";
    Method["TRACE"] = "TRACE";
    Method["UNBIND"] = "UNBIND";
    Method["UNLINK"] = "UNLINK";
    Method["UNLOCK"] = "UNLOCK";
    Method["UNSUBSCRIBE"] = "UNSUBSCRIBE";
})(Method || (exports.Method = Method = {}));
/**
 * @link https://www.iana.org/assignments/http-fields/http-fields.xhtml
 */
var Header;
(function (Header) {
    Header["Accept-Datetime"] = "Accept-Datetime";
    Header["Accept-Encoding"] = "Accept-Encoding";
    Header["Accept-Features"] = "Accept-Features";
    Header["Accept-Language"] = "Accept-Language";
    Header["Accept-Patch"] = "Accept-Patch";
    Header["Accept-Post"] = "Accept-Post";
    Header["Accept-Ranges"] = "Accept-Ranges";
    Header["Access-Control"] = "Access-Control";
    Header["Access-Control-Allow-Credentials"] = "Access-Control-Allow-Credentials";
    Header["Access-Control-Allow-Headers"] = "Access-Control-Allow-Headers";
    Header["Access-Control-Allow-Methods"] = "Access-Control-Allow-Methods";
    Header["Access-Control-Allow-Origin"] = "Access-Control-Allow-Origin";
    Header["Access-Control-Expose-Headers"] = "Access-Control-Expose-Headers";
    Header["Access-Control-Max-Age"] = "Access-Control-Max-Age";
    Header["Access-Control-Request-Headers"] = "Access-Control-Request-Headers";
    Header["Access-Control-Request-Method"] = "Access-Control-Request-Method";
    Header["Age"] = "Age";
    Header["Allow"] = "Allow";
    Header["ALPN"] = "ALPN";
    Header["Alt-Svc"] = "Alt-Svc";
    Header["Alt-Used"] = "Alt-Used";
    Header["Alternates"] = "Alternates";
    Header["AMP-Cache-Transform"] = "AMP-Cache-Transform";
    Header["Apply-To-Redirect-Ref"] = "Apply-To-Redirect-Ref";
    Header["Authentication-Control"] = "Authentication-Control";
    Header["Authentication-Info"] = "Authentication-Info";
    Header["Authorization"] = "Authorization";
    Header["C-Ext"] = "C-Ext";
    Header["C-Man"] = "C-Man";
    Header["C-Opt"] = "C-Opt";
    Header["C-PEP"] = "C-PEP";
    Header["C-PEP-Info"] = "C-PEP-Info";
    Header["Cache-Control"] = "Cache-Control";
    Header["Cache-Status"] = "Cache-Status";
    Header["Cal-Managed-ID"] = "Cal-Managed-ID";
    Header["CalDAV-Timezones"] = "CalDAV-Timezones";
    Header["CDN-Cache-Control"] = "CDN-Cache-Control";
    Header["CDN-Loop"] = "CDN-Loop";
    Header["Cert-Not-After"] = "Cert-Not-After";
    Header["Cert-Not-Before"] = "Cert-Not-Before";
    Header["Clear-Site-Data"] = "Clear-Site-Data";
    Header["Close"] = "Close";
    Header["Configuration-Context"] = "Configuration-Context";
    Header["Connection"] = "Connection";
    Header["Content-Base"] = "Content-Base";
    Header["Content-Disposition"] = "Content-Disposition";
    Header["Content-Encoding"] = "Content-Encoding";
    Header["Content-ID"] = "Content-ID";
    Header["Content-Language"] = "Content-Language";
    Header["Content-Length"] = "Content-Length";
    Header["Content-Location"] = "Content-Location";
    Header["Content-MD5"] = "Content-MD5";
    Header["Content-Range"] = "Content-Range";
    Header["Content-Script-Type"] = "Content-Script-Type";
    Header["Content-Security-Policy"] = "Content-Security-Policy";
    Header["Content-Security-Policy-Report-Only"] = "Content-Security-Policy-Report-Only";
    Header["Content-Style-Type"] = "Content-Style-Type";
    Header["Content-Transfer-Encoding"] = "Content-Transfer-Encoding";
    Header["Content-Type"] = "Content-Type";
    Header["Content-Version"] = "Content-Version";
    Header["Cookie"] = "Cookie";
    Header["Cookie2"] = "Cookie2";
    Header["Cost"] = "Cost";
    Header["Cross-Origin-Embedder-Policy"] = "Cross-Origin-Embedder-Policy";
    Header["Cross-Origin-Embedder-Policy-Report-Only"] = "Cross-Origin-Embedder-Policy-Report-Only";
    Header["Cross-Origin-Opener-Policy"] = "Cross-Origin-Opener-Policy";
    Header["Cross-Origin-Opener-Policy-Report-Only"] = "Cross-Origin-Opener-Policy-Report-Only";
    Header["Cross-Origin-Resource-Policy"] = "Cross-Origin-Resource-Policy";
    Header["DASL"] = "DASL";
    Header["Date"] = "Date";
    Header["DAV"] = "DAV";
    Header["Default-Style"] = "Default-Style";
    Header["Delta-Base"] = "Delta-Base";
    Header["Depth"] = "Depth";
    Header["Derived-From"] = "Derived-From";
    Header["Destination"] = "Destination";
    Header["Differential-ID"] = "Differential-ID";
    Header["Digest"] = "Digest";
    Header["Early-Data"] = "Early-Data";
    Header["EDIINT-Features"] = "EDIINT-Features";
    Header["ETag"] = "ETag";
    Header["Expect"] = "Expect";
    Header["Expect-CT"] = "Expect-CT";
    Header["Expires"] = "Expires";
    Header["Ext"] = "Ext";
    Header["Forwarded"] = "Forwarded";
    Header["From"] = "From";
    Header["GetProfile"] = "GetProfile";
    Header["Hobareg"] = "Hobareg";
    Header["Host"] = "Host";
    Header["HTTP2-Settings"] = "HTTP2-Settings";
    Header["If"] = "If";
    Header["If-Match"] = "If-Match";
    Header["If-Modified-Since"] = "If-Modified-Since";
    Header["If-None-Match"] = "If-None-Match";
    Header["If-Range"] = "If-Range";
    Header["If-Schedule-Tag-Match"] = "If-Schedule-Tag-Match";
    Header["If-Unmodified-Since"] = "If-Unmodified-Since";
    Header["IM"] = "IM";
    Header["Include-Referred-Token-Binding-ID"] = "Include-Referred-Token-Binding-ID";
    Header["Isolation"] = "Isolation";
    Header["Keep-Alive"] = "Keep-Alive";
    Header["Label"] = "Label";
    Header["Last-Event-ID"] = "Last-Event-ID";
    Header["Last-Modified"] = "Last-Modified";
    Header["Link"] = "Link";
    Header["Location"] = "Location";
    Header["Lock-Token"] = "Lock-Token";
    Header["Man"] = "Man";
    Header["Max-Forwards"] = "Max-Forwards";
    Header["Memento-Datetime"] = "Memento-Datetime";
    Header["Message-ID"] = "Message-ID";
    Header["Meter"] = "Meter";
    Header["Method-Check"] = "Method-Check";
    Header["Method-Check-Expires"] = "Method-Check-Expires";
    Header["MIME-Version"] = "MIME-Version";
    Header["Negotiate"] = "Negotiate";
    Header["OData-EntityId"] = "OData-EntityId";
    Header["OData-Isolation"] = "OData-Isolation";
    Header["OData-MaxVersion"] = "OData-MaxVersion";
    Header["OData-Version"] = "OData-Version";
    Header["Opt"] = "Opt";
    Header["Optional-WWW-Authenticate"] = "Optional-WWW-Authenticate";
    Header["Ordering-Type"] = "Ordering-Type";
    Header["Origin"] = "Origin";
    Header["Origin-Agent-Cluster"] = "Origin-Agent-Cluster";
    Header["OSCORE"] = "OSCORE";
    Header["OSLC-Core-Version"] = "OSLC-Core-Version";
    Header["Overwrite"] = "Overwrite";
    Header["P3P"] = "P3P";
    Header["PEP"] = "PEP";
    Header["Pep-Info"] = "Pep-Info";
    Header["PICS-Label"] = "PICS-Label";
    Header["Ping-From"] = "Ping-From";
    Header["Ping-To"] = "Ping-To";
    Header["Position"] = "Position";
    Header["Pragma"] = "Pragma";
    Header["Prefer"] = "Prefer";
    Header["Preference-Applied"] = "Preference-Applied";
    Header["Priority"] = "Priority";
    Header["ProfileObject"] = "ProfileObject";
    Header["Protocol"] = "Protocol";
    Header["Protocol-Info"] = "Protocol-Info";
    Header["Protocol-Query"] = "Protocol-Query";
    Header["Protocol-Request"] = "Protocol-Request";
    Header["Proxy-Authenticate"] = "Proxy-Authenticate";
    Header["Proxy-Authentication-Info"] = "Proxy-Authentication-Info";
    Header["Proxy-Authorization"] = "Proxy-Authorization";
    Header["Proxy-Features"] = "Proxy-Features";
    Header["Proxy-Instruction"] = "Proxy-Instruction";
    Header["Proxy-Status"] = "Proxy-Status";
    Header["Public"] = "Public";
    Header["Public-Key-Pins"] = "Public-Key-Pins";
    Header["Public-Key-Pins-Report-Only"] = "Public-Key-Pins-Report-Only";
    Header["Range"] = "Range";
    Header["Redirect-Ref"] = "Redirect-Ref";
    Header["Referer"] = "Referer";
    Header["Referer-Root"] = "Referer-Root";
    Header["Refresh"] = "Refresh";
    Header["Repeatability-Client-ID"] = "Repeatability-Client-ID";
    Header["Repeatability-First-Sent"] = "Repeatability-First-Sent";
    Header["Repeatability-Request-ID"] = "Repeatability-Request-ID";
    Header["Repeatability-Result"] = "Repeatability-Result";
    Header["Replay-Nonce"] = "Replay-Nonce";
    Header["Retry-After"] = "Retry-After";
    Header["Safe"] = "Safe";
    Header["Schedule-Reply"] = "Schedule-Reply";
    Header["Schedule-Tag"] = "Schedule-Tag";
    Header["Sec-GPC"] = "Sec-GPC";
    Header["Sec-Token-Binding"] = "Sec-Token-Binding";
    Header["Sec-WebSocket-Accept"] = "Sec-WebSocket-Accept";
    Header["Sec-WebSocket-Extensions"] = "Sec-WebSocket-Extensions";
    Header["Sec-WebSocket-Key"] = "Sec-WebSocket-Key";
    Header["Sec-WebSocket-Protocol"] = "Sec-WebSocket-Protocol";
    Header["Sec-WebSocket-Version"] = "Sec-WebSocket-Version";
    Header["Security-Scheme"] = "Security-Scheme";
    Header["Server"] = "Server";
    Header["Server-Timing"] = "Server-Timing";
    Header["Set-Cookie"] = "Set-Cookie";
    Header["Set-Cookie2"] = "Set-Cookie2";
    Header["SetProfile"] = "SetProfile";
    Header["SLUG"] = "SLUG";
    Header["SoapAction"] = "SoapAction";
    Header["Status-URI"] = "Status-URI";
    Header["Strict-Transport-Security"] = "Strict-Transport-Security";
    Header["Sunset"] = "Sunset";
    Header["Surrogate-Capability"] = "Surrogate-Capability";
    Header["Surrogate-Control"] = "Surrogate-Control";
    Header["TCN"] = "TCN";
    Header["TE"] = "TE";
    Header["Timeout"] = "Timeout";
    Header["Timing-Allow-Origin"] = "Timing-Allow-Origin";
    Header["Title"] = "Title";
    Header["Topic"] = "Topic";
    Header["Traceparent"] = "Traceparent";
    Header["Tracestate"] = "Tracestate";
    Header["Trailer"] = "Trailer";
    Header["Transfer-Encoding"] = "Transfer-Encoding";
    Header["TTL"] = "TTL";
    Header["Upgrade"] = "Upgrade";
    Header["Urgency"] = "Urgency";
    Header["URI"] = "URI";
    Header["User-Agent"] = "User-Agent";
    Header["Variant-Vary"] = "Variant-Vary";
    Header["Vary"] = "Vary";
    Header["Version"] = "Version";
    Header["Via"] = "Via";
    Header["Want-Digest"] = "Want-Digest";
    Header["Warning"] = "Warning";
    Header["WWW-Authenticate"] = "WWW-Authenticate";
    Header["X-Content-Type-Options"] = "X-Content-Type-Options";
    Header["X-Device-Accept"] = "X-Device-Accept";
    Header["X-Device-Accept-Charset"] = "X-Device-Accept-Charset";
    Header["X-Device-Accept-Encoding"] = "X-Device-Accept-Encoding";
    Header["X-Device-Accept-Language"] = "X-Device-Accept-Language";
    Header["X-Device-User-Agent"] = "X-Device-User-Agent";
    Header["X-Frame-Options"] = "X-Frame-Options";
    Header["*"] = "*";
})(Header || (exports.Header = Header = {}));
//# sourceMappingURL=http.js.map