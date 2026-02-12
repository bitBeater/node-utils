"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_crypto_1 = require("node:crypto");
const sha256 = 'abfd4c73130792c851663170844fe0168e3d4c3a222b11f33815cfa775b7178a';
(async () => {
    const hash = (0, node_crypto_1.createHash)('sha256');
    const fileStream = (0, node_fs_1.createReadStream)('/home/alex/Videos/samples/file_example_AVI_1920_2_3MG.avi');
    for await (const chunk of fileStream) {
        hash.update(chunk);
    }
    const hexSha256 = hash.digest('hex');
    console.log('SHA256:', hexSha256);
    if (hexSha256 === sha256) {
        console.log('File integrity verified: SHA256 hash matches.');
    }
    else {
        console.log('File integrity verification failed: SHA256 hash does not match.');
    }
})();
//# sourceMappingURL=tmp.js.map