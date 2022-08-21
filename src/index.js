import * as htmlparser2 from "htmlparser2"
import render from "dom-serializer"
import { walker } from './walker.js'
import { cleanText } from './helpers.js'

class MML2OMML {
  constructor (mmlString) {

    this.inString = mmlString
    this.inXML = htmlparser2.parseDocument(mmlString)
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
    this.outString = render([this.outXML], {xmlMode: true, encodeEntities: false, decodeEntities: false})
    return this.outString
  }
}

export const mml2ooml = function (mmlString) {
  const converter = new MML2OMML(mmlString)
  converter.run()
  return converter.getResult()
}
