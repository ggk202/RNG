import sys,re
p='index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a)
    if c!=n: sys.exit('count %d: %s'%(c,a[:90]))
    s=s.replace(a,b)
MEGA="Orbital Ring,Space Elevator,Lunar Mass Driver,O'Neill Cylinder,Stanford Torus,Bernal Sphere,Orbital Solar Array,Asteroid Mining Swarm,Terraformed World,Planetary Shield,Skyhook,Launch Loop,Bishop Ring,McKendree Cylinder,Statite Mirror,Dyson Swarm,Dyson Bubble,Dyson Shell,Star Lifter,Shkadov Thruster,Caplan Thruster,Stellar Engine,Nicoll-Dyson Beam,Ringworld,Alderson Disk,Topopolis,Globus Cassus,Matrioshka Brain,Jupiter Brain,Birch Planet,Penrose Process Sphere,Kugelblitz Drive,Hawking Radiation Reactor,Interstellar Gate,Von Neumann Probe Swarm,Galactic Beacon Network,Stellar Highway,Galactic Dyson Web,Hypervelocity Star Catapult,Quasar Tap,Black Hole Bomb,Wormhole Transit Network,Galactic Brain,Kardashev III Civilization,Galaxy Shepherd,Cosmic Archive,Vacuum Energy Siphon,Dark Energy Sail,Universe-Spanning Mind,Cosmogenesis Engine"
MD="A band of structure circling a world, held up by its own spin.|A cable from equator to orbit; climbers ride it to space.|A magnetic rail flinging cargo off a moon.|Paired rotating habitats lit by angled mirrors.|A wheel-shaped station spun for gravity.|A spherical habitat with a ring of sunlit windows.|Orbital collectors beaming power down as microwaves.|Drones dismantling an asteroid for raw materials.|A planet reshaped with orbital mirrors and engineered air.|A hexagonal barrier against impacts and radiation.|A spinning tether that snatches payloads from the upper air.|A loop of iron moving at orbital speed, lifting cargo to space.|A thousand-kilometre ring habitat open to the sky.|Nanotube habitats the length of countries.|A mirror hovering on sunlight, steering a star's light.|Countless collectors orbiting a star to catch its output.|Light sails held in place by starlight, not orbit.|A solid sphere enclosing a star.|Magnetic fields drawing raw material out of a star.|A vast mirror turning a star into a slow rocket.|A fusion engine fed by its own star, steering the system.|Mirror, swarm and thruster moving a whole solar system.|A star's entire output focused into one laser.|A ring around a star with the area of millions of Earths.|A disk spanning planetary orbits, its star at the centre.|A habitat tube knotted around its star.|A world rebuilt inside-out around its own sky.|Nested Dyson shells running a solar-system-sized computer.|A gas giant's mass turned into computing substrate.|A shell around a black hole with more surface than all the stars.|A structure harvesting a spinning black hole's rotation.|A starship powered by a black hole made from pure light.|A tiny black hole evaporating into usable energy.|A portal ring linking star systems.|Self-replicating probes spreading across a galaxy.|Lasers signalling across an entire galaxy.|A chain of stars moved into a transport corridor.|A galaxy whose stars are all enclosed, glowing only in infrared.|Black-hole slingshots flinging stars between galaxies.|Collectors drawing power from a quasar's jets.|A mirror around a spinning black hole, amplifying waves until release.|Traversable wormholes stitched into a galactic transit system.|A galaxy rewired into a single thinking network.|A civilization commanding the energy of its whole galaxy.|Machinery steering the collision of two galaxies.|A crystal library holding every recorded moment.|Power drawn from the energy of empty space.|A sail riding the expansion of the universe itself.|Thought spread along the cosmic web.|A machine that builds a new universe."
assert len(MEGA.split(','))==len(MD.split('|'))==50
m=re.search(r"\n'Planck Star,[^\n]*'",s);s=s[:m.end()]+",\n\""+MEGA+"\""+s[m.end():]
rep("const KEYS=['quark','hadron','atom','mol','xtal','micro','flora','fauna','small','planet','star','remn','neb','gal','bh','wh','life','exo'];","const KEYS=['quark','hadron','atom','mol','xtal','micro','flora','fauna','small','planet','star','remn','neb','gal','bh','wh','life','exo','mega'];const CATL=KEYS.map(k=>k=='mega'?1:0);")
rep("const N=OBJ.length;OBJ.forEach((o,i)=>{o.i=i;o.k=.3+59.7*Math.pow(i/(N-1),1.2);o.h=(i*.618034)%1});",
 "const N=OBJ.length;OBJ.forEach((o,i)=>{o.i=i;o.layer=CATL[o.c]||0;o.h=(i*.618034)%1});{const LC=[60,75,90,100,120,150,200],c0=[],ix=[];OBJ.forEach(o=>{ix[o.i]=c0[o.layer]=(c0[o.layer]||0)+1});OBJ.forEach(o=>{const j=ix[o.i]-1,n=c0[o.layer];o.lj=j;o.k=o.layer==0?.3+59.7*Math.pow(j/(n-1),1.2):LC[o.layer-1]+(LC[o.layer]-LC[o.layer-1])*Math.pow((j+1)/n,1.1)})}")
rep("'Spacetime Anomaly','Exotic Lifeform','Theoretical Exotic'","'Spacetime Anomaly','Exotic Lifeform','Theoretical Exotic','Megastructure'")
rep("const OR=[1.6,1.4,2.2,1.8,1.8,1.6,1.9,1.9,1.4,1.6,1.9,1.9,2.8,3.2,2.6,2,2,1.9]","const OR=[1.6,1.4,2.2,1.8,1.8,1.6,1.9,1.9,1.4,1.6,1.9,1.9,2.8,3.2,2.6,2,2,1.9,2.4]")
m=re.search(r'\n"Quantum-gravity core that may bounce back[^\n]*"',s);s=s[:m.end()]+',\n"'+MD+'"'+s[m.end():]
rep("const tierI=o=>Math.min(8,Math.floor(o.k/6.7));","const tierI=o=>Math.min(TIERS.length-1,Math.floor(o.k/6.7));")
rep("const BAL={per:36,","const BAL={per:72,")
rep("availN=n=>!ownN(n)&&ownN(NODES[n.par])","availN=n=>!ownN(n)&&ownN(NODES[n.par])&&!nodeLocked(n)")
rep("const vis=ownN(nd)||ownN(NODES[nd.par]||nd),tg=vis?1:0;","const vis=(ownN(nd)||ownN(NODES[nd.par]||nd))&&!nodeLocked(nd),tg=vis?1:0;")
rep("TS.add(deepSky())","{const dsk=deepSky();dsk.scale.setScalar(2.6);TS.add(dsk)}")
rep("t:{th:.6,ph:1.2,d:62}","t:{th:.6,ph:1.2,d:95}")
rep("s.d=Math.min(110,","s.d=Math.min(170,",2)
rep("ns=NODES.filter(n=>n.br==i)","ns=NODES.filter(n=>n.br==i&&!nodeLocked(n))")
rep("(S.up.length)+'/'+(NODES.length-1)","(S.up.length)+'/'+NODES.filter(n=>n.id>0&&!nodeLocked(n)).length")
rep("<b>${cnt()}</b>/${N} found","<b>${cnt()}</b>/${avail()} found")
rep("for(let i=0;i<N;i++)if(S.own[i]===-2)p+=(i==0?1:F(K[i]))-(i<N-1?F(K[i+1]):0)","const MX=maxIdx();for(let i=0;i<=MX;i++)if(S.own[i]===-2)p+=(i==0?1:F(K[i]))-(i<MX?F(K[i+1]):0)")
rep("function roll1(){const i=pick(geo()+D.lk)","function roll1(){const i=biasPick(geo()+D.lk)")
rep("if(MODS[j].r<=M){m=j;break}","if(MODS[j].r<=M&&!((MODS[j].rb||0)>S.rb)){m=j;break}")
rep("const[i,m]=roll1();S.cn[i]++;const o=S.own[i];","const[i,m]=roll1();S.cn[i]++;S.cx[i]|=1<<(m+1);if(S.rb>0&&OBJ[i].layer<S.rb&&!S.ec[i]&&Math.random()<echoP()){S.ec[i]=1;S.cxe[i]=1;recalc();toast('Echo discovered: '+OBJ[i].n)}const o=S.own[i];")
rep('<small id="inc"></small></div>','<small id="inc"></small><br><small id="rbh" style="color:#ffb070"></small></div>')
rep('<button id="b_c">Codex</button>','<select id="vmod" style="display:none"></select><button id="mgbtn" style="display:none"></button><button id="shbtn" style="display:none"></button><button id="rbbtn" style="display:none"></button><button id="b_c">Codex</button>')
rep('<div id="csov">','<div id="rbp" class="pn card"></div><div id="shp" class="pn card"></div>\n<div id="csov">')
rep('</style>','#mgov{position:fixed;inset:0;z-index:30;background:rgba(2,3,10,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px}#mgc{touch-action:none}#mgh{font-size:15px;text-align:center}#mgb{max-width:560px;text-align:center;color:var(--dim)}#mgb p{margin:6px 0}#rbbtn{background:linear-gradient(135deg,#ff7a3a,#a24bff);border:0;font-weight:700}\n</style>')
v=open('src/v13.js').read()
rep('/* ---------- init + loop ---------- */',v+'/* ---------- init + loop ---------- */')
open(p,'w').write(s);print('ok')
