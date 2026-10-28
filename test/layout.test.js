import { mml2omml } from '../src/index.js'
import { parse } from '../src/parse-stringify/index.js'

test.each([
  ['width', '0px', 'm:zeroWid'],
  ['height', '0em', 'm:zeroAsc'],
  ['depth', '0', 'm:zeroDesc'],
  ['width', '0.0%', 'm:zeroWid'],
  ['width', '.0em', 'm:zeroWid'],
  ['height', '0.', 'm:zeroAsc'],
  ['width', '0width', 'm:zeroWid'],
  ['depth', '0.0height', 'm:zeroDesc'],
  ['height', '.0depth', 'm:zeroAsc']
])('mpadded maps %s="%s" to %s without hiding content', (dimension, value, property) => {
  const output = mml2omml(`<math><mpadded ${dimension}="${value}"><mi>x</mi></mpadded></math>`)
  expect(output).toContain(`<m:phantPr><m:show m:val="1"/><${property} m:val="1"/></m:phantPr>`)
  expect(output).toMatch(/<m:e><m:r><m:t[^>]*>x<\/m:t><\/m:r><\/m:e>/)
})

test('mpadded can suppress width, height, and depth independently of visibility', () => {
  const output = mml2omml(
    '<math><mpadded width="0px" height="0px" depth="0px"><mphantom><mi>x</mi></mphantom></mpadded></math>'
  )
  expect(output).toContain(
    '<m:show m:val="1"/><m:zeroAsc m:val="1"/><m:zeroDesc m:val="1"/><m:zeroWid m:val="1"/>'
  )
  expect(output).toContain('<m:show m:val="0"/>')
  expect(output.match(/<m:phant>/g)).toHaveLength(2)
})

test.each(['+0px', '-0em', '1em', '+0.6em'])(
  'mpadded does not treat %s as an absolute zero dimension',
  (width) => {
    const output = mml2omml(
      `<math><mpadded width="${width}" lspace="0.3em"><mi>x</mi></mpadded></math>`
    )
    expect(output).not.toContain('<m:zeroWid')
    expect(output).toContain('>x<')
  }
)

test('layout handlers retain script argument grouping without reattaching bases', () => {
  const output = mml2omml(
    '<math><mi>x</mi><msub><mpadded width="0px"><mi>a</mi><mi>b</mi></mpadded><mphantom><mi>i</mi></mphantom></msub></math>'
  )
  const math = parse(output)[0]
  expect(math.children.map((child) => child.name)).toEqual(['m:r', 'm:sSub'])
  const script = math.children[1]
  expect(script.children.map((child) => child.name)).toEqual(['m:sSubPr', 'm:e', 'm:sub'])
  expect(script.children[1].children.map((child) => child.name)).toEqual(['m:phant'])
  expect(script.children[2].children.map((child) => child.name)).toEqual(['m:phant'])
  expect(output).toContain('>ab<')
})

test.each([
  '<mphantom><mo>∑</mo></mphantom>',
  '<mrow><mpadded width="0px"><mo>∑</mo></mpadded></mrow>'
])('n-ary recognition does not discard a layout wrapper in %s', (base) => {
  const output = mml2omml(`<math><msub>${base}<mi>i</mi></msub><mi>x</mi></math>`)
  expect(output).not.toContain('<m:nary>')
  expect(parse(output)[0].children[0].name).toBe('m:sSub')
  expect(output).toContain('<m:phant>')
})

test.each(['mphantom', 'mpadded'])('%s following a n-ary operator stays in its operand', (name) => {
  const output = mml2omml(
    `<math><msub><mo>∑</mo><mi>i</mi></msub><${name} width="0px"><mi>x</mi></${name}></math>`
  )
  const math = parse(output)[0]
  expect(math.children.map((child) => child.name)).toEqual(['m:nary'])
  const operand = math.children[0].children.find((child) => child.name === 'm:e')
  expect(operand.children.map((child) => child.name)).toEqual(['m:phant'])
})

test('phantom labels retain their visibility rather than being treated as empty', () => {
  const output = mml2omml('<math><mover><mi>x</mi><mphantom><mi>y</mi></mphantom></mover></math>')
  const limit = parse(output)[0].children[0]
  expect(limit.name).toBe('m:limUpp')
  expect(limit.children.find((child) => child.name === 'm:lim').children[0].name).toBe('m:phant')
  expect(output).toContain('<m:show m:val="0"/>')
})

test.each(['mphantom', 'mpadded'])('empty %s is handled without adding visible text', (name) => {
  const output = mml2omml(`<math><${name} width="0px"/></math>`)
  expect(output).toContain('<m:phant>')
  expect(output).toContain('<m:e/>')
  expect(output).not.toContain('<m:t')
})
