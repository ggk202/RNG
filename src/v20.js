/* ---------- v20: generator choice, Plus Ultra (beyond-cap items, ascended tiers, rule breakers), Deep Time layer systems ---------- */
/* ---- state ---- */
{const _e=ensureS;ensureS=function(){_e();if(!S)return;if(!S.rbk||typeof S.rbk!='object')S.rbk={};if(!Array.isArray(S.gens))S.gens=[];if(!S.cxa||S.cxa.length!==N)S.cxa=Object.assign(new Array(N).fill(0),S.cxa||[])}}
function hasRule(n){return!!(S&&S.rbk&&S.rbk[n])}
var PUI=OBJ.filter(o=>o.pu).sort((a,b)=>b.k-a.k);
/* ---- ascended tiers: + / ++ / +++ from duplicates on finales and notable items ---- */
var ASCN=new Set(['Higgs Boson','Antihydrogen','DNA Helix','Diamond','Time Crystal','Living World','Yellow Dwarf','Blue Whale','Neutron Star','Magnetar','Crab Nebula','Pillars of Creation','Grand Design Spiral','Quasar','Supermassive Black Hole','Einstein-Rosen Bridge','White Hole','Boltzmann Brain','Calabi-Yau Manifold','Tesseract','Hopf Fibration','Dyson Shell','Matrioshka Brain','Ringworld','Black Hole Bomb','Iron Star','The Last Black Hole','Positronium Atom','Crystalline Black Dwarf','Poincaré Recurrence','Totality','Cosmogenesis Engine','The Final Fluctuation'].filter(n=>OBJ.some(o=>o.n==n)));
var ASCI=OBJ.filter(o=>ASCN.has(o.n)).map(o=>o.i),FINS=new Set(LFIN);
function ascTier(i){if(!ASCN||!S||!ASCN.has(OBJ[i].n)||S.own[i]<=-2)return 0;const d=(S.cn[i]||0)-1,th=FINS.has(i)?[1,3,8]:[3,12,40];return d>=th[2]?3:d>=th[1]?2:d>=th[0]?1:0}
function ascMul(i){return[1,3,9,27][ascTier(i)]}
function ascName(n,k){return k?n+' '+'+'.repeat(k):n}
/* ---- generators: the player chooses which owned items produce stardust ---- */
function genSlots(){return hasRule("Time's Arrow Reversed")?3:1}
function genList(){if(!S)return[];const sl=genSlots(),out=[];(S.gens||[]).forEach(i=>{if(out.length<sl&&i>=0&&i<N&&S.own[i]>-2&&!out.includes(i))out.push(i)});
if(out.length<sl){const own=[];for(let i=0;i<N;i++)if(S.own[i]>-2&&!out.includes(i))own.push(i);own.sort((a,b)=>K[b]-K[a]);for(const i of own){if(out.length>=sl)break;out.push(i)}}return out}
function setGen(i,on){ensureS();let g=(S.gens||[]).filter(x=>x!==i&&S.own[x]>-2);if(on){if(genSlots()==1)g=[i];else{g.push(i);g=g.slice(-genSlots())}}S.gens=g;hudUI();genRowUI()}
/* ---- Plus Ultra rolls: rule breakers need their layer reached, beyond-cap items need that layer's finale owned this run ---- */
function roll1(){const L=geo()+D.lk;let i=biasPick(L);for(const o of PUI){if(L<o.k||o.k<=K[i])continue;if(o.layer>S.rb)continue;if(o.pu=='beyond'&&!(S.own[LFIN[o.layer]]>-2))continue;i=o.i;break}
const M=geo()+D.ml;let m=-1;for(let j=MODS.length-1;j>=0;j--)if(MODS[j].r<=M&&!((MODS[j].rb||0)>S.rb)){m=j;break}S.rolls++;return[i,m]}
{const _d=doRolls;doRolls=function(n,manual){ensureS();const before=ASCI.map(ascTier),rk=Object.keys(S.rbk).length;_d(hasRule('Twin Dice')?n*2:n,manual);
OBJ.forEach(o=>{if(o.pu=='rule'&&S.own[o.i]>-2&&!S.rbk[o.n]){S.rbk[o.n]=1;recalc();toast('Rule broken: '+o.n)}});
ASCI.forEach((i,k)=>{const a=ascTier(i);if(a>before[k]){const first=a>(S.cxa[i]||0);S.cxa[i]=Math.max(S.cxa[i]||0,a);if(first&&(a==3||FINS.has(i)))playRaw('pu',{n:ascName(OBJ[i].n,a),sub:'Plus Ultra · ascended',i,k:0,tier:a});else toast('Ascended: '+ascName(OBJ[i].n,a))}});
if(rk!==Object.keys(S.rbk).length)hudUI()}}
{const _r=recalc;recalc=function(){_r();if(!S)return;if(hasRule('Rewound Clock'))D.sp*=1.4;if(S.rb>=2){let n=0;for(let i=LEND[1]+1;i<=LEND[2];i++)if(S.own[i]>-2)n++;D.lk+=.037*n}}}
{const _d2=doRolls;doRolls=function(n,m){const before=S.rb>=2?S.own.slice(LEND[1]+1,LEND[2]+1).filter(x=>x>-2).length:0;_d2(n,m);if(S.rb>=2&&S.own.slice(LEND[1]+1,LEND[2]+1).filter(x=>x>-2).length!==before)recalc()}}
/* ---- rebirth ---- */
{const _rb=doRebirth;doRebirth=function(cst){_rb(cst);S.gens=[];genRowUI()}}
const LNEW=['','the Reborn modifier, 6 more nodes per skill branch, and the Dyson Builder minigame','decayed megastructures, +0.037 luck for every Deep Time discovery, the Recursive modifier, 6 more nodes per skill branch, and the Last Light minigame'];
/* ---- saves: generators, rule breakers, ascended records ---- */
{const _se=svEncode;svEncode=function(){const s=_se();try{const d=JSON.parse(decodeURIComponent(escape(atob(s.slice(6)))));d.gens=(S.gens||[]).filter(i=>i>=0&&i<N).map(i=>OBJ[i].n);d.rbk=Object.keys(S.rbk||{});const a={};OBJ.forEach(o=>{if(S.cxa&&S.cxa[o.i])a[o.n]=S.cxa[o.i]});d.cxa=a;return'CSMS4:'+btoa(unescape(encodeURIComponent(JSON.stringify(d))))}catch(e){return s}}}
{const _i=imp;imp=function(str,quiet){const ok=_i(str,quiet);if(!ok)return ok;try{const c=cleanSave(str)||String(str).trim(),d=JSON.parse(decodeURIComponent(escape(atob(c.slice(c.indexOf(':')+1))))),by=new Map(OBJ.map(o=>[o.n,o.i]));ensureS();
S.gens=Array.isArray(d.gens)?d.gens.map(n=>by.get(n)).filter(i=>i!==undefined):[];S.rbk={};(Array.isArray(d.rbk)?d.rbk:[]).forEach(n=>{if(PUD[n]&&PUD[n].t=='rule')S.rbk[n]=1});S.cxa=new Array(N).fill(0);if(d.cxa&&typeof d.cxa=='object')for(const k in d.cxa){const i=by.get(k),v=+d.cxa[k];if(i!==undefined&&v>=0&&v<=3)S.cxa[i]=v}recalc()}catch(e){}return ok}}
/* ---- UI: generator row under the item card, star in the HUD, tier suffix on names ---- */
{const sb=$('sb');if(sb&&!$('genrow')){const d=document.createElement('div');d.id='genrow';d.style.cssText='margin-top:6px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap';sb.parentNode.insertBefore(d,sb.nextSibling);
d.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.a;if(a=='on')setGen(curI,true);else if(a=='off')setGen(curI,false);else if(a=='auto'){S.gens=[];hudUI();genRowUI()}})}}
function genRowUI(){const r=$('genrow');if(!r)return;if(view!='u'||curI<0||!S||OBJ[curI].pu=='rule'){r.innerHTML='';return}const own=S.own[curI]>-2,G=genList(),on=G.includes(curI),manual=(S.gens||[]).length>0,sl=genSlots();
let h='';if(own)h+=on?`<button data-a="off" class="on" title="Stop using this item">⚡ Generating${sl>1?' ('+(G.indexOf(curI)+1)+'/'+sl+')':''}</button>`:`<button data-a="on">⚡ Use as generator</button>`;if(manual)h+=`<button data-a="auto">Auto: rarest</button>`;
const t=ascTier(curI),rec=S.cxa?S.cxa[curI]:0;if(ASCN.has(OBJ[curI].n))h+=`<small style="align-self:center;color:#ffe9a0">${t?'Ascended '+'+'.repeat(t)+' · ×'+[1,3,9,27][t]+' yield':'Ascends with duplicates'}${rec>t?' · best '+'+'.repeat(rec):''}</small>`;if(r.dataset.h!==h){r.dataset.h=h;r.innerHTML=h}}
{const _iu=infoUI;infoUI=function(i,m){_iu(i,m);if(i>=0)genRowUI()}}
{const _s=show;show=function(i,m){_s(i,m);if(i<0||!cur)return;const t=Math.max(ascTier(i),S&&S.cxa?S.cxa[i]:0);if(t>0&&!OBJ[i].pu){cur.add(puAura(OR[OBJ[i].c],t));$('nm').textContent+=' '+'+'.repeat(t)}if(OBJ[i].pu)cur.userData.fx=Object.assign({},cur.userData.fx||{},{bloom:1,tint:[1.08,1.03,.9],tintA:.3},OBJ[i].pu=='beyond'?{ex:-.3}:{});genRowUI()}}
/* ---- shared Plus Ultra look: gold-white aura, rays, rising sparks ---- */
function puAura(R,tier){const g=new THREE.Group(),n=tier||3;for(let k=0;k<n;k++){const m=new THREE.Mesh(new THREE.TorusGeometry(R*(1.25+k*.22),.012+k*.004,8,220),new THREE.MeshBasicMaterial({color:CC('#ffe7a0').multiplyScalar(1.6),...ADD}));m.rotation.set(HP+(k-1)*.35,k*.7,0);g.add(m)}
const rays=new THREE.Mesh(new THREE.PlaneGeometry(R*7,R*7),sm(`void main(){vec2 q=vP.xy;float a=atan(q.y,q.x),r=length(q);float ray=pow(.5+.5*cos(a*12.+t*.4),18.)+pow(.5+.5*cos(a*7.-t*.25),24.)*.6;gl_FragColor=vec4(vec3(1.,.9,.6)*ray*exp(-r*1.1)*.16*${(.5+n*.25).toFixed(2)},1.);}`,{},ADD));g.add(rays);
const N_=Math.round(110*n),P=[],SD=[];for(let i=0;i<N_;i++){P.push(0,0,0);SD.push(Math.random(),Math.random(),Math.random())}
g.add(XPT(XBG({position:[P,3],sd:[SD,3]}),new THREE.ShaderMaterial({uniforms:{t:U.t,R:{value:R}},vertexShader:`attribute vec3 sd;uniform float t,R;varying vec3 c;varying float a;void main(){float u=fract(sd.x+t*(.08+sd.y*.08));float an=sd.z*6.2832+u*2.;float rr=R*(1.1+sd.y*.6);vec3 p=vec3(cos(an)*rr,(u-.5)*R*2.6,sin(an)*rr);c=mix(vec3(1.,.85,.5),vec3(1.),sd.y);a=sin(u*3.1416)*.45;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(.8+sd.y*1.2)*(80./-mv.z);gl_Position=projectionMatrix*mv;}`,fragmentShader:XPF,...ADD})));
const bl=glow(0xffe8b0,R*1.6);bl.material.opacity=.18;g.add(bl);g.userData.isAura=1;const q=new THREE.Quaternion();
const upd=()=>{const t=U.t.value;g.children.forEach((m,k)=>{if(m.geometry&&m.geometry.type=='TorusGeometry')m.rotation.z=t*(.15+k*.07)*(k%2?-1:1)});g.getWorldQuaternion(q);rays.quaternion.copy(q.invert().multiply(UC.quaternion))};g.children[0].onBeforeRender=upd;return g}
/* ---- minigames: chooser once more than one exists ---- */
const mgTarget2=()=>Math.round(55+Math.min(8,S.up.filter(id=>NODES[id]&&NODES[id].br==1).length*.2));
function openMG(){if(MG.on||CS.on)return;if(S.rb<2){openDyson();return}const ov=document.createElement('div');ov.id='mgov';ov.innerHTML=`<div style="max-width:420px;text-align:center"><p><b>Minigames</b></p>
<p><button id="mgL" style="width:100%">☾ Last Light${S.mg[2]?'':' · required for the finale'}</button></p><p><button id="mgD" style="width:100%">☀ Dyson Builder · bonus</button></p><p><button id="mgX">Close</button></p></div>`;document.body.appendChild(ov);
$('mgL').onclick=()=>{ov.remove();openLastLight()};$('mgD').onclick=()=>{ov.remove();openDyson()};$('mgX').onclick=()=>ov.remove()}
$('mgbtn').onclick=openMG;
{const _a=autoUI;autoUI=function(){_a();const b=$('mgbtn');if(b&&S.rb>=2)b.textContent='☾ Minigames'+(S.mg[2]?'':' · Last Light unlocks finale')}}
/* ---- Last Light: keep the final stars and black holes burning by redirecting dwindling energy ---- */
function openLastLight(){if(MG.on||CS.on)return;MG.on=true;const ov=document.createElement('div');ov.id='mgov';ov.innerHTML='<div id="mgh"></div><canvas id="mgc"></canvas><div id="mgb"></div>';document.body.appendChild(ov);
const cv=$('mgc'),cx=cv.getContext('2d');let W=0,H=0;const dpr=Math.min(devicePixelRatio,2);const size=()=>{const s=Math.min(innerWidth-20,innerHeight*.66,640);cv.style.width=cv.style.height=s+'px';cv.width=cv.height=s*dpr;W=H=cv.width};size();
const T=45,tgt=mgTarget2();let st='intro',t=0,acc=0,E=40,warn=null,nextW=5,raf=0,last=0,B=[],fx=[];
const mk=()=>{B=[];for(let k=0;k<6;k++){const a=k/6*6.2832+.3;B.push({bh:0,x:Math.cos(a)*.62,y:Math.sin(a)*.62,f:1,r:.045+.02*((k*3)%6)/5,hue:k})}[[-.17,0],[.17,0]].forEach(([x,y])=>B.push({bh:1,x,y,f:1,r:.026,burst:0}))};
const ui=h=>{$('mgb').innerHTML=h};const lit=()=>B.filter(b=>b.f>0).length;
const head=()=>{$('mgh').innerHTML=st=='play'?`<b>Last Light</b> · ${Math.ceil(T-t)}s · energy ${Math.floor(E)} · shining ${lit()}/${B.length} · score ${(t>0?acc/t*100:0).toFixed(1)}% <small>(target ${tgt}%)</small>`:'<b>Last Light</b>'};
const intro=()=>{st='intro';head();ui(`<p>The last stars are dying. Tap a <b>star</b> to pour 10 energy into it (+45% fuel). When a star flashes red, proton decay is about to strip its fuel: tap it in time to shield it for 6 energy.</p><p>The two <b>black holes</b> in the middle are your reserve: tap one to extract 10 energy from its mass (Penrose process). When a black hole evaporates completely it releases a final burst of +30 energy.</p><p>Energy trickles in more and more slowly. Keep the average share of shining bodies above <b>${tgt}%</b> for ${T} seconds${S.mg[2]?' (already passed: replays pay stardust on a cooldown)':' to unlock <b>The Final Fluctuation</b>'}.</p><button id="mgs">Start</button> <button id="mgx">Close</button>`);$('mgs').onclick=start;$('mgx').onclick=close};
const start=()=>{st='play';t=0;acc=0;E=40;warn=null;nextW=5;fx=[];mk();ui('<button id="mgx">Quit</button>');$('mgx').onclick=intro};
const finish=()=>{st='end';const sc=acc/T*100,pass=sc>=tgt;let msg='';if(pass&&!S.mg[2]){S.mg[2]=true;msg='<p style="color:#8fe39a">Passed! The Final Fluctuation can now be rolled.</p>'}else if(pass)msg='<p style="color:#8fe39a">Passed.</p>';else msg=`<p style="color:#ff9a9a">${tgt}% needed. Try again.</p>`;
const now=Date.now();let rw='';if((S.mgc[2]||0)+600e3<now){const g2=60*Math.max(.2,sc/100);gainAll(g2);S.mgc[2]=now;rw=`<p>Reward: ${fT(g2)} of production in all four currencies</p>`}else rw=`<p><small>Reward on cooldown for ${Math.ceil(((S.mgc[2]+600e3)-now)/60e3)} min</small></p>`;
head();ui(`<p>Light kept: <b>${sc.toFixed(1)}%</b></p>${msg}${rw}<button id="mgs">Play again</button> <button id="mgx">Close</button>`);$('mgs').onclick=start;$('mgx').onclick=close};
const close=()=>{MG.on=false;cancelAnimationFrame(raf);ov.remove()};
cv.addEventListener('pointerdown',e=>{if(st!='play')return;const bb=cv.getBoundingClientRect(),x=(e.clientX-bb.left)/bb.width*2-1,y=(e.clientY-bb.top)/bb.height*2-1;let best=null,bd=.16;B.forEach(b=>{const d=Math.hypot(b.x-x,b.y-y);if(d<bd){bd=d;best=b}});if(!best||best.f<=0)return;
if(best.bh){if(best.f>.3){best.f-=.25;E=Math.min(100,E+10);fx.push({x:best.x,y:best.y,t:0,c:'#ffb070'})}return}
if(warn&&warn.b===best){if(E>=6){E-=6;warn=null;fx.push({x:best.x,y:best.y,t:0,c:'#9ad8ff'})}return}if(E>=10){E-=10;best.f=Math.min(1.2,best.f+.45);fx.push({x:best.x,y:best.y,t:0,c:'#ffe9a0'})}});
const draw=()=>{cx.fillStyle='#02030a';cx.fillRect(0,0,W,H);const c=W/2,s=W/2;for(let k=0;k<60;k++){const a=k*2.399,r=((k*.618)%1)*.95;cx.fillStyle='rgba(120,130,160,.18)';cx.fillRect(c+Math.cos(a)*r*s,c+Math.sin(a)*r*s,1.5*dpr,1.5*dpr)}
B.forEach(b=>{const X=c+b.x*s,Y=c+b.y*s;if(b.bh){const rr=s*(.045+.05*Math.max(b.f,0));cx.strokeStyle=b.f>0?'rgba(255,170,90,.9)':'rgba(255,170,90,.15)';cx.lineWidth=3*dpr;cx.beginPath();cx.arc(X,Y,rr*1.25,0,6.29);cx.stroke();cx.fillStyle='#000';cx.beginPath();cx.arc(X,Y,rr,0,6.29);cx.fill()}
else if(b.f>0){const k=Math.min(1,b.f),rr=s*(.035+.05*k),col=k>.6?[255,240,220]:k>.3?[255,190,120]:[255,110,70];const gr=cx.createRadialGradient(X,Y,0,X,Y,rr*2.6);gr.addColorStop(0,`rgba(${col},1)`);gr.addColorStop(.3,`rgba(${col},.55)`);gr.addColorStop(1,`rgba(${col},0)`);cx.fillStyle=gr;cx.beginPath();cx.arc(X,Y,rr*2.6,0,6.29);cx.fill()}
else{cx.fillStyle='rgba(60,50,60,.6)';cx.beginPath();cx.arc(X,Y,s*.025,0,6.29);cx.fill()}
cx.strokeStyle=b.bh?'rgba(255,170,90,.55)':'rgba(255,233,160,.65)';cx.lineWidth=2.5*dpr;cx.beginPath();cx.arc(X,Y,s*.13,-HP,-HP+6.2832*Math.max(0,Math.min(1,b.f)));cx.stroke();
if(warn&&warn.b===b){cx.strokeStyle=`rgba(255,60,60,${.5+.5*Math.sin(t*22)})`;cx.lineWidth=4*dpr;cx.beginPath();cx.arc(X,Y,s*.155,0,6.29);cx.stroke()}});
fx=fx.filter(f=>f.t<.6);fx.forEach(f=>{cx.strokeStyle=f.c;cx.globalAlpha=1-f.t/.6;cx.lineWidth=2*dpr;cx.beginPath();cx.arc(c+f.x*s,c+f.y*s,s*(.05+f.t*.35),0,6.29);cx.stroke();cx.globalAlpha=1});
cx.fillStyle='rgba(255,255,255,.12)';cx.fillRect(s*.2,H-s*.08,s*1.6,s*.035);cx.fillStyle='#ffe9a0';cx.fillRect(s*.2,H-s*.08,s*1.6*E/100,s*.035)};
const loop=now=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-(last||now))/1000);last=now;if(st=='play'){t+=dt;const age=t/T;
B.forEach(b=>{if(b.f>0){b.f-=b.r*(1+.6*age)*dt;if(b.f<=0){b.f=0;if(b.bh&&!b.burst){b.burst=1;E=Math.min(100,E+30);fx.push({x:b.x,y:b.y,t:0,c:'#ffffff'})}}}});
E=Math.min(100,E+2.4*(1-.6*age)*dt);nextW-=dt;if(!warn&&nextW<0){const al=B.filter(b=>!b.bh&&b.f>0);if(al.length)warn={b:al[Math.floor(Math.random()*al.length)],tt:1.6};nextW=5+Math.random()*3}
if(warn){warn.tt-=dt;if(warn.tt<0){warn.b.f=Math.max(0,warn.b.f-.35);fx.push({x:warn.b.x,y:warn.b.y,t:0,c:'#ff4a4a'});warn=null}}
acc+=lit()/B.length*dt;fx.forEach(f=>f.t+=dt);if(t>=T)finish();head()}else fx.forEach(f=>f.t+=dt);draw()};intro();raf=requestAnimationFrame(loop)}
