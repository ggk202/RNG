/* ---------- v15: real molecules — true geometry, CPK colours, bond orders, glossy shading, ESP clouds ---------- */
/* tiny array-vector maths so the geometry layer is testable without three.js */
const qv=(x,y,z)=>[x,y,z],qa=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],qs=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],qk=(a,k)=>[a[0]*k,a[1]*k,a[2]*k],
qd=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],qx=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],ql=a=>Math.sqrt(qd(a,a)),qn=a=>{const l=ql(a)||1;return qk(a,1/l)},
qperp=(d,h)=>{let p=qs(h,qk(d,qd(h,d)));if(ql(p)<1e-3){p=qx(d,Math.abs(d[0])<.9?[1,0,0]:[0,1,0])}return qn(p)},qrot=(v,ax,an)=>{const c=Math.cos(an),s=Math.sin(an);return qa(qa(qk(v,c),qk(qx(ax,v),s)),qk(ax,qd(ax,v)*(1-c)))};
/* element table: colour, ball radius (Å), cloud radius, vibration amplitude, ESP base charge */
const ELT={H:['#f4f6ff',.24,1.0,.055,0],C:['#5c5f68',.34,1.5,.028,0],N:['#3d63ff',.33,1.45,.03,-.75],O:['#ff2b22',.32,1.4,.03,-1],S:['#ffd43a',.44,1.7,.025,-.35],Si:['#e8c39a',.46,1.9,.025,.3],Mg:['#7dff3a',.5,1.6,.02,1],P:['#ff8a1a',.44,1.7,.025,.3]};
const HLEN={C:1.09,N:1.01,O:.96,S:1.34,Si:1.48};
function MB(){const A=[],B=[];const M={A,B,
a(e,x,y,z,o){A.push(Object.assign({e,p:Array.isArray(x)?x.slice():[x,y,z]},o||{}));return A.length-1},
b(i,j,o){B.push([i,j,o||1]);return M},
nb(i){const r=[];B.forEach(b=>{if(b[0]==i)r.push(b[1]);else if(b[1]==i)r.push(b[0])});return r},
slots(i,st,hint){const p=A[i].p,ds=M.nb(i).map(j=>qn(qs(A[j].p,p))),h=hint||[0,0,1];
if(!ds.length){if(st==2)return[[1,0,0],[-1,0,0]];if(st==3){const u=qperp(qn(h),[1,0,0]),w=qx(qn(h),u);return[0,1,2].map(k=>qa(qk(u,Math.cos(k*2.0944)),qk(w,Math.sin(k*2.0944))))}return[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(qn)}
if(st==4){if(ds.length==1){const d=ds[0],u=qperp(d,h),w=qx(d,u);return[0,1,2].map(k=>qa(qk(d,-1/3),qk(qa(qk(u,Math.cos(k*2.0944)),qk(w,Math.sin(k*2.0944))),.9428)))}
if(ds.length==2){const b=qn(qk(qa(ds[0],ds[1]),-1)),n=qn(qx(ds[0],ds[1]));return[qa(qk(b,.577),qk(n,.8165)),qa(qk(b,.577),qk(n,-.8165))]}
if(ds.length==3)return[qn(qk(qa(qa(ds[0],ds[1]),ds[2]),-1))];return[]}
if(st==3){if(ds.length==1){const d=ds[0],n=qperp(d,h),pp=qn(qx(n,d));return[qa(qk(d,-.5),qk(pp,.866)),qa(qk(d,-.5),qk(pp,-.866))]}if(ds.length==2)return[qn(qk(qa(ds[0],ds[1]),-1))];return[]}
if(st==2&&ds.length==1)return[qk(ds[0],-1)];return[]},
grow(i,e,len,st,o,k,hint,ex){const d=M.slots(i,st,hint)[k||0];const j=M.a(e,qa(A[i].p,qk(d,len)),null,null,ex);M.b(i,j,o||1);return j},
H(i,st,n,hint,len){const ds=M.slots(i,st,hint);for(let k=0;k<n&&k<ds.length;k++){const j=M.a('H',qa(A[i].p,qk(ds[k],len||HLEN[A[i].e]||1.09)));M.b(i,j,1)}return M}};return M}

/* ---- molecule definitions (Å, real bond lengths and angles) ---- */
const MDEF={};
MDEF['Molecular Hydrogen']=M=>{M.b(M.a('H',-.37,0,0),M.a('H',.37,0,0))};
MDEF['Water']=M=>{const o=M.a('O',0,.065,0);M.b(o,M.a('H',.757,-.521,0));M.b(o,M.a('H',-.757,-.521,0));M.lp=[o]};
MDEF['Carbon Monoxide']=M=>{M.b(M.a('C',-.564,0,0),M.a('O',.564,0,0),3)};
MDEF['Ammonia']=M=>{const n=M.a('N',0,.12,0);for(let k=0;k<3;k++){const a=k*2.0944;M.b(n,M.a('H',.94*Math.cos(a),-.26,.94*Math.sin(a)))}M.lp=[n]};
const tetra=(M,e,L)=>{const c=M.a(e,0,0,0),k=L/Math.sqrt(3);[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].forEach(s=>M.b(c,M.a('H',s[0]*k,s[1]*k,s[2]*k)))};
MDEF['Methane']=M=>tetra(M,'C',1.087);MDEF['Silane']=M=>tetra(M,'Si',1.48);
MDEF['Carbon Dioxide']=M=>{const c=M.a('C',0,0,0);M.b(c,M.a('O',-1.16,0,0),2).b(c,M.a('O',1.16,0,0),2)};
MDEF['Formaldehyde']=M=>{const c=M.a('C',0,0,0);M.b(c,M.a('O',0,1.205,0),2);M.b(c,M.a('H',.943,-.587,0)).b(c,M.a('H',-.943,-.587,0))};
MDEF['Hydrogen Sulfide']=M=>{const s=M.a('S',0,.3,0);M.b(s,M.a('H',.964,-.63,0)).b(s,M.a('H',-.964,-.63,0))};
MDEF['Ozone']=M=>{const o=M.a('O',0,.22,0);M.b(o,M.a('O',1.091,-.447,0),1.5).b(o,M.a('O',-1.091,-.447,0),1.5)};
MDEF['Acetylene']=M=>{const a=M.a('C',-.601,0,0),b=M.a('C',.601,0,0);M.b(a,b,3).b(a,M.a('H',-1.664,0,0)).b(b,M.a('H',1.664,0,0))};
MDEF['Cyanogen']=M=>{const n1=M.a('N',-1.94,0,0),c1=M.a('C',-.69,0,0),c2=M.a('C',.69,0,0),n2=M.a('N',1.94,0,0);M.b(n1,c1,3).b(c1,c2).b(c2,n2,3)};
MDEF['Methanol']=M=>{const c=M.a('C',-.71,0,0),o=M.a('O',.72,0,0);M.b(c,o);M.b(o,M.a('H',1.02,.91,0));M.H(c,4,3,[0,-1,0])};
MDEF['Ethanol']=M=>{const c1=M.a('C',-1.17,-.4,0),c2=M.a('C',.08,.48,0),o=M.a('O',1.25,-.35,0);M.b(c1,c2).b(c2,o);M.b(o,M.a('H',2.03,.22,0));M.H(c1,4,3,[0,-1,0]);M.H(c2,4,2)};
MDEF['Benzene']=M=>{const C=[];for(let k=0;k<6;k++){const a=k*1.0472;C.push(M.a('C',1.397*Math.cos(a),1.397*Math.sin(a),0))}for(let k=0;k<6;k++){M.b(C[k],C[(k+1)%6],1.5);const a=k*1.0472;M.b(C[k],M.a('H',2.48*Math.cos(a),2.48*Math.sin(a),0))}M.pi=1.397};
MDEF['Glycine']=M=>{const ca=M.a('C',0,0,0),n=M.a('N',-1.2,.85,0),c=M.a('C',1.24,.88,0),o1=M.a('O',1.13,2.09,0),o2=M.a('O',2.43,.33,0);M.b(ca,n).b(ca,c).b(c,o1,2).b(c,o2);M.H(o2,4,1,[0,-1,0]);M.H(n,4,2,[0,1,0]);M.H(ca,4,2)};
MDEF['Urea']=M=>{const c=M.a('C',0,0,0),o=M.a('O',0,1.26,0),n1=M.a('N',1.195,-.69,0),n2=M.a('N',-1.195,-.69,0);M.b(c,o,2).b(c,n1).b(c,n2);M.H(n1,3,2);M.H(n2,3,2)};
MDEF['Adenine']=M=>{const hx=k=>{const a=(30+60*k)*Math.PI/180;return[1.39*Math.cos(a),1.39*Math.sin(a),0]},cx=1.204+.956,pv=d=>{const a=d*Math.PI/180;return[cx+1.182*Math.cos(a),1.182*Math.sin(a),0]};
const C5=M.a('C',hx(0)),C6=M.a('C',hx(1)),N1=M.a('N',hx(2)),C2=M.a('C',hx(3)),N3=M.a('N',hx(4)),C4=M.a('C',hx(5)),N7=M.a('N',pv(72)),C8=M.a('C',pv(0)),N9=M.a('N',pv(-72));
M.b(N1,C6,2).b(N1,C2).b(C2,N3,2).b(N3,C4).b(C4,C5,2).b(C5,C6).b(C5,N7).b(N7,C8,2).b(C8,N9).b(N9,C4);const N6=M.grow(C6,'N',1.34,3);M.H(N6,3,2);M.H(C2,3,1,null,1.08);M.H(C8,3,1,null,1.08);M.H(N9,3,1)};
MDEF['Glucose']=M=>{const R=[],el=['C','C','C','C','C','O'];for(let k=0;k<6;k++){const a=k*1.0472;R.push(M.a(el[k],1.45*Math.cos(a),k%2?-.25:.25,1.45*Math.sin(a)))}for(let k=0;k<6;k++)M.b(R[k],R[(k+1)%6]);
const eq=i=>{const s=M.slots(i,4);return Math.abs(s[0][1])<Math.abs(s[1][1])?0:1};for(let k=0;k<4;k++){const o=M.grow(R[k],'O',1.43,4,1,eq(R[k]));M.H(o,4,1,[0,1,0])}const c6=M.grow(R[4],'C',1.52,4,1,eq(R[4]));const o6=M.grow(c6,'O',1.43,4,1,0,[0,1,0]);M.H(o6,4,1);M.H(c6,4,2);for(let k=0;k<5;k++)M.H(R[k],4,1)};
/* C60: truncated icosahedron, 6:6 bonds double, 5:6 single */
const c60=(M,sc,ex)=>{const f=(1+Math.sqrt(5))/2,base=[[0,1,3*f],[1,2+f,2*f],[f,2,2*f+1]],P=[];base.forEach(b=>{for(let s=0;s<8;s++){const v=b.map((x,i)=>x*((s>>i)&1?-1:1));for(let r=0;r<3;r++){const q=[v[r%3],v[(r+1)%3],v[(r+2)%3]].map(x=>x*.7*sc);if(!P.some(p=>ql(qs(p,q))<.01))P.push(q)}}});
const I=P.map(p=>M.a('C',p,null,null,ex)),nb=I.map(()=>[]),E=[];for(let i=0;i<I.length;i++)for(let j=i+1;j<I.length;j++)if(ql(qs(P[i],P[j]))<1.5*sc){E.push([i,j]);nb[i].push(j);nb[j].push(i)}
E.forEach(([i,j])=>{let pent=false;nb[i].forEach(x=>{if(x==j)return;nb[j].forEach(y=>{if(y==i||y==x)return;if(nb[x].some(z=>z!=i&&nb[y].includes(z)))pent=true})});M.b(I[i],I[j],pent?1:2)});return I};
/* larger fullerene shells: dual of a geodesic sphere (C80/C180/C320 family) */
const shellF=(M,det,R,ex)=>{const g=new THREE.IcosahedronGeometry(1,det),pa=g.attributes.position,F=[],K=[];for(let i=0;i+2<pa.count;i+=3){const vs=[0,1,2].map(k=>[pa.getX(i+k),pa.getY(i+k),pa.getZ(i+k)]);F.push(qk(qn(qa(qa(vs[0],vs[1]),vs[2])),R));K.push(vs.map(v=>v.map(x=>x.toFixed(3)).join()))}
const I=F.map(p=>M.a('C',p,null,null,ex));for(let i=0;i<F.length;i++)for(let j=i+1;j<F.length;j++){let c=0;K[i].forEach(k=>{if(K[j].includes(k))c++});if(c>=2)M.b(I[i],I[j])}return I};
MDEF['Fullerene C60']=M=>{c60(M,1);M.cage=1};
MDEF['Buckyonion']=M=>{c60(M,1,{sh:0});shellF(M,2,6.1,{sh:1,sk:1});shellF(M,3,8.6,{sh:2,sk:1});M.shells=3};
MDEF['Graphene Sheet']=M=>{const a=1.42,P=[];for(let i=-9;i<=9;i++)for(let j=-9;j<=9;j++){const o=[1.5*a*(i+j),.866*a*(i-j),0];[o,[o[0]+a,o[1],0]].forEach(p=>{if(ql(p)<9.6)P.push(p)})}
const I=P.map(p=>M.a('C',p)),nb=P.map(()=>0);for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++)if(ql(qs(P[i],P[j]))<1.5){M.b(I[i],I[j],1.5);nb[i]++;nb[j]++}M.sheet=1};
MDEF['Chlorophyll']=M=>{const mg=M.a('Mg',0,0,0),Ca=[],Cb=[];for(let k=0;k<4;k++){const th=k*Math.PI/2,d=[Math.cos(th),Math.sin(th),0],p=[-Math.sin(th),Math.cos(th),0],cen=qk(d,3.22),V=ph=>qa(cen,qa(qk(d,1.17*Math.cos(ph)),qk(p,1.17*Math.sin(ph))));
const n=M.a('N',V(Math.PI)),a1=M.a('C',V(Math.PI*108/180)),a2=M.a('C',V(-Math.PI*108/180)),b1=M.a('C',V(Math.PI*36/180)),b2=M.a('C',V(-Math.PI*36/180));M.b(mg,n,.5).b(n,a1).b(n,a2,k%2?1:2).b(a1,b1,k%2?2:1).b(a2,b2).b(b1,b2,k==3?1:2);Ca.push([a1,a2]);Cb.push([b1,b2])}
for(let k=0;k<4;k++){const th=k*Math.PI/2+Math.PI/4,m=M.a('C',3.4*Math.cos(th),3.4*Math.sin(th),0);M.b(Ca[k][0],m,k%2?1:2).b(m,Ca[(k+1)%4][1]);M.H(m,3,1,null,1.08)}
const me=b=>{const c=M.grow(b,'C',1.5,3);M.H(c,4,3)};me(Cb[0][1]);me(Cb[1][1]);me(Cb[2][1]);me(Cb[3][0]);{const v1=M.grow(Cb[0][0],'C',1.47,3),v2=M.grow(v1,'C',1.34,3,2);M.H(v1,3,1);M.H(v2,3,2)}{const e1=M.grow(Cb[1][0],'C',1.52,3),e2=M.grow(e1,'C',1.53,4);M.H(e1,4,2);M.H(e2,4,3)}{const k5=M.grow(Cb[2][0],'C',1.5,3),o=M.grow(k5,'O',1.22,3,2,0,[0,0,1]);M.H(k5,3,1)}
let prev=M.grow(Cb[3][1],'C',1.53,3);const st=M.A[prev].p,out=qn([st[0],st[1],0]),D=qn(qa(qk(out,.45),[0,0,-1])),pp=qn(qx(D,[0,0,1]));M.H(prev,4,2);let ch=[prev];
for(let k=1;k<18;k++){const p=qa(qa(st,qk(D,k*1.255)),qk(pp,k%2?.43:-.43));const c=M.a(k==2?'C':(k==3?'O':'C'),p);M.b(prev,c,1);ch.push(c);prev=c}M.grow(ch[2],'O',1.21,3,2,0,pp);
ch.forEach((c,k)=>{if(M.A[c].e!='C'||k<1)return;if(k>4&&k%4==1){const b=M.grow(c,'C',1.53,4,1,0,qk(pp,k%2?1:-1));M.H(b,4,3)}if(k!=2)M.H(c,4,4-M.nb(c).length)})};
MDEF['Peptide Chain']=M=>{const seq='ASCVGT',L=[1.46,1.52,1.33];let p=[-7.5,0,0],k=0;const BB=[];for(let r=0;r<seq.length;r++){const at=[];for(let q=0;q<3;q++){const e=q==0?'N':'C',i=M.a(e,p);at.push(i);if(BB.length||q>0)M.b(BB.length&&q==0?BB[BB.length-1][2]:at[q-1],i);const a=(k%2?-30:30)*Math.PI/180;p=qa(p,qk([Math.cos(a),Math.sin(a),0],L[q]));k++}BB.push(at)}
BB.forEach(([n,ca,c],r)=>{if(r<BB.length-1)M.grow(c,'O',1.23,3,2);else{M.grow(c,'O',1.23,3,2,0);}if(r>0)M.H(n,3,1,[0,0,1]);else M.H(n,4,2,[0,0,1]);
const sl=M.slots(ca,4),si=r%2,hd=sl[si],aa=seq[r];if(aa=='G'){M.H(ca,4,2)}else{const cb=M.a('C',qa(M.A[ca].p,qk(hd,1.53)));M.b(ca,cb);M.H(ca,4,1);const up=hd;
if(aa=='A')M.H(cb,4,3,up);if(aa=='S'){const o=M.grow(cb,'O',1.42,4,1,0,up);M.H(o,4,1);M.H(cb,4,2)}if(aa=='C'){const s=M.grow(cb,'S',1.82,4,1,0,up);M.H(s,4,1);M.H(cb,4,2)}
if(aa=='V'){const g1=M.grow(cb,'C',1.53,4,1,0,up),g2=M.grow(cb,'C',1.53,4,1,0,up);M.H(cb,4,1);M.H(g1,4,3);M.H(g2,4,3)}if(aa=='T'){const o=M.grow(cb,'O',1.42,4,1,0,up),g=M.grow(cb,'C',1.53,4,1,0,up);M.H(o,4,1);M.H(cb,4,1);M.H(g,4,3)}}});
const lc=BB[BB.length-1][2],ox=M.slots(lc,3)[0];const o2=M.a('O',qa(M.A[lc].p,qk(ox,1.31)));M.b(lc,o2);M.H(o2,4,1,[0,-1,0]);M.grow2=1};
/* lipid bilayer: coarse-grained (united-atom) phosphatidylcholine, two leaflets */
MDEF['Lipid Bilayer']=M=>{let s=7;const rr=()=>(s=(s*16807)%2147483647)/2147483647,TAIL='#e0cf96';for(let leaf=0;leaf<2;leaf++){const sg=leaf?-1:1;for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x0=(i-1.5)*8.4+(rr()-.5)*1.6,z0=(j-1.5)*8.4+(rr()-.5)*1.6+(leaf?4.2:0),ro=rr()*6.28,R=(dx,dz)=>[x0+dx*Math.cos(ro)-dz*Math.sin(ro),z0+dx*Math.sin(ro)+dz*Math.cos(ro)];
const bead=(e,dx,y,dz,o)=>{const q=R(dx,dz);return M.a(e,q[0],sg*y,q[1],Object.assign({r:1.25,am:.18},o||{}))};const ch=bead('N',0,22,0,{r:1.9,am:.35}),ph=bead('P',0,19,.4,{r:1.7,am:.3}),g1=bead('O',-1,16.6,0,{r:1.35}),g2=bead('O',1.2,16.4,.3,{r:1.35}),g3=bead('C',0,17.6,.8,{c:'#f0e8d0'});M.b(ch,ph).b(ph,g3).b(g3,g1).b(g3,g2);
[[g1,-1,0],[g2,1.2,1]].forEach(([g,dx,kink])=>{let pr=g;for(let k=0;k<9;k++){const kx=kink&&k>=4?1.3:0;const b=bead('C',dx+(k%2?.45:-.45)+kx,15-k*1.32,0,{c:TAIL,r:1.15,am:.18+k*.06});M.b(pr,b,kink&&k==4?2:1);pr=b}})}}M.lip=1};
/* nucleic acids + protein are built as cartoons in molDraw extras */
MDEF['DNA Helix']=M=>{M.dna=1};MDEF['RNA Strand']=M=>{M.rna=1};MDEF['Protein Fold']=M=>{M.prot=1};

/* ---- drawing: merged ball-and-stick geometry, one shader for atoms+bonds with per-atom thermal motion ---- */
const MVS=`attribute vec3 color,ca,cb;attribute float s;attribute vec2 am;uniform float t,fq,rip;varying vec3 vC,vN,vV,vA,vQ;
vec3 hs(vec3 c){return fract(sin(vec3(dot(c,vec3(12.9,78.2,37.7)),dot(c,vec3(39.3,11.1,83.4)),dot(c,vec3(73.1,52.7,9.3))))*43758.5);}
vec3 jit(vec3 c){vec3 h=hs(c)*6.2832;float T=t*fq;return vec3(sin(T*1.1+h.x),sin(T*.93+h.y),sin(T*1.21+h.z));}
vec3 wv(vec3 c){return vec3(0.,0.,rip*sin(c.x*.45+t*1.3)*cos(c.y*.4-t*.9));}
void main(){vec3 d=mix(jit(ca)*am.x+wv(ca),jit(cb)*am.y+wv(cb),s);vec3 p=position+d;vC=color;vA=mix(ca,cb,s);vQ=p;vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(p,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`;
const MFS=`uniform float t,fl,flR,wav;varying vec3 vC,vN,vV,vA,vQ;void main(){vec3 N=normalize(vN),V=normalize(vV);
vec3 L1=normalize(vec3(.45,.75,.55)),L2=normalize(vec3(-.7,-.25,.35));float nv=max(dot(N,V),0.),d1=max(dot(N,L1),0.),d2=max(dot(N,L2),0.);
float s1=pow(max(dot(N,normalize(L1+V)),0.),80.),s2=pow(max(dot(N,normalize(L2+V)),0.),24.)*.2,rim=pow(1.-nv,3.);
vec3 c=vC*(.14+d1*.92+d2*.3)+vec3(1.)*(s1*.9+s2)+mix(vC,vec3(.55,.75,1.),.45)*rim*.6;float r=length(vA.xy);
c+=vec3(.35,1.,.45)*fl*smoothstep(flR,flR*.3,r);c+=vec3(.35,.7,1.)*wav*pow(.5+.5*sin(r*1.1-t*3.),12.);gl_FragColor=vec4(c,1.);}`;
const MCF=`uniform float t;varying vec3 vC,vN,vV,vA,vQ;${NZ}void main(){vec3 N=normalize(vN),V=normalize(vV);float f=pow(1.-abs(dot(N,V)),2.2);float sh=.8+.4*n(vQ*2.5+vec3(0.,t*.5,0.));float iso=smoothstep(.92,1.,sin(length(vQ-vA)*14.-t*1.5))*.25;gl_FragColor=vec4(vC*(.22+f*1.1+iso)*sh,.1+f*.5+iso*.3);}`;
function MBuf(){const P=[],N=[],C=[],A_=[],B_=[],S_=[],AM=[];const Y=[0,1,0],tpl={};
const T=(k,f)=>tpl[k]||(tpl[k]=(()=>{const g=f(),g2=g.index?g.toNonIndexed():g;return{p:g2.attributes.position.array,n:g2.attributes.normal.array}})());
const push=(p,n,c,a,b,s,am)=>{P.push(p[0],p[1],p[2]);N.push(n[0],n[1],n[2]);C.push(c.r,c.g,c.b);A_.push(a[0],a[1],a[2]);B_.push(b[0],b[1],b[2]);S_.push(s);AM.push(am[0],am[1])};
const qq=(d)=>{const v=qn(d),c=qd(Y,v);if(c<-.9999)return q=>[-q[0],-q[1],q[2]];const ax=qx(Y,v),k=1/(1+c);return q=>{const x=qx(ax,q);return qa(qa(q,x),qk(qx(ax,x),k))}};
return{P,N,C,A_,B_,S_,AM,push,
sphere(c,r,col,am,res){const t=T('s'+res,()=>new THREE.SphereGeometry(1,res,Math.max(6,Math.round(res*.7))));for(let i=0;i<t.p.length;i+=3){const n=[t.n[i],t.n[i+1],t.n[i+2]];push([c[0]+t.p[i]*r,c[1]+t.p[i+1]*r,c[2]+t.p[i+2]*r],n,col,c,c,0,[am,am])}},
ell(c,sc,dir,col,am){const t=T('s16',()=>new THREE.SphereGeometry(1,16,11)),R=qq(dir);for(let i=0;i<t.p.length;i+=3){const p=R([t.p[i]*sc[0],t.p[i+1]*sc[1],t.p[i+2]*sc[2]]),n=R(qn([t.n[i]/sc[0],t.n[i+1]/sc[1],t.n[i+2]/sc[2]]));push(qa(c,p),n,col,c,c,0,[am,am])}},
cyl(p0,p1,r,col,a,b,s0,s1,am,seg){const t=T('c'+seg,()=>new THREE.CylinderGeometry(1,1,1,seg,1,true).translate(0,.5,0)),d=qs(p1,p0),L=ql(d),R=qq(d);for(let i=0;i<t.p.length;i+=3){const y=t.p[i+1];push(qa(p0,R([t.p[i]*r,y*L,t.p[i+2]*r])),R([t.n[i],0,t.n[i+2]]),col,a,b,s0+(s1-s0)*y,am)}},
tri(p,n,col){for(let k=0;k<3;k++)push(p[k],n,col,p[k],p[k],0,[0,0])},
geo(){const g=new THREE.BufferGeometry();[['position',P,3],['normal',N,3],['color',C,3],['ca',A_,3],['cb',B_,3],['s',S_,1],['am',AM,2]].forEach(([k,a,n])=>g.setAttribute(k,new THREE.Float32BufferAttribute(a,n)));return g}}}
const MU=o=>({t:U.t,fq:{value:o.fq||7},rip:{value:o.rip||0},fl:{value:0},flR:{value:o.flR||4},wav:{value:o.wav||0}});
const molMat=o=>new THREE.ShaderMaterial({uniforms:MU(o),vertexShader:MVS,fragmentShader:MFS});
function espQ(M,i){const a=M.A[i];let q=ELT[a.e][4];const nb=M.nb(i).map(j=>M.A[j].e);if(a.e=='H')q=nb.some(e=>e=='O'||e=='N')?1:nb.includes('S')?.45:.15;if(a.e=='C'&&nb.some(e=>e=='O'||e=='N'))q=.25;return q}
function molDraw(g,M,o){const A=M.A,n=A.length;let cen=[0,0,0];A.forEach(a=>cen=qa(cen,a.p));cen=qk(cen,1/Math.max(1,n));A.forEach(a=>a.p=qs(a.p,cen));
const big=n>200,res=n<40?30:n<200?18:10,seg=n<40?18:n<200?10:7,br=o.br||(big?.1:.105),buf=MBuf(),sk=[],col=a=>CC(a.c||ELT[a.e][0]),rad=a=>(a.r||ELT[a.e][1])*(o.ar||1),am=a=>a.am!=null?a.am:ELT[a.e][3];
const bufs=M.shells?[0,1,2].map(()=>MBuf()):null,BF=a=>bufs?bufs[a.sh||0]:buf;
A.forEach(a=>{if(a.sk)BF(a).sphere(a.p,.16,col(a),am(a),8);else BF(a).sphere(a.p,rad(a),col(a),am(a),res)});
M.B.forEach(([i,j,ord])=>{const a=A[i],b=A[j],d=qn(qs(b.p,a.p)),B=BF(a),thin=a.sk||b.sk;let ref=null;for(const k of M.nb(i))if(k!=j){ref=qs(A[k].p,a.p);break}if(!ref)for(const k of M.nb(j))if(k!=i){ref=qs(A[k].p,b.p);break}
let pp=ref?qn(qs(ref,qk(d,qd(ref,d)))):qperp(d,[0,1,0]);if(ord==1.5){const mid=qk(qa(a.p,b.p),.5);if(qd(pp,qk(mid,-1))<0)pp=qk(pp,-1)}
const r0=(thin?.07:br)*(ord==.5?.55:1),L=[],ra=rad(a)*.8,rb=rad(b)*.8;if(ord==2)L.push([.075,r0*.62],[-.075,r0*.62]);else if(ord==3)L.push([0,r0*.58],[.11,r0*.48],[-.11,r0*.48]);else if(ord==1.5)L.push([0,r0],[.17,r0*.45,1]);else L.push([0,r0]);
L.forEach(([off,r,dash])=>{const o3=qk(pp,off*(o.bo||1)),pa=qa(qa(a.p,qk(d,thin?0:ra*.3)),o3),pb=qa(qa(b.p,qk(d,thin?0:-rb*.3)),o3),pm=qk(qa(pa,pb),.5),amv=[am(a),am(b)];
if(dash){const pa2=qa(pa,qk(d,.15)),pb2=qa(pb,qk(d,-.15)),sg=5;for(let k=0;k<sg;k++){const u0=k/sg,u1=(k+.55)/sg,q0=qa(pa2,qk(qs(pb2,pa2),u0)),q1=qa(pa2,qk(qs(pb2,pa2),u1));B.cyl(q0,q1,r,col(u0<.5?a:b),a.p,b.p,u0,u1,amv,seg)}}
else{B.cyl(pa,pm,r,col(a),a.p,b.p,0,.5,amv,seg);B.cyl(pm,pb,r,col(b),a.p,b.p,.5,1,amv,seg)}})});
const mg=new THREE.Group();g.add(mg);const mats=[];const addB=(bb,ro)=>{const mt=molMat(o);mats.push(mt);const m=new THREE.Mesh(bb.geo(),mt);m.frustumCulled=false;mg.add(m);return m};
const meshes=bufs?bufs.map(addB):[addB(buf)];
if(o.cloud&&n<=30){const cb=MBuf();A.forEach((a,i)=>{const q=espQ(M,i),c=q<0?new THREE.Color(.92,.95,.92).lerp(new THREE.Color(1,.16,.1),Math.min(1,-q)):new THREE.Color(.92,.95,.92).lerp(new THREE.Color(.15,.4,1),Math.min(1,q));cb.sphere(a.p,ELT[a.e][2]*.88,c,am(a),32)});
const cm=new THREE.Mesh(cb.geo(),new THREE.ShaderMaterial({uniforms:MU(o),vertexShader:MVS,fragmentShader:MCF,transparent:true,depthWrite:true}));cm.renderOrder=2;cm.frustumCulled=false;mg.add(cm)}
if(M.lp)M.lp.forEach(i=>{const lb=MBuf();M.slots(i,4,[0,0,1]).forEach(dv=>lb.ell(qa(A[i].p,qk(dv,.62)),[.32,.32,.55],qk(dv,1),new THREE.Color(1,.55,.75),.03));const lm=new THREE.Mesh(lb.geo(),new THREE.ShaderMaterial({uniforms:MU(o),vertexShader:MVS,fragmentShader:`varying vec3 vC,vN,vV,vA,vQ;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),1.6);gl_FragColor=vec4(vC*(.15+f*.9),f);}`,...ADD}));lm.frustumCulled=false;mg.add(lm)});
if(M.pi){[-1,1].forEach(sg=>{const tr=new THREE.Mesh(new THREE.TorusGeometry(M.pi,.36,24,96),sm(`void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),1.5);float fl=.6+.4*sin(atan(vP.y,vP.x)*3.-t*2.);gl_FragColor=vec4(vec3(.35,.6,1.)*(.12+f*.8)*fl,1.);}`,{},ADD));tr.position.z=sg*.62;tr.scale.z=.7;mg.add(tr)})}
let R=0;A.forEach(a=>R=Math.max(R,ql(a.p)+rad(a)));if(M.dna||M.rna||M.prot)R=nucProt(mg,M,o,mats);const fit=Math.min(o.mx||2.1,2.45/Math.max(R,.5));mg.scale.setScalar(fit);
if(M.shells)onU(g,t=>meshes.forEach((m,k)=>{m.rotation.y=t*(k%2?-.12:.18)*(1+k*.2);m.rotation.x=t*.05*k}));
if(M.lip){const pl=[22,-22].map(y=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(40,40),sm(`void main(){float f=fbm(vec3(vP.xy*.12,t*.1));float e=smoothstep(20.,12.,max(abs(vP.x),abs(vP.y)));gl_FragColor=vec4(vec3(.25,.55,1.)*(.05+f*.12)*e,1.);}`,{},ADD));m.rotation.x=-HP;m.position.y=y*1.12;mg.add(m)})}
return{mg,mats,meshes,fit}}
/* ---- cartoons: B-DNA, RNA hairpin, alpha/beta protein ribbon ---- */
const BASEC={A:'#ff5a5a',T:'#ffd23a',U:'#c88aff',G:'#4ad86a',C:'#4aa8ff'},PAIR={A:'T',T:'A',G:'C',C:'G',U:'A'};
function slabs(B,c1,c2,yAx,colA,colB,gap){const d=qs(c2,c1),L=ql(d),u=qn(d),w=qn(qx(yAx,u)),y=qn(qx(u,w)),mid=qk(qa(c1,c2),.5);
const box=(p0,p1,cl)=>{const hw=1.15,ht=.38,cs=[[1,1],[-1,1],[-1,-1],[1,-1]].map(([a,b])=>qa(qk(w,a*hw),qk(y,b*ht))),fn=[y,qk(w,-1),qk(y,-1),w];for(let k=0;k<4;k++){const a=cs[k],b=cs[(k+1)%4],n=qn(qa(fn[k],[0,0,0])),q=[qa(p0,a),qa(p1,a),qa(p1,b),qa(p0,b)];const nn=qn(qx(qs(q[1],q[0]),qs(q[3],q[0])));B.tri([q[0],q[1],q[2]],nn,cl);B.tri([q[0],q[2],q[3]],nn,cl)}
[[p1,1],[p0,-1]].forEach(([pc,sg])=>{const q=cs.map(c=>qa(pc,c)),nn=qk(u,sg);B.tri([q[0],q[1],q[2]],nn,cl);B.tri([q[0],q[2],q[3]],nn,cl)})};
if(!colB){box(c1,c2,colA);return}box(c1,qa(mid,qk(u,-gap)),colA);box(qa(mid,qk(u,gap)),c2,colB)}
function tubeB(B,pts,r,colF,seg){const cu=new THREE.CatmullRomCurve3(pts.map(p=>V3(p[0],p[1],p[2]))),tg=new THREE.TubeGeometry(cu,pts.length*8,r,seg||10,false),g2=tg.index?tg.toNonIndexed():tg,pa=g2.attributes.position.array,na=g2.attributes.normal.array,cnt=pa.length/3;
for(let i=0;i<cnt;i++){const p=[pa[i*3],pa[i*3+1],pa[i*3+2]];B.push(p,[na[i*3],na[i*3+1],na[i*3+2]],colF(p),p,p,0,[0,0])}}
function nucProt(mg,M,o,mats){const B=MBuf();let R=0;const yA=[0,1,0];
if(M.dna||M.rna){const seq=M.dna?'GATTACAGCGTA':'GGCAC',n=seq.length,rr=M.dna?8.9:8.7,rise=M.dna?3.38:2.81,tw=(M.dna?34.3:32.7)*Math.PI/180,off=(M.dna?155:150)*Math.PI/180,y0=-(n-1)*rise/2-(M.rna?5:0);
const at=(r,a,y)=>[r*Math.cos(a),y,r*Math.sin(a)],P1=[],P2=[],S1=[],S2=[];for(let i=0;i<n;i++){const a=i*tw,y=y0+i*rise;P1.push(at(rr,a,y));P2.push(at(rr,a+off,y+(M.dna?.9:.7)));S1.push(at(5.9,a+.28,y+.3));S2.push(at(5.9,a+off-.28,y+.6))}
const pc=CC('#ff9a3a'),oc=CC('#ff4030'),sc=CC('#e8e0d0');
const strand=(P,S,cl)=>{P.forEach((p,i)=>{B.sphere(p,1.25,pc,0,14);const t2=qn([-p[2],0,p[0]]);B.sphere(qa(p,qk(qn([p[0],0,p[2]]),1.25)),.75,oc,0,10);B.sphere(qa(p,qk(t2,1.2)),.75,oc,0,10);B.sphere(S[i],.85,sc,0,10);B.cyl(p,S[i],.38,sc,p,p,0,0,[0,0],8)})};
if(M.dna){tubeB(B,P1,.75,p=>CC('#5aa8ff'));tubeB(B,P2,.75,p=>CC('#ff6ab0'));strand(P1,S1);strand(P2,S2);for(let i=0;i<n;i++){const b=seq[i];slabs(B,S1[i],S2[i],yA,CC(BASEC[b]),CC(BASEC[PAIR[b]]),.18)}}
else{const top=n-1,L=[],LS=[],lseq='UUCG';for(let k=1;k<=4;k++){const u=k/5,p=qa(qa(P1[top],qk(qs(P2[top],P1[top]),u)),[0,Math.sin(u*Math.PI)*7+u*.7,0]);const out=qn([p[0],0,p[2]]);L.push(qa(p,qk(out,2.5*Math.sin(u*Math.PI))))}
const path=[...P1,...L,...P2.slice().reverse()];tubeB(B,path,.75,p=>CC('#7affc8').lerp(CC('#c88aff'),Math.min(1,Math.max(0,(p[1]-y0)/22))));strand(P1,S1);strand(P2,S2);const pr={G:'C',C:'G',A:'U',U:'A'};for(let i=0;i<n;i++)slabs(B,S1[i],S2[i],yA,CC(BASEC[seq[i]]),CC(BASEC[pr[seq[i]]]),.18);
L.forEach((p,k)=>{B.sphere(p,1.25,pc,0,14);const inn=qa(p,qk(qn(qs([0,p[1]-1,0],p)),3.4));slabs(B,qa(p,qk(qn(qs(inn,p)),1.1)),inn,yA,CC(BASEC[lseq[k]]),null,0)})}
const all=[...P1,...P2];all.forEach(p=>R=Math.max(R,ql(p)+1.5))}
if(M.prot){const ca=[],ty=[],ax=[];const hel=(s,e,zz,yy,n)=>{const d=qn(qs(e,s)),e1=[0,1,0],e2=[0,0,1];for(let i=0;i<n;i++){const a=i*100*Math.PI/180;ca.push(qa(qa(qa(s,qk(d,i*1.5)),qk(e1,2.3*Math.cos(a))),qk(e2,2.3*Math.sin(a))));ty.push('H');ax.push(d)}};
const strd=(x0,x1,z,n)=>{for(let i=0;i<n;i++){const x=x0+(x1-x0)*i/(n-1);ca.push([x,i%2?.9:-.9,z]);ty.push('E');ax.push(null)}};
const loop=(n,bul)=>{const a=ca[ca.length-1];return b=>{for(let k=1;k<=n;k++){const u=k/(n+1);ca.push(qa(qa(a,qk(qs(b,a),u)),qk(bul,Math.sin(u*Math.PI))));ty.push('L');ax.push(null)}}};
for(let k=0;k<3;k++){ca.push([12-k*1.4,13+k*.8,-6+k*.5]);ty.push('L');ax.push(null)}
hel([9,10,-4.8],[-9,10,-4.8],0,0,12);loop(4,[-4,-3,0])([-8.25,-.9,-4.8]);strd(-8.25,8.25,-4.8,6);loop(3,[3.5,0,0])([8.25,-.9,0]);strd(8.25,-8.25,0,6);loop(3,[-3.5,0,0])([-8.25,-.9,4.8]);strd(-8.25,8.25,4.8,6);
loop(4,[4,-3,2])([9,10,5.4]);hel([9,10,5.4],[-9,10,5.4],0,0,12);loop(4,[-3,2,3])([-11,4,10]);
const n=ca.length,cu=new THREE.CatmullRomCurve3(ca.map(p=>V3(p[0],p[1],p[2]))),SPR=10,S=(n-1)*SPR;let side=[0,0,1],w=.4,th=.35;const rows=[];
for(let k=0;k<=S;k++){const u=k/S,rf=u*(n-1),ri=Math.min(n-1,Math.round(rf)),tp=ty[ri],pv=cu.getPoint(u),tv=cu.getTangent(u),p=[pv.x,pv.y,pv.z],T=qn([tv.x,tv.y,tv.z]);let sd;
if(tp=='H')sd=ax[ri];else if(tp=='E')sd=[0,0,1];else sd=side;sd=qs(sd,qk(T,qd(sd,T)));if(ql(sd)<1e-3)sd=side;sd=qn(sd);if(qd(sd,side)<0)sd=qk(sd,-1);side=sd;
let tw2=tp=='H'?1.35:tp=='E'?1.2:.36,tt=tp=='L'?.36:.24;const last=tp=='E'&&(ri==n-1||ty[ri+1]!='E');if(last){const f=Math.min(1,Math.max(0,rf-(ri-.5)));w=1.85*(1-f)+.36*f}else w+=(tw2-w)*.22;th+=(tt-th)*.25;
const nm=qn(qx(T,sd));rows.push({p,sd,nm,w,th,c:col(.68*(1-ri/(n-1)),.85,.55)})}
for(let k=0;k<rows.length-1;k++){const a=rows[k],b=rows[k+1],cor=r=>[[1,1],[-1,1],[-1,-1],[1,-1]].map(([x,y])=>qa(qa(r.p,qk(r.sd,x*r.w)),qk(r.nm,y*r.th)));const ca_=cor(a),cb_=cor(b),fn=r=>[r.nm,qk(r.sd,-1),qk(r.nm,-1),r.sd];const na=fn(a),nb=fn(b);
for(let f=0;f<4;f++){const f2=(f+1)%4,q=[ca_[f],cb_[f],cb_[f2],ca_[f2]],nn=qn(qa(na[f],nb[f]));[[0,1,2],[0,2,3]].forEach(tr=>tr.forEach(i=>B.push(q[i],nn,i==1||i==2?b.c:a.c,q[i],q[i],0,[0,0])))}}
let cn=[0,0,0];ca.forEach(p=>cn=qa(cn,p));cn=qk(cn,1/n);for(let i=0;i<B.P.length;i+=3){B.P[i]-=cn[0];B.P[i+1]-=cn[1];B.P[i+2]-=cn[2]}ca.forEach(p=>R=Math.max(R,ql(qs(p,cn))+1.5))}
const mt=molMat(o);mats.push(mt);const m=new THREE.Mesh(B.geo(),mt);m.frustumCulled=false;mg.add(m);return R}

const MOPT={'Molecular Hydrogen':{cloud:1,mx:1.9},'Water':{cloud:1},'Carbon Monoxide':{cloud:1},'Ammonia':{cloud:1},'Methane':{cloud:1},'Carbon Dioxide':{cloud:1},'Formaldehyde':{cloud:1},'Hydrogen Sulfide':{cloud:1},
'Ethanol':{cloud:1},'Silane':{cloud:1},'Ozone':{cloud:1},'Benzene':{cloud:0},'Glycine':{cloud:1},'Urea':{cloud:1},'Acetylene':{cloud:1},'Methanol':{cloud:1},'Cyanogen':{cloud:1},'Adenine':{cloud:1},'Glucose':{cloud:1},
'Graphene Sheet':{rip:.9,wav:.55,ar:.75},'Lipid Bilayer':{fq:1.3,br:.42},'Chlorophyll':{flR:5},'Fullerene C60':{wav:.25},'Buckyonion':{},'Peptide Chain':{},'DNA Helix':{},'RNA Strand':{},'Protein Fold':{}};
{const _m=G.mol;G.mol=(o,r,g)=>{const f=MDEF[o.n];if(!f)return _m(o,r,g);const M=MB();f(M);const op=MOPT[o.n]||{};const D=molDraw(g,M,op);
if(o.n=='Chlorophyll'){const ph=glow(0xff5a3a,.5);g.add(ph);const hl=glow(0x7aff8a,1);g.add(hl);onU(g,t=>{const x=(t%5)/5;if(x<.35){const u=x/.35;ph.visible=true;ph.position.set(4*(1-u),3.2*(1-u),2.2*(1-u));ph.material.color.setHSL(u<.5?0:.62,1,.6)}else ph.visible=false;const f=x>=.35?Math.exp(-(x-.35)*9):0;D.mats.forEach(m=>m.uniforms.fl.value=f*1.4);hl.scale.setScalar(.5+f*5);hl.material.opacity=f})}
if(o.n=='Peptide Chain'){onU(g,t=>D.mats.forEach(m=>m.uniforms.wav.value=.35))}}}
