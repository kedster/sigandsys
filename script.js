class MediaManager {
    constructor() {
        this.folders = {
            banner: 'Ads/Banner/',
            side: 'Ads/Side/',
            overlay: 'Ads/popup/'
        };
        this.images = { banner: [], side: [], overlay: [] };
        this.currentIndex = { banner: 0, side: 0, overlay: 0 };
        this.extensions = ['.jpg', '.png'];
        this.manifestExtraExt = ['.jpeg', '.webp'];
        this.rotationIntervals = {};
        this.overlayShown = false;
        this.cache = new Map();
        this.maxIndexToCheck = 10;
        this.customPlaceholders = ['custom1', 'custom2', 'custom3'];
    }

    getTypePrefix(type) {
        return type === 'overlay' ? 'popup' : type;
    }

    validateFileName(type, fileName) {
        try {
            const prefix = this.getTypePrefix(type);
            const pattern = new RegExp(`^${prefix}\\d+-[A-Za-z0-9._-]+\\.(jpg|png|jpeg|webp)$`, 'i');
            return pattern.test(fileName);
        } catch {
            return false;
        }
    }

    async loadFromManifest(type, folder) {
        try {
            const res = await fetch(`${folder}manifest.json`, { cache: 'no-cache' });
            if (!res.ok) return null;
            const list = await res.json(); // expects an array of filenames
            if (!Array.isArray(list)) return null;
            const filtered = list
                .filter(name => this.validateFileName(type, name))
                .map(name => `${folder}${name}`);
            return filtered;
        } catch {
            return null;
        }
    }

    async loadImages() {
        for (const [type, folder] of Object.entries(this.folders)) {
            if (this.cache.has(folder)) {
                this.images[type] = this.cache.get(folder);
                continue;
            }

            // Prefer manifest if present
            const manifestImages = await this.loadFromManifest(type, folder);
            if (manifestImages && manifestImages.length) {
                this.cache.set(folder, manifestImages);
                this.images[type] = manifestImages;
                continue;
            }

            // Fallback probing with strict pattern (prefix + number + '-') and a few placeholders
            const prefix = this.getTypePrefix(type);
            const found = [];
            for (let i = 1; i <= this.maxIndexToCheck; i++) {
                let pushed = false;
                for (const custom of this.customPlaceholders) {
                    for (const ext of this.extensions) {
                        const fileName = `${prefix}${i}-${custom}${ext}`;
                        if (!this.validateFileName(type, fileName)) continue;
                        const path = `${folder}${fileName}`;
                        if (await this.quickImageCheck(path)) {
                            found.push(path);
                            pushed = true;
                            break;
                        }
                    }
                    if (pushed) break;
                }
            }

            this.cache.set(folder, found);
            this.images[type] = found;
        }
    }

    quickImageCheck(url) {
        return new Promise((resolve) => {
            const img = new Image();
            let settled = false;
            const done = (ok) => { if (!settled) { settled = true; clearTimeout(timeoutId); resolve(ok); } };
            img.onload = () => done(true);
            img.onerror = () => done(false);
            const timeoutId = setTimeout(() => done(false), 1000);
            img.src = url;
        });
    }

    displayBanner() {
        const container = document.getElementById('media-banner') || document.getElementById('banner-ad-container');
        if (!container || this.images.banner.length === 0) return;
        const img = document.createElement('img');
        img.className = 'media-banner-img';
        img.src = this.images.banner[0];
        img.alt = 'Featured banner';
        img.loading = 'lazy';
        container.appendChild(img);
        if (this.images.banner.length > 1) this.startRotation('banner', img);
    }

    displayLeft() {
        const container = document.getElementById('media-left') || document.getElementById('side-ad-container');
        if (!container || this.images.side.length === 0) return;
        const img = document.createElement('img');
        img.className = 'media-left-img';
        img.src = this.images.side[0];
        img.alt = 'Left media';
        img.loading = 'lazy';
        container.appendChild(img);
        if (this.images.side.length > 1) this.startRotation('side', img);
    }

    displayOverlay() {
        if (this.images.overlay.length === 0 || this.overlayShown) return;
        setTimeout(() => {
            const overlay = document.getElementById('overlay') || document.getElementById('popup-overlay');
            const img = document.getElementById('overlay-image') || document.getElementById('popup-ad-image');
            if (!overlay || !img) return;
            img.src = this.images.overlay[0];
            overlay.style.display = 'flex';
            this.overlayShown = true;
            if (this.images.overlay.length > 1) this.startRotation('overlay', img);
        }, 5000);
    }

    startRotation(type, imgEl) {
        this.rotationIntervals[type] = setInterval(() => {
            this.currentIndex[type] = (this.currentIndex[type] + 1) % this.images[type].length;
            imgEl.src = this.images[type][this.currentIndex[type]];
        }, 10000);
    }

    async init() {
        this.loadImages().then(() => {
            this.displayBanner();
            this.displayLeft();
            this.displayOverlay();
        });
    }
}

class BlogLoader {
    constructor() {
        this.articles = [];
        this.articleFiles = ['articles/sample.json', 'articles/sample2.json'];
        this.mediaManager = new MediaManager();
        this.pageSize = 5;
        this.visibleCount = this.pageSize;
        this.isFiltering = false;
        this.searchTimeout = null; // For debouncing
        this.init();
    }

    async init() {
        this.setupThemeToggle();
        this.setupProgressBar();
        this.setupBackToTop();

        // Show skeletons while loading
        this.renderSkeletons();

        // Don't wait for media manager
        this.mediaManager.init();

        // Load articles in parallel
        await this.loadArticles();
        this.clearSkeletons();

        this.renderArticles();
        this.renderRecentPosts();
        this.renderTopics();
        this.setupSearch();
        this.setupNavigation();
    }

    setupThemeToggle() {
        const root = document.documentElement;
        const btn = document.getElementById('theme-toggle');
        const apply = (theme) => {
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        };
        const stored = localStorage.getItem('theme');
        if (stored) apply(stored);
        else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            apply(prefersDark ? 'dark' : 'light');
        }
        if (btn) btn.addEventListener('click', () => {
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

    renderSkeletons() {
        const articleList = document.getElementById('article-list');
        if (!articleList) return;
        
        const makeSkeleton = () => `
            <div class="skeleton">
                <div class="skeleton-line lg"></div>
                <div class="skeleton-line md"></div>
                <div class="skeleton-line sm"></div>
                <div class="skeleton-line lg" style="width: 90%"></div>
            </div>`;
        articleList.innerHTML = makeSkeleton() + makeSkeleton() + makeSkeleton();
    }

    clearSkeletons() {
        const articleList = document.getElementById('article-list');
        if (!articleList) return;
        articleList.innerHTML = '';
    }

    async loadArticles() {
        try {
            // Load articles in parallel instead of sequentially
            const promises = this.articleFiles.map(async (file) => {
                try {
                    const response = await fetch(file);
                    if (!response.ok) throw new Error(`Failed to load ${file}`);
                    return await response.json();
                } catch (err) {
                    console.warn(`Could not load ${file}:`, err);
                    return null;
                }
            });
            
            const results = await Promise.all(promises);
            this.articles = results.filter(Boolean);
            
            // Sort only if we have articles
            if (this.articles.length > 0) {
                this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            this.articles = [];
        }
    }

    renderArticles() {
        const articleList = document.getElementById('article-list');
        const loadMoreContainer = document.getElementById('load-more-container');
        if (!articleList) return;

        if (this.articles.length === 0) {
            articleList.innerHTML = '<div class="no-articles">No articles found.</div>';
            if (loadMoreContainer) loadMoreContainer.innerHTML = '';
            return;
        }

        const count = this.isFiltering ? this.articles.length : this.visibleCount;
        const items = this.articles.slice(0, Math.min(count, this.articles.length));

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        items.forEach((article, idx) => {
            const formattedDate = this.formatDate(article.date);
            const tagsHTML = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            
            const articleEl = document.createElement('article');
            articleEl.className = 'article';
            articleEl.id = `article-${article.id}`;
            articleEl.dataset.id = article.id;
            
            articleEl.innerHTML = `
                <div class="article-header">
                    <h2 class="article-title">
                        <a href="#article-${article.id}">${article.title}</a>
                    </h2>
                    <div class="article-meta">
                        <span class="article-author">${article.author}</span>
                        <span class="article-date">${formattedDate}</span>
                    </div>
                </div>
                <div class="article-excerpt">${article.excerpt}</div>
                <div class="article-tags">${tagsHTML}</div>
                <div class="article-content" style="display: none;">${article.content}</div>
                <div class="article-actions">
                    <button class="read-more-btn btn btn-primary" data-id="${article.id}">Read More</button>
                </div>`;
            
            fragment.appendChild(articleEl);
            
            // Add banner after first article
            if (idx === 0) {
                const bannerDiv = document.createElement('div');
                bannerDiv.className = 'banner-ad-container';
                bannerDiv.innerHTML = `<img src='Ads/Banner/banner1.png' alt='Featured' class='media-banner-img' loading="lazy">`;
                fragment.appendChild(bannerDiv);
            }
        });

        // Clear and append all at once
        articleList.innerHTML = '';
        articleList.appendChild(fragment);

        // Bind read-more buttons
        document.querySelectorAll('.read-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleArticleContent(e.target.dataset.id));
        });

        // Load more button
        if (loadMoreContainer) {
            if (!this.isFiltering && this.visibleCount < this.articles.length) {
                loadMoreContainer.innerHTML = `<button id="load-more" class="btn btn-primary">Load more</button>`;
                document.getElementById('load-more').addEventListener('click', () => {
                    this.visibleCount += this.pageSize;
                    this.renderArticles();
                });
            } else {
                loadMoreContainer.innerHTML = '';
            }
        }
    }

    toggleArticleContent(articleId) {
        const article = document.querySelector(`[data-id="${articleId}"]`);
        if (!article) return;
        const content = article.querySelector('.article-content');
        const btn = article.querySelector('.read-more-btn');
        if (!content || !btn) return;
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        btn.textContent = isHidden ? 'Read Less' : 'Read More';
    }

    renderRecentPosts() {
        const recentList = document.getElementById('recent-posts');
        if (!recentList) return;
        const recent = this.articles.slice(0, 4);
        recentList.innerHTML = recent.map(a => `
            <li>
                <a href="#article-${a.id}">${a.title}</a>
                <div class="recent-date">${this.formatDate(a.date)}</div>
            </li>`).join('');
    }

    renderTopics() {
        const topicsGrid = document.getElementById('topics-grid');
        if (!topicsGrid) return;
        const all = [...new Set(this.articles.flatMap(a => a.tags))];
        let html = `<a href="#" class="category-item" data-topic="all">Show All</a>`;
        all.forEach(tag => { html += `<a href="#" class="category-item" data-topic="${tag}">${tag}</a>`; });
        topicsGrid.innerHTML = html;
        
        // Use event delegation for better performance
        topicsGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-item')) {
                e.preventDefault();
                const topic = e.target.dataset.topic;
                if (topic === 'all') {
                    this.isFiltering = false;
                    this.visibleCount = this.pageSize;
                    this.renderArticles();
                } else {
                    this.isFiltering = true;
                    this.filterByTopic(topic);
                }
            }
        });
    }

    filterByTopic(topic) {
        const articles = document.querySelectorAll('.article');
        articles.forEach(article => {
            const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent);
            article.style.display = tags.includes(topic) ? 'block' : 'none';
        });
        const loadMoreContainer = document.getElementById('load-more-container');
        if (loadMoreContainer) loadMoreContainer.innerHTML = '';
    }

    setupSearch() {
        const input = document.querySelector('.search-input');
        if (!input) return;
        
        // Debounce search for better performance
        input.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                const term = e.target.value.trim().toLowerCase();
                if (term === '') {
                    this.isFiltering = false;
                    this.visibleCount = this.pageSize;
                    this.renderArticles();
                    return;
                }
                this.isFiltering = true;
                this.filterArticles(term);
            }, 300); // Wait 300ms after user stops typing
        });
    }

    filterArticles(term) {
        const articles = document.querySelectorAll('.article');
        articles.forEach(article => {
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
            const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            const match = title.includes(term) || excerpt.includes(term) || tags.includes(term);
            article.style.display = match ? 'block' : 'none';
        });
        const loadMoreContainer = document.getElementById('load-more-container');
        if (loadMoreContainer) loadMoreContainer.innerHTML = '';
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

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
}

// Initialize
window.closePopup = function() {
    const overlay = document.getElementById('overlay') || document.getElementById('popup-overlay');
    if (overlay) overlay.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', function() {
    new BlogLoader();
});