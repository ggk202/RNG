/* ---------- v16: performance + graphics settings ---------- */
/* status text/HTML written by the 7 Hz UI tick is skipped when unchanged (no DOM churn, no relayout) */
let QUIET=false;if(typeof Node!=='undefined'){const d1=Object.getOwnPropertyDescriptor(Node.prototype,'textContent'),d2=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
if(d1&&d1.set)Object.defineProperty(Node.prototype,'textContent',{get(){return d1.get.call(this)},set(v){if(QUIET&&d1.get.call(this)===String(v))return;d1.set.call(this,v)},configurable:true,enumerable:d1.enumerable});
if(d2&&d2.set)Object.defineProperty(Element.prototype,'innerHTML',{get(){return d2.get.call(this)},set(v){v=String(v);if(QUIET&&this.__ih===v&&this.__ihf===this.firstChild&&this.__ihn===this.childNodes.length)return;d2.set.call(this,v);this.__ih=v;this.__ihf=this.firstChild;this.__ihn=this.childNodes.length},configurable:true,enumerable:d2.enumerable})}
let lastF=0,ftE=16.7,scaleMul=1,lastP='',adLast=0,fpsN=0,fpsT=0,fpsV=0;
const PANELS=['cxp','svp','rbp','shp','gfxp'];
function panelOpen(){for(const id of PANELS){const e=$(id);if(e&&e.style.display==='block')return true}return false}
function gfxCap(){let c=GFX.fps||0;if(view=='u'&&!CS.on&&panelOpen())c=c?Math.min(c,30):30;return c}
function gfxSkip(now){const cap=gfxCap();if(cap&&now-lastF<1000/cap-2)return true;const d=now-lastF;lastF=now;if(d<250)ftE+=(d-ftE)*.06;fpsN++;
if(now-fpsT>=1000){fpsV=Math.round(fpsN*1000/(now-fpsT));fpsN=0;fpsT=now;gfxInfo()}gfxAdapt(now,cap);return false}
function gfxAdapt(now,cap){if(!GFX.adapt||CS.on||MG.on||now-adLast<2500)return;adLast=now;const tg=1000/(cap||60);
if(ftE>tg*1.3&&scaleMul>.6){scaleMul=Math.max(.6,+(scaleMul-.1).toFixed(2));applyRes()}else if(ftE<tg*1.08&&scaleMul<1){scaleMul=Math.min(1,+(scaleMul+.05).toFixed(2));applyRes()}}
function applyRes(){rd.setPixelRatio(Math.min(devicePixelRatio||1,GFX.ratio)*scaleMul);resize()}
function gfxSave(){try{localStorage.setItem('csgfx',JSON.stringify(GFX))}catch(e){}}
function gfxMatch(){for(const k in GFXP){const p=GFXP[k];if(Object.keys(p).every(q=>+GFX[q]===+p[q]))return k}return'custom'}
function applyGfx(){U.lq.value=GFX.lens;bloom=GFX.bloom>0;scaleMul=1;applyRes();blT();GFX.preset=gfxMatch();gfxSave()}
/* skip the whole 3D frame while the minigame covers the screen */
{const _p=post;post=function(sc,cam){if(MG.on)return;_p(sc,cam)}}
/* Bloom button and B key drive the graphics setting */
$('bl').onclick=()=>{if(GFX.bloom){GFX._lb=GFX.bloom;GFX.bloom=0}else GFX.bloom=GFX._lb||2;applyGfx();if($('gfxp').style.display==='block')gfxUI()};
/* ---- graphics panel ---- */
const GPN={battery:'Battery saver',balanced:'Balanced',high:'High',ultra:'Ultra',custom:'Custom'};
const GOPT=[['ratio','Render resolution','Pixels rendered per screen point. Biggest effect on GPU load.',[[.75,'0.75×'],[1,'1×'],[1.25,'1.25×'],[1.5,'1.5×'],[2,'2×'],[3,'Native']]],
['fps','Frame rate cap','Fewer frames means less heat and battery. Menus always drop to 30.',[[30,'30 fps'],[60,'60 fps'],[0,'Unlimited']]],
['bloom','Bloom','Glow around bright objects. Low uses a smaller, softer glow buffer.',[[0,'Off'],[1,'Low'],[2,'High']]],
['hdr','HDR rendering','High dynamic range buffers; richer highlights. Applies after reload.',[[1,'On'],[0,'Off']]],
['aa','Antialiasing','Smooth edges (MSAA). Costly on tablets.',[[0,'Off'],[1,'On']]],
['lens','Lensing quality','Ray-march step size for black holes, wormholes and lensed skies.',[[.65,'Low'],[.8,'Medium'],[1,'High']]],
['adapt','Adaptive resolution','Lowers resolution temporarily when the frame rate drops, raises it again when it recovers.',[[0,'Off'],[1,'On']]],
['fpsShow','FPS counter','Small readout in the corner.',[[0,'Off'],[1,'On']]]];
function gfxInfo(){const fd=$('fpsd');if(fd){fd.style.display=GFX.fpsShow?'block':'none';if(GFX.fpsShow)fd.textContent=fpsV+' fps · '+BW+'×'+BH+(scaleMul<1?' · adaptive '+Math.round(scaleMul*100)+'%':'')}
const gi=$('gfxi');if(gi&&$('gfxp').style.display==='block')gi.textContent=`${fpsV} fps · rendering ${BW}×${BH}${scaleMul<1?' (adaptive '+Math.round(scaleMul*100)+'%)':''} · ${HDR?'HDR':'8-bit'} · ${rd.capabilities.isWebGL2?'WebGL 2':'WebGL 1'}`}
function gfxUI(){const p=$('gfxp'),hdrNow=HDR?1:0;
p.innerHTML=`<b>Graphics</b><p style="color:var(--dim);margin:.4em 0">Settings are stored on this device only. Preset: <b id="gfxpn">${GPN[GFX.preset]||'Custom'}</b></p>
<div id="gfxps" style="display:flex;flex-wrap:wrap;gap:6px">${['battery','balanced','high','ultra'].map(k=>`<button data-p="${k}" class="${GFX.preset==k?'on':''}">${GPN[k]}${k=='high'?' (default)':''}</button>`).join('')}</div>
<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;align-items:center;margin-top:12px">${GOPT.map(([k,l,d,o])=>`<div><div>${l}</div><small style="color:var(--dim)">${d}</small></div><select data-k="${k}">${o.map(([v,t])=>`<option value="${v}" ${+GFX[k]===v?'selected':''}>${t}</option>`).join('')}</select>`).join('')}</div>
${(GFX.hdr?1:0)!==hdrNow?'<p style="color:#ffd27a">HDR change takes effect after reloading. <button id="gfxrl">Reload now</button></p>':''}
<p id="gfxi" style="color:var(--dim)"></p><p><button id="gfxc">Close</button></p>`;
p.querySelectorAll('#gfxps button').forEach(b=>b.onclick=()=>{Object.assign(GFX,GFXP[b.dataset.p]);applyGfx();gfxUI()});
p.querySelectorAll('select').forEach(s=>s.onchange=()=>{GFX[s.dataset.k]=+s.value;applyGfx();gfxUI()});
$('gfxc').onclick=hideP;const rl=$('gfxrl');if(rl)rl.onclick=()=>{try{location.reload()}catch(e){}};gfxInfo()}
$('gfxb').onclick=()=>{hideP();$('gfxp').style.display='block';gfxUI()};
applyGfx();
