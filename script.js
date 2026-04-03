const revealTargets = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.16,
  rootMargin: '0px 0px -6% 0px'
});

document.querySelectorAll('.reveal-group').forEach((group) => {
  const items = group.querySelectorAll('.reveal');
  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  });
});

const heroInitial = document.querySelectorAll('#hero .reveal');
heroInitial.forEach((item, index) => {
  item.style.transitionDelay = `${index * 80}ms`;
});

revealTargets.forEach((target) => {
  revealObserver.observe(target);
});

const photoInput = document.getElementById('photoInput');
if (photoInput) {
  photoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = document.getElementById('profilePhoto');
      img.src = ev.target.result;
      img.style.display = 'block';
      document.getElementById('photoPlaceholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
  });
}

function addTag(containerId) {
  const container = document.getElementById(containerId);
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.contentEditable = 'false';
  tag.textContent = '새 기술';
  container.appendChild(tag);
  tag.focus();
  const range = document.createRange();
  range.selectNodeContents(tag);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
}

function addProject() {
  const grid = document.getElementById('projects-grid');
  const card = document.createElement('div');
  card.className = 'project-card reveal visible';
  card.innerHTML = `
    <div class="project-thumb" contenteditable="false">🚀</div>
    <div class="project-body">
      <div class="project-name" contenteditable="false">새 프로젝트</div>
      <p class="project-desc" contenteditable="false">프로젝트 설명을 입력하세요.</p>
      <div class="project-tags"><span class="project-tag" contenteditable="false">기술스택</span></div>
      <div class="project-links">
        <a href="#" class="project-link" contenteditable="false">↗ GitHub</a>
        <a href="#" class="project-link" contenteditable="false">🔗 Demo</a>
      </div>
    </div>`;
  grid.appendChild(card);
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const themeToggle = document.getElementById('themeToggle');
const themeToggleLabel = themeToggle?.querySelector('.theme-toggle-label');
const themeToggleIcon = themeToggle?.querySelector('.theme-toggle-icon');

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('portfolio-theme', theme);
  } catch (e) {}

  if (themeToggleLabel) {
    themeToggleLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
  if (themeToggleIcon) {
    themeToggleIcon.textContent = theme === 'dark' ? '☀' : '☾';
  }
  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? '라이트모드 전환' : '다크모드 전환'
    );
  }
}

let savedTheme = 'light';
try {
  savedTheme = localStorage.getItem('portfolio-theme') || 'light';
} catch (e) {}
applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  const nextTheme =
    document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });

  navLinks.forEach((a) => {
    a.style.color =
      a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card) => {
  const thumb = card.querySelector('.project-thumb');
  if (!thumb) return;

  const projectLinks = [...card.querySelectorAll('.project-link')].filter((link) => {
    const href = link.getAttribute('href');
    return href && href !== '#';
  });

  if (!projectLinks.length) return;

  const demoLink = projectLinks.find((link) => /demo/i.test(link.textContent));
  const targetLink = demoLink || projectLinks[0];
  const href = targetLink.getAttribute('href');
  const isExternal = /^https?:/i.test(href);

  thumb.classList.add('is-clickable');
  thumb.setAttribute('role', 'link');
  thumb.setAttribute('tabindex', '0');
  thumb.setAttribute(
    'aria-label',
    `${card.querySelector('.project-name')?.textContent || '프로젝트'} 링크로 이동`
  );

  const openProjectLink = () => {
    if (!href || href === '#') return;

    if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  thumb.addEventListener('click', openProjectLink);
  thumb.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectLink();
    }
  });
});