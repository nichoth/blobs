import { test } from 'tapzero'
import { Blobs } from '@nichoth/blobs'
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('setup', async () => {
    await fs.rm(path.join(__dirname, 'GSE7rMWN7m294865pHy7Mws9hvjMqJl-sAvkVvFAyiU'), {
        force: true
    })
})

let blobs
test('create an instance', t => {
    blobs = Blobs({ dir: __dirname })
    t.ok(blobs, 'should create a new blobs')
    t.ok(blobs.add, 'has .add')
    t.ok(blobs.get, 'has .get')
})

let hash
test('blobs.add', async t => {
    hash = await blobs.add('hello')
    t.equal(typeof hash, 'string', 'should return hash as a string')
    t.equal(hash, 'GSE7rMWN7m294865pHy7Mws9hvjMqJl-sAvkVvFAyiU',
        'should return the expected hash')
})

test('blobs.get', async t => {
    const content = await blobs.get(hash, 'utf8')
    t.ok(content, 'got content')
    t.equal(content, 'hello', 'should decode the file as utf8')
})
