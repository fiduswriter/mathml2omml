import { xml2js, js2xml } from 'xml-js'

import { walker } from './walker'
import { cleanText } from './helper'

class MML2OMML {
  constructor (mmlString) {
    this.inString = mmlString
    this.inXML = xml2js(mmlString)
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
    this.outString = js2xml({ elements: [this.outXML] })
    return this.outString
  }
}

export const mml2ooml = function (mmlString) {
  const converter = new MML2OMML(mmlString)
  converter.run()
  return converter.getResult()
}
