// ── Initialize icons ─────────────────────────
// Wrapped defensively: if the Lucide CDN is ever slow/blocked, a thrown
// ReferenceError here would otherwise kill this entire script (cursor,
// scroll animations, count-up numbers, neural canvas — everything below).
try {
  lucide.createIcons();
} catch (e) {
  console.warn('Lucide icons failed to load; continuing without icons.', e);
}

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // NEURAL NETWORK CANVAS BACKGROUND
  // =============================================
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');
  const NODES = 65;
  const DIST = 155;
  let nodes = [];
  let mouse = { x: -9999, y: -9999 };

  // Monochrome amber/copper duotone, matching a dark-server-room circuit
  // glow: mostly copper, some deep rust, a rare gold spark node.
  const NODE_PALETTE = [
    [255, 138, 76],  // copper / accent
    [255, 138, 76],
    [255, 138, 76],
    [209, 97, 31],   // deep rust / accent2
    [255, 209, 102], // gold spark, rarer
  ];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Node {
    constructor() {
      this.init();
    }

    init() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.38;
      this.vy = (Math.random() - 0.5) * 0.38;
      this.r = Math.random() * 1.8 + 0.8;
      this.phase = Math.random() * Math.PI * 2;
      this.color = NODE_PALETTE[Math.floor(Math.random() * NODE_PALETTE.length)];
    }

    update() {
      this.phase += 0.018;
      this.x += this.vx;
      this.y += this.vy;

      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d = Math.hypot(dx, dy);

      if (d < 110 && d > 0) {
        this.x += (dx / d) * 1.8;
        this.y += (dy / d) * 1.8;
      }

      if (this.x < 0 || this.x > canvas.width) {
        this.vx *= -1;
      }

      if (this.y < 0 || this.y > canvas.height) {
        this.vy *= -1;
      }
    }

    draw() {
      const a = 0.38 + Math.sin(this.phase) * 0.18;

      const [r, g, b] = this.color;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < NODES; i++) {
    nodes.push(new Node());
  }

  function drawEdges() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {

        const d = Math.hypot(
          nodes[i].x - nodes[j].x,
          nodes[i].y - nodes[j].y
        );

        if (d < DIST) {
          const a = (1 - d / DIST) * 0.18;
          const ci = nodes[i].color;
          const cj = nodes[j].color;
          const r = Math.round((ci[0] + cj[0]) / 2);
          const g = Math.round((ci[1] + cj[1]) / 2);
          const b = Math.round((ci[2] + cj[2]) / 2);

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(n => {
      n.update();
      n.draw();
    });

    drawEdges();

    requestAnimationFrame(animate);
  })();

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });


  // =============================================
  // PRELOADER
  // =============================================
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('hidden');
      }
    }, 700);
  });


  // =============================================
  // CUSTOM CURSOR
  // =============================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  let fx = 0;
  let fy = 0;
  let cx = 0;
  let cy = 0;

  document.addEventListener('mousemove', e => {

    cx = e.clientX;
    cy = e.clientY;

    if (cursor) {
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
    }

  });

  (function animateCursor() {

    fx += (cx - fx) * 0.1;
    fy += (cy - fy) * 0.1;

    if (follower) {
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
    }

    requestAnimationFrame(animateCursor);

  })();


  document.querySelectorAll('.hover-target, a, button').forEach(el => {

    el.addEventListener('mouseenter', () => {

      if (cursor) {
        cursor.classList.add('hovering');
      }

      if (follower) {
        follower.classList.add('hovering');
      }

    });

    el.addEventListener('mouseleave', () => {

      if (cursor) {
        cursor.classList.remove('hovering');
      }

      if (follower) {
        follower.classList.remove('hovering');
      }

    });

  });


  // =============================================
  // NAME SLIDE
  // =============================================
  const nameSlide = document.getElementById('slide-name');

  if (nameSlide) {

    nameSlide.addEventListener('click', () => {

      const hero = document.getElementById('hero');

      if (hero) {
        hero.scrollIntoView({
          behavior: 'smooth'
        });
      }

    });

  }


  // =============================================
  // TYPING ANIMATION
  // =============================================
  const roles = [
    'Python Developer',
    'AI Engineer in Progress',
    'Problem Solver',
    'NLP Enthusiast',
    'Deep Learning Nerd'
  ];

  let ri = 0;
  let ci = 0;
  let del = false;

  const typedEl = document.getElementById('typed-role');

  function type() {

    if (!typedEl) {
      return;
    }

    const cur = roles[ri];

    if (del) {
      ci--;
    } else {
      ci++;
    }

    typedEl.textContent = cur.slice(0, ci);

    let spd = del ? 55 : 95;

    if (!del && ci === cur.length) {

      spd = 2200;
      del = true;

    } else if (del && ci === 0) {

      del = false;
      ri = (ri + 1) % roles.length;
      spd = 400;

    }

    setTimeout(type, spd);
  }

  type();


  // =============================================
  // TOP NAV + SIDE DOTS
  // =============================================
  const topNav = document.getElementById('top-nav');
  const sdots = document.querySelectorAll('.sdot');
  const slides = document.querySelectorAll('.slide');

  const sectionObs = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.id;

      if (topNav) {
        topNav.classList.toggle(
          'visible',
          id !== 'slide-name'
        );
      }

      sdots.forEach(d => {

        d.classList.toggle(
          'active',
          d.dataset.target === id
        );

      });

    });

  }, {
    threshold: 0.38
  });


  slides.forEach(s => {
    sectionObs.observe(s);
  });


  sdots.forEach(dot => {

    dot.addEventListener('click', () => {

      const t = document.getElementById(
        dot.dataset.target
      );

      if (t) {

        t.scrollIntoView({
          behavior: 'smooth'
        });

      }

    });

  });


  // =============================================
  // SCROLL FADE-UP
  // =============================================
  const fadeEls = document.querySelectorAll('.fade-up');

  const fadeObs = new IntersectionObserver(entries => {

    entries.forEach(e => {

      if (e.isIntersecting) {

        e.target.classList.add('visible');

        fadeObs.unobserve(e.target);

      }

    });

  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });


  fadeEls.forEach(el => {
    fadeObs.observe(el);
  });


  // =============================================
  // PROJECT STACK SCROLL ANIMATION
  // =============================================
  const stackItems =
    document.querySelectorAll('.proj-sticky-item');

  function updateStack() {

    stackItems.forEach((item, i) => {

      const card = item.querySelector('.proj-card');
      const next = stackItems[i + 1];

      if (!card || !next) {
        return;
      }

      const nr = next.getBoundingClientRect();

      const threshold =
        window.innerHeight * 0.72;

      if (nr.top < threshold) {

        const prog = Math.min(
          1,
          Math.max(
            0,
            (threshold - nr.top) /
            (window.innerHeight * 0.48)
          )
        );

        card.style.transform =
          `scale(${1 - prog * 0.04})`;

        card.style.opacity =
          String(1 - prog * 0.45);

      } else {

        card.style.transform = 'scale(1)';
        card.style.opacity = '1';

      }

    });

  }

  window.addEventListener(
    'scroll',
    updateStack,
    {
      passive: true
    }
  );


  // =============================================
  // LANGUAGE BAR ANIMATION
  // =============================================
  const langObs = new IntersectionObserver(entries => {

    entries.forEach(e => {

      if (e.isIntersecting) {

        e.target
          .querySelectorAll('.lang-fill')
          .forEach(bar => {

            bar.style.animation = 'none';

            void bar.offsetWidth;

            bar.style.animation = '';

          });

        langObs.unobserve(e.target);

      }

    });

  }, {
    threshold: 0.3
  });


  document
    .querySelectorAll('.lang-bars')
    .forEach(el => langObs.observe(el));


  // =============================================
  // TILT ON HOVER
  // =============================================
  document
    .querySelectorAll('.tilt-card')
    .forEach(card => {

      let rect;

      card.addEventListener('mouseenter', () => {

        rect = card.getBoundingClientRect();

      });

      card.addEventListener('mousemove', e => {

        if (!rect) {
          rect = card.getBoundingClientRect();
        }

        const px =
          (e.clientX - rect.left) /
          rect.width;

        const py =
          (e.clientY - rect.top) /
          rect.height;

        const rx = (0.5 - py) * 8;
        const ry = (px - 0.5) * 10;

        card.style.transform =
          `perspective(800px)
           rotateX(${rx}deg)
           rotateY(${ry}deg)
           translateY(-4px)`;

      });

      card.addEventListener('mouseleave', () => {

        card.style.transform =
          'perspective(800px) rotateX(0) rotateY(0) translateY(0)';

      });

    });


  // =============================================
  // MAGNETIC BUTTONS
  // =============================================
  document
    .querySelectorAll('.magnetic-btn')
    .forEach(btn => {

      btn.addEventListener('mousemove', e => {

        const rect =
          btn.getBoundingClientRect();

        const mx =
          e.clientX -
          (rect.left + rect.width / 2);

        const my =
          e.clientY -
          (rect.top + rect.height / 2);

        btn.style.transform =
          `translate(
            ${mx * 0.25}px,
            ${my * 0.35}px
          )`;

      });

      btn.addEventListener('mouseleave', () => {

        btn.style.transform =
          'translate(0,0)';

      });

    });


  // =============================================
  // ANIMATED COUNT-UP NUMBERS
  // =============================================
  const countEls =
    document.querySelectorAll('.count-up');

  const countObs =
    new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }

        const el = entry.target;

        const target =
          parseFloat(
            el.dataset.countTarget || '0'
          );

        const decimals =
          parseInt(
            el.dataset.countDecimals || '0',
            10
          );

        const suffix =
          el.dataset.countSuffix || '';

        const dur = 1400;

        const start = performance.now();

        function step(now) {

          const p =
            Math.min(
              1,
              (now - start) / dur
            );

          const eased =
            1 - Math.pow(1 - p, 3);

          const val =
            target * eased;

          el.textContent =
            val.toFixed(decimals) +
            suffix;

          if (p < 1) {

            requestAnimationFrame(step);

          } else {

            el.textContent =
              target.toFixed(decimals) +
              suffix;

          }

        }

        requestAnimationFrame(step);

        countObs.unobserve(el);

      });

    }, {
      threshold: 0.5
    });


  countEls.forEach(el => {
    countObs.observe(el);
  });

});


// =============================================
// LIVE GITHUB + LEETCODE PROGRESS
// =============================================

async function loadProgressData() {

  try {

    const [
      githubResponse,
      leetcodeResponse
    ] = await Promise.all([

      fetch('/api/github'),

      fetch('/api/leetcode')

    ]);


    if (!githubResponse.ok) {

      throw new Error(
        'GitHub API request failed'
      );

    }


    if (!leetcodeResponse.ok) {

      throw new Error(
        'LeetCode API request failed'
      );

    }


    const github =
      await githubResponse.json();

    const leetcode =
      await leetcodeResponse.json();


    // =============================================
    // LEETCODE DATA
    // =============================================

    const leetcodeSolved =
      document.getElementById(
        'leetcode-solved'
      );

    const leetcodeEasy =
      document.getElementById(
        'leetcode-easy'
      );

    const leetcodeMedium =
      document.getElementById(
        'leetcode-medium'
      );

    const leetcodeHard =
      document.getElementById(
        'leetcode-hard'
      );

    const leetcodeProgressText =
      document.getElementById(
        'leetcode-progress-text'
      );


    if (leetcodeSolved) {

      leetcodeSolved.textContent =
        leetcode.solved.all;

    }


    if (leetcodeEasy) {

      leetcodeEasy.textContent =
        leetcode.solved.easy;

    }


    if (leetcodeMedium) {

      leetcodeMedium.textContent =
        leetcode.solved.medium;

    }


    if (leetcodeHard) {

      leetcodeHard.textContent =
        leetcode.solved.hard;

    }


    if (leetcodeProgressText) {

      leetcodeProgressText.textContent =
        `${leetcode.solved.all} solved • ${leetcode.streak} day streak`;

    }


    // Automatically update LeetCode links
    document
      .querySelectorAll(
        'a[href*="leetcode.com"]'
      )
      .forEach(link => {

        link.href =
          leetcode.profileUrl;

      });


    // =============================================
    // GITHUB DATA
    // =============================================

    const githubRepos =
      document.getElementById(
        'github-repos'
      );

    const githubFollowers =
      document.getElementById(
        'github-followers'
      );

    const githubStars =
      document.getElementById(
        'github-stars'
      );


    if (githubRepos) {

      githubRepos.textContent =
        github.publicRepos;

    }


    if (githubFollowers) {

      githubFollowers.textContent =
        github.followers;

    }


    if (githubStars) {

      githubStars.textContent =
        github.totalStars;

    }


    // =============================================
    // RECENT GITHUB REPOSITORIES
    // =============================================

    const repoContainer =
      document.getElementById(
        'github-repositories'
      );


    if (repoContainer) {

      repoContainer.innerHTML = '';


      github.repositories
        .slice(0, 4)
        .forEach(repo => {

          const repoElement =
            document.createElement('a');


          repoElement.href =
            repo.url;

          repoElement.target =
            '_blank';

          repoElement.rel =
            'noopener noreferrer';

          repoElement.className =
            'github-repo';


          repoElement.innerHTML = `

            <div class="github-repo-info">

              <strong>
                ${repo.name}
              </strong>

              <small>
                ${repo.language || 'Project'}
              </small>

            </div>

            <span>
              ⭐ ${repo.stars}
            </span>

          `;


          repoContainer.appendChild(
            repoElement
          );

        });

    }


    // =============================================
    // STATUS
    // =============================================

    const githubStatus =
      document.getElementById(
        'github-activity-status'
      );


    if (githubStatus) {

      githubStatus.textContent =
        'Updated automatically';

    }


  } catch (error) {

    console.error(
      'Progress data error:',
      error
    );


    const githubStatus =
      document.getElementById(
        'github-activity-status'
      );


    const leetcodeProgressText =
      document.getElementById(
        'leetcode-progress-text'
      );


    if (githubStatus) {

      githubStatus.textContent =
        'Live data unavailable';

    }


    if (leetcodeProgressText) {

      leetcodeProgressText.textContent =
        'Live data unavailable';

    }

  }

}


// Start live progress loading
loadProgressData();


// =============================================
// SHOW ALL PROJECTS TOGGLE
// =============================================
(function initShowAllProjects() {
  const btn = document.getElementById('show-all-projects-btn');
  const extra = document.getElementById('extra-projects');
  if (!btn || !extra) return;

  btn.addEventListener('click', () => {
    const isHidden = extra.hasAttribute('hidden');

    if (isHidden) {
      extra.removeAttribute('hidden');
      btn.classList.add('is-open');
      btn.querySelector('span').textContent = 'Show Less';
      // Re-run icon render for any icons inside the newly revealed cards
      try { lucide.createIcons(); } catch (e) {}
    } else {
      extra.setAttribute('hidden', '');
      btn.classList.remove('is-open');
      btn.querySelector('span').textContent = 'Show All Projects';
      extra.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  });
})();
