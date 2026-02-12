import { readFileSync, rmSync } from 'node:fs';
import { createServer } from 'http';
import { join } from 'path';
import { exists } from '@bitbeater/node-utils/fs';
import { downloadOnFs } from '@bitbeater/node-utils/http';
import { equal } from 'node:assert';
import { it } from 'node:test';



it('test download file', async t => {

	const CHECK_DATA = 'Hello World';
	const dir = join(__dirname, 'test');
	const file = join(dir, 'test.txt');
	const server = createServer((_req, resp) => resp.end(CHECK_DATA)).listen(1337);


	t.after(() => {
		rmSync(dir, { recursive: true, force: true });
		server.close();
	});

	equal(await exists(dir), false);
	equal(await exists(file), false);

	const downloadDescriptor = await downloadOnFs(file, `http://localhost:1337`);
	const downloadedFileData = (await readFileSync(file)).toString();

	equal(downloadDescriptor.sha256, 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e');
	equal(downloadDescriptor.size, 11);
	equal(downloadedFileData, CHECK_DATA);
});

