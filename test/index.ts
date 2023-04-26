import { test } from 'tapzero'
import { Blobs } from '@nichoth/blobs'
import path from 'node:path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('create an instance', t => {
    const blobs = Blobs({ dir: __dirname })
    t.ok(blobs, 'should create a new blobs')
    t.ok(blobs.add, 'has .add')
    t.ok(blobs.get, 'has .get')
})
