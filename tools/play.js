// Drives the real game code headlessly (mocked rendering) to measure progression pace.
const vm=require('vm'),fs=require('fs');
const mk=()=>{const f=function(){};return new Proxy(f,{get(t,k){if(k===Symbol.toPrimitive)return h=>h==='string'?'x':.5;if(k===Symbol.iterator)return function*(){};if(k==='then')return undefined;if(k==='count')return 1;if(k in t&&k!=='prototype'&&k!=='name'&&k!=='length')return t[k];if(!t['__'+String(k)])t['__'+String(k)]=mk();return t['__'+String(k)]},set(t,k,v){t['__'+String(k)]=v;return true},apply(){return mk()},construct(){return mk()}})};
const HOURS=+process.argv[2]||6,MANUAL_H=+process.argv[3]||1,SEED=+process.argv[4]||1;
let s=SEED;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
let now=0,raf=null;const ints=[];
const ctx={THREE:mk(),console:{log(){},warn(){},error(){}},document:{getElementById:()=>mk(),body:mk(),addEventListener(){},createElement:()=>mk()},matchMedia:()=>({matches:false}),navigator:{maxTouchPoints:0},addEventListener(){},innerWidth:1200,innerHeight:800,devicePixelRatio:1,performance:{now:()=>now},requestAnimationFrame(f){raf=f},setInterval(f,ms){ints.push({f,ms,next:ms})},setTimeout(){},clearTimeout(){},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},confirm:()=>false,btoa:s=>s,atob:s=>s,Math};
ctx.window=ctx;vm.createContext(ctx);
let src=fs.readFileSync(process.argv[5]||'g.js','utf8');if(process.argv[6])src=src.replace(/const BAL=\{[^}]*\};/,'const BAL='+process.argv[6]+';');const js=src+`;globalThis.__api={get S(){return S},manual,best,cnt,hasAuto:()=>typeof hasAuto=='function'?hasAuto():S.auto,buyAuto,N:OBJ.length,NN:NODES.length-1,income,K};`;
vm.runInContext(js,ctx);const A=ctx.__api;A.S.ab=true;
const ms={};const mark=(k)=>{if(ms[k]===undefined)ms[k]=now/1000};
const f=s=>s<3600?(s/60).toFixed(1)+'m':s<86400?(s/3600).toFixed(2)+'h':(s/86400).toFixed(1)+'d';
const end=HOURS*3600e3;let lastLog=0;
while(now<end){now+=100;if(raf)raf(now);for(const it of ints)if(now>=it.next){it.next+=it.ms;it.f()}
 if(now<MANUAL_H*3600e3)A.manual();A.buyAuto();
 const S=A.S;if(A.hasAuto())mark('auto');const b=A.best(),own=S.up.length/A.NN;
 for(const q of [.25,.5,.75,1])if(own>=q)mark('tree'+q*100);
 for(const q of [.25,.5,.75,.9])if(b>=Math.floor(q*(A.N-1)))mark('item'+q*100);
 if(S.own[A.N-1]>-2)mark('TOTALITY');
 if(ms.TOTALITY!==undefined&&ms.tree100!==undefined)break;}
console.log((process.argv[6]||'')+' => '+Object.entries(ms).map(([k,v])=>k+':'+f(v)).join('  '),'| end',f(now/1000),'tree',A.S.up.length+'/'+A.NN,'best',A.best(),'income',A.income().toExponential(1));
