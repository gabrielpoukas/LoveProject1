(function(){

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  
  const cur = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let mx=0, my=0, cx=0, cy=0;
  
  if (!isMobile && cur && dot) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    
    (function ani(){
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cur.style.left = cx + 'px';
      cur.style.top = cy + 'px';
      requestAnimationFrame(ani);
    })();
  }
  
  const sc = document.getElementById('starfield');
  const sctx = sc.getContext('2d');
  let stars = [];
  
  function resizeStar(){
    sc.width = window.innerWidth;
    sc.height = window.innerHeight;
    stars = [];
    const starCount = isMobile ? 80 : 200; 
    for(let i=0; i<starCount; i++){
      stars.push({
        x: Math.random() * sc.width,
        y: Math.random() * sc.height,
        r: Math.random() * 1.4 + 0.2,
        o: Math.random(),
        s: Math.random() * 0.015 + 0.003,
        d: Math.random() < 0.5 ? 1 : -1
      });
    }
  }
  resizeStar();
  window.addEventListener('resize', resizeStar);
  
  (function drawStars(){
    sctx.clearRect(0, 0, sc.width, sc.height);
    stars.forEach(s => {
      s.o += s.s * s.d;
      if(s.o > 1 || s.o < 0) s.d *= -1;
      sctx.beginPath();
      sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sctx.fillStyle = `rgba(255,245,240,${s.o})`;
      sctx.fill();
    });
    requestAnimationFrame(drawStars);
  })();
  
  const pc = document.getElementById('petals');
  const pctx = pc.getContext('2d');
  let petals = [];
  
  function resizePetal(){
    pc.width = window.innerWidth;
    pc.height = window.innerHeight;
  }
  resizePetal();
  window.addEventListener('resize', resizePetal);
  
  function newPetal(){
    return {
      x: Math.random() * pc.width,
      y: -30,
      r: Math.random() * 7 + 4,
      vx: (Math.random() - 0.5) * 0.8,
      vy: Math.random() * 1.2 + 0.5,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.03,
      o: Math.random() * 0.5 + 0.3,
      c: Math.random() < 0.5 ? 'rgba(200,116,138,' : 'rgba(212,175,122,'
    };
  }
  
  const petalCount = isMobile ? 10 : 18;
  for(let i=0; i<petalCount; i++){
    let p = newPetal();
    p.y = Math.random() * pc.height;
    petals.push(p);
  }
  
  (function drawPetals(){
    pctx.clearRect(0, 0, pc.width, pc.height);
    petals.forEach((p, i) => {
      pctx.save();
      pctx.translate(p.x, p.y);
      pctx.rotate(p.rot);
      pctx.beginPath();
      pctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
      pctx.fillStyle = p.c + p.o + ')';
      pctx.fill();
      pctx.restore();
      
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      if(p.y > pc.height + 30) petals[i] = newPetal();
    });
    requestAnimationFrame(drawPetals);
  })();
  
  document.getElementById('heartBtn').addEventListener('click', function(e){
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    burst(x, y, isMobile ? 12 : 20);
  });
  
  function burst(x, y, n){
    if(!x || !y) {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }
    for(let i=0; i<n; i++){
      const d = document.createElement('div');
      d.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${Math.random()*10+6}px;
        height: ${Math.random()*10+6}px;
        pointer-events: none;
        z-index: 9998;
        font-size: ${Math.random()*14+10}px;
        color: hsl(${Math.random()*30+340},70%,70%);
      `;
      d.textContent = '♥';
      document.body.appendChild(d);
      
      const a = d.animate([
        { transform: `translate(-50%,-50%) scale(0)`, opacity: 1 },
        { transform: `translate(${(Math.random()-0.5)*180}px, ${-(Math.random()*140+40)}px) scale(1)`, opacity: 0 }
      ], {
        duration: Math.random() * 600 + 500,
        easing: 'cubic-bezier(.2,.8,.2,1)'
      });
      a.onfinish = () => d.remove();
    }
  }
  
  if (!isMobile) {
    let lastHeart = 0;
    document.addEventListener('mousemove', e => {
      if (Date.now() - lastHeart > 120) {
        lastHeart = Date.now();
        const d = document.createElement('div');
        d.style.cssText = `
          position: fixed;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          pointer-events: none;
          z-index: 9000;
          font-size: 10px;
          color: rgba(200,116,138,0.6);
          transform: translate(-50%, -50%);
        `;
        d.textContent = '♥';
        document.body.appendChild(d);
        
        const a = d.animate([
          { opacity: 0.7, transform: 'translate(-50%,-50%) scale(0.5)' },
          { opacity: 0, transform: 'translate(-50%,-120%) scale(1)' }
        ], {
          duration: 600,
          easing: 'ease-out'
        });
        a.onfinish = () => d.remove();
      }
    });
  }
  
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: isMobile ? 0.05 : 0.15 }); 
  
  reveals.forEach(r => io.observe(r));
  
  const hn = document.getElementById('heroName');
  if (hn) {
    hn.addEventListener('mouseenter', () => hn.style.textShadow = '0 0 80px rgba(200,116,138,0.9), 0 0 160px rgba(200,116,138,0.4)');
    hn.addEventListener('mouseleave', () => hn.style.textShadow = '0 0 60px rgba(200,116,138,0.5), 0 0 120px rgba(200,116,138,0.2)');
    
    if (!isMobile) {
      document.addEventListener('mousemove', e => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 12;
        const dy = (e.clientY / window.innerHeight - 0.5) * 8;
        hn.style.transform = `translate(${dx}px, ${dy}px) Limi`;
      });
    }
  }
  
})();