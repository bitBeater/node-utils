"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
// console.log(new Uint8Array([68, 33, 123]));
const readStream = new ReadableStream({
    start(controller) {
        const interval = setInterval(i => {
            controller.enqueue(new Uint8Array([68, 33, 123]));
        }, 500);
        setTimeout(() => {
            clearInterval(interval);
            controller.close();
        }, 5000);
    }
});
async function streamToFile(readableStream, filePath) {
    if (!(0, node_fs_1.existsSync)((0, node_path_1.dirname)(filePath))) {
        (0, node_fs_1.mkdirSync)((0, node_path_1.dirname)(filePath), { recursive: true });
    }
    let writtenBytes = 0;
    const writableStream = (0, node_fs_1.createWriteStream)(filePath);
    try {
        for await (const chunk of readableStream) {
            const canContinue = writableStream.write(chunk);
            // Apply backpressure if needed
            if (!canContinue) {
                await new Promise(resolve => writableStream.once('drain', resolve));
            }
            writtenBytes += chunk.length;
        }
        // Wait for stream to finish
        await new Promise((resolve, reject) => {
            writableStream.end();
            writableStream.on('finish', resolve);
            writableStream.on('error', reject);
        });
        return writtenBytes;
    }
    catch (err) {
        writableStream.destroy();
        throw err;
    }
}
streamToFile(readStream, 'path/to/file.txt').then(bytes => {
    console.log(`Finished writing ${bytes} bytes to file.`);
}).catch(err => {
    console.error('Error writing to file:', err);
});
//# sourceMappingURL=tmp.js.map