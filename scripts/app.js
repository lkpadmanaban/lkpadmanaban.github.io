/**
 * LOKESH KUMAR PADMANABAN - EXECUTIVE PORTFOLIO INTERACTION ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvas();
  initHeroArchVisualizer();
  initDomainTabs();
  initEngineRail();
  initAgentFilters();
  initMobileNav();
  initScrollSpy();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark / Light with LocalStorage)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Retrieve stored theme or default to system/dark
  const storedTheme = localStorage.getItem('lkp_theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.classList.contains('light') ? 'light' : 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      html.classList.remove('dark');
      html.classList.add('light');
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    }
    localStorage.setItem('lkp_theme', theme);
  }
}

/* ==========================================================================
   2. INTERACTIVE BACKGROUND CANVAS (Neural Network Constellation)
   ========================================================================== */
function initCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  // Only show canvas in dark mode — keep light mode clean and warm
  if (document.documentElement.classList.contains('light')) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
    });
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.classList.contains('light');
    const nodeColor = isLight ? 'rgba(2, 132, 199, 0.45)' : 'rgba(0, 240, 255, 0.4)';
    const lineColor = isLight ? 'rgba(2, 132, 199, ' : 'rgba(0, 210, 255, ';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Connect with nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / 130) * (isLight ? 0.12 : 0.18);
          ctx.strokeStyle = lineColor + alpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Mouse attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          const alpha = (1 - dist / 160) * 0.25;
          ctx.strokeStyle = lineColor + alpha + ')';
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. HERO ARCHITECTURE VISUALIZER NODES
   ========================================================================== */
function initHeroArchVisualizer() {
  const nodes = document.querySelectorAll('.arch-node');
  const infoPanel = document.getElementById('nodeInfoPanel');

  const nodeDetails = {
    presales: {
      title: '🎯 Presales Discovery & Strategy (80% Scope)',
      desc: 'Leading high-level C-suite workshops, diagnosing technical debt, architecting winning SOWs/RFPs, and closing six- to seven-figure contracts through live technical demonstrations.'
    },
    ai: {
      title: '🤖 Azure AI Foundry, Copilot Studio & Multi-Agent Swarms',
      desc: 'Deploying autonomous ReAct agents, Model Context Protocol (MCP) tool servers, hybrid RAG pipelines, and deterministic guardrails into regulated enterprise environments.'
    },
    data: {
      title: '📊 Microsoft Fabric, OneLake & Real-Time Analytics',
      desc: 'Building modern Medallion Delta Lake foundations and vector stores that feed enterprise AI agents and BI dashboards with zero data replication.'
    },
    cloud: {
      title: '☁️ Enterprise Landing Zones & Hybrid Cloud Infrastructure',
      desc: 'Designing multi-subscription Azure/AWS landing zones, Azure Arc hybrid setups, and automated Terraform CI/CD pipelines yielding 25% operational efficiency gains.'
    },
    security: {
      title: '🛡️ Zero-Trust Security, Entra ID & Regulated Compliance',
      desc: 'Implementing Conditional Access, RBAC envelopes, Alert Logic XDR/MDR, and SIEM monitoring compliant with SOC 2, HIPAA, and Canadian banking standards.'
    }
  };

  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const type = node.dataset.node;
      if (nodeDetails[type]) {
        infoPanel.innerHTML = `
          <div class="node-info-title">${nodeDetails[type].title}</div>
          <p class="node-info-desc">${nodeDetails[type].desc}</p>
        `;
        nodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
      }
    });

    node.addEventListener('click', () => {
      const type = node.dataset.node;
      if (nodeDetails[type]) {
        infoPanel.innerHTML = `
          <div class="node-info-title">${nodeDetails[type].title}</div>
          <p class="node-info-desc">${nodeDetails[type].desc}</p>
        `;
        nodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. DOMAIN TABS (AI, Data, Cloud, Networking, Security, DevOps)
   ========================================================================== */
function initDomainTabs() {
  const tabBtns = document.querySelectorAll('.domain-tab-btn');
  const panels = document.querySelectorAll('.domain-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDomain = btn.dataset.domain;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(`domain-${targetDomain}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. SOLUTIONS & PRESALES ENGINE RAIL
   ========================================================================== */
function initEngineRail() {
  const phaseBtns = document.querySelectorAll('.engine-phase-btn');
  const phaseContents = document.querySelectorAll('.phase-content');

  phaseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const phase = btn.dataset.phase;

      phaseBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      phaseContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetContent = document.getElementById(`phase-${phase}-content`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. AGENT MATRIX FILTERS
   ========================================================================== */
function initAgentFilters() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const agentCards = document.querySelectorAll('.agent-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;

      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      agentCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileBtn || !drawer) return;

  mobileBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    drawer.classList.toggle('open', !isOpen);
    mobileBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   8. SCROLL SPY & FORM HANDLER
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const interest = document.getElementById('interest').value;
  const message = document.getElementById('message').value;

  const subject = encodeURIComponent(`Enterprise Architecture Discovery: ${interest} - from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nFocus Area: ${interest}\n\nProject Scope:\n${message}`);

  const mailtoUrl = `mailto:lokeshkumarpadmanaban4@gmail.com?subject=${subject}&body=${body}`;
  
  const successAlert = document.getElementById('formSuccess');
  if (successAlert) {
    successAlert.style.display = 'block';
  }

  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 600);
}
window.handleContactSubmit = handleContactSubmit;
