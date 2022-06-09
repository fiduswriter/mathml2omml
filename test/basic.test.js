import {readFileSync, readdirSync, statSync, existsSync} from "fs"
import {extname, join, basename, dirname} from "path"
import {fileURLToPath} from "url"
import {xml2js, js2xml} from "xml-js"
import format from 'xml-formatter'
import {
    mml2ooml
} from "../src/index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures = join(__dirname, "fixtures")


function collectFiles(dirPath, filesList=[]) {
  readdirSync(dirPath).forEach(file => {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      filesList = collectFiles(dirPath + "/" + file, filesList)
    } else {
      filesList.push(join(dirPath, "/", file))
    }
  })

  return filesList
}

const mathfiles = collectFiles(fixtures)
const examples = []

for (let fixture of mathfiles) {
    if (extname(fixture) != ".mml") {
        continue
    }
    const ofixture = fixture.slice(0, -4) + ".omml"
    const mml = readFileSync(fixture)
    const omml = existsSync(ofixture) ? readFileSync(ofixture) : false
    examples.push({fixture: fixture.slice(fixtures.length + 1), mml, omml})
}

test.each(examples)('Can produce OOML from $fixture', ({fixture, mml, omml}) => {
  const outOmml = format(mml2ooml(mml))
  if (omml) {
    expect(outOmml).toEqual(format(js2xml(xml2js(omml, {captureSpacesBetweenElements: true}))))
  } else {
    expect(outOmml).toMatchSnapshot()
  }

})
