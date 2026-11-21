const $=s=>document.querySelector(s),R=(a,b)=>Math.random()*(b-a)+a;
const st=n=>`assets/stickers/${n}.png`;
const pool=['heart1','heart2','heart3','heart4','heart5','heart7','heart8','bow1','bow3','bow5','bow6','bfly1','bfly2','bfly4','bfly5','spark1','spark2','spark3','petal1','rose1','gift1'];
const imgs={};pool.concat(['heart9','heart10','heart6','petal2']).forEach(n=>{const i=new Image();i.src=st(n);imgs[n]=i});
/* ---- background floaters ---- */
const bg=$('#bg');
for(let i=0;i<26;i++){const m=document.createElement('img');m.src=st(pool[i%pool.length]);m.alt='';
 m.style.cssText=`left:${R(0,96)}%;top:${R(0,96)}%;width:${R(34,90)}px;animation-duration:${R(6,14)}s;animation-delay:${-R(0,10)}s`;bg.appendChild(m)}
/* ---- canvas confetti ---- */
const cv=$('#fx'),cx=cv.getContext('2d');let P=[];
const fit=()=>{cv.width=innerWidth;cv.height=innerHeight};fit();addEventListener('resize',fit);
function burst(x,y,n=70,spread=1){for(let i=0;i<n;i++){const a=R(0,Math.PI*2),s=R(4,15)*spread,k=Object.keys(imgs);
 P.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6,r:R(0,6),vr:R(-.2,.2),w:R(16,40),img:imgs[k[(Math.random()*k.length)|0]],life:R(110,200),a:1})}}
function rain(n=50){for(let i=0;i<n;i++){const k=Object.keys(imgs);P.push({x:R(0,cv.width),y:R(-400,-20),vx:R(-1,1),vy:R(2,6),r:0,vr:R(-.05,.05),w:R(16,38),img:imgs[k[(Math.random()*k.length)|0]],life:400,a:1,g:0})}}
(function loop(){cx.clearRect(0,0,cv.width,cv.height);
 P=P.filter(p=>p.life>0&&p.y<cv.height+60);
 for(const p of P){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g===0?0:.28;p.vx*=p.g===0?1:.99;p.r+=p.vr;p.life--;p.a=Math.min(1,p.life/40);
  cx.save();cx.globalAlpha=p.a;cx.translate(p.x,p.y);cx.rotate(p.r);cx.drawImage(p.img,-p.w/2,-p.w/2,p.w,p.w);cx.restore()}
 requestAnimationFrame(loop)})();
/* ---- cursor sparkle trail ---- */
let last=0;function trail(e){const t=Date.now();if(t-last<45)return;last=t;
 const x=(e.touches?e.touches[0].clientX:e.clientX),y=(e.touches?e.touches[0].clientY:e.clientY);
 const s=document.createElement('img');s.src=st(['spark1','spark2','spark5','heart7'][(Math.random()*4)|0]);
 s.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:${R(14,30)}px;pointer-events:none;z-index:75;transition:1s;transform:translate(-50%,-50%)`;
 document.body.appendChild(s);requestAnimationFrame(()=>{s.style.transform=`translate(${R(-40,40)}px,${R(20,80)}px) rotate(${R(-90,90)}deg) scale(.2)`;s.style.opacity=0});setTimeout(()=>s.remove(),1000)}
addEventListener('mousemove',trail);addEventListener('touchmove',trail,{passive:true});
addEventListener('click',e=>burst(e.clientX,e.clientY,10,.5));
/* ---- title letters ---- */
function letters(el,delay=0){el.innerHTML=[...el.dataset.t].map((c,i)=>c===' '?'<span class="ch" style="width:.3em">&nbsp;</span>':`<span class="ch" style="animation-delay:${delay+i*.07}s">${c}</span>`).join('')}
/* ---- gift open ---- */
const song=$('#song'),mb=$('#music');
$('#open').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();
 burst(r.left+r.width/2,r.top+r.height/2,150,1.4);
 setTimeout(()=>{$('#gate').classList.add('go');document.body.classList.remove('locked');letters($('#title'),.2);letters($('#name'),1.5);rain(70);setTimeout(()=>burst(innerWidth/2,innerHeight/3,120,1.3),900)},650);
 song.play().then(()=>{mb.classList.add('pl')}).catch(()=>{})};
song.addEventListener('canplay',()=>mb.hidden=false);song.addEventListener('error',()=>mb.hidden=true);
song.load();mb.onclick=()=>{if(song.paused){song.play();mb.classList.add('pl')}else{song.pause();mb.classList.remove('pl')}};
/* ---- word-by-word letter text ---- */
document.querySelectorAll('.words').forEach(p=>{let d=0;p.innerHTML=p.textContent.split(' ').map(w=>`<span style="transition-delay:${(d++)*.045}s">${w}&nbsp;</span>`).join('')});
/* ---- reveal on scroll ---- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');if(e.target.id==='cake')setTimeout(()=>burst(innerWidth/2,innerHeight/2,40),500)}}),{threshold:.18});
document.querySelectorAll('.reveal,.words,#cake').forEach(el=>io.observe(el));
/* ---- progress bar + parallax ---- */
addEventListener('scroll',()=>{const h=document.documentElement;$('#bar').style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%';
 document.querySelectorAll('.deco').forEach((d,i)=>d.style.marginTop=(scrollY*(.08+i*.03))+'px')},{passive:true});
/* ---- gallery ---- */
const ph=['02','03','06','09','11','13','14','18','19','21','23','24','25','26','27','34','36','37','38','39'];
function fill(id,list){const row=$(id);const html=list.map((n,i)=>`<div class="pol" style="--r:${R(-7,7).toFixed(1)}deg"><img loading="lazy" src="assets/photos/p${n}.jpg" alt="Lakmi"></div>`).join('');row.innerHTML=html+html}
fill('#r1',ph.slice(0,10));fill('#r2',ph.slice(10));
const lb=$('#lb');document.addEventListener('click',e=>{const p=e.target.closest('.pol');if(p){lb.querySelector('img').src=p.querySelector('img').src;lb.classList.add('on');burst(e.clientX,e.clientY,18,.8)}else if(e.target.closest('#lb'))lb.classList.remove('on')});
/* ---- 19 wishes ---- */
const W=['May 2027 be YOUR year 🌸','Endless happiness 💗','Peace in your heart 🕊️','All the opportunities you wished for ✨','Doing everything you want 🎀','Every goal achieved 🏆','So many beautiful memories 📸','You deserve the best 👑','Everything falls into place 🧩','Always a reason to smile 😊','Laughter that never stops 😂','Love all around you 💞','A day filled with beautiful moments 🌷','Enjoy 19 to the fullest 🎂','Your hard work paying off 🌟','Gentle days and good news 🍀','Dreams turning real 🦋','Your best year yet 💖','Happy returns of the day!! 🎉'];
const H=$('#hearts');const hn=['heart1','heart2','heart3','heart5','heart6','heart7','heart10','heart4'];
W.forEach((w,i)=>{const h=document.createElement('img');h.src=st(hn[i%hn.length]);h.className='hh';h.alt='wish';
 h.style.cssText=`left:${(i%5)*19+R(0,6)}%;top:${Math.floor(i/5)*24+R(0,5)}%;animation-delay:${-R(0,4)}s`;
 h.onclick=e=>{h.classList.add('gone');setTimeout(()=>h.remove(),500);const t=$('#wish');t.style.opacity=0;setTimeout(()=>{t.textContent=`${19-H.querySelectorAll('.hh:not(.gone)').length}/19 · ${w}`;t.style.opacity=1},200);burst(e.clientX,e.clientY,25,.8)};H.appendChild(h)});
$('#wish').style.transition='opacity .4s';
/* ---- cake ---- */
let lit=true;
$('#blow').onclick=()=>{const c=$('#cake'),w=$('.cakewrap'),b=$('#blow');
 if(lit){c.classList.add('out');
  for(let i=0;i<10;i++){const s=document.createElement('i');s.className='smoke';s.style.left=`${R(36,62)}%`;s.style.top=`${R(2,10)}%`;s.style.animationDelay=`${i*.12}s`;w.appendChild(s);setTimeout(()=>s.remove(),3200)}
  const r=w.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,200,1.6);rain(60);
  $('#wishmsg').textContent='🌟 Wish made! Now go make it come true, Lakmi 💗';b.textContent='🕯️ Light them again'}
 else{c.classList.remove('out');$('#wishmsg').textContent='Close your eyes… make a wish… and may 2027 make it come true 💗';b.textContent='🕯️ Blow out the candles'}
 lit=!lit};
$('#again').onclick=()=>{[0,300,600,900].forEach(t=>setTimeout(()=>burst(R(100,innerWidth-100),R(100,innerHeight-200),110,1.4),t));rain(90)};
