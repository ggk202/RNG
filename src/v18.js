/* ---------- v18: volumetric nebulae — ray-marched emission + absorbing dust, tiled 3D noise texture ---------- */
/* 64^3 tileable fbm (2 channels) packed as 8x8 slices with 1px wrap padding -> 528x528; built lazily */
let NTX=null;function noiseTex(){if(NTX)return NTX;const N=64,PD=66,W=528,d=new Uint8Array(W*W*4),V=new Float32Array(N*N*N*2);const OC=[[4,.5],[8,.3],[16,.2]];
const lat=(c,seed)=>{const L=new Float32Array(c*c*c);let s=seed;for(let i=0;i<L.length;i++){s=(s*16807)%2147483647;L[i]=s/2147483647}return L};
for(let ch=0;ch<2;ch++)for(let k=0;k<OC.length;k++){const c=OC[k][0],w=OC[k][1],L=lat(c,1234+k*77+ch*5003),ix=new Int32Array(N),tt=new Float32Array(N);for(let x=0;x<N;x++){const f=x/N*c;ix[x]=Math.floor(f);let q=f-ix[x];tt[x]=q*q*(3-2*q)}
for(let z=0;z<N;z++){const z0=ix[z]%c,z1=(ix[z]+1)%c,tz=tt[z];for(let y=0;y<N;y++){const y0=ix[y]%c,y1=(ix[y]+1)%c,ty=tt[y];for(let x=0;x<N;x++){const x0=ix[x]%c,x1=(ix[x]+1)%c,tx=tt[x];
const a=L[(x0*c+y0)*c+z0],b=L[(x1*c+y0)*c+z0],e=L[(x0*c+y1)*c+z0],f=L[(x1*c+y1)*c+z0],g2=L[(x0*c+y0)*c+z1],h2=L[(x1*c+y0)*c+z1],i2=L[(x0*c+y1)*c+z1],j2=L[(x1*c+y1)*c+z1];
const l1=a+(b-a)*tx,l2=e+(f-e)*tx,l3=g2+(h2-g2)*tx,l4=i2+(j2-i2)*tx,m1=l1+(l2-l1)*ty,m2=l3+(l4-l3)*ty;V[((z*N+y)*N+x)*2+ch]+=w*(m1+(m2-m1)*tz)}}}}
const mn=[1,1],mx=[0,0];for(let i=0;i<V.length;i++){const c=i&1;if(V[i]<mn[c])mn[c]=V[i];if(V[i]>mx[c])mx[c]=V[i]}
for(let z=0;z<N;z++){const tx=z%8,ty=Math.floor(z/8);for(let py=-1;py<=N;py++)for(let px=-1;px<=N;px++){const sx=(px+N)%N,sy=(py+N)%N,k=((ty*PD+1+py)*W+(tx*PD+1+px))*4,s=((z*N+sy)*N+sx)*2;d[k]=Math.round((V[s]-mn[0])/(mx[0]-mn[0])*255);d[k+1]=Math.round((V[s+1]-mn[1])/(mx[1]-mn[1])*255);d[k+2]=0;d[k+3]=255}}
const t=new THREE.DataTexture(d,W,W,THREE.RGBAFormat);t.magFilter=t.minFilter=THREE.LinearFilter;t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.needsUpdate=true;NTX=t;return t}
const NVF=`uniform sampler2D NT;uniform vec3 cl,c1,c2,c3,cd;uniform float md,Rb,den,ab,sc,thr;uniform vec4 pa,pb,pc;
vec2 tnz(vec3 p){p=fract(p);float z=p.z*64.-.5,z0=floor(z),fz=z-z0,s0=mod(z0+64.,64.),s1=mod(z0+65.,64.);vec2 xy=p.xy*64.;
vec2 a=(vec2(mod(s0,8.),floor(s0/8.))*66.+1.+xy)/528.,b=(vec2(mod(s1,8.),floor(s1/8.))*66.+1.+xy)/528.;return mix(texture2D(NT,a).rg,texture2D(NT,b).rg,fz);}
float fb(vec3 p){return tnz(p*.25).r*.56+tnz(p*.53+.37).g*.29+tnz(p*1.13+.71).r*.15;}
float rdg(vec3 p){return 1.-abs(2.*fb(p)-1.);}
float cap(vec3 p,vec3 a,vec3 b){vec3 pa_=p-a,ba=b-a;float h=clamp(dot(pa_,ba)/dot(ba,ba),0.,1.);return length(pa_-ba*h);}
vec4 fld(vec3 p){float r=length(p);vec3 E=vec3(0.);float A=0.;
if(md<.5){/* emission / HII: warped turbulence, ionised cavity around the star at pa.xyz, dark dust lanes */
vec3 w=p+(vec3(tnz(p*.07+.7),tnz(p*.07+3.1).x)-.5)*pb.x;float n=fb(w*sc);float rr_=length(p*vec3(1.,.72,1.))+(fb(p*.3+9.)-.5)*2.6;float fall=exp(-rr_*rr_/(Rb*Rb*.3));float ds=length(p-pa.xyz);float cav=smoothstep(pa.w*.55,pa.w*1.25,ds);
float dn=pow(max(0.,n-thr)/(1.-thr),1.7)*2.4*fall*cav;dn+=pow(rdg(w*sc*1.35+2.),9.)*fall*cav*.4;float front=1.+2.6*exp(-pow((ds-pa.w*1.2)*1.6,2.));vec3 col=mix(c2,c1,smoothstep(pa.w*.8,pa.w*2.6+.6,ds));col=mix(col,c3,smoothstep(.62,.8,fb(w*sc*1.9+11.))*.6);
float dust=smoothstep(.5,.68,fb(w*sc*1.6+5.))*fall*ab;if(pb.w>0.){float an=atan(p.y,p.x);dust+=pb.w*exp(-pow(sin(an*1.5+.4)*length(p.xy)*3.,2.))*smoothstep(.15,.6,length(p.xy))*fall;}
if(pc.x>0.)dust+=pc.x*exp(-pow((p.y+.35*p.x+.1*sin(p.x*3.))*2.6,2.))*fall;
E=col*dn*front*den;A=dust*2.8+dn*.35;}
else if(md<1.5){/* Pillars of Creation: three tapered dust columns, lit from above, against a glowing cavity */
float ps=pb.x;vec3 q=p/ps;float n=fb(p*.5+3.);float bg=(pow(max(0.,n-.36)/.64,1.4)*1.6+pow(rdg(p*.9+5.),6.)*.5)*exp(-pow(p.z+1.6,2.)*.45)*pb.y;E=mix(c2,c3,smoothstep(-1.5,2.,-p.y+(n-.5)*2.))*bg*den;
float nd=(fb(q*2.4+7.)-.5)*.55;float s1=cap(q,vec3(-1.25,-3.4,0.),vec3(-.85,1.9,-.1))-mix(.62,.3,smoothstep(-3.4,1.9,q.y));float s2=cap(q,vec3(.35,-3.4,.15),vec3(.45,-.15,.25))-mix(.42,.26,smoothstep(-3.4,-.15,q.y));
float s3=cap(q,vec3(1.35,-3.4,-.05),vec3(1.55,-1.25,0.))-mix(.36,.2,smoothstep(-3.4,-1.25,q.y));float sdf=min(min(s1,s2),s3)+nd;if(pc.y>0.)sdf=min(sdf,(q.y+2.9+nd*1.5)/pc.y);sdf*=ps;
float ins=smoothstep(.05,-.18,sdf);float rim=exp(-abs(sdf)*7.)*smoothstep(-.3,.15,sdf);float lit=.35+.65*smoothstep(-3.,2.,p.y);float tip=exp(-abs(sdf)*16.)*smoothstep(-1.,1.8,p.y);
E+=(c1*rim*lit*2.4+vec3(1.,.82,.55)*tip*1.6+cd*ins*.16)*den;A+=ins*ab*(.65+.7*fb(q*3.1))*1.5;}
else if(md<2.5){/* planetary nebula shell: ellipsoid/barrel, OIII inside -> H-alpha outside, knots, halo rings */
vec3 q=p/pa.xyz;float rr=length(q);float sh=exp(-pow((rr-pb.x)/pb.y,2.));float eq=mix(1.,smoothstep(0.,.95,1.-abs(q.y)/max(rr,.01)),pb.z);float n=fb(p*2.3);
float dn=sh*eq*(.5+n)*den;float fill=exp(-rr*rr*2.6/(pb.x*pb.x))*.22*den;vec3 col=mix(c2,c1,smoothstep(pb.x-pb.y,pb.x+pb.y*1.2,rr));E=col*dn+c2*fill;
if(pa.w>0.){vec3 dr=normalize(p);float kn=pow(tnz(dr*3.3+rr*.02).r,10.)*pa.w*smoothstep(pb.x-pb.y*2.5,pb.x,rr)*smoothstep(pb.x+pb.y*3.,pb.x+pb.y,rr);E+=c3*kn*2.2;A+=kn*2.;}
if(pb.w>0.)E+=c1*pow(.5+.5*sin(rr*24.),22.)*exp(-rr*1.1)*pb.w*den;
if(pc.x>0.){vec3 q2=(p-vec3(.2,.1,0.))/vec3(.55,.8,.5);float rr2=length(q2);E+=c3*exp(-pow((rr2-.8)/.12,2.))*(.4+n)*pc.x*den;}}
else if(md<3.5){/* bipolar: two lobes with limb-brightened walls, dusty waist */
float y=abs(p.y),H=pb.x,Wd=pb.y;float rl=Wd*pow(max(0.,sin(3.1416*clamp(y/H,0.,1.))),.62)+.04;float rx=length(p.xz);float inl=step(y,H);float n=fb(p*1.9+vec3(0.,y*.6,0.));
float shl=exp(-pow((rx-rl)/pb.z,2.))*inl,fil=exp(-pow(rx/max(rl,.05),2.)*2.)*inl*.12;float dn=(shl+fil)*pow(.25+n*1.2,1.6)*den;if(pa.w>0.)dn*=.55+.9*pow(.5+.5*sin(y*pa.w),6.);
vec3 col=mix(c3,mix(c2,c1,smoothstep(.15,.85,y/H)),smoothstep(0.,.35,y/H));E=col*dn+vec3(1.,.95,.9)*exp(-r*r*40.)*pa.x;A=ab*exp(-pow((rx-pc.x)*3.,2.)-p.y*p.y*pc.y)*(.6+n);}
else if(md<4.5){/* supernova remnant: ridged filaments on an expanding shell; optional synchrotron core; optional partial arcs */
vec3 dr=p/max(r,1e-3);float rd=rdg(dr*pb.y+vec3(r*.35)+1.7);float fl=pow(rd,pb.z);float sh=exp(-pow((r-pb.x)/pa.w,2.));float n=fb(p*2.6);float dn=sh*fl*den*(.5+n);
if(pa.y>0.)dn*=smoothstep(.35,.85,dot(dr,normalize(vec3(1.,.35,.2))))+smoothstep(.45,.9,dot(dr,normalize(vec3(-.7,-.5,.4))))*.8;
E=mix(c1,c2,smoothstep(.35,.65,fb(p*1.2+9.)))*dn;if(pc.y>0.)E=mix(E,c3*dn,smoothstep(.55,.7,fb(p*1.7+21.)));if(pa.x>0.){float syn=exp(-r*r/(pb.x*pb.x*.33))*(.55+.6*fb(p*3.5+t*.02));E+=c3*syn*pa.x;}A=dn*.25;}
else if(md<5.5){/* dark nebulae: horsehead silhouette, Bok globules, dark lanes, molecular clumps */
if(pa.x>0.){float edge=smoothstep(-.6,.2,p.y+(fb(p*1.4)-.5)*1.1);E=c1*pa.x*exp(-pow(p.z+.9,2.)*1.4)*(.45+.9*fb(p*.8+2.))*edge*den+c3*pa.x*.35*(1.-edge)*exp(-pow(p.z+.9,2.)*2.)*den;}
float nd=(fb(p*2.2)-.5)*.5;float sdf=1e3;if(pa.z<1.5){sdf=min(cap(p,vec3(-.1,-3.,0.),vec3(.05,.35,0.))-.55,length((p-vec3(.38,.8,0.))/vec3(.62,.44,.42))-1.);sdf=min(sdf,cap(p,vec3(.45,.78,0.),vec3(1.12,.12,0.))-.24);sdf=min(sdf,cap(p,vec3(.1,1.05,0.),vec3(.0,1.42,0.))-.11);sdf=min(sdf,p.y+1.7);sdf+=nd;}
else if(pa.z<2.5){sdf=min(min(length(p-vec3(-.6,.3,.2))-.75,length(p-vec3(.9,-.5,-.2))-.45),length(p-vec3(.3,1.1,.1))-.3)+nd*1.2;}
else{float n=fb(p*pb.x);sdf=(.58-n)*2.;}
float ins=smoothstep(.06,-.2,sdf);float rim=exp(-abs(sdf)*9.)*smoothstep(-.25,.1,sdf);float fo=exp(-r*r/(Rb*Rb*.45));E*=fo;E+=(c2*rim*pb.y*den+cd*ins*pc.z)*fo;A=ins*ab*(.7+.6*fb(p*3.3))*fo;
if(pa.w>0.){float cl_=pow(fb(p*2.8+4.),9.)*pa.w;E+=c3*cl_*40.*ins*fo;}}
else if(md<6.5){/* reflection nebula: blue scattered starlight in stretched wisps */
float n=fb(vec3(p.x*.45,p.y*1.5,p.z*1.5)+pc.xyz);float il=1./(1.+dot(p-pa.xyz,p-pa.xyz)*pa.w)+.5/(1.+dot(p-pb.xyz,p-pb.xyz)*pa.w);float dn=max(0.,n-thr)*il*exp(-r*r/(Rb*Rb*.4));E=mix(c2,c1,smoothstep(.2,1.,il))*dn*den;A=dn*.4+smoothstep(.62,.75,fb(p*1.3+8.))*ab*exp(-r*r/(Rb*Rb*.4));}
else{/* wind-blown bubble: thin turbulent shell around a massive star, inside a larger cloud */
vec3 q=p-pa.xyz;float rq=length(q);float sh=exp(-pow((rq-pb.x)/pb.y,2.))*(.45+1.1*fb(p*2.7));if(pb.w>0.)sh*=.4+pow(rdg(q/max(rq,.01)*3.+1.),3.)*1.4;float n=fb(p*.55+2.);float cld=max(0.,n-.42)*exp(-r*r/(Rb*Rb*.35))*pb.z*smoothstep(pb.x*.9,pb.x*1.3,rq);
E=(c2*sh+c1*cld*2.)*den;A=smoothstep(.6,.75,fb(p*1.4+6.))*ab*exp(-r*r/(Rb*Rb*.35));}
return vec4(E,A);}
void main(){vec3 ro=cl,rd=normalize(vP-cl);float b=dot(ro,rd),c=dot(ro,ro)-Rb*Rb,h=b*b-c;if(h<0.)discard;h=sqrt(h);float t0=max(-b-h,0.),t1=-b+h;if(t1<=t0)discard;
float ns=floor(46.*lq),dt=(t1-t0)/ns,jt=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)*dt;vec3 acc=vec3(0.);float T=1.;
for(int i=0;i<64;i++){if(float(i)>=ns||T<.015)break;vec3 p=ro+rd*(t0+jt+dt*float(i));vec4 f=fld(p)*smoothstep(Rb,Rb*.78,length(p));acc+=T*f.rgb*dt;T*=exp(-f.a*dt);}
gl_FragColor=vec4(acc,T);}`;
function nebV(o){const u={NT:{value:noiseTex()},cl:{value:V3()},c1:{value:CC(o.c1||'#ff3a4a')},c2:{value:CC(o.c2||'#3ad8c8')},c3:{value:CC(o.c3||'#ffc860')},cd:{value:CC(o.cd||'#5a3020')},md:{value:o.md||0},Rb:{value:o.R||3.3},den:{value:o.den||1},ab:{value:o.ab==null?1:o.ab},sc:{value:o.sc||1},thr:{value:o.thr==null?.42:o.thr},
pa:{value:new THREE.Vector4(...(o.pa||[0,0,0,.6]))},pb:{value:new THREE.Vector4(...(o.pb||[1,1,1,0]))},pc:{value:new THREE.Vector4(...(o.pc||[0,0,0,0]))}};
const m=new THREE.Mesh(new THREE.SphereGeometry(o.R||3.3,48,32),sm(NVF,u,{transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.CustomBlending,blendSrc:THREE.OneFactor,blendDst:THREE.SrcAlphaFactor,blendEquation:THREE.AddEquation}));
m.renderOrder=1;m.onBeforeRender=(r,s,cam)=>{u.cl.value.copy(cam.position);m.worldToLocal(u.cl.value)};if(o.rot)m.rotation.set(...o.rot);return m}
/* stars that sit in front of / inside the gas (drawn after the volume) */
function nebStars(r,o){const P=[],C=[],S=[],BP=[],BC=[],BS=[];(o.bright||[]).forEach(([x,y,z,c,s])=>{BP.push(x,y,z);const k=CC(c||'#cfe0ff');BC.push(k.r*1.5,k.g*1.5,k.b*1.5);BS.push(s||.3)});
for(let i=0;i<(o.n||0);i++){const v=V3(gs(r),gs(r),gs(r)).multiplyScalar(o.spread||.5).add(o.c||V3());P.push(v.x,v.y,v.z);const k=CC(o.col||'#d8e6ff').lerp(CC('#fff0d8'),r()*.5);C.push(k.r,k.g,k.b);S.push(.05+r()*.06)}
const g=new THREE.Group();if(S.length){const p=gPts(P,C,S);p.renderOrder=2;g.add(p)}if(BS.length){const p=gPts(BP,BC,BS,{spike:1});p.renderOrder=2;g.add(p)}return g}
const NEB={};const nb=(g,...a)=>{g.userData.noSpin=1;a.forEach(x=>g.add(x));return g};
NEB['Emission Nebula']=(o,r,g)=>nb(g,nebV({md:0,c1:'#ff3050',c2:'#ff9a7a',c3:'#ff5ab0',pa:[.3,.2,0,.5],pb:[1.4,1,0,0],sc:1.9,thr:.4,den:0.88}),nebStars(r,{bright:[[.3,.2,0,'#cfe0ff',.35]],n:40,c:V3(.3,.2,0),spread:.4}));
NEB['HII Region']=(o,r,g)=>nb(g,nebV({md:0,c1:'#ff4060',c2:'#5affd0',c3:'#ffd080',pa:[0,0,0,.9],pb:[1.1,1,0,0],thr:.38,ab:.6,sc:1.8,den:0.83}),nebStars(r,{bright:[[0,0,0,'#d8e8ff',.4],[.2,-.15,.1,'#cfe0ff',.25]],n:60,spread:.35}));
NEB['Orion Nebula']=(o,r,g)=>nb(g,nebV({md:0,c1:'#ff3a5a',c2:'#7affe0',c3:'#ffb070',pa:[.15,.1,.3,.75],pb:[1.6,.95,0,0],thr:.36,ab:1.3,pc:[.9,0,0,0],sc:1.9,den:0.99}),nebStars(r,{bright:[[.1,.15,.35,'#dfe8ff',.4],[.25,.05,.3,'#dfe8ff',.33],[.15,-.05,.45,'#e8f0ff',.3],[.0,.02,.38,'#dfe8ff',.28]],n:120,c:V3(.15,.1,.3),spread:.6}));
NEB['Lagoon Nebula']=(o,r,g)=>nb(g,nebV({md:0,c1:'#ff2a5a',c2:'#ff9a9a',c3:'#ffd0a0',pa:[-.6,.1,.2,.45],pb:[1.5,.85,0,0],thr:.35,ab:.9,pc:[1.3,0,0,0],sc:1.8,den:0.99}),nebStars(r,{bright:[[-.6,.12,.25,'#e0ecff',.35]],n:140,c:V3(.6,-.2,0),spread:.7}));
NEB['Trifid Nebula']=(o,r,g)=>{nb(g,nebV({md:0,c1:'#ff2a50',c2:'#ff7a8a',c3:'#ff4a9a',pa:[0,0,0,.35],pb:[1,1,0,1.6],thr:.34,ab:.5,R:2.6,sc:2,den:1.1}),nebV({md:6,R:2.2,c1:'#9ad0ff',c2:'#3a7aff',pa:[0,0,0,.8],pb:[0,0,0,0],thr:.3,den:1.6,ab:0,rot:[0,0,0]}),nebStars(r,{bright:[[0,0,0,'#e8f0ff',.4]]}));g.children[1].position.set(0,2.4,-.6)};
NEB['Rosette Nebula']=(o,r,g)=>nb(g,nebV({md:0,c1:'#ff2a48',c2:'#ff7090',c3:'#ff9a6a',pa:[0,0,0,1.25],pb:[1.2,1.2,0,0],thr:.35,ab:.9,sc:2,den:0.94}),nebStars(r,{n:90,spread:.45,bright:[[0,0,0,'#d8e8ff',.3],[.3,.2,-.1,'#d8e8ff',.25],[-.25,-.1,.2,'#d8e8ff',.22]]}));
NEB['Carina Nebula']=(o,r,g)=>nb(g,nebV({md:0,c1:'#ff5a2a',c2:'#5ac8ff',c3:'#ffd060',pa:[.4,.3,0,.6],pb:[2,1.2,0,0],thr:.33,ab:1.6,R:3.5,pc:[.6,0,0,0],sc:1.7,den:0.99}),nebStars(r,{bright:[[.4,.3,0,'#fff2c0',.7]],n:160,c:V3(.2,.3,0),spread:.9}));
NEB['Tarantula Nebula']=(o,r,g)=>{const v=nebV({md:0,c1:'#ff3a8a',c2:'#5adcff',c3:'#ffb0e0',pa:[0,0,0,.7],pb:[2.2,1.4,0,0],thr:.33,ab:.8,R:3.4,sc:2.1,den:1.04});g.add(v);nb(g,nebStars(r,{n:260,spread:.18,col:'#cfe0ff',bright:[[0,0,0,'#e8f0ff',.6],[.06,.04,.02,'#dfe8ff',.35],[-.05,-.03,.04,'#dfe8ff',.32]]}))};
NEB['Stellar Nursery']=(o,r,g)=>{nb(g,nebV({md:0,c1:'#ff4060',c2:'#ff9070',c3:'#ff5aa0',pa:[0,-.2,0,.4],pb:[1.3,1.1,0,0],thr:.37,ab:2,sc:2.1,den:0.94}),nebStars(r,{n:70,spread:1,col:'#ffd0b0'}));for(let k=0;k<5;k++){const p=V3(gs(r),gs(r),gs(r)).multiplyScalar(1.1),j=jetPair(CC('#ffa0c0'),.9,.06,.8,.8);j.position.copy(p);j.scale.setScalar(.6);j.rotation.set(r()*3,r()*3,0);g.add(j)}};
NEB['Pillars of Creation']=(o,r,g)=>nb(g,nebV({md:1,R:3.6,c1:'#ffb070',c2:'#3a9adf',c3:'#6ae0b0',cd:'#6a3a1a',pb:[1,1.1,0,0],pc:[0,1,0,0],ab:2.6}),nebStars(r,{n:30,spread:1.8,c:V3(0,.5,1.2)}));
NEB['Eagle Nebula']=(o,r,g)=>nb(g,nebV({md:0,R:3.5,c1:'#ff6a3a',c2:'#ffd070',c3:'#ff9a5a',pa:[0,.2,.6,1.5],pb:[1.6,1.2,0,0],thr:.36,ab:1.2,sc:1.8,den:.75}),nebV({md:1,R:1.9,c1:'#ffc080',c2:'#ff8a4a',c3:'#ffd090',cd:'#3a200e',pb:[.45,0,0,0],pc:[0,0,0,0],ab:3.4}),nebStars(r,{n:140,spread:.8,c:V3(.6,1.2,.6),bright:[[.6,1.2,.8,'#e0ecff',.35]]}));
NEB['Planetary Nebula']=(o,r,g)=>nb(g,nebV({md:2,R:2.4,pa:[1,.85,1,0],pb:[1.1,.28,0,0],c1:'#ff4a6a',c2:'#4ad0ff'}),nebStars(r,{bright:[[0,0,0,'#ffffff',.3]]}));
NEB['Ring Nebula']=(o,r,g)=>nb(g,nebV({md:2,R:2.6,pa:[1,1.3,1,0],pb:[1.15,.3,.85,.35],c1:'#ff3a3a',c2:'#3adcff',c3:'#ffd060',den:1.2,rot:[1.2,0,.3]}),nebStars(r,{bright:[[0,0,0,'#e8f0ff',.22]]}));
NEB['Helix Nebula']=(o,r,g)=>nb(g,nebV({md:2,R:3.2,pa:[1,.7,1,1],pb:[1.55,.42,.6,.15],c1:'#ff3050',c2:'#5affe0',c3:'#ff7a50',den:1.1,rot:[1.3,0,0]}),nebStars(r,{bright:[[0,0,0,'#e8f0ff',.25]]}));
NEB['Cat’s Eye Nebula']=(o,r,g)=>nb(g,nebV({md:2,R:2.8,pa:[1.05,1.4,.85,0],pb:[.75,.18,0,.9],pc:[1,0,0,0],c1:'#ff5a3a',c2:'#5aff9a',c3:'#7ab0ff',den:1.4,rot:[.3,.4,.6]}),nebStars(r,{bright:[[0,0,0,'#e8f0ff',.25]]}));
NEB['Butterfly Nebula']=(o,r,g)=>nb(g,nebV({md:3,R:3.4,pb:[3,1.15,.22,0],pa:[1,0,0,0],pc:[.45,8,0,0],c1:'#ff4a2a',c2:'#ffb070',c3:'#a0d0ff',ab:2.2,den:1.6,rot:[0,0,1.45]}));
NEB['Hourglass Nebula']=(o,r,g)=>nb(g,nebV({md:3,R:2.6,pb:[2.2,.75,.09,0],pa:[1.2,0,0,9],pc:[.25,14,0,0],c1:'#ff5aa0',c2:'#5ad8ff',c3:'#ffffff',ab:1.2,rot:[.3,0,.2]}));
NEB['Homunculus Nebula']=(o,r,g)=>nb(g,nebV({md:3,R:2.4,pb:[1.8,.9,.22,0],pa:[3,0,0,0],pc:[.35,10,0,0],c1:'#d07a4a',c2:'#ffb07a',c3:'#ffe0b0',ab:1.4,den:1.3,rot:[.5,0,.7]}),nebStars(r,{bright:[[0,0,0,'#fff2d8',.55]]}));
NEB['Boomerang Nebula']=(o,r,g)=>nb(g,nebV({md:3,R:3,pb:[2.6,.6,.15,0],pa:[.5,0,0,0],pc:[.3,6,0,0],c1:'#7aa8ff',c2:'#c8d8ff',c3:'#ffffff',ab:2,den:.9,rot:[0,0,1.2]}));
NEB['Supernova Remnant']=(o,r,g)=>nb(g,nebV({md:4,R:2.8,pb:[2.1,2.2,11,0],pa:[0,0,0,.3],c1:'#ff3a5a',c2:'#4ad8ff',den:3.2}));
NEB['Veil Nebula']=(o,r,g)=>nb(g,nebV({md:4,R:3.3,pb:[2.6,2,16,0],pa:[0,1,0,.24],c1:'#ff3a4a',c2:'#3adcff',den:5}),nebStars(r,{n:60,spread:2}));
NEB['Cassiopeia A']=(o,r,g)=>nb(g,nebV({md:4,R:2.4,pb:[1.6,2.8,8,0],pa:[0,0,0,.36],pc:[0,1,0,0],c1:'#ff5a3a',c2:'#5affa0',c3:'#7a9aff',den:3.4}),nebStars(r,{bright:[[0,0,0,'#a0c0ff',.14]]}));
NEB['Crab Nebula']=(o,r,g)=>{nb(g,nebV({md:4,R:2.4,pb:[1.5,2.6,9,0],pa:[.55,0,0,.55],c1:'#ff6a2a',c2:'#ffd070',c3:'#8ab8ff',den:4,rot:[0,0,.6]}));const ps=glow(0xdfe8ff,.5);g.add(ps);onU(g,t=>{const f=Math.pow(Math.max(0,Math.sin(t*6.28*1.5)),18);ps.scale.setScalar(.25+f*.9)})};
NEB['Pulsar Wind Nebula']=(o,r,g)=>{nb(g,nebV({md:4,R:2,pb:[.9,2.6,3,0],pa:[2.2,0,0,.35],c1:'#7a8aff',c2:'#c8d8ff',c3:'#9ab8ff',den:1.4}));for(let k=0;k<3;k++){const tr=new THREE.Mesh(new THREE.TorusGeometry(.45+k*.28,.03+k*.01,10,120),sm(`void main(){float a=atan(vP.y,vP.x);gl_FragColor=vec4(vec3(.7,.85,1.)*(.5+.5*sin(a*6.-t*4.))*.9,1.);}`,{},ADD));tr.rotation.x=1.25;g.add(tr)}
const j=jetPair(CC('#a8c8ff'),1.6,.08,1.2,1);j.rotation.x=1.25-HP;g.add(j);const ps=glow(0xffffff,.5);g.add(ps);onU(g,t=>ps.scale.setScalar(.3+.6*Math.pow(Math.max(0,Math.sin(t*20)),12)))};
NEB['Wolf-Rayet Bubble']=(o,r,g)=>nb(g,nebV({md:7,R:3,pa:[0,0,0,0],pb:[1.6,.18,.6,1],c1:'#ff4a6a',c2:'#5ac8ff',den:1.4,ab:.6}),nebStars(r,{bright:[[0,0,0,'#e0ecff',.45]]}));
NEB['Bubble Nebula']=(o,r,g)=>nb(g,nebV({md:7,R:3.2,pa:[-.3,.2,0,0],pb:[1.15,.14,1,0],c1:'#ff3a5a',c2:'#7ad8ff',den:1.6,ab:1}),nebStars(r,{bright:[[-.05,.35,.1,'#e8f0ff',.4]],n:30,spread:2}));
NEB['Horsehead Nebula']=(o,r,g)=>nb(g,nebV({md:5,R:3.2,pa:[1.6,0,1,0],pb:[1,.9,0,0],pc:[0,0,.05,0],c1:'#ff2a4a',c2:'#ff8aa0',c3:'#3a2050',cd:'#1a0a08',ab:5}),nebStars(r,{n:50,spread:2,c:V3(0,.5,.8)}));
NEB['Bok Globule']=(o,r,g)=>nb(g,nebV({md:5,R:3,pa:[1.3,0,2,0],pb:[1,1.4,0,0],pc:[0,0,.05,0],c1:'#ff3a5a',c2:'#ffb0a0',c3:'#ff6a6a',ab:6}),nebStars(r,{n:40,spread:2,c:V3(0,0,1)}));
NEB['Dark Cloud']=(o,r,g)=>nb(g,nebV({md:5,R:3.4,pa:[0,0,3,0],pb:[.75,.1,0,0],pc:[0,0,.5,0],c2:'#9ab8ff',cd:'#6a4a3a',ab:4.5}));
NEB['Molecular Cloud']=(o,r,g)=>nb(g,nebV({md:5,R:3.4,pa:[.12,0,3,1],pb:[1,.12,0,0],pc:[0,0,.45,0],c1:'#6a3aaf',c2:'#a080df',c3:'#ff5a3a',cd:'#5a3a5a',ab:3.6}));
NEB['Reflection Nebula']=(o,r,g)=>nb(g,nebV({md:6,R:3,pa:[.2,.3,0,1.2],pb:[-.6,-.2,.3,0],thr:.32,c1:'#cfe4ff',c2:'#3a7aff',den:2.2,ab:.8}),nebStars(r,{bright:[[.2,.3,0,'#dfe8ff',.45],[-.6,-.2,.3,'#dfe8ff',.3],[.7,-.4,-.2,'#dfe8ff',.25]],n:40,spread:.8}));
NEB['Witch Head Nebula']=(o,r,g)=>nb(g,nebV({md:6,R:3.3,pa:[2.6,.8,.5,.35],pb:[2.6,.8,.5,0],thr:.36,pc:[4,1,2,0],c1:'#9ac8ff',c2:'#2a5aff',den:3,ab:.4,rot:[0,0,.5]}),nebStars(r,{bright:[[2.9,.9,.6,'#e0ecff',.6]]}));
NEB['Protoplanetary Disk']=(o,r,g)=>{g.userData.noSpin=1;const d=new THREE.Mesh(new THREE.RingGeometry(.12,2.6,160,1),sm(`void main(){float r=length(vP.xy);float I=exp(-r/1.1)*smoothstep(.12,.3,r);float gp=0.;for(int k=0;k<5;k++){float rk=.45+float(k)*.42;gp+=exp(-pow((r-rk)/(.035+float(k)*.01),2.));}I*=1.-.85*clamp(gp,0.,1.);I*=.8+.4*fbm(vec3(vP.xy*3.,1.));vec3 c=mix(vec3(1.,.75,.45),vec3(.8,.4,.25),smoothstep(0.,2.4,r));gl_FragColor=vec4(c*I*1.8,1.);}`,{},{...ADD,side:THREE.DoubleSide}));d.rotation.x=-1.25;g.add(d,glow(0xffe8c0,1.2));
g.add(nebV({md:0,R:2.4,c1:'#ff8a5a',c2:'#ffd0a0',c3:'#ff6a3a',pa:[0,0,0,.2],pb:[.8,1.3,0,0],thr:.48,ab:.6,den:.6}));const j=jetPair(CC('#ffb0d0'),1.8,.06,.7,.7);j.rotation.x=-1.25+HP;g.add(j)};
NEB['Cosmic Web Filament']=(o,r,g)=>{g.userData.noSpin=0;const N=[];for(let k=0;k<9;k++)N.push(V3(-3.2+k*.8,Math.sin(k*1.3)*.4+gs(r)*.2,gs(r)*.3));const W=webGals(r,N,{n:2600,fn:.3,nw:.18,fw:.1,k:2,maxL:1.3,spread:.4});g.add(miniGals(W.gals),filGlow(W.links,CC('#8aa8ff'),.12));
N.forEach(c=>g.add(vol({re:.3,n:1,amp:.25,cut:.9,nz:1,ns:2,c1:'#6a8aff',c2:'#3a5adf',p:c})));g.rotation.z=.2};
NEB['Dark Matter Halo']=(o,r,g)=>{g.userData.noSpin=0;g.add(vol({re:1.3,n:1.2,amp:.32,cut:3.4,nz:.8,ns:1.4,c1:'#5a7aff',c2:'#3a3a9a'}));for(let k=0;k<14;k++){const p=V3(gs(r),gs(r),gs(r)).multiplyScalar(1.3);g.add(vol({re:.08+r()*.06,n:1,amp:.5,cut:.45,c1:'#8aa8ff',c2:'#5a6adf',p}))}
const gx=diskGal({m:2,pitch:16,R:.9,r0:.15,hd:.3,nb:600,na:2500,nf:1200,nh:6,rb:.15,ba:1.2},r);gx.rotation.x=1;g.add(gx);gSpin(g,gx);lensArcs(g,4,1.6,r)};
setTimeout(()=>{try{noiseTex()}catch(e){}},2500);
{const _n=G.neb;G.neb=(o,r,g)=>{const f=NEB[o.n];if(!f)return _n(o,r,g);f(o,r,g)}}
