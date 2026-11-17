/* ---------- v25: generator teams (2+ slots), synergies, mastery, keystone forks, mixed costs, bottleneck helper ---------- */
SHOP.push({k:'slot',n:'Expanded Array',d:'+1 generator slot',max:1,c0:25,g:1});
{const u=SHOP.find(x=>x.k=='dust');if(u)u.d='All yields ×1.6 (every currency)'}
/* ---- keystone forks: option A = double effect, option B = a generator-focused alternative ---- */
const ALT=[['mast','slot','cat:star','syn','cat:planet','floor','cat:bh','mast','cat:mega','syn','cat:deep','slot'],
['cat:quark','floor','cat:atom','bal','cat:neb','syn','cat:gal','floor','cat:wh','bal','cat:exo','syn'],
['cat:mol','syn','cat:xtal','mast','cat:remn','bal','cat:star','syn','cat:mega','mast','cat:deep','bal'],
['floor','cat:life','slot','cat:micro','syn','cat:flora','bal','cat:fauna','floor','cat:wh','syn','cat:exo']];
NODES.forEach(n=>{if(n.mile&&n.br>=0)n.alt=ALT[n.br][Math.floor(n.j/TREE.mile)%12];
if(n.br>=0&&n.j>=40){n.cur2=(n.br+2)%4;n.cost2=.3*nodeCost(n.cur2,n.j)}});
const catName=k=>CATN[KEYS.indexOf(k)]||k;
function altTxt(a){if(!a)return'';if(a=='slot')return'+1 generator slot';if(a=='mast')return'Generator mastery grows 2× faster';if(a=='syn')return'Synergy bonuses 50% stronger';if(a=='floor')return'Off-specialty output ×2 for every modifier';if(a=='bal')return'Balanced team bonus +30%';
if(a.startsWith('cat:'))return catName(a.slice(4))+' generators yield ×3';return a}
const forkB=n=>!!(n&&n.mile&&S&&S.kc&&S.kc[n.key]);
function applyNode(n,D){if(n.leg){const f=n.fx;if(f.sp)D.sp*=f.sp;if(f.lk)D.lk+=f.lk;if(f.cu)D.cu*=f.cu;if(f.ml)D.ml+=f.ml;return}
if(n.mile&&forkB(n)){const a=n.alt;if(a=='slot')D.slot=(D.slot||0)+1;else if(a=='mast')D.mast=(D.mast||1)+1;else if(a=='syn')D.syn=(D.syn||0)+1;else if(a=='floor')D.floor=(D.floor||1)*2;else if(a=='bal')D.bal=(D.bal||0)+1;
else if(a&&a.startsWith('cat:')){D.cat=Object.assign({},D.cat||{});const k=a.slice(4);D.cat[k]=(D.cat[k]||1)*3}return}
if(n.br==0)D.sp*=n.v;else if(n.br==1)D.lk+=n.v;else if(n.br==2)D.cu*=n.v;else if(n.br==3)D.ml+=n.v}
/* ---- generator slots ---- */
function genSlots(){if(!S)return 2;return Math.min(5,2+(hasRule("Time's Arrow Reversed")?1:0)+(S.shop&&S.shop.slot?1:0)+((D&&D.slot)||0))}
function genList(){if(!S)return[];const sl=genSlots(),out=[];(S.gens||[]).forEach(i=>{if(out.length<sl&&i>=0&&i<N&&S.own[i]>-2&&OBJ[i].pu!='rule'&&!out.includes(i))out.push(i)});
if(out.length<sl){const own=[];for(let i=0;i<N;i++)if(S.own[i]>-2&&OBJ[i].pu!='rule'&&!out.includes(i))own.push(i);own.sort((a,b)=>K[b]-K[a]);for(const i of own){if(out.length>=sl)break;out.push(i)}}return out}
/* ---- mastery: time spent generating, kept across rebirths ---- */
const mastSec=i=>(S&&S.gm&&S.gm[OBJ[i].n])||0,mastLvl=i=>Math.min(10,Math.floor(Math.log2(1+mastSec(i)/300))),mastMul=i=>1+.15*mastLvl(i);
const mastNext=i=>{const l=mastLvl(i);return l>=10?0:300*(Math.pow(2,l+1)-1)-mastSec(i)};
const catMul=i=>(D&&D.cat&&D.cat[KEYS[OBJ[i].c]])||1;
function mprofF(m){const p=mprof(m),fl=(D&&D.floor)||1;if(modTier(m)==0)return p;return p.map(v=>v<.5?v*fl:v)}
/* ---- synergies ---- */
const SYN=[{n:'Quantum Foundation',d:'Fundamental Particle + Hadron or Atom',a:['quark'],b:['hadron','atom'],m:1.5},
{n:'Molecular Forge',d:'Molecule + Mineral',a:['mol'],b:['xtal'],m:1.5},
{n:'Living World',d:'Planet + any life',a:['planet'],b:['micro','flora','fauna','life'],m:1.5},
{n:'Star System',d:'Star + Planet or Minor Body',a:['star'],b:['planet','small'],m:1.5},
{n:'Stellar Graveyard',d:'Star + Stellar Remnant or Black Hole',a:['star'],b:['remn','bh'],m:1.5},
{n:'Cosmic Web',d:'Galaxy + Nebula',a:['gal'],b:['neb'],m:1.5},
{n:'Exotic Physics',d:'Spacetime Anomaly + Black Hole or Theoretical Exotic',a:['wh'],b:['bh','exo'],m:1.5},
{n:'Engineered Cosmos',d:'Megastructure + Star, Black Hole or Galaxy',a:['mega'],b:['star','bh','gal'],m:1.6},
{n:'Long Twilight',d:'Deep Time + Stellar Remnant or Black Hole',a:['deep'],b:['remn','bh'],m:1.6},
{n:'Resonance',d:'two generators of the same category',m:1.25},
{n:'Balanced',d:'every currency is favoured by a modified generator (2+ generators)',m:1.3}];
function synList(G){G=G||genList();const ks=G.map(i=>KEYS[OBJ[i].c]),has=k=>ks.includes(k),out=[],boost=1+.5*((D&&D.syn)||0);
SYN.forEach(s=>{let on=false,m=s.m;if(s.a)on=s.a.some(has)&&s.b.some(k=>has(k)&&!(s.a.includes(k)&&ks.filter(x=>x==k).length<2));
else if(s.n=='Resonance')on=ks.some((k,i)=>ks.indexOf(k)!==i);
else{m=s.m+.3*((D&&D.bal)||0);on=G.length>=2&&[0,1,2,3].every(c=>G.some(i=>modTier(S.own[i])>0&&mprof(S.own[i])[c]>.5))}
if(on)out.push({n:s.n,m:1+(m-1)*boost})});return out}
const synMul=G=>synList(G).reduce((a,s)=>a*s.m,1);
/* ---- rates now include mastery, category forks, off-specialty floor and synergies ---- */
function genBase(i){return Math.pow(10,.25*K[i])*mmul(S.own[i])*ascMul(i)*mastMul(i)*catMul(i)}
function rates(){const r=[0,0,0,0];if(!S||!D)return r;const G=genList();G.forEach(b=>{const base=genBase(b),p=mprofF(S.own[b]);for(let i=0;i<4;i++)r[i]+=base*p[i]});
const f=D.cu*(1+cnt()*.02)*ecoS()*synMul(G);for(let i=0;i<4;i++)r[i]=isFinite(r[i]*f)?r[i]*f:0;return r}
function itemRates(i,m){if(m===undefined||m<-1)m=-1;const base=Math.pow(10,.25*K[i])*mmul(m)*ascMul(i)*mastMul(i)*catMul(i),p=mprofF(m),f=D.cu*(1+cnt()*.02)*ecoS();return p.map(x=>isFinite(x*base*f)?x*base*f:0)}
/* ---- mixed costs: deeper nodes also take a share of a second currency ---- */
function costList(n){if(n.leg)return n.costs.map((c,i)=>[i,c]);const a=[[n.cur,n.cost]];if(n.cost2)a.push([n.cur2,n.cost2]);return a}
function canAfford(n){return costList(n).every(([i,c])=>getW(i)>=c)}
function payNode(n){costList(n).forEach(([i,c])=>addW(i,-c))}
function costTxt(n){const r=rates(),cs=costList(n);let wait=0;const parts=cs.map(([i,c])=>{const h=getW(i),miss=c-h;if(miss>0)wait=Math.max(wait,r[i]>0?miss/r[i]:Infinity);return curSpan(i,c)+(miss>0?`<small style="color:var(--dim)"> (${fmt(h)} held)</small>`:' <small style="color:#8fe39a">✓</small>')});
return'Cost: '+parts.join(cs.length>1?'<br>':' ')+(wait>0?`<br><small style="color:var(--dim)">ready in ~${fT(wait)}</small>`:'')}
const nodeWait=(n,r)=>{let w=0;costList(n).forEach(([i,c])=>{const m=c-getW(i);if(m>0)w=Math.max(w,r[i]>0?m/r[i]:Infinity)});return w};
/* ---- keystone fork UI on the node card ---- */
function buyFork(b){const n=NODES[sel];if(!n||!n.mile||!availN(n)||!canAfford(n))return;ensureS();if(b)S.kc[n.key]=1;else delete S.kc[n.key];payNode(n);S.up.push(n.id);recalc();n.g=.6;toast('Unlocked '+n.name+(b?' · '+altTxt(n.alt):''));nodeUI(true);try{curHUD(true)}catch(e){}}
function switchFork(){const n=NODES[sel];if(!n||!n.mile||!ownN(n))return;ensureS();const free=!S.rb;if(!free&&(S.rc||0)<1)return;if(!free)S.rc-=1;if(S.kc[n.key])delete S.kc[n.key];else S.kc[n.key]=1;recalc();toast('Keystone switched to '+(S.kc[n.key]?altTxt(n.alt):'double effect'));nodeUI(true)}
{const _nu=nodeUI;nodeUI=function(force){_nu(force);try{const p=$('node'),n=NODES[sel];if(!n||!n.mile||view!='t'||p.style.display=='none')return;let fb=$('forkbox');const own=ownN(n),av=availN(n),ok=canAfford(n),b=forkB(n);
if(!fb){fb=document.createElement('div');fb.id='forkbox';fb.style.cssText='margin-top:8px;display:flex;flex-direction:column;gap:6px';const bb=$('buy');if(bb)bb.style.display='none';p.appendChild(fb);fb._s=''}
const sig=[own,av,ok,b,S.rc|0].join();if(fb._s==sig)return;fb._s=sig;const a1=effTxt({br:n.br,v:n.v,leg:0}),a2=altTxt(n.alt),free=!S.rb;
fb.innerHTML=own?`<small>Keystone choice:</small><div style="padding:6px 8px;border:1px solid ${b?'#7cc4ff':'#ffe9a8'};border-radius:8px">${b?'B · '+a2:'A · '+a1}</div><button id="fksw" ${!free&&(S.rc||0)<1?'disabled':''}>Switch to ${b?'A · '+a1:'B · '+a2}<br><small>${free?'free during your first universe':'costs 1 aether'}</small></button>`
:`<small>Choose one (you can switch later):</small><button id="fka" ${av&&ok?'':'disabled'}>A · ${a1}</button><button id="fkb" ${av&&ok?'':'disabled'}>B · ${a2}</button>`;
const x=$('fka'),y=$('fkb'),z=$('fksw');if(x)x.onclick=()=>buyFork(0);if(y)y.onclick=()=>buyFork(1);if(z)z.onclick=switchFork}catch(e){}}}
/* ---- generator row on the item card: slots, mastery, synergy hints ---- */
function genRowUI(){const r=$('genrow');if(!r)return;if(view!='u'||curI<0||!S||OBJ[curI].pu=='rule'){r.innerHTML='';r.dataset.h='';return}const own=S.own[curI]>-2,G=genList(),on=G.includes(curI),manual=(S.gens||[]).length>0,sl=genSlots();
let h='';if(own)h+=on?`<button data-a="off" class="on" title="Stop using this item">⚡ Generating (${G.indexOf(curI)+1}/${sl})</button>`:`<button data-a="on">⚡ Use as generator <small>(${G.length}/${sl} slots)</small></button>`;if(manual)h+=`<button data-a="auto">Auto: rarest</button>`;
const t=ascTier(curI),rec=S.cxa?S.cxa[curI]:0;if(ASCN.has(OBJ[curI].n))h+=`<small style="align-self:center;color:#ffe9a0">${t?'Ascended '+'+'.repeat(t)+' · ×'+[1,3,9,27][t]+' yield':'Ascends with duplicates'}${rec>t?' · best '+'+'.repeat(rec):''}</small>`;
const ml=mastLvl(curI),nx=mastNext(curI),k=KEYS[OBJ[curI].c],pairs=SYN.filter(s=>s.a&&(s.a.includes(k)||s.b.includes(k))).map(s=>s.n);
h+=`<div style="flex-basis:100%;font-size:11.5px;color:var(--dim)">Mastery <b style="color:#ffe9a8">${ml}</b>/10 · ×${mastMul(curI).toFixed(2)} yield${ml<10?' · next level after ~'+fT(nx)+' generating':''}${catMul(curI)>1?' · <span style="color:#7cc4ff">keystone ×'+catMul(curI)+'</span>':''}${pairs.length?'<br>Synergies: '+pairs.join(', '):''}</div>`;
if(r.dataset.h!==h){r.dataset.h=h;r.innerHTML=h}}
/* ---- team + bottleneck line in the HUD ---- */
{const card=$('coin').parentNode,d=document.createElement('div');d.id='team';d.style.cssText='margin-top:5px;font-size:11px;line-height:1.45;max-width:320px';card.insertBefore(d,$('feed')||null);
d.addEventListener('click',e=>{if(e.target.closest('#bnfix'))fixBottleneck()})}
{const st=document.createElement('style');st.textContent='#team{pointer-events:auto}#team .syn{display:inline-block;padding:0 6px;margin:1px 3px 1px 0;border-radius:99px;border:1px solid rgba(255,233,168,.45);color:#ffe9a8;animation:synglow 2.4s ease-in-out infinite}@keyframes synglow{50%{box-shadow:0 0 8px rgba(255,220,140,.45)}}#team .bn{color:#ffb070}#team button{min-height:26px;padding:0 8px;font-size:11px;margin-left:4px}#hud{pointer-events:none}#hud #team button{pointer-events:auto}@media (max-width:600px){#team{max-width:200px}}';(document.head||document.body).appendChild(st)}
function bottleneck(){const r=rates(),need=[0,0,0,0],node=[null,null,null,null];for(let b=0;b<4;b++){const av=NODES.filter(n=>n.br==b&&availN(n));if(!av.length)continue;const n=av.reduce((x,y)=>nodeWait(x,r)<=nodeWait(y,r)?x:y);
costList(n).forEach(([i,c])=>{const m=c-getW(i);if(m>0){const w=r[i]>0?m/r[i]:Infinity;if(w>need[i]){need[i]=w;node[i]=n}}})}let bi=-1;need.forEach((w,i)=>{if(w>(bi<0?60:need[bi]))bi=i});return bi<0?null:{c:bi,w:need[bi],n:node[bi]}}
function fixBottleneck(){const B=bottleneck();if(!B)return;ensureS();const sl=genSlots(),own=[];for(let i=0;i<N;i++)if(S.own[i]>-2&&OBJ[i].pu!='rule')own.push(i);if(!own.length)return;
const rc=i=>itemRates(i,S.own[i]),first=own.reduce((a,b)=>rc(b)[B.c]>rc(a)[B.c]?b:a),rest=own.filter(i=>i!==first).sort((a,b)=>rc(b).reduce((s,v)=>s+v,0)-rc(a).reduce((s,v)=>s+v,0));
S.gens=[first,...rest].slice(0,sl);hudUI();genRowUI();toast('Generators set to boost '+CUR[B.c].s+' '+CUR[B.c].n)}
let _tmS='';function teamUI(){const d=$('team');if(!d||!S)return;const G=genList(),sy=synList(G),B=bottleneck();
const h=`<span style="color:var(--dim)">Team ${G.length}/${genSlots()}:</span> ${G.map(i=>`<span style="color:${TCOL[tierI(OBJ[i])]}">${OBJ[i].n}</span>`).join(', ')||'—'}<br>${sy.length?sy.map(s=>`<span class="syn">${s.n} ×${s.m.toFixed(2)}</span>`).join(''):'<span style="color:var(--dim)">No synergies: pair generators to unlock bonuses</span>'}`
+(B?`<br><span class="bn">⚠ Bottleneck: ${CUR[B.c].s} ${CUR[B.c].n}</span><span style="color:var(--dim)"> · ${B.n?BR[B.n.br].n+' node':'next node'} in ~${fT(B.w)}</span><button id="bnfix">Fix</button>`:'');if(h!==_tmS){_tmS=h;d.innerHTML=h}}
/* hide the old one-line generator label under the currencies (the team line replaces it) */
{const st=document.createElement('style');st.textContent='#hud #inc{display:none}';(document.head||document.body).appendChild(st)}
/* ---- mastery ticks + UI refresh (1 s) ---- */
setInterval(()=>{try{if(!S||document.hidden||CS.on)return;ensureS();const sp=(D&&D.mast)||1;genList().forEach(i=>{const n=OBJ[i].n;S.gm[n]=(S.gm[n]||0)+sp});teamUI();if(view=='u'&&curI>=0)genRowUI()}catch(e){}},1000);
/* ---- state, saves ---- */
{const _e=ensureS;ensureS=function(){_e();if(!S)return;if(!S.gm||typeof S.gm!='object')S.gm={};if(!S.kc||typeof S.kc!='object')S.kc={}}}
{const _rb=doRebirth;doRebirth=function(){const r=_rb.apply(this,arguments);if(S){S.kc={};recalc()}return r}}
{const _se=svEncode;svEncode=function(){const s=_se();try{const d=JSON.parse(decodeURIComponent(escape(atob(s.slice(6)))));const gm={};for(const k in (S.gm||{}))if(S.gm[k]>0)gm[k]=Math.round(S.gm[k]);d.gm=gm;d.kc=Object.keys(S.kc||{});return'CSMS4:'+btoa(unescape(encodeURIComponent(JSON.stringify(d))))}catch(e){return s}}}
{const _i=imp;imp=function(str,quiet){const ok=_i(str,quiet);if(ok)try{const c=cleanSave(str)||String(str).trim(),d=JSON.parse(decodeURIComponent(escape(atob(c.slice(c.indexOf(':')+1))))),names=new Set(OBJ.map(o=>o.n)),keys=new Set(NODES.filter(n=>n.mile).map(n=>n.key));
S.gm={};if(d.gm&&typeof d.gm=='object')for(const k in d.gm){const v=+d.gm[k];if(names.has(k)&&isFinite(v)&&v>0)S.gm[k]=v}S.kc={};(Array.isArray(d.kc)?d.kc:[]).forEach(k=>{if(keys.has(k))S.kc[k]=1});recalc()}catch(e){ensureS()}return ok}}
