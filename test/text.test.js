import { mml2omml } from '../src/index.js'

test('normal mathvariant produces an upright run', () => {
  const output = mml2omml('<math><mi mathvariant="normal">H</mi></math>')
  expect(output).toContain('<m:sty m:val="p"/>')
  expect(output).not.toContain('undefined')
})

test('inherited normal mathvariant is not replaced by the preceding italic run', () => {
  const output = mml2omml(
    '<math><mstyle mathvariant="normal"><mi mathvariant="italic">x</mi><mi>H</mi><mi>O</mi></mstyle></math>'
  )
  expect(output).toMatch(/<m:sty m:val="p"\/><\/m:rPr><m:t[^>]*>HO<\/m:t>/)
  expect(output.match(/<m:r>/g)).toHaveLength(2)
  expect(output).not.toContain('undefined')
})

test.each([
  ['\u00a0', '&#xA0;'],
  ['\u2009', '&#x2009;']
])('mtext preserves literal %j like its numeric entity', (space, entity) => {
  for (const content of [space, `${space}unit${space}`]) {
    const output = mml2omml(`<math><mtext>${content}</mtext></math>`)
    expect(output).toContain(`>${content}</m:t>`)
    expect(output).toBe(
      mml2omml(`<math><mtext>${content.replaceAll(space, entity)}</mtext></math>`)
    )
    expect(output).toBe(mml2omml(`<math><mtext>${content}</mtext></math>`, { disableDecode: true }))
  }
})

test('mtext continues to trim boundary ASCII whitespace', () => {
  const output = mml2omml('<math><mtext> \t\nunit\r </mtext></math>')
  expect(output).toContain('>unit</m:t>')
})
