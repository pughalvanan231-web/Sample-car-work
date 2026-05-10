// =============================================
// ENGINE CARE SOLUTIONS - Premium Auto Service
// =============================================

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = current;

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let activeId = 'hero';
  sections.forEach(sec => {
    const top = sec.offsetTop - 150;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      activeId = sec.id;
    }
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + activeId);
  });
});

// ---- THREE.JS 3D HERO BACKGROUND ----
function initThreeScene() {
  const container = document.getElementById('hero3d');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // ---- Lights ----
  const ambient = new THREE.AmbientLight(0x222244, 0.5);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0x0088ff, 2);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x0044ff, 1);
  fillLight.position.set(-3, -2, 4);
  scene.add(fillLight);

  const pointLight = new THREE.PointLight(0x00b4ff, 3, 20);
  pointLight.position.set(0, 2, 4);
  scene.add(pointLight);

  // ---- Build Low-Poly 3D Car ----
  const carGroup = new THREE.Group();

  function makeMat(color, emissive, metalness, roughness, opacity, emissiveIntensity) {
    return new THREE.MeshPhysicalMaterial({
      color, emissive: emissive || 0x000000,
      emissiveIntensity: emissiveIntensity || 0,
      metalness: metalness || 0.8, roughness: roughness || 0.2,
      transparent: true, opacity: opacity || 1,
      clearcoat: 0.2, clearcoatRoughness: 0.3,
    });
  }

  // Car body
  const bodyMat = makeMat(0x0a1628, 0x0044ff, 0.9, 0.15, 0.9, 0.08);
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.55, 1.3), bodyMat);
  body.position.y = 0.45;
  carGroup.add(body);

  // Body accent stripe
  const stripeMat = makeMat(0x00b4ff, 0x00b4ff, 0.5, 0.3, 0.5, 0.15);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 1.31), stripeMat);
  stripe.position.set(0, 0.73, 0);
  carGroup.add(stripe);

  // Cabin
  const cabinMat = makeMat(0x0d1f3c, 0x0066ff, 0.7, 0.3, 0.85, 0.05);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 1.15), cabinMat);
  cabin.position.set(-0.2, 0.92, 0);
  carGroup.add(cabin);

  // Windshield (glowing glass)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x00b4ff, emissive: 0x0088ff, emissiveIntensity: 0.1,
    metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.25,
    clearcoat: 1.0, clearcoatRoughness: 0.05, side: THREE.DoubleSide,
  });
  const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.32), glassMat);
  windshield.position.set(-0.2, 0.92, 0.58);
  carGroup.add(windshield);

  const rearGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.32), glassMat);
  rearGlass.position.set(-0.2, 0.92, -0.58);
  carGroup.add(rearGlass);

  // Neon underglow
  const glowMat = new THREE.MeshPhysicalMaterial({
    color: 0x00b4ff, emissive: 0x00b4ff, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.4, side: THREE.DoubleSide,
  });
  const underglow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.9), glowMat);
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.set(0, 0.05, 0);
  carGroup.add(underglow);

  // Headlights
  const headlightMat = new THREE.MeshPhysicalMaterial({
    color: 0x88ddff, emissive: 0x00b4ff, emissiveIntensity: 2,
    transparent: true, opacity: 0.8,
  });
  const hlPositions = [[0.8, 0.5, 0.5], [0.8, 0.5, -0.5]];
  hlPositions.forEach(pos => {
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), headlightMat);
    hl.position.set(pos[0], pos[1], pos[2]);
    carGroup.add(hl);
  });

  // Taillights
  const tailMat = new THREE.MeshPhysicalMaterial({
    color: 0xff2200, emissive: 0xff0044, emissiveIntensity: 0.6,
    transparent: true, opacity: 0.7,
  });
  const tlPositions = [[-1.2, 0.5, 0.5], [-1.2, 0.5, -0.5]];
  tlPositions.forEach(pos => {
    const tl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), tailMat);
    tl.position.set(pos[0], pos[1], pos[2]);
    carGroup.add(tl);
  });

  // Wheels
  const wheelMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111, metalness: 0.9, roughness: 0.3,
  });
  const rimMat = new THREE.MeshPhysicalMaterial({
    color: 0x334466, emissive: 0x0044ff, emissiveIntensity: 0.08,
    metalness: 0.9, roughness: 0.2,
  });
  const wheelPositions = [
    [0.9, 0.2, 0.8], [0.9, 0.2, -0.8],
    [-0.9, 0.2, 0.8], [-0.9, 0.2, -0.8],
  ];
  const wheels = [];
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 16), wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos[0], pos[1], pos[2]);
    carGroup.add(wheel);
    wheels.push(wheel);

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.15, 8), rimMat);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(pos[0], pos[1], pos[2]);
    carGroup.add(rim);
  });

  // Hood intake scoop (floating neon)
  const scoopMat = new THREE.MeshPhysicalMaterial({
    color: 0x00b4ff, emissive: 0x00b4ff, emissiveIntensity: 0.3,
    metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.6,
  });
  const scoop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.4), scoopMat);
  scoop.position.set(0.6, 0.8, 0);
  carGroup.add(scoop);

  // Exhaust pipes
  const exhaustMat = makeMat(0x222233, 0x0044ff, 0.9, 0.5, 0.7, 0.05);
  [-0.35, 0.35].forEach(z => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.2, 8), exhaustMat);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(-1.55, 0.15, z);
    carGroup.add(pipe);
  });

  carGroup.position.x = -0.5;
  carGroup.position.y = -0.3;
  scene.add(carGroup);

  // ---- Floating car parts ----
  const parts = [];
  const partGeos = [
    new THREE.TorusGeometry(0.15, 0.05, 8, 12),
    new THREE.CylinderGeometry(0.06, 0.08, 0.2, 6),
    new THREE.BoxGeometry(0.08, 0.08, 0.25),
    new THREE.SphereGeometry(0.08, 6, 6),
    new THREE.TorusKnotGeometry(0.1, 0.04, 32, 6),
    new THREE.CylinderGeometry(0.04, 0.1, 0.12, 5),
  ];

  for (let i = 0; i < 40; i++) {
    const geo = partGeos[i % partGeos.length];
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL(0.58 + Math.random() * 0.08, 0.8, 0.5 + Math.random() * 0.3),
      emissive: new THREE.Color().setHSL(0.58, 0.6, 0.2),
      emissiveIntensity: 0.2,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.5 + Math.random() * 0.3,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const radius = 2.5 + Math.random() * 3.5;
    mesh.position.set(
      -0.5 + Math.cos(theta) * Math.sin(phi) * radius,
      Math.sin(theta) * Math.sin(phi) * radius,
      Math.cos(phi) * radius
    );
    mesh.userData = {
      speed: 0.1 + Math.random() * 0.3,
      rotSpeed: 0.005 + Math.random() * 0.02,
      axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed: 0.2 + Math.random() * 0.4,
      initialPos: mesh.position.clone(),
    };
    scene.add(mesh);
    parts.push(mesh);
  }

  // ---- Particles ----
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    sizes[i] = 0.02 + Math.random() * 0.06;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00b4ff,
    size: 0.05,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Mouse tracking ----
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseX = x * 0.5;
    mouseY = y * 0.3;
  });

  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const x = (touch.clientX / window.innerWidth) * 2 - 1;
    const y = -(touch.clientY / window.innerHeight) * 2 + 1;
    mouseX = x * 0.5;
    mouseY = y * 0.3;
  }, { passive: true });

  // ---- Animation loop ----
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate car
    carGroup.rotation.y = time * 0.12 + targetX * 0.5;
    carGroup.rotation.x = Math.sin(time * 0.08) * 0.05 + targetY * 0.3;
    carGroup.position.y = -0.3 + Math.sin(time * 0.4) * 0.08;

    // Spin wheels
    wheels.forEach(w => {
      w.rotation.x += 0.03;
    });

    // Pulse lights
    pointLight.intensity = 2.5 + Math.sin(time * 0.5) * 0.8;
    headlightMat.emissiveIntensity = 1.5 + Math.sin(time * 0.7) * 0.8;
    tailMat.emissiveIntensity = 0.4 + Math.sin(time * 0.5) * 0.3;
    glowMat.emissiveIntensity = 1.0 + Math.sin(time * 0.6) * 0.8;

    // Float parts
    parts.forEach((part, i) => {
      const ud = part.userData;
      const offset = Math.sin(time * ud.floatSpeed + ud.floatOffset) * 0.4;
      part.position.copy(ud.initialPos);
      part.position.y += offset;
      part.rotateOnWorldAxis(ud.axis, ud.rotSpeed);
    });

    // Rotate particles slowly
    particles.rotation.y = time * 0.01;

    // Camera subtle movement
    camera.position.x = targetX * 1.5;
    camera.position.y = targetY * 1.0;
    camera.lookAt(-0.5, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // ---- Resize ----
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// ---- Load Three.js dynamically ----
function loadThree() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = initThreeScene;
  document.head.appendChild(script);
}

// Use requestIdleCallback or DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => loadThree());
} else {
  loadThree();
}

// ---- PARTICLES IN HERO (CSS particles) ----
function createHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const span = document.createElement('span');
    span.style.left = Math.random() * 100 + '%';
    span.style.animationDuration = (6 + Math.random() * 8) + 's';
    span.style.animationDelay = Math.random() * 8 + 's';
    span.style.width = span.style.height = (2 + Math.random() * 4) + 'px';
    container.appendChild(span);
  }
}
createHeroParticles();

// ---- SCROLL ANIMATIONS (AOS-style) ----
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay');
        if (delay) {
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
        } else {
          entry.target.classList.add('aos-animate');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ---- COUNTER ANIMATION ----
function initCounters() {
  const counters = document.querySelectorAll('.counter, .hero-stat .stat-num[data-target]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetNum = parseInt(el.getAttribute('data-target'));
        if (isNaN(targetNum)) return;
        let current = 0;
        const duration = 2000;
        const steps = 60;
        const increment = targetNum / steps;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current = Math.min(Math.round(increment * step), targetNum);
          el.textContent = current.toLocaleString();
          if (step >= steps) {
            el.textContent = targetNum.toLocaleString();
            clearInterval(timer);
          }
        }, duration / steps);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

// ---- 3D TILT EFFECT ON SERVICE CARDS ----
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        perspective(1000px)
        rotateY(${x * 12}deg)
        rotateX(${-y * 12}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
    });
  });
}

// ---- TESTIMONIAL CAROUSEL ----
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const dots = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-card');
  let current = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });

  function goTo(index) {
    current = index;
    if (current < 0) current = slides.length - 1;
    if (current >= slides.length) current = 0;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto play
  let autoPlay = setInterval(() => goTo(current + 1), 5000);

  const carousel = document.querySelector('.testimonial-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
  carousel.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  });

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(current + 1);
      else goTo(current - 1);
    }
    isDragging = false;
  }, { passive: true });
}

// ---- INIT ALL ----
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounters();
  initTiltCards();
  initCarousel();
});

// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
