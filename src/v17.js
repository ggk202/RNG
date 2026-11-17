/* ---------- v17: high-quality galaxies — analytic disk light, log-spiral arms, dust lanes, HII knots,
   volumetric bulges/ellipticals, procedural mini-galaxies for groups, clusters and the cosmic web ---------- */
U.pr={value:rd.getPixelRatio()};{const _a=applyRes;applyRes=function(){_a();U.pr.value=rd.getPixelRatio()}}
let GLITE=0;
const GSV=`attribute vec3 color;attribute float size,sd;uniform float t,pr,br;varying vec3 vc;varying float va;
void main(){vc=color*br*(.88+.12*sin(t*(1.+sd*3.)+sd*40.));vec4 mv=modelViewMatrix*vec4(position,1.);float ps=size*length(modelMatrix[0].xyz)*pr*120./-mv.z;va=clamp(ps,0.,1.);gl_PointSize=max(1.4,ps);gl_Position=projectionMatrix*mv;}`;
const GSF=`varying vec3 vc;varying float va;void main(){float d=length(gl_PointCoord-.5)*2.;float k=(exp(-d*d*5.)+exp(-d*3.)*.12)*step(d,1.);gl_FragColor=vec4(vc*k*va,1.);}`;
/* bright stars with 4-point diffraction spikes */
const GSPF=`varying vec3 vc;varying float va;void main(){vec2 p=(gl_PointCoord-.5)*2.;float d=length(p);float k=exp(-d*d*30.)*1.6+exp(-d*6.)*.25;k+=(exp(-abs(p.x)*40.)*exp(-abs(p.y)*2.6)+exp(-abs(p.y)*40.)*exp(-abs(p.x)*2.6))*.55;gl_FragColor=vec4(vc*k*va*step(d,1.42),1.);}`;
const DSF=`varying vec3 vc;varying float va;void main(){float d=length(gl_PointCoord-.5)*2.;float k=exp(-d*d*3.)*step(d,1.);gl_FragColor=vec4(vc,k*va);}`;
function gPts(P,C,S,o){o=o||{};const SD=[];for(let i=0;i<S.length;i++)SD.push(Math.random());const g=XBG({position:[P,3],color:[C,3],size:[S,1],sd:[SD,1]});
const m=new THREE.ShaderMaterial({uniforms:{t:U.t,pr:U.pr,br:{value:o.br||1}},vertexShader:GSV,fragmentShader:o.spike?GSPF:o.dust?DSF:GSF,...(o.dust?{transparent:true,depthWrite:false,blending:THREE.NormalBlending}:ADD)});
const p=new THREE.Points(g,m);p.frustumCulled=false;if(o.dust)p.renderOrder=3;return p}
/* volumetric ellipsoid: projected Sersic profile along the view ray (works from any angle, inside or out) */
const VOLF=`uniform vec3 cl,c1,c2;uniform float re,nn,amp,nz,cut,ns;void main(){vec3 rd=normalize(vP-cl);float b=dot(cl,rd);vec3 cp=cl-rd*b;float d=length(cp);
float I=exp(-3.2*pow(d/re,1./nn))*amp;if(nz>0.){float f=fbm(cp*ns+vec3(0.,t*.03,0.));I*=mix(1.,.25+1.6*f*f,nz);}I*=smoothstep(cut,cut*.55,d);vec3 c=mix(c1,c2,smoothstep(0.,re*2.5,d));gl_FragColor=vec4(c*I,1.);}`;
function vol(o){const u={cl:{value:V3()},c1:{value:CC(o.c1||'#fff1d0')},c2:{value:CC(o.c2||o.c1||'#ffcf8a')},re:{value:o.re||.4},nn:{value:o.n||2.5},amp:{value:o.amp||1.4},nz:{value:o.nz||0},ns:{value:o.ns||2},cut:{value:o.cut||1}};
const m=new THREE.Mesh(new THREE.SphereGeometry(o.cut||1,40,28),sm(VOLF,u,{...ADD,side:THREE.BackSide}));if(o.q)m.scale.y=o.q;if(o.p)m.position.copy(o.p);
m.onBeforeRender=(r,s,cam)=>{u.cl.value.copy(cam.position);m.worldToLocal(u.cl.value)};m.userData.vu=u;return m}
/* analytic disk light: exponential disk x log-spiral density wave, bar, rings, spokes, dust lanes, HII glints */
const DGF=`uniform float m,tp,r0,hd,bar,arms,sharp,dust,fl,ring,ringW,ring2,spoke,R,floc,hii;uniform vec3 cin,cout,carm;
void main(){vec2 q=vec2(vP.x,-vP.y);float r=length(q),th=atan(q.y,q.x);float D=exp(-r/hd);float ph=m*(th-log(max(r,.02)/r0)/tp);
float a=arms*pow(.5+.5*cos(ph),sharp)*smoothstep(r0*.55,r0*1.05,r);float fn=fbm(vec3(q*2.6,1.7));a*=mix(1.,.35+1.3*fn,floc);
float dl=dust*pow(.5+.5*cos(ph+.85),7.)*smoothstep(r0*.45,r0*1.1,r)*(.6+.8*fbm(vec3(q*5.,4.)));
float bI=bar>0.?bar*exp(-pow(abs(q.x)/(r0*1.02),4.)-pow(q.y/(r0*.2),2.)):0.;
float rg=ring>0.?exp(-pow((r-ring)/ringW,2.))*(1.2+.8*fbm(vec3(q*4.,9.))):0.;float rg2=ring2>0.?exp(-pow((r-ring2)/(ringW*.7),2.))*.9:0.;
float sp=spoke>0.?pow(.5+.5*cos(spoke*th+.3*sin(r*3.)),14.)*smoothstep(ring2,ring2+.25,r)*smoothstep(ring,ring-.35,r)*.7:0.;
float I=D*(.28+a*1.7)+bI+rg+rg2+sp;I*=1.-dl*.8;I*=smoothstep(R,R*.7,r);
vec3 c=mix(cin,cout,smoothstep(0.,R*.75,r));c=mix(c,carm,clamp(a*.7+rg*.6+sp,0.,1.));float hg=pow(fbm(vec3(q*9.,3.)),5.)*hii*(a+rg);c+=vec3(1.,.28,.5)*hg*9.;
gl_FragColor=vec4(c*I*fl,1.);}`;
function diskGal(o,r){const G0=new THREE.Group(),disk=new THREE.Group();G0.add(disk);const L=GLITE?.22:1,R=o.R||3.2,m=o.m||2,tp=Math.tan((o.pitch||14)*Math.PI/180),r0=o.r0||.55,hd=o.hd||R*.32,young=CC(o.young||'#aac8ff'),old=CC(o.old||'#ffd9a0');
const gu={m:{value:m},tp:{value:tp},r0:{value:r0},hd:{value:hd},bar:{value:o.bar||0},arms:{value:o.arms==null?1:o.arms},sharp:{value:o.sharp||3},dust:{value:o.dust==null?.8:o.dust},fl:{value:o.fl||.55},ring:{value:o.ring||0},ringW:{value:o.ringW||.25},ring2:{value:o.ring2||0},spoke:{value:o.spoke||0},R:{value:R},floc:{value:o.floc==null?.6:o.floc},hii:{value:o.hii==null?1:o.hii},cin:{value:CC(o.cin||'#ffe2b0')},cout:{value:CC(o.cout||'#9cb8ff')},carm:{value:CC(o.carm||'#b8d0ff')}};
const pl=new THREE.Mesh(new THREE.PlaneGeometry(R*2.1,R*2.1,1,1),sm(DGF,gu,{...ADD,side:THREE.DoubleSide}));pl.rotation.x=-HP;disk.add(pl);
const P=[],C=[],S=[],DP=[],DC=[],DS=[],HP_=[],HC=[],HS=[];const add=(A,Cc,Ss,x,y,z,c,b,s)=>{A.push(x,y,z);Cc.push(c.r*b,c.g*b,c.b*b);Ss.push(s)};
const armT=(k,rr)=>k*6.2832/m+Math.log(rr/r0)/tp,thick=rr=>.035+.03*Math.exp(-rr/R*3);
const Nb=Math.round((o.nb||5000)*L),Na=Math.round((o.na||16000)*L),Nf=Math.round((o.nf||9000)*L);
for(let i=0;i<Nb;i++){const rr=Math.pow(r(),1.8)*(o.rb||.8),th=r()*6.2832,ct=r()*2-1,st=Math.sqrt(1-ct*ct);const c=old.clone().lerp(CC('#ffb070'),r()*.4);add(P,C,S,rr*st*Math.cos(th),rr*ct*(o.bq||.55),rr*st*Math.sin(th),c,.6+r()*.5,.05+r()*.04)}
if(o.bar)for(let i=0;i<Math.round(3000*L);i++){const x=gs(r)*r0*.55,yy=gs(r)*.05,z=gs(r)*r0*.1;add(P,C,S,x,yy,z,old,.7,.06)}
if((o.arms==null?1:o.arms)>0)for(let i=0;i<Na;i++){const k=i%m,rr=Math.min(R*.98,r0*.9+(-Math.log(1-r()*.995))*hd*1.05),u=rr/R,w=(o.aw||.22)*(1+(o.floc||.6)*r()),th=armT(k,rr)+gs(r)*w*.5;
const c=young.clone().lerp(old,Math.max(0,.6-u)*.8+r()*.15);if(r()<.012)c.set(1,.55,.35);add(P,C,S,rr*Math.cos(th),gs(r)*thick(rr),rr*Math.sin(th),c,.75+r()*.6,r()<.02?.16:.05+r()*.05)}
for(let i=0;i<Nf;i++){const rr=Math.min(R,-Math.log(1-r()*.99)*hd),th=r()*6.2832;add(P,C,S,rr*Math.cos(th),gs(r)*thick(rr)*1.3,rr*Math.sin(th),old.clone().lerp(young,rr/R*.6),.45+r()*.4,.045+r()*.04)}
if(o.ring){const Nr=Math.round(9000*L);for(let i=0;i<Nr;i++){const th=r()*6.2832,rr=o.ring+gs(r)*(o.ringW||.25)*.6;add(P,C,S,rr*Math.cos(th),gs(r)*.04,rr*Math.sin(th),young,.8+r()*.5,.05+r()*.05)}}
const nH=Math.round((o.nh==null?60:o.nh)*L);for(let k=0;k<nH;k++){let rr,th;if(o.ring&&r()<.75){rr=o.ring+gs(r)*.12;th=r()*6.2832}else{rr=r0+r()*(R*.85-r0);th=armT(k%m,rr)+gs(r)*.12-.05}const cx=rr*Math.cos(th),cz=rr*Math.sin(th),n=8+Math.floor(r()*14),sc=.03+r()*.06;
for(let j=0;j<n;j++){add(HP_,HC,HS,cx+gs(r)*sc,gs(r)*.02,cz+gs(r)*sc,j%3?CC('#ff5c8a'):CC('#cfe0ff'),1+r(),.08+r()*.1)}}
const dd=o.dust==null?.8:o.dust,Nd=Math.round(5000*L*dd);for(let i=0;i<Nd;i++){let rr,th;if((o.arms==null?1:o.arms)>0&&r()<.8){rr=r0*.9+(-Math.log(1-r()*.99))*hd;th=armT(i%m,rr)-.85/m+gs(r)*.07}else{rr=(o.dustR||R*.7)*(.4+r()*.6);th=r()*6.2832}if(rr>R*.95)continue;
add(DP,DC,DS,rr*Math.cos(th),gs(r)*.025,rr*Math.sin(th),CC('#140a06'),1,.18+r()*.28)}
disk.add(gPts(P,C,S));if(HS.length)disk.add(gPts(HP_,HC,HS,{br:1.2}));if(DS.length)disk.add(gPts(DP,DC,DS,{dust:1}))
const bul=vol({re:(o.rb||.8)*.32,n:o.bn||2.5,amp:o.ba||1.6,cut:(o.rb||.8)*2.4,q:o.bq||.62,c1:o.bc1||'#fff3dc',c2:o.bc2||'#ffc47a'});disk.add(bul);
G0.userData.spin=o.spin==null?.05:o.spin;G0.userData.disk=disk;G0.userData.gu=gu;return G0}
function ellGal(o,r){const G0=new THREE.Group(),L=GLITE?.25:1,re=o.re||.7,q=o.q||.75;G0.add(vol({re,n:o.n||4,amp:o.amp||1.5,cut:re*(o.cutK||4.5),q,c1:o.c1||'#fff0d8',c2:o.c2||'#ffbf80'}));
const P=[],C=[],S=[];for(let i=0;i<Math.round((o.ns||6000)*L);i++){const rr=re*Math.pow(r(),2.2)*4,th=r()*6.2832,ct=r()*2-1,st=Math.sqrt(1-ct*ct),c=CC('#ffd8a8').lerp(CC('#ffb070'),r()*.5);P.push(rr*st*Math.cos(th),rr*ct*q,rr*st*Math.sin(th));C.push(c.r*.55,c.g*.55,c.b*.55);S.push(.04+r()*.04)}
for(let i=0;i<Math.round((o.ngc||90)*L);i++){const v=V3(gs(r),gs(r)*q,gs(r)).multiplyScalar(re*3.2);P.push(v.x,v.y,v.z);C.push(1,.85,.6);S.push(.07+r()*.04)}G0.add(gPts(P,C,S));return G0}
/* procedural mini-galaxies: each point is a tiny spiral or elliptical at its own angle and inclination */
const MGV=`attribute vec3 color;attribute float size,sd,ty;uniform float t,pr;varying vec3 vc;varying float vt,va,vang,vinc;void main(){vc=color;vt=ty;vang=sd*6.2832;vinc=.22+.78*fract(sd*7.31);vec4 mv=modelViewMatrix*vec4(position,1.);float ps=size*length(modelMatrix[0].xyz)*pr*120./-mv.z;va=clamp(ps/3.,0.,1.);gl_PointSize=max(2.,ps);gl_Position=projectionMatrix*mv;}`;
const MGF=`varying vec3 vc;varying float vt,va,vang,vinc;void main(){vec2 p=gl_PointCoord-.5;float c=cos(vang),s=sin(vang);p=vec2(c*p.x-s*p.y,s*p.x+c*p.y);p.y/=vinc;float r=length(p)*2.;if(r>1.)discard;float I;
if(vt<.5)I=exp(-7.*pow(r,.55))*1.6;else{float th=atan(p.y,p.x);float arm=.5+.5*cos(2.*(th-log(r+.04)*2.4));I=exp(-4.2*r)*(.35+1.1*arm*smoothstep(.05,.3,r))+exp(-r*r*90.)*1.4;}
I*=smoothstep(1.,.65,r);vec3 col=vt<.5?vc*vec3(1.,.85,.65):mix(vc*vec3(1.,.9,.75),vc*vec3(.7,.85,1.2),smoothstep(.1,.6,r));gl_FragColor=vec4(col*I*va,1.);}`;
function miniGals(list){const P=[],C=[],S=[],SD=[],T=[];list.forEach(g=>{P.push(g.p.x,g.p.y,g.p.z);C.push(g.c.r,g.c.g,g.c.b);S.push(g.s);SD.push(Math.random());T.push(g.t)});
const p=new THREE.Points(XBG({position:[P,3],color:[C,3],size:[S,1],sd:[SD,1],ty:[T,1]}),new THREE.ShaderMaterial({uniforms:{t:U.t,pr:U.pr},vertexShader:MGV,fragmentShader:MGF,...ADD}));p.frustumCulled=false;return p}
const galPick=(r,ell)=>{const e=r()<ell;return{t:e?0:1,c:e?CC('#ffd2a0').multiplyScalar(.8+r()*.4):CC('#d8e4ff').lerp(CC('#ffe0b0'),r()*.5)}};
/* cosmic-web skeleton: nodes + nearest-neighbour filaments, galaxies sampled on both */
function webGals(r,nodes,o){const L=[],E=new Set(),out=[];nodes.forEach((a,i)=>{nodes.map((b,j)=>[a.distanceTo(b),j]).filter(x=>x[1]!=i).sort((x,y)=>x[0]-y[0]).slice(0,o.k||3).forEach(([d,j])=>{const key=i<j?i+'_'+j:j+'_'+i;if(!E.has(key)&&d<(o.maxL||9)){E.add(key);L.push([a,nodes[j]])}})});
const N=GLITE?Math.round(o.n*.25):o.n;for(let i=0;i<N;i++){const u=r();let p;if(u<(o.fn||.35)){const c=nodes[Math.floor(r()*nodes.length)];p=V3(gs(r),gs(r),gs(r)).multiplyScalar(o.nw||.22).add(c);const g=galPick(r,.7);out.push({p,s:.06+r()*.07,...g})}
else if(u<.94&&L.length){const [a,b]=L[Math.floor(r()*L.length)];p=a.clone().lerp(b,r()).add(V3(gs(r),gs(r),gs(r)).multiplyScalar(o.fw||.1));out.push({p,s:.045+r()*.05,...galPick(r,.3)})}
else{p=V3(gs(r),gs(r),gs(r)).multiplyScalar(o.spread||2.5);out.push({p,s:.04+r()*.04,...galPick(r,.3)})}}return{gals:out,links:L}}
function filGlow(links,col,w){const P=[],C=[],S=[];links.forEach(([a,b])=>{for(let k=0;k<26;k++){const p=a.clone().lerp(b,k/25);P.push(p.x+gs(Math.random)*w,p.y+gs(Math.random)*w,p.z+gs(Math.random)*w);C.push(col.r*.12,col.g*.12,col.b*.12);S.push(.5+Math.random()*.5)}});return gPts(P,C,S)}
function tidal(r,o){const P=[],C=[],S=[];const n=Math.round((o.n||5000)*(GLITE?.25:1));for(let i=0;i<n;i++){const u=Math.pow(r(),.8),a=o.a0+u*o.sweep,rr=o.r0+u*o.len,p=V3(Math.cos(a)*rr,gs(r)*.06+u*(o.lift||0),Math.sin(a)*rr).add(o.c).add(V3(gs(r),gs(r),gs(r)).multiplyScalar(.08+u*.12));
const c=r()<.08?CC('#ff6a9a'):CC('#b0c8ff').lerp(CC('#ffe0b0'),r()*.4);P.push(p.x,p.y,p.z);C.push(c.r*.8,c.g*.8,c.b*.8);S.push(.05+r()*.05)}return gPts(P,C,S)}
function lensArcs(g,n,R0,r){const bl=g.userData.bill||(g.userData.bill=[]);const grp=new THREE.Group();for(let k=0;k<n;k++){const a=r()*6.2832,len=.35+r()*.5,rr=R0*(.8+r()*.5);const m=new THREE.Mesh(new THREE.RingGeometry(rr-.025,rr+.025,48,1,a,len),sm(`void main(){float u=fract(atan(vP.y,vP.x)/6.2832+1.);gl_FragColor=vec4(vec3(.55,.75,1.)*1.6,1.);}`,{},ADD));grp.add(m)}g.add(grp);bl.push(grp)}

const GAL={};
const gSpin=(g,G0)=>onU(g,t=>{G0.userData.disk.rotation.y=t*G0.userData.spin});
const tiltG=(g,G0,x,z)=>{G0.rotation.x=x;G0.rotation.z=z||0;g.add(G0);gSpin(g,G0);g.userData.noSpin=1;return G0};
GAL['Spiral Galaxy']=(o,r,g)=>tiltG(g,diskGal({m:3,pitch:17,floc:.9,aw:.3,sharp:2.2},r),.95,.15);
GAL['Barred Spiral Galaxy']=(o,r,g)=>tiltG(g,diskGal({m:2,pitch:12,bar:1.1,r0:1.05,sharp:3,floc:.5,rb:.55,dust:1},r),1.0,.2);
GAL['Grand Design Spiral']=(o,r,g)=>{const G0=tiltG(g,diskGal({m:2,pitch:15,sharp:4.5,floc:.25,aw:.16,dust:1.1,nh:90},r),.9,-.1);const c=ellGal({re:.18,ns:900,ngc:0,amp:1.3},r);c.position.set(3.3,.1,1.1);G0.userData.disk.add(c);const br=tidal(r,{c:V3(0,0,0),a0:0.,sweep:.6,r0:2.6,len:1,n:900});G0.userData.disk.add(br)};
GAL['Seyfert Galaxy']=(o,r,g)=>{const G0=tiltG(g,diskGal({m:2,pitch:20,sharp:2.6,floc:.7,ba:2.2,rb:.6},r),1.05,.1);const core=glow(0xdfe8ff,1.6),c2=glow(0x9fc0ff,.6);G0.add(core,c2);
[1,-1].forEach(s=>{const cn=new THREE.Mesh(new THREE.ConeGeometry(.55,1.6,32,1,true).translate(0,-.8,0),sm(`void main(){float f=1.-abs(dot(normalize(vN),normalize(vV)));float l=smoothstep(-1.6,0.,vP.y);gl_FragColor=vec4(vec3(.3,1.,.85)*(.06+f*.12)*l*(.7+.6*fbm(vP*4.+t*.2)),1.);}`,{},{...ADD,side:THREE.DoubleSide}));cn.rotation.x=s>0?Math.PI:0;G0.add(cn)});onU(g,t=>{core.scale.setScalar(1.5+.25*Math.sin(t*2.3)+.15*Math.sin(t*5.1))})};
GAL['Starburst Galaxy']=(o,r,g)=>{const G0=tiltG(g,diskGal({m:2,pitch:25,arms:.4,floc:1,dust:1.4,nh:140,hii:2.5,R:2.6,rb:.5,ba:2.4,cin:'#ffd2c0'},r),1.42,.35);
G0.add(vol({re:.35,n:1,amp:1.1,cut:2.6,q:1.6,nz:1,ns:2.4,c1:'#ff3a5a',c2:'#ff8a5a',p:V3(0,0,0)}));
const P=[],C=[],S=[];for(let i=0;i<4000;i++){const s=r()<.5?1:-1,h=Math.pow(r(),.7)*2.3,w=.12+h*.45,a=r()*6.2832;P.push(Math.cos(a)*w*Math.sqrt(r()),s*h,Math.sin(a)*w*Math.sqrt(r()));const c=r()<.7?CC('#ff4060'):CC('#ffb070');C.push(c.r*.5,c.g*.5,c.b*.5);S.push(.05+r()*.06)}G0.add(gPts(P,C,S))};
GAL['Ring Galaxy']=(o,r,g)=>{const G0=tiltG(g,diskGal({arms:0,ring:2.3,ringW:.22,m:2,dust:.15,hd:4,fl:.5,nf:2000,rb:.75,ba:2.6,bn:2,cout:'#8fb4ff',carm:'#9fc4ff',nh:50},r),.55,.1);G0.userData.gu.fl.value=.45;
const bg=ellGal({re:.09,ns:0,ngc:0,amp:.9,c1:'#ffb080',c2:'#ff7a40'},r);bg.position.set(.9,.4,-1.2);g.add(bg);const rg=diskGal({arms:0,ring:.22,ringW:.05,R:.35,nb:0,na:0,nf:0,nh:4,dust:0,rb:.05,ba:.4,spin:0},r);rg.position.copy(bg.position);rg.rotation.x=1.2;g.add(rg)};
GAL['Cartwheel Galaxy']=(o,r,g)=>{const G0=tiltG(g,diskGal({arms:0,ring:2.6,ringW:.2,ring2:.75,spoke:9,m:2,dust:.5,dustR:1.6,hd:5,nf:2500,rb:.4,ba:1.8,nh:120,hii:2.5,cout:'#a0c0ff'},r),.8,.3);
[[3.8,.2,1.5,.32],[4.3,-.3,-.8,.22]].forEach(([x,y,z,s])=>{const c=diskGal({m:2,pitch:20,R:s*3.2,r0:.15,hd:s,nb:600,na:1500,nf:800,nh:5,rb:.15,ba:1.2},r);c.position.set(x,y,z);c.rotation.set(.6+r(),r(),0);g.add(c)})};
GAL['Lenticular Galaxy']=(o,r,g)=>tiltG(g,diskGal({arms:0,m:2,hd:.9,dust:1.2,dustR:1.2,nh:0,hii:0,nf:14000,rb:1.05,ba:2.2,bn:3,cout:'#ffe2b8',cin:'#ffe9c8',fl:.75},r),1.25,.25);
GAL['Elliptical Galaxy']=(o,r,g)=>{g.add(ellGal({re:.75,q:.68,n:4,amp:1.6},r));g.rotation.z=.3};
GAL['Giant cD Galaxy']=(o,r,g)=>{g.add(ellGal({re:.65,q:.82,n:4,amp:1.9,ngc:260,ns:9000},r));g.add(vol({re:1.6,n:1.5,amp:.35,cut:4.2,q:.85,c1:'#ffd8a8',c2:'#c89870'}));
for(let k=0;k<5;k++){const v=V3(gs(r),gs(r)*.6,gs(r)).normalize().multiplyScalar(.6+r()*1.6);const e=ellGal({re:.06+r()*.07,q:.8,amp:1.2,ns:0,ngc:0},r);e.position.copy(v);g.add(e)}
const L=[];for(let i=0;i<260;i++){const p=V3(gs(r),gs(r),gs(r)).multiplyScalar(2.8);L.push({p,s:.05+r()*.06,...galPick(r,.75)})}g.add(miniGals(L))};
GAL['Dwarf Galaxy']=(o,r,g)=>{const d=ellGal({re:.35,q:.8,n:1,amp:.55,ns:2500,ngc:4,c1:'#f0e6d8',c2:'#c8b8a0'},r);d.position.set(-.6,.3,.8);g.add(d);
const host=diskGal({m:2,pitch:13,bar:1,r0:.8,R:3.4,fl:.4,dust:1},r);host.scale.setScalar(1.25);host.position.set(2.2,-1.2,-4.2);host.rotation.set(.5,0,.3);g.add(host);gSpin(g,host);g.userData.noSpin=1};
GAL['Irregular Galaxy']=(o,r,g)=>{const G0=tiltG(g,diskGal({m:1,arms:.35,pitch:30,bar:.9,r0:.7,floc:1.4,R:2.6,hd:1,rb:.25,ba:.8,dust:.6,nh:80,hii:2,cin:'#e8e8ff',young:'#b8d0ff'},r),.7,.4);G0.userData.disk.position.x=-.3;
const ta=vol({re:.12,n:1,amp:1.4,cut:.7,nz:1,ns:6,c1:'#ff5a8a',c2:'#ff9ab0',p:V3(1.3,0,.6)});G0.userData.disk.add(ta)};
GAL['Primordial Galaxy']=(o,r,g)=>{g.userData.noSpin=0;const G0=new THREE.Group();g.add(G0);G0.add(vol({re:.6,n:1,amp:.5,cut:2.6,q:.7,nz:1,ns:1.6,c1:'#7ab0ff',c2:'#5a7aff'}));
for(let k=0;k<6;k++){const p=V3(gs(r),gs(r)*.5,gs(r)).multiplyScalar(.9);G0.add(vol({re:.07+r()*.08,n:1,amp:1.8,cut:.6,nz:.6,ns:7,c1:k%2?'#ff7ab0':'#c8e0ff',c2:'#8aa8ff',p}))}
const P=[],C=[],S=[];for(let i=0;i<5000;i++){const p=V3(gs(r),gs(r)*.5,gs(r)).multiplyScalar(1.1);P.push(p.x,p.y,p.z);const c=CC('#a8c8ff');C.push(c.r*.6,c.g*.6,c.b*.6);S.push(.04+r()*.04)}G0.add(gPts(P,C,S));G0.add(vol({re:1.4,n:1,amp:.18,cut:3.6,c1:'#5affc8',c2:'#3a7aff'}))};
GAL['Radio Galaxy']=(o,r,g)=>{g.add(ellGal({re:.45,q:.78,n:4,amp:1.7},r));const j=jetPair(CC('#9ab8ff'),2.8,.12,1.4,1.4);j.scale.setScalar(.9);j.rotation.z=.25;g.add(j);
[1,-1].forEach(s=>{const p=V3(-Math.sin(.25)*3.6*s,Math.cos(.25)*3.6*s,0);g.add(vol({re:.45,n:1,amp:.9,cut:1.25,q:1.25,nz:1,ns:2.2,c1:'#ff6ad0',c2:'#7a5aff',p}),glow(0xffc0f0,.9,p.clone().multiplyScalar(.93)))})};
GAL['Interacting Pair']=(o,r,g)=>{g.userData.noSpin=1;const A=diskGal({m:2,pitch:16,R:2,r0:.35,hd:.6,rb:.45,nb:2500,na:8000,nf:4000,nh:30},r),B=diskGal({m:2,pitch:20,R:1.6,r0:.3,hd:.5,rb:.4,nb:2000,na:6000,nf:3000,nh:25,cin:'#ffe8c8'},r);
const pA=V3(-1.6,.2,0),pB=V3(1.7,-.3,.4);A.position.copy(pA);A.rotation.set(1.1,0,.3);B.position.copy(pB);B.rotation.set(.5,.4,-.6);g.add(A,B);gSpin(g,A);gSpin(g,B);
g.add(tidal(r,{c:pA,a0:2.2,sweep:2.4,r0:1.6,len:2.6,n:5000,lift:.6}),tidal(r,{c:pB,a0:-1,sweep:-2.2,r0:1.3,len:2.2,n:4000,lift:-.5}));
const P=[],C=[],S=[];for(let i=0;i<1500;i++){const p=pA.clone().lerp(pB,r()).add(V3(gs(r),gs(r),gs(r)).multiplyScalar(.18));P.push(p.x,p.y,p.z);C.push(.5,.6,.9);S.push(.05)}g.add(gPts(P,C,S))};
GAL['Galactic Merger']=(o,r,g)=>{g.userData.noSpin=1;const A=diskGal({m:2,pitch:22,R:1.6,r0:.3,hd:.5,rb:.35,nb:2000,na:5000,nf:3000,nh:60,hii:2.5,floc:1.2,dust:1.3},r),B=diskGal({m:2,pitch:24,R:1.4,r0:.3,hd:.45,rb:.3,nb:1800,na:4000,nf:2500,nh:50,hii:2.5,floc:1.3,dust:1.3},r);
const pA=V3(-.45,0,.1),pB=V3(.5,.1,-.1);A.position.copy(pA);A.rotation.set(1.2,.3,.5);B.position.copy(pB);B.rotation.set(.4,-.5,-.4);g.add(A,B);gSpin(g,A);gSpin(g,B);
g.add(tidal(r,{c:pA,a0:2.6,sweep:2.8,r0:1.2,len:3.4,n:6000,lift:.9}),tidal(r,{c:pB,a0:-.4,sweep:-2.9,r0:1.1,len:3.2,n:6000,lift:-.9}));
g.add(vol({re:.35,n:1,amp:.9,cut:1.6,nz:1,ns:4,c1:'#ff6a9a',c2:'#ffa070'}))};
/* star clusters */
GAL['Globular Cluster']=(o,r,g)=>{g.userData.noSpin=0;const P=[],C=[],S=[],BP=[],BC=[],BS=[],N=GLITE?5000:26000;for(let i=0;i<N;i++){const u=r(),rr=.2*Math.pow(1/(1-u*.985)-1,.55),v=V3(gs(r),gs(r),gs(r)).normalize().multiplyScalar(Math.min(rr,3.2));const q=r();let c=CC('#ffe6c0'),s=.035+r()*.03,b=.55;
if(q<.04){c=CC('#ff9a50');s=.1;b=1}else if(q<.055){c=CC('#9ac0ff');s=.09;b=1}(s>.08?BP:P).push(v.x,v.y,v.z);(s>.08?BC:C).push(c.r*b,c.g*b,c.b*b);(s>.08?BS:S).push(s)}
g.add(gPts(P,C,S),gPts(BP,BC,BS,{spike:1}),vol({re:.12,n:1.2,amp:1.6,cut:1.4,c1:'#fff0d8',c2:'#ffd8a0'}))};
GAL['Open Cluster']=(o,r,g)=>{g.userData.noSpin=0;const P=[],C=[],S=[],BP=[],BC=[],BS=[];for(let i=0;i<320;i++){const v=V3(gs(r),gs(r),gs(r)).multiplyScalar(1.3);const q=r();let c=CC('#cfe0ff').lerp(CC('#fff2d8'),r()*.6),s=.05+r()*.05;if(q<.04){c=CC('#ffc080')}if(i<14){BP.push(v.x,v.y,v.z);c=CC('#b8d4ff');BC.push(c.r*1.4,c.g*1.4,c.b*1.4);BS.push(.35+r()*.25)}else{P.push(v.x,v.y,v.z);C.push(c.r,c.g,c.b);S.push(s)}}
g.add(gPts(P,C,S),gPts(BP,BC,BS,{spike:1}),vol({re:.9,n:1,amp:.5,cut:2.8,nz:1,ns:1.5,c1:'#5a8aff',c2:'#3a5adf'}))};
/* large-scale structure */
GAL['Galaxy Group']=(o,r,g)=>{g.userData.noSpin=0;const pos=[[-1.2,.3,.4,.42,1],[1.1,-.2,-.3,.36,1],[.2,.9,-.9,.3,0],[.4,-1,.8,.28,1],[-.3,-.6,-1.3,.22,0]];pos.forEach(([x,y,z,s,sp])=>{let m;if(sp){m=diskGal({m:2,pitch:16,R:s*3,r0:.12,hd:s,nb:500,na:2200,nf:900,nh:6,rb:.12,ba:1.2},r);m.rotation.set(r()*3,r()*3,0);gSpin(g,m)}else{m=ellGal({re:s*.35,ns:500,ngc:0,amp:1.4},r)}m.position.set(x,y,z);g.add(m)});
g.add(vol({re:1.1,n:1,amp:.16,cut:3,c1:'#ffe0c0',c2:'#c0a0ff'}));const L=[];for(let i=0;i<60;i++)L.push({p:V3(gs(r),gs(r),gs(r)).multiplyScalar(2.2),s:.05+r()*.04,...galPick(r,.4)});g.add(miniGals(L))};
GAL['Galaxy Cluster']=(o,r,g)=>{g.userData.noSpin=0;const L=[];for(let i=0;i<(GLITE?250:1100);i++){const rr=.36*Math.pow(1/(1-r()*.97)-1,.6),p=V3(gs(r),gs(r),gs(r)).normalize().multiplyScalar(Math.min(rr,3.3));L.push({p,s:.05+r()*.07*(rr<.8?1.6:1),...galPick(r,rr<1.2?.85:.4)})}g.add(miniGals(L));
g.add(ellGal({re:.22,q:.85,amp:2,ns:1500,ngc:60},r),vol({re:.8,n:1,amp:.45,cut:3.4,nz:.6,ns:1.2,c1:'#b07aff',c2:'#5a7aff'}));lensArcs(g,7,1.25,r)};
GAL['Supercluster']=(o,r,g)=>{g.userData.noSpin=0;const N=[];for(let k=0;k<11;k++)N.push(V3(gs(r)*2.6,gs(r)*1.4,gs(r)*2.6));const W=webGals(r,N,{n:9000,fn:.45,nw:.2,fw:.08,k:2,maxL:4});g.add(miniGals(W.gals),filGlow(W.links,CC('#8aa8ff'),.12));N.forEach(c=>g.add(vol({re:.16,n:1,amp:.5,cut:.6,c1:'#c8a0ff',c2:'#7a8aff',p:c})))};
GAL['Cosmic Void Edge']=(o,r,g)=>{g.userData.noSpin=0;const N=[];for(let k=0;k<36;k++)N.push(V3(gs(r),gs(r),gs(r)).normalize().multiplyScalar(2.6+gs(r)*.12));const W=webGals(r,N,{n:8000,fn:.3,nw:.16,fw:.07,k:3,maxL:2.2,spread:.1});W.gals=W.gals.filter(x=>x.p.length()>1.8);g.add(miniGals(W.gals),filGlow(W.links,CC('#9ab0ff'),.08));
g.add(vol({re:1.8,n:1,amp:.06,cut:2.4,c1:'#000000',c2:'#2a1a4a'}))};
GAL['Great Wall']=(o,r,g)=>{g.userData.noSpin=0;const N=[];for(let k=0;k<26;k++)N.push(V3(gs(r)*3.6,gs(r)*.25+Math.sin(k)*.3,gs(r)*1.2));const W=webGals(r,N,{n:9000,fn:.4,nw:.15,fw:.08,k:3,maxL:2.4,spread:.3});W.gals.forEach(x=>x.p.y+=Math.sin(x.p.x*.8)*.4);g.add(miniGals(W.gals),filGlow(W.links,CC('#a8b8ff'),.1));g.rotation.x=.5};
GAL['Hubble Volume']=(o,r,g)=>{g.userData.noSpin=0;const N=[];for(let k=0;k<70;k++){const v=V3(gs(r),gs(r),gs(r));if(v.length()>1.9)v.setLength(1.9);N.push(v.multiplyScalar(1.4))}const W=webGals(r,N,{n:14000,fn:.35,nw:.1,fw:.05,k:3,maxL:1.4,spread:1.5});
W.gals.forEach(x=>{const d=x.p.length()/2.7;x.c.lerp(CC('#ff7a50'),Math.min(1,d*.8));x.s*=.6});g.add(miniGals(W.gals),filGlow(W.links,CC('#8aa0ff'),.05));
g.add(new THREE.Mesh(new THREE.SphereGeometry(2.95,96,64),sm(`void main(){vec3 p=normalize(vP);float T=fbm(p*5.)+.5*fbm(p*12.+3.)-.75;vec3 c=T>0.?mix(vec3(.9,.8,.7),vec3(1.,.35,.1),clamp(T*2.,0.,1.)):mix(vec3(.9,.8,.7),vec3(.15,.35,1.),clamp(-T*2.,0.,1.));float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.5);gl_FragColor=vec4(c*(.05+f*.75),1.);}`,{},ADD)))};
{const _g=G.gal;G.gal=(o,r,g)=>{const f=GAL[o.n];if(!f)return _g(o,r,g);f(o,r,g)}}
{const _gm=galaxyM;galaxyM=function(g,s,pos,name){GLITE=1;try{return _gm(g,s,pos,name)}finally{GLITE=0}}}
