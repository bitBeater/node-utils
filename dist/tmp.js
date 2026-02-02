"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _controller;
var cancelStreams;
const stream = new ReadableStream({
    start(controller) {
        _controller = controller;
        // Push data to the stream
        let counter = 0;
        const interval = setInterval(() => {
            controller.enqueue(counter++);
        }, 1000);
        cancelStreams = () => {
            clearInterval(interval);
            controller.close();
        };
    }
});
(async () => {
    // I need 5 from the stream
    let count = 0;
    for await (const chunk of stream) {
        count++;
        if (count > 5) {
            cancelStreams();
            break;
        }
        console.log('Received chunk:', chunk);
    }
})();
//# sourceMappingURL=tmp.js.map