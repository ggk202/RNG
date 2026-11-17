/* ---------- v23: codex currency rates, legendary impact-frame relics, upgrade navigator ---------- */
let TGO=null,tlF=-1,_tlSig='';
/* ---- codex: what every item would produce as a generator, top producer per currency marked ---- */
function itemRates(i,m){if(m===undefined||m<-1)m=-1;const base=Math.pow(10,.25*K[i])*mmul(m)*ascMul(i),p=mprof(m),f=D.cu*(1+cnt()*.02)*ecoS();return p.map(x=>isFinite(x*base*f)?x*base*f:0)}
function topGens(){const top=[-1,-1,-1,-1],tv=[-1,-1,-1,-1];OBJ.forEach(o=>{if(S.own[o.i]<=-2||o.pu=='rule')return;itemRates(o.i,S.own[o.i]).forEach((v,c)=>{if(v>tv[c]){tv[c]=v;top[c]=o.i}})});return{top,tv}}
{const st=document.createElement('style');st.textContent=`.cr{display:flex;flex-wrap:wrap;gap:2px 9px;font-size:11px;margin-top:3px;align-items:center}.cr.pot{opacity:.5}.cr .tp{font-weight:700;border:1px solid currentColor;border-radius:5px;padding:0 4px;box-shadow:0 0 8px currentColor inset}
.it.topg{border-color:#ffe9a8;box-shadow:0 0 10px rgba(255,233,168,.25)}#cxtop{font-size:12px;margin:0 0 8px;line-height:1.6}#cxtop b{font-weight:600}
#tlist{position:fixed;left:10px;top:calc(env(safe-area-inset-top,0px) + 70px);width:250px;display:none;font-size:12px;z-index:5;max-height:calc(100vh - 170px);overflow:hidden;flex-direction:column}
#tlist .hd{display:flex;align-items:center;gap:6px}#tlist .hd b{flex:1}#tlist .hd button{min-height:30px;padding:2px 10px}
#tlf{display:flex;gap:4px;margin:6px 0;flex-wrap:wrap}#tlf button{min-height:28px;padding:2px 8px;font-size:12px;opacity:.55}#tlf button.on{opacity:1;border-color:currentColor}
#tlb{overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1;min-height:0}#tlb .tr{display:flex;align-items:center;gap:6px;padding:5px 4px;border-radius:6px;cursor:pointer;border:1px solid transparent}
#tlb .tr:hover,#tlb .tr.sel{border-color:var(--bd);background:rgba(255,255,255,.04)}#tlb .tr .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#tlb .tr small{color:var(--dim)}
#tlb .tr .ok{color:#8fe39a}#tlb .tr button{min-height:28px;padding:0 9px;font-size:13px}#tlb .lg{background:linear-gradient(90deg,rgba(255,190,80,.16),transparent);border-color:rgba(255,200,100,.5)!important}
#tlb .lg .nm{white-space:normal}#tlb .dot{width:8px;height:8px;border-radius:50%;flex:0 0 8px}body.tlon #node{left:270px}body.tlc #tlb,body.tlc #tlf{display:none}
@media (max-width:600px){#tlist{width:170px;top:calc(env(safe-area-inset-top,0px) + 165px);max-height:45vh}body.tlon #node{left:10px}body.tlon #tsum{display:none!important}}
body.cs #tlist{display:none!important}`;(document.head||document.body).appendChild(st)}
function codexRates(){if($('cxp').style.display!='block')return;const box=$('cx');if(!box)return;
if(cxTab==-2){box.querySelectorAll('.it.md[data-m]').forEach(el=>{if(el.classList.contains('no'))return;el.insertAdjacentHTML('beforeend','<div class="cr">'+profTxt(+el.dataset.m)+'</div>')});return}
const {top,tv}=topGens();let hd=$('cxtop');if(!hd){hd=document.createElement('div');hd.id='cxtop';box.parentNode.insertBefore(hd,box)}
hd.innerHTML='<b>Top generators this run</b> <small style="color:var(--dim)">(★ marks the best item for each currency)</small><br>'+CUR.map((c,k)=>top[k]>=0?`<span style="color:${c.c}">${c.s} ${OBJ[top[k]].n} · ${fmt(tv[k])}/s</span>`:`<span style="color:var(--dim)">${c.s} —</span>`).join(' &nbsp; ');
box.querySelectorAll('.it[data-i]').forEach(el=>{const i=+el.dataset.i,o=OBJ[i];if(el.classList.contains('no')||!o||o.pu=='rule')return;const owned=S.own[i]>-2;let m=owned?S.own[i]:bestSeen(i);if(!(m>=-1))m=-1;const r=itemRates(i,m),tp=top.map(x=>x==i);if(tp.some(x=>x))el.classList.add('topg');
el.insertAdjacentHTML('beforeend',`<div class="cr ${owned?'':'pot'}">${r.map((v,c)=>`<span class="${tp[c]?'tp':''}" style="color:${CUR[c].c}" title="${CUR[c].n} per second">${tp[c]?'★':''}${CUR[c].s}&#8202;${fmt(v)}/s</span>`).join('')}${owned?'':'<small>if owned</small>'}</div>`)})}
{const _rc=refreshCodex;refreshCodex=function(){const r=_rc.apply(this,arguments);try{const hd=$('cxtop');if(hd)hd.style.display=cxTab==-2?'none':'';codexRates()}catch(e){}return r}}
/* ---- legendary relics: an impact-frame shader on nested polyhedra with flickering speed lines ---- */
const LEGFS=`uniform float st,fs,sd;void main(){vec3 n=normalize(vN),v=normalize(vV);float f=1.-abs(dot(n,v));float nz=fbm(vP*4.+vec3(t*.7,0.,sd));
vec3 gold=vec3(1.,.72,.26)*(.35+nz*.75)+vec3(1.,.93,.75)*pow(f,2.5)*.9;vec3 col=gold;
if(fs>.5&&fs<1.5)col=mix(vec3(0.),vec3(1.6),step(.5,f+nz*.15));else if(fs>1.5)col=mix(vec3(1.2,.04,.03),vec3(0.),step(.55,f+nz*.2));
else col*=mix(.45,1.,st);gl_FragColor=vec4(col,1.);}`;
const LEGV=[];
function legSpikes(seed){const r=R(seed),P=[],A=[];for(let k=0;k<44;k++){const d=V3(gs(r),gs(r),gs(r)).normalize(),q=V3(gs(r),gs(r),gs(r)).cross(d).normalize().multiplyScalar(.018+r()*.03),r0=.9+r()*.25,r1=1.7+r()*1.2;
[d.clone().multiplyScalar(r0).add(q),d.clone().multiplyScalar(r0).sub(q),d.clone().multiplyScalar(r1)].forEach((p,j)=>{P.push(p.x,p.y,p.z);A.push(k,j==2?1:0,0)})}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('aux',new THREE.Float32BufferAttribute(A,3));
const mat=new THREE.ShaderMaterial({uniforms:{fr:{value:0},fs:{value:0},al:{value:1}},transparent:true,depthWrite:false,side:THREE.DoubleSide,
vertexShader:`attribute vec3 aux;uniform float fr;varying float vt;void main(){vec3 p=position;float h=fract(sin(aux.x*12.9898+fr*78.233)*43758.5453);if(aux.y>.5)p*=.3+h*1.9;vt=aux.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
fragmentShader:`uniform float fs,al;varying float vt;void main(){vec3 c=fs<.5?vec3(.85,.62,.28):fs<1.5?vec3(1.):vec3(1.,.06,.03);gl_FragColor=vec4(c*(1.-vt*.6),al*(1.-vt*.6));}`});
const m=new THREE.Mesh(g,mat);m.frustumCulled=false;return m}
NODES.forEach((n,i)=>{if(!n.leg)return;const m=nm[i],mat=sm(LEGFS,{st:{value:0},fs:{value:0},sd:{value:n.leg*1.7}});m.material=mat;m.geometry=new THREE.IcosahedronGeometry(.62,0);
const wire=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(1.05,0)),new THREE.LineBasicMaterial({color:0xffd27a,transparent:true,depthWrite:false}));
const stel=new THREE.Group();[0,1].forEach(k=>{const tt=new THREE.Mesh(new THREE.TetrahedronGeometry(.95,0),mat);if(k)tt.scale.set(-1,-1,-1);stel.add(tt)});
const sw=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(1.0,0)),wire.material);stel.add(sw);
const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(.95,.03,160,6,3,5),mat);const spk=legSpikes(n.leg*97+5);
const grp=new THREE.Group();grp.add(wire,stel,knot,spk);m.add(grp);m.userData.big=1.25;LEGV.push({n,m,mat,wire,stel,knot,spk,grp,fr:0,fs:0})});
let _lfT=0;
{const _tf=treeFX;treeFX=function(t,dt){_tf(t,dt);if(TGO){tc.lerp(TGO,Math.min(1,dt*3));if(tc.distanceTo(TGO)<.01)TGO=null}
_lfT+=dt;const step=_lfT>=1/11;if(step)_lfT=0;
LEGV.forEach((L,k)=>{if(!L.m.visible)return;if(step){L.fr++;const h=Math.random();L.fs=h<.5?0:h<.82?1:2}
const fs=L.fs;L.mat.uniforms.fs.value=fs;L.m.children[0].visible=fs==0;if(L.m.children[1])L.m.children[1].visible=fs==0&&ownN(L.n);L.spk.material.uniforms.fs.value=fs;L.spk.material.uniforms.fr.value=L.fr;L.spk.material.uniforms.al.value=ownN(L.n)?1:.55;
L.wire.material.color.setRGB(fs==1?1:fs==2?1:1,fs==1?1:fs==2?.1:.82,fs==1?1:fs==2?.05:.48);
L.grp.rotation.y=t*.35+k;L.stel.rotation.set(t*.6,t*.4,0);L.knot.rotation.set(t*.25,-t*.5,t*.15);L.wire.rotation.set(-t*.3,t*.2,0);
const pul=1+.06*Math.sin(t*9+k)+(fs?.08:0);L.grp.scale.setScalar(pul)})}}
/* ---- upgrade navigator: every node you can unlock right now, beside the tree ---- */
{const d=document.createElement('div');d.id='tlist';d.className='card';d.innerHTML='<div class="hd"><b>Upgrades</b><small id="tlc"></small><button id="tlctr" title="Recenter the camera">◎</button><button id="tlx">▾</button></div><div id="tlf"></div><div id="tlb"></div>';document.body.appendChild(d);
if(innerWidth<=600)document.body.classList.add('tlc');
$('tlx').onclick=()=>{document.body.classList.toggle('tlc');_tlSig='';tlUI()};$('tlctr').onclick=()=>{TGO=V3(0,0,0);VW.t.d=95};
$('tlf').onclick=e=>{const b=e.target.closest('button');if(!b)return;tlF=+b.dataset.f;_tlSig='';tlUI()};
$('tlb').onclick=e=>{const row=e.target.closest('.tr');if(!row)return;const id=+row.dataset.id,n=NODES[id];if(!n)return;
if(e.target.closest('button')&&!n.mile){sel=id;buyNode();_tlSig='';tlUI();return}sel=id;nodeUI(true);TGO=n.pos.clone();VW.t.d=Math.min(VW.t.d,42);_tlSig='';tlUI()}}
function tlUI(){const box=$('tlist');if(!box)return;const on=view=='t'&&!CS.on;box.style.display=on?'flex':'none';document.body.classList.toggle('tlon',on&&!document.body.classList.contains('tlc'));if(!on)return;
const r=rates(),av=NODES.filter(n=>n.id>0&&availN(n)),eta=n=>{let w=0;costList(n).forEach(([i,c])=>{const m=c-getW(i);if(m>0)w=Math.max(w,r[i]>0?m/r[i]:Infinity)});return w};
const rows=av.map(n=>({n,w:eta(n)})).filter(x=>tlF==-1||(tlF==4?x.n.leg:x.n.br==tlF)).sort((a,b)=>(b.n.leg?1:0)-(a.n.leg?1:0)||a.w-b.w||a.n.d-b.n.d).slice(0,60);
const cnt_=av.filter(n=>canAfford(n)).length;
const sig=tlF+'|'+sel+'|'+document.body.classList.contains('tlc')+'|'+rows.map(x=>x.n.id+':'+(x.w>0?fT(x.w):'ok')).join(',');if(sig==_tlSig)return;_tlSig=sig;
$('tlc').textContent=cnt_+' ready · '+av.length+' open';
$('tlf').innerHTML=[[-1,'All','#dfe7ff'],...CUR.map((c,i)=>[i,c.s,c.c]),[4,'✦ Legendary','#ffcf6a']].map(([f,l,c])=>`<button data-f="${f}" class="${tlF==f?'on':''}" style="color:${c}">${l}</button>`).join('');
$('tlb').innerHTML=rows.length?rows.map(({n,w})=>{const c=n.leg?'#ffcf6a':`hsl(${brH(n)*360},90%,66%)`,cost=costList(n).map(([i,c])=>curSpan(i,c)).join(' ');
return`<div class="tr ${n.leg?'lg':''} ${sel==n.id?'sel':''}" data-id="${n.id}"><span class="dot" style="background:${c};box-shadow:0 0 6px ${c}"></span><div class="nm"><span style="color:${c}">${n.leg?'✦ ':''}${n.name.replace('Legendary: ','')}</span><br><small>${cost} · ${w>0?'<span>~'+fT(w)+'</span>':'<span class="ok">ready</span>'}</small><br><small>${effTxt(n)}</small></div>${w>0?'':n.mile?'<button title="Choose A or B">A/B</button>':'<button title="Unlock">＋</button>'}</div>`}).join(''):'<small style="color:var(--dim)">Nothing to unlock here right now.</small>'}
{const _h=hudUI;hudUI=function(){_h.apply(this,arguments);try{tlUI()}catch(e){}}}
{const _sv=setView;setView=function(v){const r=_sv.apply(this,arguments);try{_tlSig='';tlUI()}catch(e){}return r}}
