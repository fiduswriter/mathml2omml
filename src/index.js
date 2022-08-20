import { xml2js, js2xml } from '@netless/xml-js'
import * as htmlparser2 from "htmlparser2"
import render from "dom-serializer"
import { walker } from './walker.js'
import { cleanText } from './helpers.js'

class MML2OMML {
  constructor (mmlString) {

    this.inString = mmlString
  //  this.inXML = xml2js(mmlString)
    this.inXML = htmlparser2.parseDocument(mmlString).children
    cleanText(this.inXML)
    this.outXML = false
    this.outString = false
  }

  run () {
    const outXML = {}
    walker(this.inXML, outXML)
    this.outXML = outXML
  }

  getResult () {
    console.log(this.outXML)
    this.outString = render([this.outXML], {xmlMode: true})
    console.log(this.outString)
    return this.outString
  }
}

export const mml2ooml = function (mmlString) {
  const converter = new MML2OMML(mmlString)
  converter.run()
  return converter.getResult()
}
