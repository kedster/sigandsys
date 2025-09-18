class ToolsManager {
    constructor() {
        this.tools = [];
        this.filteredTools = [];
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.init();
    }

    async init() {
        this.setupThemeToggle();
        this.setupProgressBar();
        this.setupBackToTop();
        this.setupSearch();
        this.setupFilters();
        this.setupNavigation();
        this.setupScrollNavigation();
        
        // Load tools from JSON file
        await this.loadTools();
        this.renderTools();
        this.renderUpdates();
        
        // Initialize media manager for ads
        if (window.MediaManager) {
            const mediaManager = new window.MediaManager();
            mediaManager.init();
        }
    }

    async loadTools() {
        try {
            const response = await fetch('tools.json');
            if (!response.ok) {
                throw new Error(`Failed to load tools: ${response.status}`);
            }
            const data = await response.json();
            this.tools = Array.isArray(data) ? data : data.tools || [];
            this.filteredTools = [...this.tools];
            console.log(`Loaded ${this.tools.length} tools`);
        } catch (error) {
            console.error('Error loading tools:', error);
            this.tools = [];
            this.filteredTools = [];
        }
    }

    setupThemeToggle() {
        const root = document.documentElement;
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        const apply = (theme) => {
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        };

        const stored = localStorage.getItem('theme');
        if (stored) {
            apply(stored);
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            apply(prefersDark ? 'dark' : 'light');
        }

        btn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            apply(current);
        });
    }

    setupProgressBar() {
        const bar = document.getElementById('progress-bar');
        if (!bar) return;
        
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const doc = document.documentElement;
                    const scrollTop = doc.scrollTop || document.body.scrollTop;
                    const height = doc.scrollHeight - doc.clientHeight;
                    const width = height > 0 ? (scrollTop / height) * 100 : 0;
                    bar.style.width = `${width}%`;
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    setupBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;
        
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrolled > 300) btn.classList.add('show'); 
                    else btn.classList.remove('show');
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        onScroll();
    }

    setupSearch() {
        const input = document.querySelector('.search-input');
        if (!input) return;
        
        input.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.trim().toLowerCase();
            this.filterTools();
        });
    }

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                this.currentCategory = e.target.dataset.category;
                this.filterTools();
            });
        });
    }

    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    setupScrollNavigation() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollTop = 0;
        let ticking = false;
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // Hide header when scrolling down, show when scrolling up
                    if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                        // Scrolling down and past initial 100px
                        header.classList.add('nav-hidden');
                    } else if (currentScrollTop < lastScrollTop) {
                        // Scrolling up
                        header.classList.remove('nav-hidden');
                    }
                    
                    lastScrollTop = currentScrollTop;
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    filterTools() {
        this.filteredTools = this.tools.filter(tool => {
            const matchesCategory = this.currentCategory === 'all' || tool.category === this.currentCategory;
            const matchesSearch = !this.searchTerm || 
                tool.name.toLowerCase().includes(this.searchTerm) ||
                tool.description.toLowerCase().includes(this.searchTerm) ||
                tool.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            return matchesCategory && matchesSearch;
        });
        
        this.renderTools();
    }

    renderTools() {
        const toolsGrid = document.getElementById('tools-grid');
        const toolsLoading = document.getElementById('tools-loading');
        const toolsEmpty = document.getElementById('tools-empty');
        
        if (!toolsGrid) return;

        // Hide loading, show results
        if (toolsLoading) toolsLoading.style.display = 'none';
        
        if (this.filteredTools.length === 0) {
            toolsGrid.innerHTML = '';
            if (toolsEmpty) toolsEmpty.style.display = 'block';
            return;
        }

        if (toolsEmpty) toolsEmpty.style.display = 'none';

        const fragment = document.createDocumentFragment();
        
        this.filteredTools.forEach((tool, index) => {
            const toolCard = this.createToolCard(tool);
            fragment.appendChild(toolCard);
            
            // Add banner between tools (after every tool except the last one)
            if (index < this.filteredTools.length - 1) {
                const bannerDiv = document.createElement('div');
                bannerDiv.className = 'banner-ad-container';
                bannerDiv.innerHTML = `<img src='Ads/Banner/banner1.png' alt='Featured' class='media-banner-img' loading="lazy">`;
                fragment.appendChild(bannerDiv);
            }
        });

        toolsGrid.innerHTML = '';
        toolsGrid.appendChild(fragment);
    }

    createToolCard(tool) {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.dataset.category = tool.category;
        
        const tagsHTML = tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('');
        
        card.innerHTML = `
            <div class="tool-header">
                ${tool.image ? `<img src="${tool.image}" alt="${tool.name}" class="tool-image" loading="lazy">` : ''}
                <div class="tool-info">
                    <h3 class="tool-name">
                        <a href="${tool.url}" target="_blank" rel="noopener noreferrer">${tool.name}</a>
                    </h3>
                    <div class="tool-meta">
                        <span class="tool-category">${tool.category}</span>
                        ${tool.price ? `<span class="tool-price">${tool.price}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="tool-content">
                <p class="tool-description">${tool.description}</p>
                <div class="tool-tags">${tagsHTML}</div>
                ${tool.howToUse ? `<div class="tool-usage"><strong>How I use it:</strong> ${tool.howToUse}</div>` : ''}
            </div>
            <div class="tool-actions">
                <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Visit Tool</a>
                ${tool.documentation ? `<a href="${tool.documentation}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Documentation</a>` : ''}
            </div>
        `;
        
        return card;
    }

    renderUpdates() {
        const updatesList = document.getElementById('updates-list');
        if (!updatesList) return;

        // Get recent tools (last 5 added/updated)
        const recentTools = this.tools
            .sort((a, b) => new Date(b.updated || b.added || '2025-01-01') - new Date(a.updated || a.added || '2025-01-01'))
            .slice(0, 5);

        if (recentTools.length === 0) {
            updatesList.innerHTML = '<p>No updates yet</p>';
            return;
        }

        const updatesHTML = recentTools.map(tool => `
            <div class="update-item">
                <div class="update-title">${tool.name}</div>
                <div class="update-date">${this.formatDate(tool.updated || tool.added)}</div>
            </div>
        `).join('');

        updatesList.innerHTML = updatesHTML;
    }

    formatDate(dateString) {
        if (!dateString) return 'Recently';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ToolsManager();
    startTimebar();
});

// Timebar updater (reused from main script)
function startTimebar() {
    const elAR = document.getElementById('time-ar');
    const elCA = document.getElementById('time-ca');
    const elNY = document.getElementById('time-ny');
    if (!elAR || !elCA || !elNY) return;

    const update = () => {
        const now = new Date();
        const ar = now.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const ca = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const ny = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        elAR.textContent = `AR: ${ar}`;
        elCA.textContent = `CA: ${ca}`;
        elNY.textContent = `NY: ${ny}`;
    };

    update();
    setInterval(update, 1000);
}
