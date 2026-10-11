// Offline check of the VSEPR and bond-type logic in index.html. Run: node test.mjs
import fs from 'fs'
const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8').split('\n')
const find = s => html.findIndex(l => l.startsWith(s))
const code = [...html.slice(find('// Element database'), find('// Three.js / WebGPU setup')), ...html.slice(find('// Compound chemistry helpers'), find('// Atom detail panel'))].join('\n')
const api = new Function(code + '\nreturn {idealizeVSEPR, analyzeGeometry, computeBondType, computeMolPolarity, computeAllIMFs, parseFormula, nameIonicCompound}')()
// flat star: central at origin, n ligands around it in 2D (like PubChem 2D)
const star = (c, lig, n, order=1) => ({atoms:[{id:1,el:c,x:0,y:0,z:0}, ...Array.from({length:n},(_,i)=>({id:i+2,el:lig,x:Math.cos(i*2*Math.PI/n),y:Math.sin(i*2*Math.PI/n),z:0}))], bonds:Array.from({length:n},(_,i)=>({a:1,b:i+2,order}))})
const cases = [['BeCl2','Be','Cl',2,'Linear','Nonpolar'],['XeF2','Xe','F',2,'Linear','Nonpolar'],['BF3','B','F',3,'Trigonal Planar','Nonpolar'],
 ['ClF3','Cl','F',3,'T-shaped','Polar'],['SF4','S','F',4,'See-saw','Polar'],['XeF4','Xe','F',4,'Square Planar','Nonpolar'],['PCl5','P','Cl',5,'Trigonal Bipyramidal','Nonpolar'],
 ['BrF5','Br','F',5,'Square Pyramidal','Polar'],['SF6','S','F',6,'Octahedral','Nonpolar'],['IF7','I','F',7,'Pentagonal Bipyramidal','Nonpolar']]
let fail = 0
const check = (label, got, want) => { if (got !== want) { fail++; console.log('FAIL', label, 'got', got, 'want', want) } }
for (const [name, c, l, n, geo, pol] of cases) {
  const m = api.idealizeVSEPR(star(c, l, n))
  const g = api.analyzeGeometry(m.atoms, m.bonds)
  const p = api.computeMolPolarity(m, g.geoName)
  check(name+' geo', g.geoName, geo); check(name+' pol', p.label, pol)
  check(name+' bond', api.computeBondType(m) === 'Ionic', false)
  console.log(name.padEnd(6), g.geoName.padEnd(24), String(g.bondAngle).padEnd(9), p.label.padEnd(9), api.computeBondType(m), '|', api.computeAllIMFs(m, p))
}
// angles really ideal: XeF2 F-Xe-F 180, XeF4 adjacent 90
const xe = api.idealizeVSEPR(star('Xe','F',2)); check('XeF2 180', Math.round(Math.acos(xe.atoms[1].x*xe.atoms[2].x+xe.atoms[1].y*xe.atoms[2].y+xe.atoms[1].z*xe.atoms[2].z)*180/Math.PI), 180)
check('CaCO3 parse', JSON.stringify(api.parseFormula('CaCO3')), JSON.stringify([{el:'Ca',n:1},{el:'C',n:1},{el:'O',n:3}]))
check('BeCl2 not ionic', api.nameIonicCompound(api.parseFormula('BeCl2')), null)
check('AlCl3 not ionic', api.nameIonicCompound(api.parseFormula('AlCl3')), null)
check('NaCl ionic', api.nameIonicCompound(api.parseFormula('NaCl')), 'Sodium Chloride')
check('Na2SO4 ionic', api.nameIonicCompound(api.parseFormula('Na2SO4')), 'Sodium Sulfate')
// HF (no metal, ΔEN 1.78) is polar covalent with H-bonding
const hf = {atoms:[{id:1,el:'H',x:0,y:0,z:0},{id:2,el:'F',x:1,y:0,z:0}], bonds:[{a:1,b:2,order:1}]}
check('HF bond', api.computeBondType(hf), 'Polar Covalent')
// acetone-like C=O without O-H: no H-bonding
const co = {atoms:[{id:1,el:'C',x:0,y:0,z:0},{id:2,el:'O',x:1,y:0,z:0},{id:3,el:'H',x:-1,y:0,z:0}], bonds:[{a:1,b:2,order:2},{a:1,b:3,order:1}]}
check('no H-bond', api.computeAllIMFs(co, {label:'Polar'}).includes('H-bonding'), false)
// free ions: Mg2+ 2Cl- with no bonds
const mgcl2 = {atoms:[{id:1,el:'Mg',x:0,y:0,z:0,charge:2},{id:2,el:'Cl',x:1,y:0,z:0,charge:-1},{id:3,el:'Cl',x:-1,y:0,z:0,charge:-1}], bonds:[]}
check('MgCl2 ionic', api.computeBondType(mgcl2), 'Ionic')
console.log(fail ? `${fail} FAILED` : 'ALL PASS'); process.exitCode = fail ? 1 : 0
