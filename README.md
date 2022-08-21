# mathml2omml

Convert MathML to the OOML format used in DOCX files without XSLT.

You can use it like this:

```js
import {mml2omml} from "mathml2omml"

const mml = '<math xmlns="http://www.w3.org/1998/Math/MathML">
  <semantics>
    <mrow>
      <mn>2</mn>
      <mo>+</mo>
      <mn>2</mn>
      <mo>=</mo>
      <mn>4</mn>
    </mrow>
  </semantics>
</math>'

const omml = mml2omml(mml)

console.log(omml)

> <m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">
>    <m:r>
>        <m:t xml:space="preserve">2+2=4</m:t>
>    </m:r>
> </m:oMath>

```


License
=======

LGPL v.3.0 or later.

License of test files depends on source of files.

Some test fixtures fall under other licenses/copyrights. See the LICENSE and copyirght.txt files in the different test fixture folders.

Remaining test fixtures fall under the same license and copyright as the source code.
