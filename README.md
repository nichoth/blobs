# blobs ![tests](https://github.com/nichoth/blobs/actions/workflows/nodejs.yml/badge.svg)

Store blobs by their content address using the blake2s hash algorithm.

## install

```
npm i @nichoth/blobs
```

## featuring
* ESM only. Sorry, no common JS, because we are using top level `await`
* compatibility with either Node JS or [SSC](https://github.com/socketsupply/socket)
* types
* Contemporary API -- use promises & `async` functions

## example

```ts
import { test } from 'tapzero'
import { Blobs } from '@nichoth/blobs'
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let blobs
test('create an instance', t => {
    blobs = Blobs({ dir: __dirname })
    t.ok(blobs, 'should create a new blobs instance')
    t.ok(blobs.add, 'has .add')
    t.ok(blobs.get, 'has .get')
})

let hash
test('blobs.add', async t => {
    hash = await blobs.add('hello')
    t.equal(typeof hash, 'string', 'should return hash as a string')
    t.equal(hash, 'GSE7rMWN7m294865pHy7Mws9hvjMqJl-sAvkVvFAyiU',
        'should return the expected hash')

    const stats = await fs.stat(path.join(__dirname, hash))
    t.ok(stats, 'should create the file at the right path')
})

test('blobs.get', async t => {
    const content = await blobs.get(hash, 'utf8')
    t.ok(content, 'got content')
    t.equal(content, 'hello', 'should decode the file as utf8')
})
```
