import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

// Keep the original PDF byte-for-byte identical while storing it as UTF-8
// Base64 text in the repository. This also supports GitHub Pages deployments.
const source = resolve(process.cwd(), 'assets/Runtime_advanced_W2.pdf.base64')
const destination = resolve(process.cwd(), 'public/seminars/Runtime_심화반_W2.pdf')
const encoded = (await readFile(source, 'utf8')).replace(/\s+/g, '')
const pdf = Buffer.from(encoded, 'base64')
const actualSha256 = createHash('sha256').update(pdf).digest('hex')
const expectedSha256 = '4300cfa61a37ac11a59a0108b8124e5a7acb2bbff6170b18962d9302009715b0'

if (pdf.length !== 2437037 || actualSha256 !== expectedSha256) {
  throw new Error('Advanced seminar PDF payload is missing or does not match the uploaded original')
}

await mkdir(dirname(destination), { recursive: true })
await writeFile(destination, pdf)
console.log('Restored advanced seminar PDF (30 pages, verified SHA-256)')
