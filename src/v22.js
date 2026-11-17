/* ---------- v22: four currencies, specialised modifiers, a long spiral skill tree with a legendary spire ---------- */
/* Currencies: 0 Chronons (Chronal Speed), 1 Aurum (Fortune), 2 Stardust (Stellar Forge, kept in S.coins), 3 Anomalons (Anomaly). */
function modTier(m){return m<0?0:m<10?1:m<18?2:m<24?3:4}
const PROF_F=[1,2.4,1.8,1.45,1.3],PROF_O=.12;
function mprof(m){const k=modTier(m);if(!k)return[1,1,1,1];const a=[PROF_O,PROF_O,PROF_O,PROF_O];for(let i=0;i<k;i++)a[(m+i)%4]=PROF_F[k];return a}
function profTxt(m){const p=mprof(m),y=mmul(m);return'<span style="font-size:12px">'+p.map((v,i)=>`<span style="color:${v>.5?CUR[i].c:'#5a6480'}">${CUR[i].s}&#8202;×${fmt(v*y)}</span>`).join(' &nbsp;')+'</span>'}
function rates(){const r=[0,0,0,0];if(!S||!D)return r;const G=genList();G.forEach(b=>{const base=Math.pow(10,.25*K[b])*mmul(S.own[b])*ascMul(b),p=mprof(S.own[b]);for(let i=0;i<4;i++)r[i]+=base*p[i]});const f=D.cu*(1+cnt()*.02)*ecoS();for(let i=0;i<4;i++)r[i]=isFinite(r[i]*f)?r[i]*f:0;return r}
function getW(i){return i==2?S.coins:(S.w&&S.w[i])||0}
function addW(i,v){if(!isFinite(v))return;if(i==2){S.coins=Math.max(0,S.coins+v);return}if(!Array.isArray(S.w)||S.w.length!=4)S.w=[0,0,0,0];S.w[i]=Math.max(0,(+S.w[i]||0)+v)}
function gainAll(sec){const r=rates();if(sec>0)for(let i=0;i<4;i++)addW(i,r[i]*sec);return r}
{const _e=ensureS;ensureS=function(){_e();if(!S)return;if(!Array.isArray(S.w)||S.w.length!=4)S.w=[0,0,0,0];S.w=S.w.map(v=>isFinite(+v)&&+v>=0?+v:0)}}
/* ---- availability, legendary reveal ---- */
function availLen(){return TREE.base+TREE.perRb*Math.min(S&&S.rb||0,6)}
let _boS=null,_bo=[0,0,0,0];
function brOwned(){if(!S)return _bo;const u=upSet();if(u===_boS)return _bo;_boS=u;_bo=[0,0,0,0];u.forEach(id=>{const n=NODES[id];if(n&&n.br>=0)_bo[n.br]++});return _bo}
function legReady(k){const lv=k*TREE.mile;return lv<=availLen()&&brOwned().every(c=>c>=lv)}
function nodeLocked(n){if(!n||n.id==0)return false;if(n.leg)return!ownN(n)&&!legReady(n.leg);return n.j>=availLen()}
function canAfford(n){return n.leg?n.costs.every((c,i)=>getW(i)>=c):getW(n.cur)>=n.cost}
function payNode(n){if(n.leg)n.costs.forEach((c,i)=>addW(i,-c));else addW(n.cur,-n.cost)}
function cheapN(){let b=null;NODES.forEach(n=>{if(availN(n)&&!n.leg&&(!b||n.cost<b.cost))b=n});return b}
const curSpan=(i,v)=>`<span style="color:${CUR[i].c}">${CUR[i].s}&#8202;${fmt(v)}</span>`;
function effTxt(n){if(n.leg){const f=n.fx,L=[];if(f.sp)L.push('Roll cooldown ÷'+f.sp);if(f.lk)L.push('Luck +10^'+f.lk);if(f.cu)L.push('Yield ×'+f.cu);if(f.ml)L.push('Modifier luck +10^'+f.ml);return L.join(' · ')}
return['Roll cooldown ÷','Luck +10^','Yield ×','Modifier luck +10^'][n.br]+(n.br==0||n.br==2?n.v.toFixed(3):n.v.toFixed(2))}
function nodeDelta(n){if(!n||n.br==-1)return'';const E=Object.assign({},D);applyNode(n,E);const L=[],cd=cdn();
if(E.sp!==D.sp)L.push(`Cooldown ${fCD(cd)} → ${fCD(cd*D.sp/E.sp)}`);if(E.lk!==D.lk)L.push(`Luck ×10^${D.lk.toFixed(2)} → ×10^${E.lk.toFixed(2)}`);
if(E.cu!==D.cu){const r=rates();L.push(`Yield ×${fmt(D.cu)} → ×${fmt(E.cu)} (all four currencies)`)}if(E.ml!==D.ml)L.push(`Mod luck ×10^${D.ml.toFixed(2)} → ×10^${E.ml.toFixed(2)}`);return L.join('<br>')}
function costTxt(n){const r=rates(),cs=n.leg?n.costs.map((c,i)=>[i,c]):[[n.cur,n.cost]];let wait=0;const parts=cs.map(([i,c])=>{const h=getW(i),miss=c-h;if(miss>0)wait=Math.max(wait,r[i]>0?miss/r[i]:Infinity);return curSpan(i,c)+(miss>0?`<small style="color:var(--dim)"> (${fmt(h)} held)</small>`:' <small style="color:#8fe39a">✓</small>')});
return'Cost: '+parts.join(n.leg?'<br>':' ')+(wait>0?`<br><small style="color:var(--dim)">ready in ~${fT(wait)}</small>`:'')}
function nodeUI(force){const p=$('node');if(view!='t'||sel<0){p.style.display='none';nodeSig='';return}
const n=NODES[sel];if(!n){sel=-1;p.style.display='none';return}const own=ownN(n),av=availN(n),sig=sel+'|'+own+'|'+av;p.style.display='block';
if(force||sig!=nodeSig){nodeSig=sig;const hcl=n.br==-1?'#fff':n.leg?'#ffcf6a':`hsl(${brH(n)*360},90%,70%)`,bo=brOwned();
const sub=n.br==-1?'The origin of all branches':n.leg?`Legendary ${ROMAN(n.leg)} of ${LEGS.length} · costs all four currencies`:`${BR[n.br].n} · node ${n.j+1}/${availLen()} · ${bo[n.br]} unlocked${n.mile?' · keystone (double effect)':''}`;
p.innerHTML=`<button id="ncl" style="float:right;min-height:36px;padding:4px 12px">✕</button><b style="color:${hcl}">${n.name}</b><br><small>${sub}</small><div style="margin:6px 0">${n.br==-1?'All four branches grow from here. Legendary nodes rise above it.':effTxt(n)}</div><div id="ndl" style="font-size:12px;color:#c6d2f0;margin-bottom:4px"></div>`+(own?'<small style="color:#8fe39a">✓ Unlocked</small>':`<small id="ncost"></small><button id="buy" style="width:100%;margin-top:6px">${av?'Unlock':'Locked: unlock the previous node first'}</button>`);
$('ncl').onclick=()=>{sel=-1;nodeUI()};const b=$('buy');if(b)b.onclick=buyNode}
$('ndl').innerHTML=own?'':nodeDelta(n);const b=$('buy');if(b){b.disabled=!(av&&canAfford(n));$('ncost').innerHTML=costTxt(n)}}
function buyNode(){const n=NODES[sel];if(n&&availN(n)&&canAfford(n)){payNode(n);S.up.push(n.id);recalc();n.g=.6;toast((n.leg?'✦ ':'')+'Unlocked '+n.name);nodeUI(true);try{curHUD(true)}catch(e){}}}
function treeSum(){const r=rates(),bo=brOwned(),AL=availLen(),val=[`cooldown ${fCD(cdn())}`,`luck ×10^${D.lk.toFixed(1)}`,`yield ×${fmt(D.cu)}`,`mod luck ×10^${D.ml.toFixed(1)}`],aff=NODES.filter(n=>availN(n)&&canAfford(n)).length;
const lg=NODES.filter(n=>n.leg),lo=lg.filter(ownN).length,nx=lg.find(n=>!ownN(n)),nxt=nx?(nx.lv>AL?`next legendary needs a deeper rebirth`:nodeLocked(nx)?`next legendary: ${nx.lv} nodes in every branch`:`<b style="color:#ffcf6a">${nx.name.replace('Legendary: ','')}</b> is waiting`):'spire complete';
$('tsum').innerHTML='<b>Constellation</b> <small>'+S.up.length+'/'+(AL*4+lg.filter(n=>!nodeLocked(n)).length)+'</small>'+BR.map((b,i)=>{const u=bo[i],h=b.h*360;return`<div class="br"><span style="color:hsl(${h},90%,72%)">${b.n}</span> <small>${u}/${AL}</small><div class="pb"><i style="width:${Math.min(100,u/AL*100)}%;background:hsl(${h},90%,60%)"></i></div><small>${curSpan(i,getW(i))} <span style="color:var(--dim)">+${fmt(r[i])}/s · ${val[i]}</span></small></div>`}).join('')
+`<div class="br"><span style="color:#ffcf6a">Legendary spire</span> <small>${lo}/${LEGS.length}</small><br><small style="color:var(--dim)">${nxt}</small></div><small style="color:${aff?'#ffe9a8':'var(--dim)'}">${aff?aff+' node'+(aff>1?'s':'')+' affordable now':'Tap a node to inspect it'}</small>${abLine()}`}
/* ---- HUD: four currency counters ---- */
{const st=document.createElement('style');st.textContent='#coin{display:grid;grid-template-columns:auto auto;gap:1px 12px;font-weight:600;font-size:14px;line-height:1.25}#coin small{font-weight:400;color:var(--dim);font-size:11px}#coin>div{white-space:nowrap}';(document.head||document.body).appendChild(st)}
let _chS='';function curHUD(force){if(!S)return;const r=rates(),h=CUR.map((c,i)=>`<div title="${c.n}">${curSpan(i,getW(i))} <small>+${fmt(r[i])}/s</small></div>`).join('');if(force||h!=_chS){_chS=h;$('coin').innerHTML=h}}
/* ---- legendary reveal toast ---- */
let _legS=null,_legN=0;function legCheck(){if(!S)return;const n=NODES.filter(x=>x.leg&&!nodeLocked(x)).length;if(_legS!==S){_legS=S;_legN=n;return}if(n>_legN)toast('✦ A legendary node has risen above the Singularity Core. It costs all four currencies.');_legN=n}
{const _h=hudUI;hudUI=function(){_h.apply(this,arguments);try{legCheck()}catch(e){}}}
/* ---- rebirth: the head start applies to every currency ---- */
{const _rb=doRebirth;doRebirth=function(){const r=_rb.apply(this,arguments);if(S){const h=S.coins;S.w=[h,h,0,h];_legS=S;_legN=0}return r}}
/* ---- saves: the three new currencies (stardust stays in "c") ---- */
{const _se=svEncode;svEncode=function(){const s=_se();try{const d=JSON.parse(decodeURIComponent(escape(atob(s.slice(6)))));const w=S.w||[0,0,0,0];d.w=[w[0],w[1],w[3]].map(v=>isFinite(v)?v:0);return'CSMS4:'+btoa(unescape(encodeURIComponent(JSON.stringify(d))))}catch(e){return s}}}
{const _i=imp;imp=function(str,quiet){const ok=_i(str,quiet);if(!ok)return ok;try{const c=cleanSave(str)||String(str).trim(),d=JSON.parse(decodeURIComponent(escape(atob(c.slice(c.indexOf(':')+1))))),w=Array.isArray(S.w)&&S.w.length==4?S.w:[0,0,0,0],oc=isFinite(+d.c)&&+d.c>=0?+d.c:0,dw=Array.isArray(d.w)?d.w.map(v=>isFinite(+v)&&+v>=0?+v:0):[oc,oc,oc];/* saves from before the four currencies: mirror the stardust savings once */
S.w=[w[0]+(dw[0]||0),w[1]+(dw[1]||0),0,w[3]+(dw[2]||0)]}catch(e){if(!Array.isArray(S.w))S.w=[0,0,0,0]}_legS=S;try{_legN=NODES.filter(x=>x.leg&&!nodeLocked(x)).length}catch(e){}return ok}}
