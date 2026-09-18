/**
 * Personal Portfolio - Muhammad Huzaifa
 * Interactive scripts: Theme toggle, typing effect, mobile nav, active links, contact form & animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC YEAR IN FOOTER
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. THEME TOGGLE (DARK / LIGHT MODE)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve saved preference or check system color scheme
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
  } else if (!systemPrefersDark) {
    rootElement.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  // 3. HEADER SCROLL SHADOW
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // 4. MOBILE NAVIGATION MENU
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }

  if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) {
        navMenu.classList.remove('show-menu');
      }
    });
  });

  // 5. ACTIVE NAV LINK ON SCROLL (INTERSECTION OBSERVER)
  const sections = document.querySelectorAll('section[id]');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const sectionId = entry.target.getAttribute('id');
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active-link');
          } else {
            link.classList.remove('active-link');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

  // 6. HERO TYPING ANIMATION
  const typedTextSpan = document.getElementById('typed-text');
  if (typedTextSpan) {
    const textArray = [
      'scalable web applications.',
      'modern full-stack architectures.',
      'delightful user interfaces.',
      'cloud-native solutions.',
      'high-throughput APIs.'
    ];
    const typingDelay = 90;
    const erasingDelay = 50;
    const newTextDelay = 1800;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 300);
      }
    }

    typedTextSpan.textContent = '';
    setTimeout(type, 500);
  }

  // 7. STATS NUMBER COUNTER ANIMATION
  const statNumbers = document.querySelectorAll('.about-stat-number');
  let statsAnimated = false;

  const statsSection = document.getElementById('about');
  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            if (isNaN(target)) return;
            
            const duration = 1500;
            const startTime = performance.now();
            const suffix = stat.textContent.replace(/[0-9]/g, '');

            const updateCounter = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const easeOut = 1 - (1 - progress) * (1 - progress);
              const currentVal = Math.floor(easeOut * target);

              stat.textContent = currentVal + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                stat.textContent = target + suffix;
              }
            };

            requestAnimationFrame(updateCounter);
          });
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // 8. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  function showToast(message, isSuccess = true) {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    const toastIcon = toast.querySelector('.toast-icon');
    if (toastIcon) {
      if (isSuccess) {
        toastIcon.className = 'fa-solid fa-circle-check toast-icon';
        toast.style.borderColor = 'var(--accent-green)';
      } else {
        toastIcon.className = 'fa-solid fa-circle-exclamation toast-icon';
        toast.style.borderColor = '#ef4444';
      }
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields.', false);
        return;
      }

      // Simulate sending with button spinner / loading state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        contactForm.reset();
        showToast('Thank you! Your message has been sent successfully.', true);
      }, 1200);
    });
  }

  // 9. BACK TO TOP BUTTON VISIBILITY
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
      } else {
        scrollTopBtn.style.opacity = '0.7';
      }
    });
  }

  // 10. DYNAMIC TEAM DATA HYDRATION FROM data/team.json
  const teamGrid = document.getElementById('team-grid');
  if (teamGrid) {
    fetch('data/team.json')
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(members => {
        if (!Array.isArray(members) || members.length === 0) return;
        
        const avatarIcons = {
          rayan: 'fa-code',
          sufiyan: 'fa-server',
          sanan: 'fa-paintbrush',
          aimal: 'fa-bug-slash'
        };

        teamGrid.innerHTML = members.map(m => {
          const icon = avatarIcons[m.id] || 'fa-user-astronaut';
          const skillsHtml = (m.skills || []).map(s => `<span class="team-skill">${s}</span>`).join('');
          return `
            <div class="team-card" data-accent="${m.accentColor || 'cyan'}">
              <div class="team-card-header">
                <div class="team-avatar avatar-${m.accentColor || 'cyan'}">
                  <i class="fa-solid ${icon}"></i>
                </div>
                <div>
                  <h3 class="team-name">${m.name}</h3>
                  <span class="team-role">${m.role}</span>
                </div>
              </div>
              <p class="team-bio">${m.bio}</p>
              <div class="team-skills">${skillsHtml}</div>
              <div class="team-links">
                <a href="${m.page || `members/${m.id}.html`}" class="btn btn-primary team-btn">
                  <span>View Lab</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
                <a href="${m.github || '#'}" target="_blank" rel="noopener noreferrer" class="team-social" aria-label="GitHub">
                  <i class="fa-brands fa-github"></i>
                </a>
              </div>
            </div>
          `;
        }).join('');
      })
      .catch(() => {
        // Fallback to static cards already in HTML
      });
  }
});
