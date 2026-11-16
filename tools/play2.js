// Two-run progression: base run to Totality, rebirth (greedy aether shop), then Layer I to the Cosmogenesis Engine.
const vm=require('vm'),fs=require('fs');
const mk=()=>{const f=function(){};return new Proxy(f,{get(t,k){if(k===Symbol.toPrimitive)return h=>h==='string'?'x':.5;if(k===Symbol.iterator)return function*(){};if(k==='then')return undefined;if(k==='count')return 1;if(k in t&&k!=='prototype'&&k!=='name'&&k!=='length')return t[k];if(!t['__'+String(k)])t['__'+String(k)]=mk();return t['__'+String(k)]},set(t,k,v){t['__'+String(k)]=v;return true},apply(){return mk()},construct(){return mk()}})};
const HOURS=+process.argv[2]||12,SEED=+process.argv[3]||1,PATCH=process.argv[4]||'';
let s=SEED;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
let now=0,raf=null;const ints=[];
const ctx={THREE:mk(),console:{log(){},warn(){},error(){}},document:{getElementById:()=>mk(),body:mk(),addEventListener(){},createElement:()=>mk()},matchMedia:()=>({matches:false}),navigator:{maxTouchPoints:0},addEventListener(){},innerWidth:1200,innerHeight:800,devicePixelRatio:1,performance:{now:()=>now},requestAnimationFrame(f){raf=f},cancelAnimationFrame(){},setInterval(f,ms){ints.push({f,ms,next:ms})},setTimeout(){},clearTimeout(){},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},confirm:()=>false,btoa:s=>s,atob:s=>s,Math,Date:{now:()=>now}};
ctx.window=ctx;vm.createContext(ctx);let src=fs.readFileSync('g.js','utf8');if(PATCH){for(const [a,b] of JSON.parse(PATCH))src=src.split(a).join(b)}
vm.runInContext(src+`;globalThis.__api={get S(){return S},manual,best,buyAuto,doRebirth,shopGreedy,LFIN,N:OBJ.length,income,CS};`,ctx);const A=ctx.__api;A.S.ab=true;
const ms={};const mark=k=>{if(ms[k]===undefined)ms[k]=now/1000};const f=s=>s<3600?(s/60).toFixed(0)+'m':(s/3600).toFixed(2)+'h';
let rbT=null;const tot=A.LFIN[0],fin=A.LFIN[1];
while(now<HOURS*3600e3){now+=100;if(raf)raf(now);for(const it of ints)if(now>=it.next){it.next+=it.ms;it.f()}
 A.CS.on=false;const S=A.S;const tr=rbT===null?now:now-rbT;if(tr<3600e3)A.manual();A.buyAuto();
 const b=A.best();if(rbT===null){if(S.own[tot]>-2){mark('run1_totality');A.doRebirth('bal');A.shopGreedy();A.S.ab=true;rbT=now;ms.aether=A.S.rc;ms.shop=JSON.stringify(A.S.shop)}}
 else{if(b>=tot-100)mark('run2_old75');if(S.own[tot]>-2)mark('run2_totality');if(b>=tot+12)mark('run2_L1_25%');if(b>=tot+25)mark('run2_L1_50%');if(b>=tot+38)mark('run2_L1_75%');if(b>=fin-1&&!S.mg[1]){S.mg[1]=true;mark('run2_gate')}if(S.own[fin]>-2){mark('run2_finale');break}}}
const out=Object.entries(ms).map(([k,v])=>k+':'+(typeof v=='number'&&k!='aether'?f(rbT&&k.startsWith('run2')?v-rbT/1000:v):v)).join('  ');
console.log(PATCH.slice(0,90),'=>',out,'| end',f(now/1000),'best',A.best(),'tree',A.S.up.length,'inc',A.income().toExponential(1));
