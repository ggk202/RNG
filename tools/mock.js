const vm=require('vm'),fs=require('fs');
const mk=()=>{const f=function(){};return new Proxy(f,{get(t,k){if(k===Symbol.toPrimitive)return h=>h==='string'?'x':.5;if(k===Symbol.iterator)return function*(){};if(k==='then')return undefined;if(k==='count')return 1;if(k in t&&k!=='prototype'&&k!=='name'&&k!=='length')return t[k];if(!t['__'+String(k)])t['__'+String(k)]=mk();return t['__'+String(k)]},set(t,k,v){t['__'+String(k)]=v;return true},apply(){return mk()},construct(){return mk()}})};
const THREE=mk();const el=()=>mk();
const errs=[];
const ctx={THREE,console:{log(){},warn(){},error(...a){errs.push(a.map(x=>x&&x.stack?x.stack.split('\n').slice(0,3).join(' | '):String(x)).join(' '))}},document:{getElementById:el,body:mk(),addEventListener(){},createElement:()=>mk()},matchMedia:()=>({matches:false}),navigator:{maxTouchPoints:0,clipboard:mk()},addEventListener(){},innerWidth:1200,innerHeight:800,devicePixelRatio:1,performance:{now:()=>0},requestAnimationFrame(){},setInterval(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},confirm:()=>false,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary')};
ctx.window=ctx;vm.createContext(ctx);
let js=fs.readFileSync('g.js','utf8');
js+=`;(function(){const fails=[];for(const o of OBJ){try{show(o.i,-1)}catch(e){fails.push(o.n+': '+e.message)}}
for(let m=0;m<MODS.length;m++){try{show(OBJ.length-1,m);show(150,m)}catch(e){fails.push('mod '+MODS[m].n+': '+e.message)}}
try{for(const f of ['bh','wh','life','exo','total']){const o=OBJ.find(x=>csFam(x)==f);playCS(o.i);fails.push('ran '+f+' '+o.n);let n=0;while(CS.on&&n<2000){csStep(.05);n++}}}catch(e){fails.push('CS: '+e.message+' @ '+String(e.stack).split(String.fromCharCode(10))[1])}
const ws=OBJ.filter(o=>KEYS[o.c]=='wh').map(o=>o.n);globalThis.R_={fails,N:OBJ.length,wh:ws,cats:CATN.length,keys:KEYS.length,desc:OBJ.filter(o=>!o.d).map(o=>o.n),or:OR.length,top:OBJ[OBJ.length-1].n,old:OLDN.length}})();`;
try{vm.runInContext(js,ctx,{filename:'g.js'})}catch(e){console.log('TOP-LEVEL ERROR',e.stack.split('\n').slice(0,4).join('\n'))}
console.log(JSON.stringify(ctx.R_,null,0));console.log('console.errors:',errs.length);errs.slice(0,40).forEach(e=>console.log(' ',e));
