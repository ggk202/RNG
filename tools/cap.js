const vm=require('vm'),fs=require('fs');
const mk=()=>{const f=function(){};return new Proxy(f,{get(t,k){if(k===Symbol.toPrimitive)return h=>h==='string'?'x':.5;if(k===Symbol.iterator)return function*(){};if(k==='then')return undefined;if(k==='count')return 1;if(k in t&&k!=='prototype'&&k!=='name'&&k!=='length')return t[k];if(!t['__'+String(k)])t['__'+String(k)]=mk();return t['__'+String(k)]},set(t,k,v){t['__'+String(k)]=v;return true},apply(){return mk()},construct(){return mk()}})};
const THREE=mk();
const caps=new Map();THREE.ShaderMaterial=function(p){const k=(p.vertexShader||'')+'@@'+(p.fragmentShader||'');if(!caps.has(k))caps.set(k,{v:p.vertexShader,f:p.fragmentShader,u:Object.keys(p.uniforms||{})});return mk()};
const ctx={THREE,console:{log(){},warn(){},error(){}},document:{getElementById:()=>mk(),body:mk(),addEventListener(){},createElement:()=>mk()},matchMedia:()=>({matches:false}),navigator:{maxTouchPoints:0},addEventListener(){},innerWidth:1200,innerHeight:800,devicePixelRatio:1,performance:{now:()=>0},requestAnimationFrame(){},setInterval(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},confirm:()=>false,btoa:s=>s,atob:s=>s};
ctx.window=ctx;vm.createContext(ctx);
let js=fs.readFileSync('g.js','utf8')+`;for(const o of OBJ){try{show(o.i,-1)}catch(e){}}for(let m=0;m<MODS.length;m++){try{show(5,m)}catch(e){}}try{for(const f of ['bh','wh','life','exo','total','mega','forge']){const o=OBJ.find(x=>csFam(x)==f);playCS(o.i);let n=0;while(CS.on&&n<2000){csStep(.05);n++}}}catch(e){}`;
vm.runInContext(js,ctx);
const arr=[...caps.values()];fs.writeFileSync('shaders.json',JSON.stringify(arr));console.log('captured',arr.length);
