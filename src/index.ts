import Blake2s from 'blake2s-js'
import { PathLike } from 'node:fs'
import { fromString, toString } from 'uint8arrays'

let join:(...segments:string[])=>string
let readFile:(path:PathLike, enc?:BufferEncoding)=>Promise<Buffer>
let writeFile:(path:PathLike, data: string | NodeJS.ArrayBufferView)=>Promise<void>

if (process.env._?.includes('node')) {
    join = (await import('node:path')).join
    // typescript mysteries
    readFile = (await import('node:fs/promises')).readFile as
        (path:PathLike, enc?:BufferEncoding)=>Promise<Buffer>
    writeFile = (await import('node:fs/promises')).writeFile as
        (path:PathLike, data:string|NodeJS.ArrayBufferView)=>Promise<void>
} else {  // is socket
    // @ts-ignore -- can't find `socket:` namespace
    join = (await import('socket:path')).join;
    // @ts-ignore
    ({ readFile, writeFile } = await import('socket:fs/promises'))
}

interface Args {
    dir:string
}

interface BlobStore {
    add: (data:Uint8Array|string) => Promise<string>,
    get: (hash:string, enc?:BufferEncoding) => Promise<string|Buffer>
}

export function Blobs ({ dir }:Args):BlobStore {
    if (!dir) throw new Error('need a directory argument')

    const blake = new Blake2s(32)

    return {
        add: async function (_data) {
            let data = _data
            if (typeof _data === 'string') data = fromString(_data)

            blake.update(data as Uint8Array)

            const hash = toString(blake.digest(), 'base64url')
            // const hash = blake.hexDigest()

            await writeFile(join(dir, hash), data)

            return hash
        },

        get: function (hash, enc?:BufferEncoding) {
            return readFile(join(dir, hash), enc)
        }
    }
}
