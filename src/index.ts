import Blake2s from 'blake2s-js'
import { fromString, toString } from 'uint8arrays'

let join, readFile
if (process.env._?.includes('node')) {
    join = (await import('node:path')).join
    readFile = (await import('node:fs/promises')).readFile
}

interface Args {
    dir:string
}

interface BlobStore {
    add: (data:Uint8Array|string) => string,
    get: (hash:string) => Promise<Buffer>
}

export function Blobs ({ dir }:Args):BlobStore {
    if (!dir) throw new Error('need a directory argument')

    const blake = new Blake2s(32)

    return {
        add: function (_data) {
            let data = _data
            if (typeof _data === 'string') data = fromString(_data)

            blake.update(data as Uint8Array)

            return toString(blake.digest())
        },

        get: function (hash) {
            return readFile(join(dir, hash))
        }
    }
}
