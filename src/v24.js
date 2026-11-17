/* ---------- v24: UI refresh — glass cards with motion, live currency sparklines, telemetry panel, discovery feed ---------- */
{const st=document.createElement('style');st.textContent=`
:root{--card:linear-gradient(160deg,rgba(14,20,46,.78),rgba(6,9,24,.7));--bd:rgba(150,180,255,.2);--glow:rgba(110,160,255,.18)}
.card{position:relative;overflow:hidden;background:var(--card);border:1px solid var(--bd);border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.06)}
.card::after{content:'';position:absolute;top:0;left:0;width:45%;height:100%;pointer-events:none;background:linear-gradient(100deg,transparent,rgba(170,200,255,.07),transparent);transform:translateX(-120%);animation:sheen 9s ease-in-out infinite}
#hud .card:nth-child(2)::after{animation-delay:4.5s}
@keyframes sheen{0%,70%{transform:translateX(-120%)}100%{transform:translateX(320%)}}
.card::before{content:'';position:absolute;left:12px;right:12px;top:0;height:1px;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(140,190,255,.7),transparent);opacity:.55}
button{background:linear-gradient(180deg,rgba(28,38,78,.75),rgba(10,14,34,.75));transition:transform .15s,border-color .15s,box-shadow .15s}
button:hover:not(:disabled){border-color:var(--ac);box-shadow:0 0 14px var(--glow);transform:translateY(-1px)}button:active:not(:disabled){transform:translateY(1px)}
button.on{background:linear-gradient(180deg,#24508f,#16305e);border-color:rgba(140,200,255,.6);box-shadow:0 0 12px rgba(90,160,255,.3)}
#roll{background:linear-gradient(90deg,rgba(0,0,0,.62) var(--p,0%),transparent var(--p,0%)),linear-gradient(120deg,#3b6bff,#a24bff,#ff5fd2,#3b6bff);background-size:100% 100%,300% 100%;animation:rollflow 6s linear infinite;letter-spacing:.08em;box-shadow:0 0 18px rgba(130,100,255,.45)}
#roll.ready{animation:rollflow 6s linear infinite,rollpulse 1.6s ease-in-out infinite}
@keyframes rollflow{to{background-position:0 0,300% 0}}@keyframes rollpulse{50%{box-shadow:0 0 30px rgba(170,120,255,.85)}}
#hud{align-items:flex-start}#hud .card{font-variant-numeric:tabular-nums}
#coin{display:flex!important;flex-direction:column;gap:2px;font-size:13px}
.cu{display:grid;grid-template-columns:16px minmax(64px,auto) 62px auto;align-items:center;gap:0 7px;white-space:nowrap}
.cu .sy{color:var(--c);text-shadow:0 0 8px var(--c);font-size:14px;text-align:center}.cu b{color:var(--c)!important;font-size:15px!important;font-weight:700}
.cu canvas{position:static!important;width:62px!important;height:18px!important;inset:auto!important;display:block}.cu small{font-size:11px;color:var(--dim)}
.cu.up b{animation:cuup .6s ease-out}@keyframes cuup{0%{text-shadow:0 0 14px var(--c)}100%{text-shadow:none}}
#st{display:none}#tele{display:grid;grid-template-columns:auto auto;gap:3px 12px;align-items:center;font-size:11.5px;text-align:left;min-width:200px}
#tele .ring{grid-column:1/3;display:flex;align-items:center;gap:10px;margin-bottom:3px}
#tele svg{width:46px;height:46px;transform:rotate(-90deg);flex:0 0 46px}#tele svg circle{fill:none;stroke-width:4}#tele .rbg{stroke:rgba(255,255,255,.09)}
#tele .rfg{stroke:url(#tg);stroke-linecap:round;stroke-dasharray:119.4;transition:stroke-dashoffset .08s linear}
#tele .rspin{stroke:rgba(190,150,255,.9);stroke-dasharray:22 97.4;stroke-linecap:round;opacity:0;transform-origin:22px 22px}
#tele.fast .rspin{opacity:1;animation:spin .9s linear infinite}#tele.fast .rfg{opacity:.25}@keyframes spin{to{transform:rotate(360deg)}}
#tele .big{font-size:20px;font-weight:700;color:#ffe9a8;line-height:1}#tele .k{color:var(--dim)}#tele .v{text-align:right;color:#dfe8ff;font-weight:600}
#tele .bar{grid-column:1/3;height:3px;border-radius:2px;background:rgba(255,255,255,.08);overflow:hidden;margin:-1px 0 2px}#tele .bar i{display:block;height:100%;border-radius:2px;transition:width .4s}
#tele .live{display:inline-block;width:6px;height:6px;border-radius:50%;background:#5dff9a;box-shadow:0 0 6px #5dff9a;margin-right:5px;animation:blink 1.4s infinite}@keyframes blink{50%{opacity:.25}}
#feed{margin-top:6px;display:flex;flex-direction:column;gap:2px;font-size:11px;max-width:300px}
#feed div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;animation:feedin .45s cubic-bezier(.2,.9,.3,1.2)}#feed div:nth-child(2){opacity:.7}#feed div:nth-child(3){opacity:.45}#feed div:nth-child(n+4){display:none}
@keyframes feedin{from{transform:translateX(-14px);opacity:0}}
#info{transition:box-shadow .4s}#info.flash{animation:infoflash .9s ease-out}@keyframes infoflash{0%{box-shadow:0 0 0 1px var(--tc,#fff),0 0 40px var(--tc,#fff)}}
@media (max-width:600px){.cu{grid-template-columns:14px minmax(54px,auto) auto}.cu canvas{display:none!important}#tele{min-width:0;grid-template-columns:auto auto;font-size:10.5px}#tele .ring{gap:6px}#tele svg{width:34px;height:34px;flex-basis:34px}#tele .big{font-size:15px}#feed{display:none}#tele .opt{display:none}}
@media (prefers-reduced-motion:reduce){.card::after,#roll,#tele .live,.cu.up b,#feed div{animation:none!important}}
`;(document.head||document.body).appendChild(st)}
const TEL={h:[[],[],[],[]],rl:[],fd:[],disp:[0,0,0,0],last:[0,0,0,0],acc:0,feed:[]};
function buildCur(){$('coin').innerHTML=CUR.map((k,i)=>`<div class="cu" id="cu${i}" style="--c:${k.c}" title="${k.n}"><span class="sy">${k.s}</span><b id="cv${i}">0</b><canvas id="cs${i}" width="124" height="36"></canvas><small id="cr${i}"></small></div>`).join('')}
function curHUD(force){if(!S)return;if(!$('cv0'))buildCur();const r=rates();for(let i=0;i<4;i++){const w=getW(i),d=TEL.disp[i];
TEL.disp[i]=force||!isFinite(d)||d<=0||w<=0||Math.abs(Math.log10((w+1)/(d+1)))>2?w:d+(w-d)*.35;$('cv'+i).textContent=fmt(TEL.disp[i]);$('cr'+i).textContent='+'+fmt(r[i])+'/s';
if(w<TEL.last[i]*.98){const e=$('cu'+i);e.classList.remove('up');void e.offsetWidth;e.classList.add('up')}TEL.last[i]=w}}
function sparkDraw(){for(let i=0;i<4;i++){const cv=$('cs'+i);if(!cv||!cv.offsetParent)continue;const x=cv.getContext('2d'),h=TEL.h[i],W=cv.width,H=cv.height;x.clearRect(0,0,W,H);if(h.length<2)continue;
let lo=Math.min(...h),hi=Math.max(...h);if(hi-lo<.5){const m=(hi+lo)/2;lo=m-.25;hi=m+.25}const X=k=>k/(h.length-1)*(W-6)+2,Y=v=>H-3-(v-lo)/(hi-lo)*(H-8);
const c=CUR[i].c,g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,c+'55');g.addColorStop(1,c+'00');x.beginPath();x.moveTo(X(0),H);h.forEach((v,k)=>x.lineTo(X(k),Y(v)));x.lineTo(X(h.length-1),H);x.fillStyle=g;x.fill();
x.beginPath();h.forEach((v,k)=>k?x.lineTo(X(k),Y(v)):x.moveTo(X(k),Y(v)));x.strokeStyle=c;x.lineWidth=2;x.stroke();const ex=X(h.length-1),ey=Y(h[h.length-1]),pu=1.5+1.2*(.5+.5*Math.sin(performance.now()/250));x.beginPath();x.arc(ex,ey,pu+1,0,7);x.fillStyle='#fff';x.fill()}}
/* telemetry panel (replaces the old status text; the old #st element stays hidden for compatibility) */
{const card=$('st').parentNode;const d=document.createElement('div');d.id='tele';d.innerHTML=`<div class="ring"><svg viewBox="0 0 44 44"><defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#5ff3ff"/><stop offset="1" stop-color="#b07bff"/></linearGradient></defs><circle class="rbg" cx="22" cy="22" r="19"/><circle class="rfg" id="tcr" cx="22" cy="22" r="19"/><circle class="rspin" cx="22" cy="22" r="19"/></svg><div><div class="big" id="tcd">—</div><small class="k" id="tcm">cooldown</small></div></div>
<span class="k">Luck</span><span class="v" id="tlk"></span><div class="bar"><i id="tlkb" style="background:linear-gradient(90deg,#ffd27a,#ff9d4a)"></i></div>
<span class="k opt">Mod luck</span><span class="v opt" id="tml"></span>
<span class="k"><span class="live"></span>Rolls/min</span><span class="v" id="trm"></span>
<span class="k">Found</span><span class="v" id="tfd"></span><div class="bar"><i id="tfdb" style="background:linear-gradient(90deg,#5ff3ff,#7cff9a)"></i></div>
<span class="k">Next new find</span><span class="v" id="tnx"></span>
<span class="k opt">Modifier</span><span class="v opt" id="tmd"></span>
<span class="k">Run time</span><span class="v" id="trt"></span>`;card.appendChild(d)}
let _tmaxK=0,_tmaxS=-1;
function teleUI(){if(!S||!D)return;ensureS();const cd=cdn(),pn=pNew(),mc=Math.min(1,Math.pow(10,-(MODS[0].r-D.ml)));
$('tcd').textContent=fCD(cd);$('tcm').textContent=hasAuto()?(S.autoOn?'cooldown · auto':'cooldown · auto off'):'cooldown';
if(_tmaxS!==S.rb){_tmaxS=S.rb;_tmaxK=Math.max(1,...OBJ.filter(o=>!o.pu&&(o.layer||0)<=S.rb).map(o=>o.k))}
$('tlk').innerHTML='×10<sup>'+D.lk.toFixed(1)+'</sup>';$('tlkb').style.width=Math.min(100,D.lk/_tmaxK*100)+'%';$('tml').innerHTML='×10<sup>'+D.ml.toFixed(1)+'</sup>';
const rl=TEL.rl,rpm=rl.length>1?(rl[rl.length-1][1]-rl[0][1])/Math.max(1,(rl[rl.length-1][0]-rl[0][0]))*60:0;$('trm').textContent=rpm>0?fmt(rpm):'—';
const c=cnt(),a=avail();$('tfd').textContent=c+' / '+a;$('tfdb').style.width=Math.min(100,c/Math.max(1,a)*100)+'%';
$('tnx').textContent=pn>0?probT(pn)+' · ~'+fT(cd/pn):'all found';$('tmd').textContent=probT(mc);$('trt').textContent=fT(S.rt||0)}
function ringUI(){const t=$('tele');if(!t||!S)return;const cd=cdn(),auto=hasAuto()&&S.autoOn,p=auto?Math.min(1,acc/cd):1-Math.min(1,cdLeft/cd),fast=cd<.3;
t.classList.toggle('fast',fast);$('tcr').style.strokeDashoffset=(119.4*(1-(fast?1:p))).toFixed(1);const rb=$('roll');if(rb)rb.classList.toggle('ready',!auto&&cdLeft<=0)}
/* discovery feed under the currencies */
{const card=$('coin').parentNode,f=document.createElement('div');f.id='feed';card.appendChild(f)}
{const _ft=findToast;findToast=function(nw){const r=_ft.apply(this,arguments);try{const ids=nw.map(x=>x<0?-1-x:x),bi=Math.max(...ids),o=OBJ[bi],m=S.own[bi],tc=TCOL[tierI(o)];
const d=document.createElement('div');d.innerHTML=`<span style="color:${tc}">◆ ${m>=0?MODS[m].n+' ':''}${o.n}</span> <span style="color:var(--dim)">· ${TIERS[tierI(o)]}</span>`;const fe=$('feed');fe.insertBefore(d,fe.firstChild);while(fe.children.length>4)fe.lastChild.remove();
const inf=$('info');if(inf){inf.style.setProperty('--tc',tc);inf.classList.remove('flash');void inf.offsetWidth;inf.classList.add('flash')}}catch(e){}return r}}
/* sampling + animation loop (DOM-only; independent of the WebGL loop) */
{let lt=performance.now(),sp=0,tl=0;const loop=now=>{const dt=Math.min(.5,(now-lt)/1000);lt=now;try{if(S&&!CS.on){S.rt=(S.rt||0)+dt;ringUI();sp+=dt;tl+=dt;
if(tl>.25){tl=0;curHUD();teleUI()}
if(sp>=1){sp=0;for(let i=0;i<4;i++){const h=TEL.h[i];h.push(Math.log10(getW(i)+1));if(h.length>90)h.shift()}TEL.rl.push([now/1000,S.rolls]);{const bar=$('bar'),inf=$('info');if(bar&&inf&&bar.offsetHeight)inf.style.bottom=(bar.offsetHeight+4)+'px'}while(TEL.rl.length>30)TEL.rl.shift();sparkDraw()}}}catch(e){}requestAnimationFrame(loop)};requestAnimationFrame(loop)}
/* run timer: saved, reset on rebirth */
{const _rb=doRebirth;doRebirth=function(){const r=_rb.apply(this,arguments);if(S){S.rt=0;TEL.h=[[],[],[],[]];TEL.rl=[]}return r}}
{const _se=svEncode;svEncode=function(){const s=_se();try{const d=JSON.parse(decodeURIComponent(escape(atob(s.slice(6)))));d.rt=Math.round(S.rt||0);return'CSMS4:'+btoa(unescape(encodeURIComponent(JSON.stringify(d))))}catch(e){return s}}}
{const _i=imp;imp=function(str,quiet){const ok=_i(str,quiet);if(ok)try{const c=cleanSave(str)||String(str).trim(),d=JSON.parse(decodeURIComponent(escape(atob(c.slice(c.indexOf(':')+1)))));S.rt=isFinite(+d.rt)&&+d.rt>=0?+d.rt:0}catch(e){S.rt=S.rt||0}TEL.h=[[],[],[],[]];TEL.rl=[];TEL.disp=[0,0,0,0];return ok}}
