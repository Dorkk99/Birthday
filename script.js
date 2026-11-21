const $=s=>document.querySelector(s),R=(a,b)=>Math.random()*(b-a)+a,sleep=ms=>new Promise(r=>setTimeout(r,ms)),B=document.body;
const st=n=>`assets/stickers/${n}.png`;
const pool=['heart1','heart2','heart3','heart5','heart7','heart8','bow1','bow3','bfly1','bfly2','bfly4','spark1','spark2','petal1','petal2','rose1'];
const imgs={};pool.forEach(n=>{const i=new Image();i.src=st(n);imgs[n]=i});const keys=Object.keys(imgs);
/* ================= preload everything, then reveal the start button ================= */
const KEEP=[];(async function preload(){const ST=['heart1','heart2','heart3','heart5','heart7','heart8','bow1','bow3','bfly1','bfly2','bfly4','bfly5','spark1','spark2','spark5','petal1','petal2','rose1','balloons'],
 PH_=['02','03','06','09','11','13','14','18','19','21','23','24','25','26','27','34','36','38','39'],
 U=[...ST.map(n=>`assets/stickers/${n}.png`),...PH_.map(n=>`assets/photos/p${n}.jpg`),...['lily1','lily2','tulip','orchid1','orchid2','rose','cake','cake-out'].map(n=>`assets/art/${n}.png`),...[1,2,3].map(n=>`assets/lanterns/lan${n}.png`)],
 msgs=['Lighting the candles… 🕯️','Hanging the lanterns… 🏮','Picking the flowers… 🌸','Warming up the fireworks… 🎆'],t0=performance.now();let n=0;
 const mi=setInterval(()=>{$('#ltxt').textContent=msgs[(Math.random()*msgs.length)|0]},900);
 await Promise.all(U.map(u=>new Promise(r=>{const i=new Image();KEEP.push(i);const d=()=>{(i.decode?i.decode().catch(()=>{}):Promise.resolve()).then(()=>{$('#lbar').style.width=(++n/U.length*100)+'%';r()})};i.onload=d;i.onerror=()=>{$('#lbar').style.width=(++n/U.length*100)+'%';r()};i.src=u})));
 try{await Promise.race([document.fonts.ready,sleep(2500)])}catch(e){}
 await sleep(Math.max(0,4500-(performance.now()-t0)));clearInterval(mi);$('#ltxt').textContent='All ready 💗';await sleep(500);
 $('#loader').classList.add('off');document.body.classList.remove('loading');$('#go').hidden=false})();
/* ================= AUDIO ENGINE (all synthesised) ================= */
let ac,out,mus,bgTimer,bgBar=0,bgNext=0;const BAR=2.4,mtof=m=>440*2**((m-69)/12);
function initAudio(){if(ac)return;try{ac=new(window.AudioContext||window.webkitAudioContext)();if(ac.resume)ac.resume();out=ac.createGain();out.gain.value=.9;mus=ac.createGain();mus.gain.value=0;mus.connect(out);
 const d=ac.createDelay(),fb=ac.createGain(),wet=ac.createGain();d.delayTime.value=.36;fb.gain.value=.4;wet.gain.value=.38;out.connect(ac.destination);out.connect(d);d.connect(fb);fb.connect(d);d.connect(wet);wet.connect(ac.destination)}catch(e){ac=null}}
function bell(f,d=1.2,v=.2,t,dest){if(!ac)return;t=t||ac.currentTime+.02;const o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),g2=ac.createGain();
 o.type='triangle';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*3;g2.gain.value=.22;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.015);g.gain.exponentialRampToValueAtTime(.0008,t+d);
 o2.connect(g2);g2.connect(g);o.connect(g);g.connect(dest||out);o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05)}
function pad(ms,t,dur,v=.03,dest){const lp=ac.createBiquadFilter(),g=ac.createGain();lp.type='lowpass';lp.frequency.value=1000;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur+.7);lp.connect(g);g.connect(dest||mus);
 ms.forEach(m=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=mtof(m)*(1+R(-.003,.003));o.connect(lp);o.start(t);o.stop(t+dur+.8)})}
let NB;function nz(t,dur,f0,f1,v=.3,type='bandpass'){if(!ac)return;if(!NB){NB=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=NB;f.type=type;f.Q.value=1.2;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+dur*.3);g.gain.linearRampToValueAtTime(0,t+dur);s.connect(f);f.connect(g);g.connect(out);s.start(t,Math.random()*1.5);s.stop(t+dur+.05)}
function noise(dur,f0,f1,v,type){nz(ac?ac.currentTime:0,dur,f0,f1,v,type)}
function thump(t,v=.5,d=.28){if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(40,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.05)}
const CH=[[48,52,55,60,64,67],[43,47,50,55,59,62],[45,48,52,57,60,64],[40,47,52,55,59,64],[41,45,48,53,57,60],[48,52,55,60,64,67],[41,45,48,53,57,60],[43,47,50,55,59,62]];
const ML=[[76,79,76,72],[74,79,74,71],[72,76,81,76],[71,76,79,76],[77,81,77,72],[76,72,76,79],[77,81,84,81],[79,74,71,79]];
function bar(i,t){const c=CH[i];pad(c.slice(0,4),t,BAR);bell(mtof(c[0]-12),BAR*.9,.18,t,mus);
 [1,2,3,4,3,2,5,4].forEach((k,j)=>bell(mtof(c[k]+(j>5?12:0)),.9,.055,t+j*BAR/8,mus));
 ML[i].forEach((m,j)=>bell(mtof(m),1.7,.12,t+j*BAR/4+.02,mus))}
function bgStart(){if(!ac||bgTimer)return;bgNext=ac.currentTime+.1;mus.gain.setTargetAtTime(1,ac.currentTime,2);
 bgTimer=setInterval(()=>{while(bgNext<ac.currentTime+.7){bar(bgBar%8,bgNext);bgNext+=BAR;bgBar++}},200)}
const PENT=[84,86,88,91,93,96];
function boom(v=1){if(!ac)return;const t=ac.currentTime;thump(t,.55*v,.35);nz(t,.8,1100,70,.5*v,'lowpass');nz(t,.4,7000,2500,.12*v,'highpass')}
function whistle(){if(ac)nz(ac.currentTime,.6,500,2800,.05)}
function crackle(){if(!ac)return;for(let i=0;i<7;i++)nz(ac.currentTime+i*R(.03,.1),.04,5000,3000,.09,'highpass')}
function shimmer(){if(ac)for(let i=0;i<6;i++)bell(mtof(PENT[(Math.random()*6)|0]+12),.9,.04,ac.currentTime+.05+i*.05)}
function chimes(n=16,gap=.12){Array.from({length:n}).forEach((_,i)=>bell(mtof(PENT[(Math.random()*6)|0]),1.4,.1,ac&&ac.currentTime+.02+i*gap))}
let muted=false;$('#snd').onclick=()=>{muted=!muted;if(ac)out.gain.setTargetAtTime(muted?0:.9,ac.currentTime,.1);$('#snd').textContent=muted?'🔇':'🔊'};
/* ================= CANVAS: confetti, petals, wind, fireworks ================= */
const cv=$('#fx'),cx=cv.getContext('2d');let P=[],S=[],wind=0;
const fit=()=>{cv.width=innerWidth;cv.height=innerHeight};fit();addEventListener('resize',fit);
const pick=()=>imgs[keys[(Math.random()*keys.length)|0]];
function burst(x,y,n=70,sp=1){for(let i=0;i<n;i++){const a=R(0,6.283),s=R(4,15)*sp;P.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6,r:R(0,6),vr:R(-.2,.2),w:R(16,40),img:pick(),life:R(110,200),a:1})}}
function rain(n=50){for(let i=0;i<n;i++)P.push({x:R(0,cv.width),y:R(-400,-20),vx:R(-1,1),vy:R(2,6),r:0,vr:R(-.05,.05),w:R(16,38),img:pick(),life:420,a:1,g:0})}
(function loop(){cx.clearRect(0,0,cv.width,cv.height);
 if(wind>.02)for(let k=0;k<4*wind;k++)S.push({x:-200,y:R(0,cv.height),l:R(160,460),v:R(30,60),a:R(.25,.75),w:R(1,3.2)});
 S=S.filter(s=>s.x<cv.width+500);
 for(const s of S){s.x+=s.v;const g=cx.createLinearGradient(s.x-s.l,0,s.x,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,`rgba(255,255,255,${s.a})`);cx.strokeStyle=g;cx.lineWidth=s.w;cx.beginPath();cx.moveTo(s.x-s.l,s.y);cx.quadraticCurveTo(s.x-s.l/2,s.y-8,s.x,s.y+6);cx.stroke()}
 P=P.filter(p=>p.life>0&&p.y<cv.height+60);
 for(const p of P){p.x+=p.vx+wind*9;p.y+=p.vy;if(p.g!==0)p.vy+=.28,p.vx*=.99;p.r+=p.vr;p.life--;p.a=Math.min(1,p.life/40);
  cx.save();cx.globalAlpha=p.a;cx.translate(p.x,p.y);cx.rotate(p.r);cx.drawImage(p.img,-p.w/2,-p.w/2,p.w,p.w);cx.restore()}
 requestAnimationFrame(loop)})();

/* ================= FIREWORKS v2: 25 shapes x 4 effect styles = 100 recipes (+ name/age text) ================= */
const sky=$('#sky'),sx=sky.getContext('2d');let RK=[],FP=[],FG=[],glowA=0,showing=false;
const fitS=()=>{sky.width=innerWidth;sky.height=innerHeight};fitS();addEventListener('resize',fitS);
const PAL=[[335,100,72],[345,100,80],[320,100,74],[45,100,66],[52,100,78],[285,90,78],[195,100,76],[0,0,100],[15,100,70],[165,90,68],[350,100,62]];
const rc=()=>PAL[(Math.random()*PAL.length)|0],usc=()=>Math.min(1.1,Math.max(.62,Math.min(innerWidth,innerHeight*1.3)/760)),TAU=6.2832;
function mk(x,y,vx,vy,c,o={}){const L=o.life||70;FP.push({x,y,vx,vy,c,cs:`${c[0]},${c[1]}%,${c[2]}%`,life:L,max:L,g:o.g??.05,f:o.f??.985,sz:o.sz||2.2,h:[],tl:o.tl??5,crk:o.crk,tw:o.tw,hs:o.hs||0,shed:o.shed||0,sp:o.sp})}
const hx=t=>16*Math.sin(t)**3/17,hy=t=>-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/17;
const ring=(n,r=1,sx=1,sy=1,rot=0)=>Array.from({length:n},(_,i)=>{const t=i/n*TAU,x=Math.cos(t)*r*sx,y=Math.sin(t)*r*sy;return[x*Math.cos(rot)-y*Math.sin(rot),x*Math.sin(rot)+y*Math.cos(rot)]});
const polar=(n,fn,turn=TAU)=>Array.from({length:n},(_,i)=>{const t=i/n*turn,r=fn(t);return[r*Math.cos(t),r*Math.sin(t)]});
const hrt=(n,k=1)=>Array.from({length:n},(_,i)=>{const t=i/n*TAU;return[k*hx(t),k*hy(t)]});
const star=(p,ri)=>{const v=[];for(let i=0;i<2*p;i++){const r=i%2?ri:1,t=i/(2*p)*TAU-1.5708;v.push([Math.cos(t)*r,Math.sin(t)*r])}return v.flatMap((a,i)=>{const b=v[(i+1)%v.length];return Array.from({length:9},(_,k)=>[a[0]+(b[0]-a[0])*k/9,a[1]+(b[1]-a[1])*k/9])})};
const arms=(n,m,rot=0)=>Array.from({length:n}).flatMap((_,a)=>Array.from({length:m},(_,i)=>{const r=(i+1)/m,t=a/n*TAU+rot;return[Math.cos(t)*r,Math.sin(t)*r]}));
const disc=n=>Array.from({length:n},()=>{const a=R(0,TAU),r=1-Math.random()**2*.7;return[Math.cos(a)*r,Math.sin(a)*r]});
const SH=[()=>disc(130),()=>ring(70),()=>[...ring(60),...ring(34,.55)],()=>[...ring(56),...ring(40,.68),...ring(24,.36)],
 ()=>[...disc(50).map(p=>[p[0]*.4,p[1]*.4]),...ring(90,1,1,.28,-.35)],()=>[...hrt(80),...hrt(36,.55)],()=>[...hrt(70),...hrt(44,.7),...hrt(24,.4)],
 ()=>star(5,.42),()=>star(6,.58),()=>polar(170,t=>Math.cos(5*t)),()=>polar(200,t=>Math.cos(2*t)),()=>polar(130,t=>t/(3*TAU),3*TAU),
 ()=>[0,1,2].flatMap(a=>Array.from({length:55},(_,i)=>{const t=i/55*TAU*1.4+a*2.094,r=.15+.85*i/55;return[r*Math.cos(t),r*Math.sin(t)]})),
 ()=>Array.from({length:150},(_,i)=>{const r=Math.sqrt(i/150),t=i*2.39996;return[r*Math.cos(t),r*Math.sin(t)]}),
 ()=>polar(260,t=>(Math.exp(Math.sin(t))-2*Math.cos(4*t)+Math.sin((2*t-3.14159)/24)**5)/4.7,37.7).map(p=>[p[0],-p[1]]),
 ()=>[...ring(56),...ring(9,.12).map(p=>[p[0]-.35,p[1]-.3]),...ring(9,.12).map(p=>[p[0]+.35,p[1]-.3]),...Array.from({length:22},(_,i)=>{const t=.2*3.1416+i/21*.6*3.1416;return[Math.cos(t)*.6,Math.sin(t)*.6]})],
 ()=>Array.from({length:110},(_,i)=>{const t=i/110*TAU,d=1+Math.sin(t)**2;return[Math.cos(t)/d,Math.sin(t)*Math.cos(t)/d*1.4]}),
 ()=>arms(4,14,.785),()=>arms(24,6),()=>Array.from({length:90},()=>{const a=R(0,TAU),r=R(.5,1);return[Math.cos(a)*r,Math.sin(a)*r]}),()=>arms(7,12,.3),
 ()=>[...Array.from({length:40},(_,i)=>{const t=1.5708+i/39*3.1416;return[Math.cos(t),Math.sin(t)]}),...Array.from({length:30},(_,i)=>{const t=1.5708+i/29*3.1416;return[.45*Math.cos(t),Math.sin(t)]})],
 ()=>[[1,0],[0,1],[-1,0],[0,-1]].flatMap((a,i,v)=>{const b=v[(i+1)%4];return Array.from({length:18},(_,k)=>[a[0]+(b[0]-a[0])*k/18,a[1]+(b[1]-a[1])*k/18])}),
 ()=>Array.from({length:130},(_,i)=>{const t=i*.5,r=.15+.85*i/130;return[r*Math.cos(t),r*Math.sin(t)]}),()=>polar(180,t=>Math.cos(3*t))];
const SN=['Peony','Halo','Twin Halo','Triple Ring','Saturn','Heart','Double Heart','Star','Hexagram','Rose','Four-Petal','Spiral','Galaxy','Sunflower','Butterfly','Smiley','Infinity','Sparkle Cross','Starburst','Willow','Palm','Crescent','Diamond','Tornado','Clover'],FN=['','Golden Glitter ','Prism ','Comet '];
const PH={f:.93,g:.012,L:110,tl:3},PB={f:.975,g:.045,L:85,tl:7},PW={f:.975,g:.05,L:140,tl:14},PP={f:.98,g:.04,L:115,tl:12},BURST=new Set([0,17,18,23]),SPLIT=new Set([17,18]);
const TXT={};
function txtPts(s){if(TXT[s])return TXT[s];const c=document.createElement('canvas'),g=c.getContext('2d');c.width=480;c.height=200;g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';
 g.font='bold 100px Quicksand,sans-serif';const w=g.measureText(s).width,fs=Math.min(170,100*440/w);g.font=`bold ${fs}px Quicksand,sans-serif`;const tw=g.measureText(s).width;g.fillText(s,240,104);
 const d=g.getImageData(0,0,480,200).data,a=[];for(let y=0;y<200;y+=4)for(let x=0;x<480;x+=4)if(d[(y*480+x)*4+3]>120)a.push([(x-240)/(tw/2),(y-100)/(tw/2)]);return TXT[s]=a}
function explode(x,y,k,b=1){const u=usc()*b;boom(.6+.5*b);FG.push({x,y,r:(260+80*b)*u,a:.55,h:rc()[0]});glowA=Math.min(1,glowA+.12*b);bell(mtof(PENT[(Math.random()*6)|0]),1.1,.05);
 if(typeof k==='string'){const s=k.slice(4),pts=txtPts(s),f=.93,L=125,R0=Math.min(innerWidth*.45,130+32*s.length)*b,sc=(1-f)/(1-f**L),c=Math.random()<.5?[45,100,74]:[335,100,80];
  pts.forEach(p=>mk(x,y,p[0]*R0*sc+R(-.12,.12),p[1]*R0*sc+R(-.12,.12),c,{life:L,g:.012,f,sz:2.6,tl:3}));return}
 const si=k%25,fx=(k/25|0)%4,pr=si===19?PW:si===20?PP:BURST.has(si)?PB:PH,c=rc(),c2=rc(),R0=(si===19?190:si===20?170:150)*u;
 SH[si]().forEach((p,i)=>{let cc=fx===1?(i%3?[44,100,72]:[0,0,100]):c,rr=R0;if(fx===3&&i%3===0){rr*=.45;cc=c2}
  const L=(pr.L+R(-6,6))|0,s=(1-pr.f)/(1-pr.f**L);mk(x,y,p[0]*rr*s,p[1]*rr*s,cc,{life:L,g:pr.g,f:pr.f,tl:pr.tl+(fx===1?2:0),sz:pr.tl>3?2.1:2.5,crk:fx===1,hs:fx===2?4:0,tw:fx===2&&i%3===0,shed:fx===3?.05:0,sp:SPLIT.has(si)})});
 if(fx===1)setTimeout(crackle,500);if(fx===2)shimmer();if(FP.length>5200)FP.splice(0,900)}
const shown=new Set();
function firework(x,y,k,b=1){if(RK.length>34)return;x=x??R(innerWidth*.1,innerWidth*.9);y=y??R(innerHeight*.12,innerHeight*.5);k=k??(Math.random()*100|0);
 RK.push({x,y:innerHeight+10,ty:y,v:R(15,19),k,b});whistle();if(showing&&typeof k==='number'){shown.add(k);$('#tick').textContent=`🎆 ${shown.size}/100 · ${FN[(k/25|0)%4]}${SN[k%25]}`}}
(function skyLoop(){sx.clearRect(0,0,sky.width,sky.height);sx.globalCompositeOperation='lighter';sx.lineCap='round';sx.lineJoin='round';const W=sky.width,H=sky.height;
 if(glowA>.01){const g=sx.createLinearGradient(0,H,0,H*.55);g.addColorStop(0,`hsla(330,100%,65%,${glowA*.4})`);g.addColorStop(1,'hsla(330,100%,65%,0)');sx.fillStyle=g;sx.fillRect(0,H*.55,W,H*.45);glowA*=.975}
 FG=FG.filter(f=>f.a>.015);for(const f of FG){const g=sx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r);g.addColorStop(0,`hsla(${f.h},100%,80%,${f.a})`);g.addColorStop(1,'hsla(0,0%,0%,0)');sx.fillStyle=g;sx.fillRect(f.x-f.r,f.y-f.r,f.r*2,f.r*2);f.a*=.86}
 const nr=[];for(const r of RK){r.y-=r.v;r.v=Math.max(4.5,r.v*.988);r.x+=Math.sin(r.y*.06)*.35;
  if(Math.random()<.9)mk(r.x,r.y+6,R(-.4,.4),R(.4,1.4),[40,100,78],{life:20,sz:1.3,g:.03,tl:0});
  if(r.y<=r.ty)explode(r.x,r.y,r.k,r.b);else{sx.fillStyle='#fff';sx.beginPath();sx.arc(r.x,r.y,2.4,0,TAU);sx.fill();nr.push(r)}}
 RK=nr;const np=[],heavy=FP.length>3200;
 for(const p of FP){p.h.push(p.x,p.y);if(p.h.length>p.tl*2)p.h.splice(0,2);p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=p.f;p.vy*=p.f;p.life--;
  if(p.shed&&Math.random()<p.shed)mk(p.x,p.y,R(-.5,.5),R(-.2,.8),[44,100,82],{life:18,sz:1,tl:0,g:.05});
  if(p.life<=0){if(p.sp)for(let i=0;i<4;i++){const a=i*1.5708+.785;mk(p.x,p.y,Math.cos(a)*2.2,Math.sin(a)*2.2,p.c,{life:34,tl:4,f:.96,sz:1.8})}continue}
  if(p.crk&&p.life===14){for(let i=0;i<3;i++)mk(p.x,p.y,R(-1.6,1.6),R(-1.6,1.6),[0,0,100],{life:R(10,26)|0,sz:1.2,tw:1,tl:0,g:.04});if(Math.random()<.03)crackle()}
  let a=Math.min(1,p.life/(p.max*.55));if(p.tw&&Math.random()<.45)a*=.15;const cs=p.hs?`${(p.c[0]+p.hs*(p.max-p.life))%360},${p.c[1]}%,${p.c[2]}%`:p.cs;
  if(p.tl>0&&p.h.length>=4&&!heavy){sx.beginPath();sx.moveTo(p.h[0],p.h[1]);for(let i=2;i<p.h.length;i+=2)sx.lineTo(p.h[i],p.h[i+1]);sx.lineTo(p.x,p.y);sx.strokeStyle=`hsla(${cs},${a*.55})`;sx.lineWidth=p.sz*.9;sx.stroke()}
  sx.fillStyle=`hsla(${cs},${a})`;sx.beginPath();sx.arc(p.x,p.y,p.sz*(.6+.4*a),0,TAU);sx.fill();np.push(p)}
 FP=np;sx.globalCompositeOperation='source-over';requestAnimationFrame(skyLoop)})();
function volley(n=6,gap=300){for(let i=0;i<n;i++)setTimeout(()=>firework(),i*gap)}
function cannon(){for(const s of [0,1])for(let i=0;i<70;i++){const a=s?-Math.PI+R(.7,1.4):-R(.7,1.4),v=R(14,26);P.push({x:s?cv.width:0,y:cv.height,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:R(0,6),vr:R(-.2,.2),w:R(16,40),img:pick(),life:R(120,200),a:1})}boom(.6)}
function hint(t){const h=$('#hint');h.textContent=t;h.classList.add('on');setTimeout(()=>h.classList.remove('on'),6500)}
let capT;function cap(t,ms=3200){const c=$('#cap');clearTimeout(capT);c.className='';let i=0;c.innerHTML=t.split(' ').map(w=>`<span style="animation-delay:${(i++*.12).toFixed(2)}s">${w}&nbsp;</span>`).join('');capT=setTimeout(()=>c.classList.add('out'),ms)}
for(let i=0;i<70;i++){const s=document.createElement('i');s.style.cssText=`left:${R(0,100)}%;top:${R(0,100)}%;animation-delay:${-R(0,3).toFixed(1)}s;animation-duration:${R(1.5,4).toFixed(1)}s`;$('#dusk').appendChild(s)}
addEventListener('click',e=>{if(B.classList.contains('clear')&&!e.target.closest('button,.pol,#lb,.wh,#snd'))firework(e.clientX,Math.min(e.clientY,innerHeight*.75))});
/* ---- show music: 50 bars, builds from a soft overture to a huge finale ---- */
const SB=2.2;let smus,smT,smBar=0,smNext=0;
function sbar(i,t){const l=i<7?0:i<18?1:i<28?2:i<38?3:i<48?4:0,c=CH[i%8],n=l<1?4:l<3?8:16;
 pad(c.slice(0,4),t,SB,.03+l*.006,smus);bell(mtof(c[0]-12),SB*.9,.2,t,smus);
 for(let j=0;j<n;j++)bell(mtof(c[1+(j%4)+(j%8>5?1:0)]+(j%8>3?12:0)),.7,.04+l*.01,t+j*SB/n,smus);
 if(l>=1)ML[i%8].forEach((m,j)=>bell(mtof(m+(l>=3?12:0)),1.5,.1+l*.015,t+j*SB/4,smus));
 if(l>=1)thump(t,.5);if(l>=2)thump(t+SB/2,.45);if(l>=3){thump(t+SB/4,.3);thump(t+3*SB/4,.4)}
 if(l>=4)for(let j=0;j<8;j++)nz(t+SB*.5+j*SB/16,.1,2000,6000,.07,'highpass');
 if(l>=2&&i%2)for(let j=0;j<4;j++)bell(mtof(PENT[(Math.random()*6)|0]),1.2,.05,t+j*SB/4+.1,smus);
 if(i===48){[48,55,60,64,67,72,76,79,84].forEach((m,j)=>bell(mtof(m),4,.18,t+j*.05,smus));thump(t,.9,.6);boom(1.4)}}
function showMusic(){if(!ac)return;smus=ac.createGain();smus.gain.value=1;smus.connect(out);if(mus)mus.gain.setTargetAtTime(0,ac.currentTime,.8);clearInterval(bgTimer);bgTimer=0;
 smBar=0;smNext=ac.currentTime+.15;smT=setInterval(()=>{while(smNext<ac.currentTime+1&&smBar<50){sbar(smBar,smNext);smNext+=SB;smBar++}if(smBar>=50)clearInterval(smT)},200)}
/* ---- THE MEGA SHOW (~110 s, every one of the 100 recipes appears) ---- */
function megaShow(done){if(showing)return;showing=true;shown.clear();const ev=[],L=(t,k,x,y,b=1)=>ev.push([t,()=>firework(innerWidth*x,innerHeight*y,k,b)]),C=(t,s,ms=3300)=>ev.push([t,()=>cap(s,ms)]),CN=t=>ev.push([t,cannon]);let k=0;const nx=()=>(k++*7)%100;
 const BTN=.55;ev.push([0,()=>{$('#tick').classList.add('on');showMusic()}]);
 C(.5,'Lakmi… it&rsquo;s time ✨',3000);for(let i=0;i<8;i++)L(1.5+i*1.8,nx(),.2+.6*((i*.37)%1),.3+.1*(i%3));
 C(16,'Happy Birthday, Lakmi!',3600);CN(16);for(let i=0;i<40;i++){L(16+i*.6,nx(),(i%2?.25:.75)+R(-.12,.12),.25+R(0,.2));if(i%3===0)L(16.3+i*.6,nx(),.5,.3)}
 C(31,'Nineteen years of you 💗',3000);
 C(40,'19',2600);L(41,'txt:19',.5,.38,1.1);C(46,'L A K M I',2800);L(47,'txt:LAKMI',.5,.36,1.2);C(52,'Happy Birthday!',2600);L(53,'txt:HAPPY',.5,.3,1.2);L(55.5,'txt:BIRTHDAY',.5,.38,1.2);L(58,'txt:2027',.5,.34,1.1);
 for(let i=0;i<16;i++)L(41+i*1.1,nx(),i%2?.15:.85,.22+R(0,.18),.9);
 C(62,'May 2027 be YOUR year ✨',3400);CN(62);for(let i=0;i<22;i++){L(62+i*.5,nx(),i/21,.28+.08*Math.sin(i),1.1);L(73+i*.5,nx(),1-i/21,.3+.08*Math.cos(i),1.1)}
 C(74,'Everything you wished for 🌸',3200);CN(74);
 C(84,'This one is for YOU 💖',3000);for(let i=0;i<110;i++){const t=84+i*.2-(i*i)*.00055;L(t,nx(),R(.08,.92),R(.15,.5),1.1+(i>80?.3:0));if(i%10===0)CN(t)}
 ev.push([102,()=>{boom(1.4);chimes(20,.08)}]);L(103,5,.5,.36,1.7);L(103.6,'txt:19',.5,.36,1.4);L(105,6,.3,.3,1.4);L(105,6,.7,.3,1.4);L(106,'txt:LAKMI',.5,.34,1.4);
 for(let i=0;i<30;i++)L(107+i*.1,nx(),R(.05,.95),R(.12,.5),1.3);L(110,19,.25,.3,1.6);L(110,19,.75,.3,1.6);L(110.3,19,.5,.28,1.8);C(110.5,'Happy 19th Birthday, Lakmi 💗',9000);CN(110.5);CN(112);
 const T0=performance.now();ev.sort((a,b)=>a[0]-b[0]);let q=0;const iv=setInterval(()=>{const e=(performance.now()-T0)/1000;while(q<ev.length&&ev[q][0]<=e){ev[q][1]();q++}
  if(q>=ev.length&&e>122){clearInterval(iv);showing=false;$('#tick').classList.remove('on');done&&done()}},25)}
/* sparkle trail */
function spark(x,y,w=R(14,30)){const s=document.createElement('img');s.src=st(['spark1','spark2','spark5','heart7'][(Math.random()*4)|0]);
 s.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:${w}px;pointer-events:none;z-index:75;transition:1s;transform:translate(-50%,-50%)`;B.appendChild(s);
 requestAnimationFrame(()=>{s.style.transform=`translate(${R(-40,40)}px,${R(20,80)}px) rotate(${R(-90,90)}deg) scale(.2)`;s.style.opacity=0});setTimeout(()=>s.remove(),1000)}
let last=0;function trail(e){const t=Date.now();if(t-last<45)return;last=t;const p=e.touches?e.touches[0]:e;spark(p.clientX,p.clientY)}
addEventListener('mousemove',trail);addEventListener('touchmove',trail,{passive:true});
addEventListener('click',e=>burst(e.clientX,e.clientY,10,.5));
/* bokeh */
for(let i=0;i<18;i++){const b=document.createElement('i'),s=R(14,70);b.style.cssText=`left:${R(0,100)}%;width:${s}px;height:${s}px;animation-duration:${R(9,22)}s;animation-delay:${-R(0,18)}s;opacity:${R(.3,.8)}`;$('#bokeh').appendChild(b)}
/* ================= hanging photos + sticker lanterns ================= */
const ph=['02','03','06','09','11','13','14','18','19','21','23','24','25','26','27','34','36','38','39'].sort(()=>Math.random()-.5);let k=0,lk=0;
[{y:.04,s:.6,b:3.2,o:.8},{y:.27,s:.82,b:1.8,o:.92},{y:.52,s:1,b:.8,o:1}].forEach((L,li)=>{
 const n=Math.max(3,Math.min(7,Math.round(innerWidth/(250*L.s+30)))),d=document.createElement('div');d.className='line';
 d.style.cssText=`top:${L.y*100}%;--b:${L.b}px;filter:blur(${L.b}px);opacity:${L.o};--s:${L.s}`;
 let h='<svg viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M-5 0Q50 20 105 0" vector-effect="non-scaling-stroke"/></svg>';
 const sag=f=>{const t=(f*100+5)/110;return 60*4*t*(1-t)};
 for(let j=0;j<n;j++){const f=(j+.5)/n,e=(li*.25+j*.12).toFixed(2);
  h+=`<div class="hang" style="left:${f*100}%;top:${sag(f)}px;--e:${e}s"><div class="sw" style="--d:${R(3,5).toFixed(1)}s;--dl:${-R(0,4).toFixed(1)}s;--r:${R(2,6).toFixed(1)}deg"><i class="pin"></i><div class="pol" data-p="${ph[k%ph.length]}"><img src="assets/photos/p${ph[k++%ph.length]}.jpg" alt="Lakmi"></div></div></div>`;
  const g=f+.5/n;if(g<.97)h+=`<div class="hang" style="left:${g*100}%;top:${sag(g)}px;--e:${(+e+.3).toFixed(2)}s"><div class="sw" style="--d:${R(2.5,4.5).toFixed(1)}s;--dl:${-R(0,3).toFixed(1)}s;--r:${R(3,7).toFixed(1)}deg"><i class="th" style="height:${R(4,26)|0}px"></i><img class="lan" src="assets/lanterns/lan${lk++%3+1}.png" alt=""></div></div>`}
 d.innerHTML=h;$('#world').appendChild(d)});
addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;document.querySelectorAll('.line').forEach((l,i)=>l.style.transform=`translate(${-x*(14+i*16)}px,${-y*(6+i*7)}px)`)});
/* lightbox with arrows */
const lb=$('#lb'),lbi=lb.querySelector('img');let li=0;const show=i=>{li=(i+ph.length)%ph.length;lbi.src=`assets/photos/p${ph[li]}.jpg`};
document.addEventListener('click',e=>{const p=e.target.closest('.pol');
 if(p&&B.classList.contains('clear')){show(ph.indexOf(p.dataset.p));lb.classList.add('on')}
 else if(e.target.id==='prev')show(li-1);else if(e.target.id==='next')show(li+1);
 else if(lb.classList.contains('on')&&e.target.closest('#lb'))lb.classList.remove('on')});
let tx0=0;lb.addEventListener('touchstart',e=>{tx0=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx0;if(Math.abs(d)>50)show(li+(d<0?1:-1))});
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='ArrowLeft')show(li-1);if(e.key==='ArrowRight')show(li+1);if(e.key==='Escape')lb.classList.remove('on')});
/* ================= flower border ================= */
const FL=['lily1','lily2','tulip','orchid1','orchid2','rose'];
(function border(){const w=innerWidth,h=innerHeight,m=Math.min(w,h),box=$('#border'),items=[];
 [[1.5,0],[1.05,1]].forEach(([sc,L])=>{const base=(m<600?62:96)*sc,step=base*.5;const add=(x,y)=>items.push({x,y,w:base*R(.85,1.25),L});
  for(let x=-base*.2;x<w+base*.2;x+=step){add(x,-base*.12+R(-8,12));add(x,h+base*.12+R(-12,8))}
  for(let y=step;y<h-step*.6;y+=step){add(-base*.12+R(-8,12),y);add(w+base*.12+R(-12,8),y)}});
 items.sort(()=>Math.random()-.5).forEach((o,i)=>{const f=document.createElement('div');f.className='fl f'+o.L;
  f.style.cssText=`left:${o.x-o.w/2}px;top:${o.y-o.w/2}px;width:${o.w}px;z-index:${o.L};--r:${R(0,360)|0}deg;--e:${(i/items.length*2.6).toFixed(2)}s;--d:${R(3,6).toFixed(1)}s;--dl:${-R(0,5).toFixed(1)}s`;
  f.innerHTML=`<img src="assets/art/${FL[(Math.random()*FL.length)|0]}.png" alt="">`;box.appendChild(f)})})();
/* ================= Happy Birthday ================= */
const N={G4:392,A4:440,B4:493.9,C5:523.3,D5:587.3,E5:659.3,F5:698.5,G5:784};
const song=[[['Hap','G4',.75],['py ','G4',.25],['Birth','A4',1],['day ','G4',1],['to ','C5',1],['you','B4',2]],
[['Hap','G4',.75],['py ','G4',.25],['Birth','A4',1],['day ','G4',1],['to ','D5',1],['you','C5',2]],
[['Hap','G4',.75],['py ','G4',.25],['Birth','G5',1],['day ','E5',1],['dear ','C5',1],['Lak','B4',1],['mi','A4',2]],
[['Hap','F5',.75],['py ','F5',.25],['Birth','E5',1],['day ','C5',1],['to ','D5',1],['you','C5',2]]];
async function sing(){const lyr=$('#lyr'),beat=.62,t0=(ac?ac.currentTime:0)+.45;let T=0;
 for(const line of song){const Tl=T;setTimeout(()=>{lyr.innerHTML=`<p>${line.map(s=>`<span class="${/\s$/.test(s[0])?'we':''}">${s[0].trim()}</span>`).join('')}</p>`},(Tl+.45)*1000);
  line.forEach(([,n,b],i)=>{bell(N[n],b*beat*1.2,.24,t0+T);setTimeout(()=>{const sp=lyr.querySelectorAll('span')[i];if(!sp)return;sp.classList.add('on');const r=sp.getBoundingClientRect();burst(r.left+r.width/2,r.top,4,.4)},(T+.45)*1000);T+=b*beat});T+=.45}
 await sleep((T+.45)*1000);lyr.innerHTML=''}
/* ================= the show ================= */
$('#go').onclick=async()=>{$('#go').hidden=true;initAudio();$('#snd').hidden=false;await sing();bgStart();
 $('#ask').textContent='Close your eyes… make a wish 🌟';await sleep(2400);$('#ask').textContent='Now blow the candles 🎂';$('#blow').hidden=false};
$('#blow').onclick=async()=>{$('#blow').hidden=true;$('#ask').textContent='💨 whooosh…';const cb=$('#cakebox');
 B.classList.add('wind');wind=1;noise(2.6,300,3000,.45);noise(2.2,600,1800,.25);await sleep(1800);
 for(let i=0;i<12;i++){const s=document.createElement('i');s.className='smoke';s.style.cssText=`left:${R(34,64)}%;top:${R(0,14)}%;animation-delay:${i*.1}s`;cb.appendChild(s);setTimeout(()=>s.remove(),3800)}
 noise(.6,2000,200,.5,'lowpass');cb.classList.add('out');B.classList.add('out');await sleep(900);
 for(let i=10;i>0;i--){wind=i/10;await sleep(110)}wind=0;B.classList.remove('wind');
 $('#ask').textContent='🌟 Wish made — may it come true, Lakmi 💗';burst(innerWidth/2,innerHeight/2,160,1.5);chimes(10,.14);await sleep(2600);
 B.classList.add('clear','leave');await sleep(1500);
 B.classList.add('bloom');cannon();volley(8,380);chimes(26,.1);if(ac)mus.gain.setTargetAtTime(1.5,ac.currentTime,1);
 for(let i=0;i<4;i++)setTimeout(()=>burst(R(100,innerWidth-100),R(100,innerHeight-100),70,1.2),i*500);rain(60);extras();
 await sleep(4200);flyNote()};
/* ambient extras after the reveal: butterflies, balloons, shooting stars, falling petals */
function extras(){for(let i=0;i<6;i++){const d=document.createElement('div');d.className='bfw';d.style.cssText=`top:${R(8,75)}%;--t:${R(16,26)|0}s;--dl:${-R(0,20)|0}s;--w:${R(34,64)|0}px`;d.innerHTML=`<img src="${st(['bfly1','bfly2','bfly4','bfly5'][i%4])}" alt="">`;document.body.appendChild(d)}
 setInterval(()=>rain(5),2800);
 setInterval(()=>{const b=document.createElement('img');b.src=st(Math.random()<.5?'balloons':'heart1');b.className='bal';b.style.cssText=`left:${R(8,88)}%;width:${R(60,110)|0}px;--t:${R(12,20)|0}s;--sx:${R(-120,120)|0}px`;document.body.appendChild(b);setTimeout(()=>b.remove(),21000)},3500);
 setInterval(()=>{const s=document.createElement('i');s.className='ss';s.style.cssText=`left:${R(0,70)}%;top:${R(2,30)}%`;document.body.appendChild(s);setTimeout(()=>s.remove(),1200)},4200);
 setInterval(()=>{if(!document.hidden&&!showing&&RK.length<3)firework()},2300)}
/* ================= flying note + message ================= */
const msg=["Happiest 19th Birthday, Lakmi!! ❤️🎂","I know 2026 hasn't been the easiest year for you, and you've been through a lot this year. But I genuinely hope 2027 will be YOUR year! I hope it brings you all the happiness, peace, and opportunities you've been wishing for. I hope you get to do everything you want, achieve all your goals, and make so many beautiful memories along the way.","You deserve the best, and I really wish that 2027 turns out to be an amazing year for you. May everything you've been working towards fall into place, and may you always find reasons to smile and be happy.","I hope this special day is filled with happiness, laughter, love, and lots of beautiful moments. Enjoy your day to the fullest because 19 only comes once!!","Once again, MANY MANY HAPPY RETURNS OF THE DAY!! ❤️ I wish you nothing but the best for your 19th year and hope 2027 becomes your best year yet!! ✨"];
$('#msg').innerHTML=msg.map(p=>`<p>${p.split(' ').map(w=>`<span>${w}&nbsp;</span>`).join('')}</p>`).join('');
async function flyNote(){const n=$('#note'),paper=$('.paper');n.classList.add('fly');noise(2.8,300,4000,.22);
 const iv=setInterval(()=>{const r=paper.getBoundingClientRect();spark(r.left+r.width/2+R(-40,40),r.top+r.height/2+R(-40,40),R(18,38))},60);
 await sleep(2900);clearInterval(iv);burst(innerWidth/2,innerHeight/2,90,1.2);[72,76,79,84,88,91].forEach((m,i)=>bell(mtof(m),1.8,.16,ac&&ac.currentTime+.02+i*.09));
 n.classList.add('open');await sleep(900);let c=0;
 for(const s of document.querySelectorAll('#msg span')){s.classList.add('on');if(++c%7===0)bell(mtof(PENT[(Math.random()*6)|0]),1.2,.09);paper.scrollTop=paper.scrollHeight;await sleep(95)}
 await sleep(1200);fanfare();burst(innerWidth/2,innerHeight/2,100,1.3);await sleep(2600);
 n.classList.add('gone');noise(2.2,2500,300,.18);await sleep(2300);
 B.classList.add('zoom');noise(3,200,1200,.12);cannon();await sleep(3200);
 megaShow(()=>{$('#dock').hidden=false;hint('Tap anywhere for more fireworks 🎆');wishHearts()})}
function fanfare(){[60,64,67,72,76,79,84].forEach((m,i)=>bell(mtof(m),1.8,.15,ac&&ac.currentTime+.02+i*.11))}
/* 19 floating wish hearts */
const W=['May 2027 be YOUR year 🌸','Endless happiness 💗','Peace in your heart 🕊️','Every opportunity you wished for ✨','Do everything you want 🎀','Every goal achieved 🏆','So many beautiful memories 📸','You deserve the best 👑','Everything falls into place 🧩','Always a reason to smile 😊','Laughter that never stops 😂','Love all around you 💞','Beautiful moments all day 🌷','Enjoy 19 to the fullest 🎂','Your hard work paying off 🌟','Gentle days, good news 🍀','Dreams turning real 🦋','Your best year yet 💖','Happy returns of the day!! 🎉'];
async function wishHearts(){const t=$('#toast');for(let i=0;i<W.length;i++){await sleep(2600);const h=document.createElement('img');h.src=st(['heart1','heart2','heart3','heart5'][i%4]);h.className='wh';h.alt='wish';
 h.style.cssText=`left:${R(6,86)}%;--t:${R(9,14)|0}s;--sx:${R(-80,80)|0}px`;
 h.onclick=e=>{e.stopPropagation();t.textContent=W[i];t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2600);burst(e.clientX,e.clientY,30,.9);bell(mtof(PENT[i%6]),1.4,.14);h.remove()};
 document.body.appendChild(h);setTimeout(()=>h.remove(),15000)}}
$('#again').onclick=()=>{if(showing)return;fanfare();megaShow()};
$('#readl').onclick=()=>{const n=$('#note'),g=n.classList.contains('gone');n.classList.toggle('gone',!g);n.classList.toggle('back',g);$('#readl').textContent=g?'✖ Close letter':'💌 Read letter'};
$('#replay').onclick=()=>location.reload();
