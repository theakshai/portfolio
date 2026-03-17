const grid = document.getElementById('grid');

/**
 * Generates the background grid cells
 */
function createGrid() {
  if (!grid) return;
  grid.innerHTML = '';
  const cellSize = 40;
  const cols = Math.ceil(window.innerWidth / cellSize);
  const rows = Math.ceil(window.innerHeight / cellSize);
  const totalItems = Math.ceil(cols / 2) * Math.ceil(rows / 2);

  for (let i = 0; i < totalItems; i++) {
    const div = document.createElement('div');
    div.className = 'title-item';
    grid.appendChild(div);
  }
}

// Initialization
createGrid();
window.addEventListener('resize', createGrid);

/**
 * Data for Projects and Blogs
 */
const projectsData = [
  {
    title: "DevOps Pipeline",
    description: "Automated CI/CD pipeline for cloud-native applications.",
    file: "devops-pipeline.md"
  },
  {
    title: "AI Infra Monitor",
    description: "Real-time monitoring for distributed AI training workloads.",
    file: "ai-infra-monitor.md"
  }
];

const blogsData = [
  {
    title: "Hello World",
    description: "March 17, 2026",
    file: "hello-world.md"
  }
];

/**
 * Navigation and content switching with smooth transitions
 */
const appWrapper = document.querySelector('.app-wrapper');
const mainContent = document.getElementById('main-content');
const brandLink = document.querySelector('.brand');
const sectionLinks = document.querySelectorAll('.nav-right a');

// Store original home content
const homeContent = mainContent.innerHTML;

/**
 * Renders a list of items (Projects or Blogs)
 */
function renderList(data, type) {
  return `
    <div class="section-container">
      <div class="grid-list">
        ${data.map(item => `
          <div class="data-item">
            <h3 class="clickable" onclick="loadPost('${type}', '${item.file}')">${item.title}</h3>
            <p>${item.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Fetches and renders a single post (Project or Blog)
 */
async function loadPost(type, filename) {
  try {
    const response = await fetch(`${type}/${filename}`);
    const text = await response.text();
    
    let content = text;
    if (filename.endsWith('.md')) {
      content = marked.parse(text);
    }
    
    mainContent.innerHTML = `
      <div class="section-container blog-post">
        <a href="#${type}" class="back-link" onclick="event.preventDefault(); navigateTo('${type}')"><- back to ${type}</a>
        <div class="markdown-body">
          ${content}
        </div>
      </div>
    `;
    window.scrollTo(0, 0);
  } catch (error) {
    console.error(`Error loading ${type} post:`, error);
  }
}

/**
 * Centralized navigation function
 */
function navigateTo(section, updateHistory = true) {
  const isHome = section === 'home' || section === '' || section === '/';
  
  if (isHome) {
    appWrapper.classList.remove('section-mode');
    mainContent.innerHTML = homeContent;
    if (updateHistory) {
      history.pushState({ section: 'home' }, '', window.location.pathname);
    }
  } else {
    appWrapper.classList.add('section-mode');
    if (section === 'projects') mainContent.innerHTML = renderList(projectsData, 'projects');
    if (section === 'blogs') mainContent.innerHTML = renderList(blogsData, 'blogs');
    if (section === 'about') mainContent.innerHTML = `<div class="section-container"><p style="opacity: 0.6; font-weight: 300; line-height: 1.8;">Presidio DevOps Engineer. AI Infra Explorer.</p></div>`;
    
    if (updateHistory) {
      history.pushState({ section: section }, '', `#${section}`);
    }
  }
  window.scrollTo(0, 0);
}

// Global scope for onclick handlers
window.loadPost = loadPost;
window.navigateTo = navigateTo;

// Handle Logo Click
if (brandLink) {
  brandLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });
}

// Handle Nav Link Clicks
sectionLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = e.target.getAttribute('href').replace('#', '');
    navigateTo(section);
  });
});

// Handle Browser Back/Forward buttons
window.addEventListener('popstate', (e) => {
  const hash = window.location.hash.replace('#', '');
  navigateTo(hash || 'home', false);
});

// Initial Page Load Check
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    navigateTo(hash, false);
  }
});
