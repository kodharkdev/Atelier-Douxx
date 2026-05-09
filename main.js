function initHeader() {
    const header = document.querySelector('header#header');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (header) header.classList.toggle('scrolled', y > 550);
    }, {passive: true});
}

function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        // Stagger siblings so they don't all appear at once
        const siblings = Array.from(
          e.target.parentElement?.querySelectorAll('.reveal, .reveal-scale') || []
        );
        const idx = siblings.indexOf(e.target);
        setTimeout(() => e.target.classList.add('in'), idx * 80);
        obs.unobserve(e.target); // stop watching once revealed
      }
    });
  }, { threshold: .12 }); // triggers when 12% of element is visible

  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => obs.observe(el));
};

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count) // reads the data-count number
      if (!target) return;
         // grab whatever comes after the number in the original text
         const originalText = el.textContent.trim()
         const suffix = originalText.replace(/[\d.]+/, '').trim();

      let start = 0;
      const dur = 1500; // 2 seconds to count up
      const tick = (now) => {
        if (!start) start = now;
        const p = Math.min((now - start) / dur, 1); // progress 0 to 1
         el.textContent = Math.floor(p * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: .5 });

  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

function initMenu() {
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mob-menu');
  const cls = document.getElementById('mob-close');
  if (!ham || !mob) return;

  const open = () => {
    mob.classList.add('on');
    ham.classList.add('open');
    ham.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent page scrolling
  };

  const close = () => {
    mob.classList.remove('on');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  ham.addEventListener('click', open);
  if (cls) cls.addEventListener('click', close);

  // Close when any nav link is clicked
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close when clicking outside the menu content
  mob.addEventListener('click', e => { if (e.target === mob) close(); });
};

//  small paticles on the screen

  function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  // Make canvas match window size
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Create 100 particles with random positions/speeds/sizes
  for (let i = 0; i < 100; i++) {
    pts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r:  Math.random() * 1.2 + .3,   // radius
      vx: (Math.random() - .5) * .18,  // horizontal speed
      vy: (Math.random() - .5) * .18,  // vertical speed
      o:  Math.random() * .4 + .1      // opacity
    });
  }

  (function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move and draw each particle
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      // Wrap around edges
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.o})`;
      ctx.fill();
    });

    // Draw lines between particles that are close together
    
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          // Line fades out the farther apart they are
          ctx.strokeStyle = `rgba(201,168,76,${.04 * (1 - d / 120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw); // loop forever
  })();
}

function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    const handler = () => {
      const fi   = q.parentElement;        // the .faq-item
      const open = fi.classList.contains('open');

      // Close all items first
      document.querySelectorAll('.faq-item').forEach(f => {
        f.classList.remove('open');
        f.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });

      // If it wasn't open, open it now
      if (!open) {
        fi.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    };

    q.addEventListener('click', handler);
    // Also works with keyboard
    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

  // booking section 


    function initBooking() {
        document.querySelector('.btn').addEventListener('click', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim()
      const email = document.getElementById('email').value.trim()
      const date = document.getElementById('date').value.trim()
      const category = document.getElementById('category').value.trim()
      const message = document.getElementById('message').value.trim()

      if (!name) {
        alert('Please enter your name.');
        return;
      }

      if (!email) {
        alert('Please enter your Email address.');
        return;
      }
      
      // to check if the email is valid 

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert('Please enter a valid email address.');
          return;
        }

        if (!date) {
          alert('Please select a date.')
          return;
        }

        if (!category || category === 'Select a service') {
          alert('Please select a service.')
          return;
        }

        alert('Your booking has been submitted! We will get back to you shortly.')

      document.querySelector('form').reset();
      
    });
    }

    // Newsletter
    function initNewsletter() {
        document.getElementById('submit').addEventListener('click', function(e) {
          e.preventDefault();

          const newsletterEmail = document.getElementById('newsletterEmail').value.trim()

          if(!newsletterEmail) {
            alert('Please enter your email address.')
            return;
          }
          const newsletterEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!newsletterEmailRegex.test(newsletterEmail)) {
              alert('Please enter a valid email address.');
              return;
            }  

            alert('Thank you for subscribing!');

          document.getElementById('newsletterEmail').value = '';

        })

    };
  

  // To load all functions
document.addEventListener('DOMContentLoaded', () => {

    initHeader()
    initReveal()
    initCounters()
    initMenu()
    initHeroCanvas()
    initFaq()
    initBooking()
    initNewsletter()

    });

      
    

      