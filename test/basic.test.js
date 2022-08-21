import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { extname, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import format from 'xml-formatter'
import {
  mml2ooml
} from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures = join(__dirname, 'fixtures')

function collectFiles (dirPath, filesList = []) {
  readdirSync(dirPath).forEach(file => {
    if (statSync(dirPath + '/' + file).isDirectory()) {
      filesList = collectFiles(dirPath + '/' + file, filesList)
    } else {
      filesList.push(join(dirPath, '/', file))
    }
  })

  return filesList
}

const mathfiles = collectFiles(fixtures)
const examples = []

for (const fixture of mathfiles) {
  if (extname(fixture) !== '.mml') {
    continue
  }
  const ofixture = fixture.slice(0, -4) + '.omml'
  const mml = readFileSync(fixture, 'utf8')
  const omml = existsSync(ofixture) ? readFileSync(ofixture, 'utf8') : false
  examples.push({ fixture: fixture.slice(fixtures.length + 1), mml, omml })
}

test.each(examples)('Can produce OOML from $fixture', ({ fixture, mml, omml }) => {
  const outOmml = format(mml2ooml(mml))
  if (omml) {
    expect(outOmml).toEqual(format(omml))
  } else {
    expect(outOmml).toMatchSnapshot()
  }
})
