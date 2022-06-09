
export function addScriptlevel (target, ancestors) {
  const scriptlevel = ancestors.find(ancestor => ancestor.attributes?.scriptlevel)?.attributes?.scriptlevel
  if (['0', '1', '2'].includes(scriptlevel)) {
    target.elements.unshift({
      type: 'element',
      name: 'm:argPr',
      elements: [{
        type: 'element',
        name: 'm:scrLvl',
        attributes: { 'm:val': scriptlevel }
      }]
    })
  }
}
