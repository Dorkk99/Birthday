const $=s=>document.querySelector(s),R=(a,b)=>Math.random()*(b-a)+a,sleep=ms=>new Promise(r=>setTimeout(r,ms)),B=document.body;
const st=n=>`assets/stickers/${n}.png`;
const pool=['heart1','heart2','heart3','heart5','heart7','heart8','bow1','bow3','bfly1','bfly2','bfly4','spark1','spark2','petal1','petal2','rose1'];
const imgs={};pool.forEach(n=>{const i=new Image();i.src=st(n);imgs[n]=i});const keys=Object.keys(imgs);
/* ================= AUDIO ENGINE (all synthesised) ================= */
let ac,out,mus,bgTimer,bgBar=0,bgNext=0;const BAR=2.4,mtof=m=>440*2**((m-69)/12);
function initAudio(){if(ac)return;try{ac=new(window.AudioContext||window.webkitAudioContext)();out=ac.createGain();out.gain.value=.9;mus=ac.createGain();mus.gain.value=0;mus.connect(out);
 const d=ac.createDelay(),fb=ac.createGain(),wet=ac.createGain();d.delayTime.value=.36;fb.gain.value=.4;wet.gain.value=.38;out.connect(ac.destination);out.connect(d);d.connect(fb);fb.connect(d);d.connect(wet);wet.connect(ac.destination)}catch(e){ac=null}}
function bell(f,d=1.2,v=.2,t,dest){if(!ac)return;t=t||ac.currentTime+.02;const o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),g2=ac.createGain();
 o.type='triangle';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*3;g2.gain.value=.22;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.015);g.gain.exponentialRampToValueAtTime(.0008,t+d);
 o2.connect(g2);g2.connect(g);o.connect(g);g.connect(dest||out);o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05)}
function pad(ms,t,dur,v=.03){const lp=ac.createBiquadFilter(),g=ac.createGain();lp.type='lowpass';lp.frequency.value=1000;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur+.7);lp.connect(g);g.connect(mus);
 ms.forEach(m=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=mtof(m)*(1+R(-.003,.003));o.connect(lp);o.start(t);o.stop(t+dur+.8)})}
function noise(dur,f0,f1,v=.3,type='bandpass'){if(!ac)return;const n=ac.sampleRate*dur|0,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
 const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain(),t=ac.currentTime;s.buffer=b;f.type=type;f.Q.value=1.2;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+dur*.3);g.gain.linearRampToValueAtTime(0,t+dur);s.connect(f);f.connect(g);g.connect(out);s.start()}
const CH=[[48,52,55,60,64,67],[43,47,50,55,59,62],[45,48,52,57,60,64],[40,47,52,55,59,64],[41,45,48,53,57,60],[48,52,55,60,64,67],[41,45,48,53,57,60],[43,47,50,55,59,62]];
const ML=[[76,79,76,72],[74,79,74,71],[72,76,81,76],[71,76,79,76],[77,81,77,72],[76,72,76,79],[77,81,84,81],[79,74,71,79]];
function bar(i,t){const c=CH[i];pad(c.slice(0,4),t,BAR);bell(mtof(c[0]-12),BAR*.9,.18,t,mus);
 [1,2,3,4,3,2,5,4].forEach((k,j)=>bell(mtof(c[k]+(j>5?12:0)),.9,.055,t+j*BAR/8,mus));
 ML[i].forEach((m,j)=>bell(mtof(m),1.7,.12,t+j*BAR/4+.02,mus))}
function bgStart(){if(!ac||bgTimer)return;bgNext=ac.currentTime+.1;mus.gain.setTargetAtTime(1,ac.currentTime,2);
 bgTimer=setInterval(()=>{while(bgNext<ac.currentTime+.7){bar(bgBar%8,bgNext);bgNext+=BAR;bgBar++}},200)}
const PENT=[84,86,88,91,93,96];
function chimes(n=16,gap=.12){PENT.length&&Array.from({length:n}).forEach((_,i)=>bell(mtof(PENT[(Math.random()*6)|0]),1.4,.1,ac&&ac.currentTime+.02+i*gap))}
function boom(){noise(.7,900,60,.5,'lowpass');noise(.4,6000,2000,.12,'highpass')}
let muted=false;$('#snd').onclick=()=>{muted=!muted;if(ac)out.gain.setTargetAtTime(muted?0:.9,ac.currentTime,.1);$('#snd').textContent=muted?'🔇':'🔊'};
/* ================= CANVAS: confetti, petals, wind, fireworks ================= */
const cv=$('#fx'),cx=cv.getContext('2d');let P=[],S=[],F=[],wind=0;
const fit=()=>{cv.width=innerWidth;cv.height=innerHeight};fit();addEventListener('resize',fit);
const pick=()=>imgs[keys[(Math.random()*keys.length)|0]];
function burst(x,y,n=70,sp=1){for(let i=0;i<n;i++){const a=R(0,6.283),s=R(4,15)*sp;P.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6,r:R(0,6),vr:R(-.2,.2),w:R(16,40),img:pick(),life:R(110,200),a:1})}}
function rain(n=50){for(let i=0;i<n;i++)P.push({x:R(0,cv.width),y:R(-400,-20),vx:R(-1,1),vy:R(2,6),r:0,vr:R(-.05,.05),w:R(16,38),img:pick(),life:420,a:1,g:0})}
function firework(x,y){F.push({x:x??R(120,innerWidth-120),y:innerHeight,ty:y??R(80,innerHeight*.45),rocket:1,c:`hsl(${R(300,360)|0},100%,${R(65,80)|0}%)`})}
(function loop(){cx.clearRect(0,0,cv.width,cv.height);
 if(wind>.02)for(let k=0;k<4*wind;k++)S.push({x:-200,y:R(0,cv.height),l:R(160,460),v:R(30,60),a:R(.25,.75),w:R(1,3.2)});
 S=S.filter(s=>s.x<cv.width+500);
 for(const s of S){s.x+=s.v;const g=cx.createLinearGradient(s.x-s.l,0,s.x,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,`rgba(255,255,255,${s.a})`);cx.strokeStyle=g;cx.lineWidth=s.w;cx.beginPath();cx.moveTo(s.x-s.l,s.y);cx.quadraticCurveTo(s.x-s.l/2,s.y-8,s.x,s.y+6);cx.stroke()}
 P=P.filter(p=>p.life>0&&p.y<cv.height+60);
 for(const p of P){p.x+=p.vx+wind*9;p.y+=p.vy;if(p.g!==0)p.vy+=.28,p.vx*=.99;p.r+=p.vr;p.life--;p.a=Math.min(1,p.life/40);
  cx.save();cx.globalAlpha=p.a;cx.translate(p.x,p.y);cx.rotate(p.r);cx.drawImage(p.img,-p.w/2,-p.w/2,p.w,p.w);cx.restore()}
 cx.globalCompositeOperation='lighter';const nf=[];
 for(const f of F){if(f.rocket){f.y-=14;cx.fillStyle=f.c;cx.fillRect(f.x-1.5,f.y,3,16);if(f.y<=f.ty){boom();for(let i=0;i<80;i++){const a=R(0,6.283),s=R(1,7.5);nf.push({x:f.x,y:f.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:R(50,90),c:f.c})}}else nf.push(f)}
  else{f.x+=f.vx;f.y+=f.vy;f.vy+=.06;f.vx*=.985;f.life--;if(f.life>0){cx.globalAlpha=Math.min(1,f.life/30);cx.fillStyle=f.c;cx.beginPath();cx.arc(f.x,f.y,2.2,0,6.283);cx.fill();nf.push(f)}}}
 F=nf;cx.globalAlpha=1;cx.globalCompositeOperation='source-over';requestAnimationFrame(loop)})();
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
 d.style.cssText=`top:${L.y*100}%;filter:blur(${L.b}px);opacity:${L.o};--s:${L.s}`;
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
async function sing(){const lyr=$('#lyr'),beat=.62;
 for(const line of song){lyr.innerHTML=`<p>${line.map(s=>`<span class="${/\s$/.test(s[0])?'we':''}">${s[0].trim()}</span>`).join('')}</p>`;const sp=lyr.querySelectorAll('span');
  for(let i=0;i<line.length;i++){const[,n,b]=line[i];bell(N[n],b*beat*1.2,.24);sp[i].classList.add('on');const r=sp[i].getBoundingClientRect();burst(r.left+r.width/2,r.top,4,.4);await sleep(b*beat*1000)}
  await sleep(450)}
 lyr.innerHTML=''}
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
 B.classList.add('bloom');chimes(26,.1);if(ac)mus.gain.setTargetAtTime(1.5,ac.currentTime,1);
 for(let i=0;i<4;i++)setTimeout(()=>burst(R(100,innerWidth-100),R(100,innerHeight-100),70,1.2),i*500);rain(60);extras();
 await sleep(4200);flyNote()};
/* ambient extras after the reveal: butterflies, balloons, shooting stars, falling petals */
function extras(){for(let i=0;i<6;i++){const d=document.createElement('div');d.className='bfw';d.style.cssText=`top:${R(8,75)}%;--t:${R(16,26)|0}s;--dl:${-R(0,20)|0}s;--w:${R(34,64)|0}px`;d.innerHTML=`<img src="${st(['bfly1','bfly2','bfly4','bfly5'][i%4])}" alt="">`;document.body.appendChild(d)}
 setInterval(()=>rain(5),2800);
 setInterval(()=>{const b=document.createElement('img');b.src=st(Math.random()<.5?'balloons':'heart1');b.className='bal';b.style.cssText=`left:${R(8,88)}%;width:${R(60,110)|0}px;--t:${R(12,20)|0}s;--sx:${R(-120,120)|0}px`;document.body.appendChild(b);setTimeout(()=>b.remove(),21000)},3500);
 setInterval(()=>{const s=document.createElement('i');s.className='ss';s.style.cssText=`left:${R(0,70)}%;top:${R(2,30)}%`;document.body.appendChild(s);setTimeout(()=>s.remove(),1200)},4200)}
/* ================= flying note + message ================= */
const msg=["Happiest 19th Birthday, Lakmi!! ❤️🎂","I know 2026 hasn't been the easiest year for you, and you've been through a lot this year. But I genuinely hope 2027 will be YOUR year! I hope it brings you all the happiness, peace, and opportunities you've been wishing for. I hope you get to do everything you want, achieve all your goals, and make so many beautiful memories along the way.","You deserve the best, and I really wish that 2027 turns out to be an amazing year for you. May everything you've been working towards fall into place, and may you always find reasons to smile and be happy.","I hope this special day is filled with happiness, laughter, love, and lots of beautiful moments. Enjoy your day to the fullest because 19 only comes once!!","Once again, MANY MANY HAPPY RETURNS OF THE DAY!! ❤️ I wish you nothing but the best for your 19th year and hope 2027 becomes your best year yet!! ✨"];
$('#msg').innerHTML=msg.map(p=>`<p>${p.split(' ').map(w=>`<span>${w}&nbsp;</span>`).join('')}</p>`).join('');
async function flyNote(){const n=$('#note'),paper=$('.paper');n.classList.add('fly');noise(2.8,300,4000,.22);
 const iv=setInterval(()=>{const r=paper.getBoundingClientRect();spark(r.left+r.width/2+R(-40,40),r.top+r.height/2+R(-40,40),R(18,38))},60);
 await sleep(2900);clearInterval(iv);burst(innerWidth/2,innerHeight/2,90,1.2);[72,76,79,84,88,91].forEach((m,i)=>bell(mtof(m),1.8,.16,ac&&ac.currentTime+.02+i*.09));
 n.classList.add('open');await sleep(900);let c=0;
 for(const s of document.querySelectorAll('#msg span')){s.classList.add('on');if(++c%7===0)bell(mtof(PENT[(Math.random()*6)|0]),1.2,.09);paper.scrollTop=paper.scrollHeight;await sleep(95)}
 await sleep(600);$('.acts').hidden=false;paper.scrollTop=paper.scrollHeight;fanfare();[0,500,1000].forEach(t=>setTimeout(()=>firework(),t));burst(innerWidth/2,innerHeight/2,140,1.5);wishHearts()}
function fanfare(){[60,64,67,72,76,79,84].forEach((m,i)=>bell(mtof(m),1.8,.15,ac&&ac.currentTime+.02+i*.11))}
/* 19 floating wish hearts */
const W=['May 2027 be YOUR year 🌸','Endless happiness 💗','Peace in your heart 🕊️','Every opportunity you wished for ✨','Do everything you want 🎀','Every goal achieved 🏆','So many beautiful memories 📸','You deserve the best 👑','Everything falls into place 🧩','Always a reason to smile 😊','Laughter that never stops 😂','Love all around you 💞','Beautiful moments all day 🌷','Enjoy 19 to the fullest 🎂','Your hard work paying off 🌟','Gentle days, good news 🍀','Dreams turning real 🦋','Your best year yet 💖','Happy returns of the day!! 🎉'];
async function wishHearts(){const t=$('#toast');for(let i=0;i<W.length;i++){await sleep(2600);const h=document.createElement('img');h.src=st(['heart1','heart2','heart3','heart5'][i%4]);h.className='wh';h.alt='wish';
 h.style.cssText=`left:${R(6,86)}%;--t:${R(9,14)|0}s;--sx:${R(-80,80)|0}px`;
 h.onclick=e=>{e.stopPropagation();t.textContent=W[i];t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2600);burst(e.clientX,e.clientY,30,.9);bell(mtof(PENT[i%6]),1.4,.14);h.remove()};
 document.body.appendChild(h);setTimeout(()=>h.remove(),15000)}}
$('#again').onclick=()=>{fanfare();[0,300,600,900,1200].forEach(t=>setTimeout(()=>{firework();burst(R(100,innerWidth-100),R(100,innerHeight-200),90,1.4)},t));rain(90)};
$('#replay').onclick=()=>location.reload();
