import { strictEqual } from 'node:assert';
import { appendFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { tail, tailStream } from '@bitbeater/node-utils/fs';





describe('fs/files', () => {
    describe('tail', () => {

        it('should be called once', (t, done) => {

            // Arrange
            const CHECK_DATA = 'Appended data';
            const testFilePath = join(__dirname, 'tail_test.txt');
            writeFileSync(testFilePath, 'Initial data\n');

            const mockCallback = t.mock.fn(() => null);

            const watcher = tail(testFilePath, mockCallback);

            // Act
            appendFileSync(testFilePath, CHECK_DATA);

            setTimeout(() => {
                // Assert
                try {
                    strictEqual(mockCallback.mock.calls.length, 1);
                } catch (error) {
                    done(error);
                }
                done();
            }, 100); // Wait a bit for the event to be processed

            t.after(() => {
                // Cleanup
                watcher.close();
                unlinkSync(testFilePath);
            });
        });


        it('should call callback on new data appended to file', (t, done) => {

            // Arrange
            const CHECK_DATA = 'Appended data';
            const testFilePath = join(__dirname, 'tail_test.txt');
            writeFileSync(testFilePath, 'Initial data\n');

            const watcher = tail(testFilePath, (chunk: Uint8Array) => {
                // Assert
                const data = Buffer.from(chunk).toString();

                try {
                    strictEqual(data, CHECK_DATA);
                } catch (error) {
                    done(error);
                    return;
                }
                done();
            });

            // Act
            appendFileSync(testFilePath, CHECK_DATA);

            t.after(() => {
                // Cleanup
                watcher.close();
                unlinkSync(testFilePath);
            });
        });
    });

    describe('tailStream', () => {

        it('should be called once', (t, done) => {

            t.after(() => {
                // Cleanup
                unlinkSync(testFilePath);
            });

            // Arrange
            const CHECK_DATA = 'Appended data';
            const testFilePath = join(__dirname, 'tail_test.txt');
            writeFileSync(testFilePath, 'Initial data\n');


            // Act
            const [readableTailStream, cancel] = tailStream(testFilePath);

            setTimeout(() => {
                appendFileSync(testFilePath, CHECK_DATA);
                setTimeout(() => cancel(), 1);
            }, 1);


            let callCount = 0;
            (
                async () => {
                    for await (var _ of readableTailStream) {
                        callCount++;
                    }

                    // Assert
                    try {
                        strictEqual(callCount, 1);
                    } catch (error) {
                        done(error);
                        return;
                    }

                    done();
                }
            )()
        });


        it('should call callback on new data appended to file', (t, done) => {
            t.after(() => {
                // Cleanup
                unlinkSync(testFilePath);
            });

            // Arrange
            const CHECK_DATA = 'Appended data';
            const testFilePath = join(__dirname, 'tail_test.txt');
            writeFileSync(testFilePath, 'Initial data\n');


            // Act
            const [readableTailStream, cancel] = tailStream(testFilePath);

            setTimeout(() => {
                appendFileSync(testFilePath, CHECK_DATA);
                setTimeout(() => cancel(), 1);
            }, 1);



            (
                async () => {
                    var data: string = '';

                    for await (var chunk of readableTailStream) {
                        data = Buffer.from(chunk).toString();
                    }

                    // Assert
                    try {
                        strictEqual(data, CHECK_DATA);
                    } catch (error) {
                        done(error);
                        return;
                    }

                    done();
                }
            )()

        });
    });
});

