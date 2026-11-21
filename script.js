const $=s=>document.querySelector(s),R=(a,b)=>Math.random()*(b-a)+a,sleep=ms=>new Promise(r=>setTimeout(r,ms));
const st=n=>`assets/stickers/${n}.png`,B=document.body;
const pool=['heart1','heart2','heart3','heart5','heart7','heart8','bow1','bow3','bfly1','bfly2','bfly4','spark1','spark2','petal1','petal2','rose1'];
const imgs={};pool.forEach(n=>{const i=new Image();i.src=st(n);imgs[n]=i});const keys=Object.keys(imgs);
/* ===== canvas: confetti, petals, wind streaks ===== */
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
/* sparkle trail */
function spark(x,y,w=R(14,30)){const s=document.createElement('img');s.src=st(['spark1','spark2','spark5','heart7'][(Math.random()*4)|0]);
 s.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:${w}px;pointer-events:none;z-index:75;transition:1s;transform:translate(-50%,-50%)`;B.appendChild(s);
 requestAnimationFrame(()=>{s.style.transform=`translate(${R(-40,40)}px,${R(20,80)}px) rotate(${R(-90,90)}deg) scale(.2)`;s.style.opacity=0});setTimeout(()=>s.remove(),1000)}
let last=0;function trail(e){const t=Date.now();if(t-last<45)return;last=t;const p=e.touches?e.touches[0]:e;spark(p.clientX,p.clientY)}
addEventListener('mousemove',trail);addEventListener('touchmove',trail,{passive:true});
addEventListener('click',e=>burst(e.clientX,e.clientY,10,.5));
/* bokeh */
for(let i=0;i<18;i++){const b=document.createElement('i'),s=R(14,70);b.style.cssText=`left:${R(0,100)}%;width:${s}px;height:${s}px;animation-duration:${R(9,22)}s;animation-delay:${-R(0,18)}s;opacity:${R(.3,.8)}`;$('#bokeh').appendChild(b)}
/* ===== hanging photos + lanterns ===== */
const ph=['02','03','06','09','11','13','14','18','19','21','23','24','25','26','27','34','36','38','39'].sort(()=>Math.random()-.5);let k=0;
[{y:.04,s:.6,b:3.2,o:.8},{y:.27,s:.82,b:1.8,o:.92},{y:.52,s:1,b:.8,o:1}].forEach((L,li)=>{
 const n=Math.max(3,Math.min(7,Math.round(innerWidth/(250*L.s+30)))),d=document.createElement('div');d.className='line';
 d.style.cssText=`top:${L.y*100}%;filter:blur(${L.b}px);opacity:${L.o};--s:${L.s}`;
 let h='<svg viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M-5 0Q50 20 105 0" vector-effect="non-scaling-stroke"/></svg>';
 const sag=f=>{const t=(f*100+5)/110;return 60*4*t*(1-t)};
 for(let j=0;j<n;j++){const f=(j+.5)/n,e=(li*.25+j*.12).toFixed(2);
  h+=`<div class="hang" style="left:${f*100}%;top:${sag(f)}px;--e:${e}s"><div class="sw" style="--d:${R(3,5).toFixed(1)}s;--dl:${-R(0,4).toFixed(1)}s;--r:${R(2,6).toFixed(1)}deg"><i class="pin"></i><div class="pol" data-p="${ph[k%ph.length]}"><img src="assets/photos/p${ph[k++%ph.length]}.jpg" alt="Lakmi"></div></div></div>`;
  const g=f+.5/n;if(g<.97)h+=`<div class="hang" style="left:${g*100}%;top:${sag(g)}px;--e:${(+e+.3).toFixed(2)}s"><div class="sw" style="--d:${R(2,4).toFixed(1)}s;--dl:${-R(0,3).toFixed(1)}s;--r:${R(3,7).toFixed(1)}deg"><i class="th" style="height:${R(20,70)|0}px"></i><b class="lt"></b></div></div>`}
 d.innerHTML=h;$('#world').appendChild(d)});
const lb=$('#lb');document.addEventListener('click',e=>{const p=e.target.closest('.pol');if(p&&B.classList.contains('clear')){lb.querySelector('img').src=`assets/photos/p${p.dataset.p}.jpg`;lb.classList.add('on')}else if(e.target.closest('#lb'))lb.classList.remove('on')});
/* ===== flower border ===== */
const FL=['lily1','lily2','tulip','orchid1','orchid2','rose'];
function border(){const w=innerWidth,h=innerHeight,m=Math.min(w,h),box=$('#border'),items=[];
 [[1.5,0],[1.05,1]].forEach(([sc,L])=>{const base=(m<600?62:96)*sc,step=base*.5;
  const add=(x,y)=>items.push({x,y,w:base*R(.85,1.25),L});
  for(let x=-base*.2;x<w+base*.2;x+=step){add(x,-base*.12+R(-8,12));add(x,h+base*.12+R(-12,8))}
  for(let y=step;y<h-step*.6;y+=step){add(-base*.12+R(-8,12),y);add(w+base*.12+R(-12,8),y)}});
 items.sort(()=>Math.random()-.5).forEach((o,i)=>{const f=document.createElement('div');f.className='fl f'+o.L;
  f.style.cssText=`left:${o.x-o.w/2}px;top:${o.y-o.w/2}px;width:${o.w}px;z-index:${o.L};--r:${R(0,360)|0}deg;--e:${(i/items.length*2.6).toFixed(2)}s;--d:${R(3,6).toFixed(1)}s;--dl:${-R(0,5).toFixed(1)}s`;
  f.innerHTML=`<img src="assets/art/${FL[(Math.random()*FL.length)|0]}.png" alt="">`;box.appendChild(f)})}
border();
/* ===== Happy Birthday (synthesised, no audio file needed) ===== */
const N={G4:392,A4:440,B4:493.9,C5:523.3,D5:587.3,E5:659.3,F5:698.5,G5:784};
const song=[[['Hap','G4',.75],['py ','G4',.25],['Birth','A4',1],['day ','G4',1],['to ','C5',1],['you','B4',2]],
[['Hap','G4',.75],['py ','G4',.25],['Birth','A4',1],['day ','G4',1],['to ','D5',1],['you','C5',2]],
[['Hap','G4',.75],['py ','G4',.25],['Birth','G5',1],['day ','E5',1],['dear ','C5',1],['Lak','B4',1],['mi','A4',2]],
[['Hap','F5',.75],['py ','F5',.25],['Birth','E5',1],['day ','C5',1],['to ','D5',1],['you','C5',2]]];
let ac;function tone(f,d){try{const t=ac.currentTime+.02,o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),g2=ac.createGain();
 o.type='triangle';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*3;g2.gain.value=.22;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.24,t+.02);g.gain.exponentialRampToValueAtTime(.0008,t+d);
 o2.connect(g2);g2.connect(g);o.connect(g);g.connect(ac.destination);o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05)}catch(e){}}
async function sing(){try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}
 const lyr=$('#lyr'),beat=.62;
 for(const line of song){lyr.innerHTML=`<p>${line.map(s=>`<span>${s[0]}</span>`).join('')}</p>`;const sp=lyr.querySelectorAll('span');
  for(let i=0;i<line.length;i++){const[,n,b]=line[i];if(ac)tone(N[n],b*beat*1.2);sp[i].classList.add('on');const r=sp[i].getBoundingClientRect();burst(r.left+r.width/2,r.top,4,.4);await sleep(b*beat*1000)}
  await sleep(450)}
 lyr.innerHTML=''}
/* ===== the show ===== */
$('#go').onclick=async()=>{$('#go').hidden=true;await sing();
 $('#ask').textContent='Close your eyes… make a wish 🌟';await sleep(1800);$('#ask').textContent='Now blow the candles 🎂';$('#blow').hidden=false};
$('#blow').onclick=async()=>{$('#blow').hidden=true;$('#ask').textContent='💨 whooosh…';const cb=$('#cakebox');
 B.classList.add('wind');wind=1;await sleep(1800);
 for(let i=0;i<12;i++){const s=document.createElement('i');s.className='smoke';s.style.cssText=`left:${R(34,64)}%;top:${R(0,14)}%;animation-delay:${i*.1}s`;cb.appendChild(s);setTimeout(()=>s.remove(),3800)}
 cb.classList.add('out');B.classList.add('out');await sleep(900);
 for(let i=10;i>0;i--){wind=i/10;await sleep(110)}wind=0;B.classList.remove('wind');
 $('#ask').textContent='🌟 Wish made — may it come true, Lakmi 💗';burst(innerWidth/2,innerHeight/2,160,1.5);await sleep(2600);
 B.classList.add('clear','leave');await sleep(1500);
 B.classList.add('bloom');for(let i=0;i<4;i++){setTimeout(()=>burst(R(100,innerWidth-100),R(100,innerHeight-100),70,1.2),i*500)}rain(60);
 setInterval(()=>rain(5),2800);await sleep(4200);flyNote()};
/* ===== flying note + message ===== */
const msg=["Happiest 19th Birthday, Lakmi!! ❤️🎂","I know 2026 hasn't been the easiest year for you, and you've been through a lot this year. But I genuinely hope 2027 will be YOUR year! I hope it brings you all the happiness, peace, and opportunities you've been wishing for. I hope you get to do everything you want, achieve all your goals, and make so many beautiful memories along the way.","You deserve the best, and I really wish that 2027 turns out to be an amazing year for you. May everything you've been working towards fall into place, and may you always find reasons to smile and be happy.","I hope this special day is filled with happiness, laughter, love, and lots of beautiful moments. Enjoy your day to the fullest because 19 only comes once!!","Once again, MANY MANY HAPPY RETURNS OF THE DAY!! ❤️ I wish you nothing but the best for your 19th year and hope 2027 becomes your best year yet!! ✨"];
$('#msg').innerHTML=msg.map(p=>`<p>${p.split(' ').map(w=>`<span>${w}&nbsp;</span>`).join('')}</p>`).join('');
async function flyNote(){const n=$('#note'),paper=$('.paper');n.classList.add('fly');
 const iv=setInterval(()=>{const r=paper.getBoundingClientRect();spark(r.left+r.width/2+R(-40,40),r.top+r.height/2+R(-40,40),R(18,38))},60);
 await sleep(2900);clearInterval(iv);burst(innerWidth/2,innerHeight/2,90,1.2);n.classList.add('open');await sleep(900);
 for(const s of document.querySelectorAll('#msg span')){s.classList.add('on');paper.scrollTop=paper.scrollHeight;await sleep(95)}
 await sleep(600);$('.acts').hidden=false;paper.scrollTop=paper.scrollHeight;burst(innerWidth/2,innerHeight/2,120,1.4)}
$('#again').onclick=()=>{[0,300,600,900].forEach(t=>setTimeout(()=>burst(R(100,innerWidth-100),R(100,innerHeight-200),110,1.4),t));rain(90)};
$('#replay').onclick=()=>location.reload();
