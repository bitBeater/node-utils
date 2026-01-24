import { readFileSync, rmSync } from 'node:fs';
import { createServer } from 'http';
import { join } from 'path';
import { exists } from '../src/fs/files.ts';
import { downloadOnFs, httpRequest } from '../src/http.ts';
import { equal } from 'node:assert';
import { it } from 'node:test';

it('test httpRequest', async () => {
	const server = createServer((_req, resp) => resp.end('Hello World\n')).listen(1337);

	const resp = await httpRequest({ url: `http://localhost:1337` });
	equal(resp.data, 'Hello World\n');
	server.close();
});

it('test download file', async () => {
	const server = createServer((_req, resp) => resp.end('Hello World\n')).listen(1337);

	const dir = join(__dirname, 'test');
	const file = join(dir, 'test.txt');

	equal(await exists(dir), false);
	equal(await exists(file), false);

	await downloadOnFs({ url: `http://localhost:1337` }, file);

	equal((await readFileSync(file)).toString(), 'Hello World\n');

	rmSync(dir, { recursive: true, force: true });

	server.close();
});
