import gsap from 'gsap';

export function animateStartScreen() {
  const tl = gsap.timeline();

  tl.from('.start-screen h1', {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: 'back.out(1.7)',
  })
    .from(
      '.start-screen p',
      {
        duration: 0.8,
        opacity: 0,
        y: 20,
        ease: 'power2.out',
      },
      '-=0.3',
    )
    .from(
      '.start-screen .start-btn',
      {
        duration: 0.7,
        opacity: 0,
        y: 15,
        ease: 'power2.out',
      },
      '-=0.2',
    );

  gsap.to('.bg-heart', {
    y: '-=20',
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: { each: 0.3, from: 'random' },
  });
}

export function animateHeartFall(element, heartData, gameHeight, onMiss) {
  const fallDuration = 4 + Math.random() * 3;
  const swayAmount = 20 + Math.random() * 30;
  const swayDirection = Math.random() > 0.5 ? 1 : -1;
  const rotationAmount = (15 + Math.random() * 20) * (Math.random() > 0.5 ? 1 : -1);

  gsap.set(element, {
    x: heartData.x,
    y: heartData.y,
    scale: 0,
    rotation: Math.random() * 30 - 15,
  });

  const tl = gsap.timeline();

  tl.to(element, {
    scale: 1,
    duration: 0.3,
    ease: 'back.out(2)',
  });

  tl.to(
    element,
    {
      y: gameHeight + 80,
      duration: fallDuration,
      ease: 'power1.in',
      onComplete: onMiss,
    },
    0.1,
  );

  tl.to(
    element,
    {
      x: `+=${swayDirection * swayAmount}`,
      duration: fallDuration / 2,
      repeat: 1,
      yoyo: true,
      ease: 'sine.inOut',
    },
    0.1,
  );

  tl.to(
    element,
    {
      rotation: `+=${rotationAmount}`,
      duration: fallDuration,
      ease: 'sine.inOut',
    },
    0,
  );

  return tl;
}

export function animateHeartCatch(element, gameAreaEl, onComplete) {
  const tl = gsap.timeline({ onComplete });

  tl.to(element, {
    scale: 1.8,
    opacity: 0,
    y: '-=40',
    duration: 0.5,
    ease: 'power2.out',
  });

  const rect = element.getBoundingClientRect();
  const gameRect = gameAreaEl.getBoundingClientRect();
  const cx = rect.left - gameRect.left + rect.width / 2;
  const cy = rect.top - gameRect.top + rect.height / 2;

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.className = 'heart-particle';
    particle.textContent = ['💕', '💖', '💗', '✨', '💘', '💝'][i];
    gameAreaEl.appendChild(particle);

    gsap.set(particle, {
      position: 'absolute',
      left: cx,
      top: cy,
      fontSize: '16px',
      pointerEvents: 'none',
      zIndex: 50,
    });

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 120,
      y: -(40 + Math.random() * 80),
      opacity: 0,
      scale: 0.3,
      duration: 0.6 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => particle.remove(),
    });
  }
}

export function animateToast(el, stayDuration = 2.5) {
  gsap.killTweensOf(el);

  gsap.fromTo(
    el,
    { opacity: 0, y: -15 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
  );

  gsap.to(el, {
    opacity: 0,
    y: -10,
    duration: 0.4,
    delay: stayDuration,
    ease: 'power2.in',
  });
}

export function animateFinalScreen(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  gsap.set(el, { opacity: 1 });

  const tl = gsap.timeline();

  tl.fromTo(
    el,
    { opacity: 0 },
    { opacity: 1, duration: 0.5 },
  )
    .fromTo(
      `${selector} .final-photo`,
      { scale: 0, rotation: -10 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      },
    )
    .fromTo(
      `${selector} .final-title`,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.3',
    )
    .fromTo(
      `${selector} .final-text`,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.2',
    );

  gsap.to(`${selector} .floating-heart`, {
    y: '-=15',
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.2, from: 'random' },
    ease: 'sine.inOut',
  });

  return tl;
}
