// main.js — petal animation + tiny interactions
(() => {
  // Canvas petals
  const canvas = document.getElementById('petal-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;

  // handle resize
  window.addEventListener('resize', () => {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  });

  // create a small flower petal shape as an offscreen canvas
  function makePetalCanvas(){
    const s = 24;
    const c = document.createElement('canvas');
    c.width = s; c.height = s;
    const g = c.getContext('2d');

    // petal gradient
    const g1 = g.createLinearGradient(0,0,s,s);
    g1.addColorStop(0, '#fff7fb');
    g1.addColorStop(0.5, '#ffd9e7');
    g1.addColorStop(1, '#ff9ccf');

    g.save();
    g.translate(s/2, s/2);
    g.rotate(-0.6);
    g.beginPath();
    g.ellipse(0, 0, s*0.4, s*0.65, 0, 0, Math.PI*2);
    g.fillStyle = g1;
    g.fill();
    g.restore();

    // small center
    g.beginPath();
    g.arc(s*0.7, s*0.25, 2.2, 0, Math.PI*2);
    g.fillStyle = '#ff6fa3';
    g.fill();

    return c;
  }
  const petalImg = makePetalCanvas();

  // particles
  const petals = [];
  const PCOUNT = Math.min(80, Math.floor((W*H)/90000)); // scale with screen

  function rand(a,b) { return a + Math.random()*(b-a); }

  function spawnPetal(x){
    petals.push({
      x: x !== undefined ? x : rand(0,W),
      y: rand(-H*0.2, -10),
      vx: rand(-0.25, 0.75),
      vy: rand(0.4, 1.2),
      rot: rand(0, Math.PI*2),
      vrot: rand(-0.02, 0.02),
      size: rand(0.6,1.2),
      sway: rand(0.004, 0.012),
      phase: Math.random()*Math.PI*2
    });
  }

  for(let i=0;i<PCOUNT;i++) spawnPetal();

  function step(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<petals.length;i++){
      const p = petals[i];
      p.x += p.vx + Math.cos(p.phase + i*0.01)*0.6;
      p.y += p.vy;
      p.rot += p.vrot;
      p.phase += p.sway;

      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(p.size, p.size);
      ctx.drawImage(petalImg, -petalImg.width/2, -petalImg.height/2);
      ctx.restore();

      // recycle
      if(p.y > H + 50 || p.x < -60 || p.x > W + 60){
        petals.splice(i,1);
        i--;
        spawnPetal();
      }
    }
    requestAnimationFrame(step);
  }
  step();

  // tiny interactive flourish for Yes button
  document.addEventListener('click', (e) => {
    const yes = e.target.closest && e.target.closest('.btn-yes');
    if(yes){
      // spawn a little burst of petals from the button
      const rect = yes.getBoundingClientRect();
      for(let i=0;i<14;i++){
        petals.push({
          x: rect.left + rect.width/2 + rand(-10,10),
          y: rect.top + rect.height/2 + rand(-10,10),
          vx: rand(-1.2,1.2),
          vy: rand(-2.4,-0.6),
          rot: rand(0,Math.PI*2),
          vrot: rand(-0.08,0.08),
          size: rand(0.6,1.1),
          sway: rand(0.01,0.02),
          phase: Math.random()*Math.PI*2
        });
      }
    }
  });

  // accessibility: keyboard enter/space activates focused button
  document.addEventListener('keydown', (e) => {
    if((e.key === 'Enter' || e.key === ' ') && document.activeElement && document.activeElement.classList.contains('btn')){
      document.activeElement.click();
    }
  });

})();
