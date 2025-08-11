class AdManager {
            constructor() {
                this.adFolders = {
                    banner: 'Ads/Banner/',
                    side: 'Ads/Side/',
                    popup: 'Ads/popup/'
                };
                this.adImages = {
                    banner: [],
                    side: [],
                    popup: []
                };
                this.currentAdIndex = {
                    banner: 0,
                    side: 0,
                    popup: 0
                };
                this.imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
                this.rotationIntervals = {};
                this.popupShown = false;
            }

            async loadAdImages() {
                // Since we can't directly list directory contents, we'll try common image names
                const commonNames = [
                    'ad1', 'ad2', 'ad3', 'ad4', 'ad5',
                    'banner1', 'banner2', 'banner3',
                    'side1', 'side2', 'side3',
                    'popup1', 'popup2', 'popup3',
                    '1', '2', '3', '4', '5'
                ];

                for (const [folderType, folderPath] of Object.entries(this.adFolders)) {
                    const images = [];
                    
                    for (const name of commonNames) {
                        for (const ext of this.imageExtensions) {
                            const imagePath = `${folderPath}${name}${ext}`;
                            if (await this.imageExists(imagePath)) {
                                images.push(imagePath);
                            }
                        }
                    }
                    
                    this.adImages[folderType] = images;
                }
            }

            async imageExists(url) {
                try {
                    const response = await fetch(url, { method: 'HEAD' });
                    return response.ok;
                } catch {
                    return false;
                }
            }

            displayBannerAds() {
                const container = document.getElementById('banner-ad-container');
                if (this.adImages.banner.length > 0) {
                    const img = document.createElement('img');
                    img.className = 'banner-ad';
                    img.src = this.adImages.banner[0];
                    img.alt = 'Banner Advertisement';
                    container.appendChild(img);

                    if (this.adImages.banner.length > 1) {
                        this.startAdRotation('banner', img);
                    }
                }
            }

            displaySideAds() {
                const container = document.getElementById('side-ad-container');
                if (this.adImages.side.length > 0) {
                    const img = document.createElement('img');
                    img.className = 'side-ad';
                    img.src = this.adImages.side[0];
                    img.alt = 'Side Advertisement';
                    container.appendChild(img);

                    if (this.adImages.side.length > 1) {
                        this.startAdRotation('side', img);
                    }
                }
            }

            displayPopupAd() {
                if (this.adImages.popup.length > 0 && !this.popupShown) {
                    // Show popup after 5 seconds
                    setTimeout(() => {
                        const overlay = document.getElementById('popup-overlay');
                        const img = document.getElementById('popup-ad-image');
                        img.src = this.adImages.popup[0];
                        overlay.style.display = 'flex';
                        this.popupShown = true;

                        if (this.adImages.popup.length > 1) {
                            this.startAdRotation('popup', img);
                        }
                    }, 5000);
                }
            }

            startAdRotation(type, imgElement) {
                this.rotationIntervals[type] = setInterval(() => {
                    this.currentAdIndex[type] = (this.currentAdIndex[type] + 1) % this.adImages[type].length;
                    imgElement.src = this.adImages[type][this.currentAdIndex[type]];
                }, 10000); // Rotate every 10 seconds
            }

            async init() {
                await this.loadAdImages();
                this.displayBannerAds();
                this.displaySideAds();
                this.displayPopupAd();
            }
        }

        class BlogLoader {
            constructor() {
                this.articles = [];
                this.articleFiles = ['articles/sample.json', 'articles/sample2.json'];
                this.adManager = new AdManager();
                this.init();
            }

            async init() {
                await this.adManager.init();
                await this.loadArticles();
                this.renderArticles();
                this.renderRecentPosts();
                this.renderTopics();
                this.setupSearch();
                this.setupNavigation();
            }

            async loadArticles() {
                try {
                    const promises = this.articleFiles.map(async (file) => {
                        try {
                            const response = await fetch(file);
                            if (!response.ok) throw new Error(`Failed to load ${file}`);
                            return await response.json();
                        } catch (error) {
                            console.warn(`Could not load ${file}:`, error);
                            return null;
                        }
                    });

                    const results = await Promise.all(promises);
                    this.articles = results.filter(article => article !== null);
                    
                    // Sort articles by date (newest first)
                    this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
                } catch (error) {
                    console.error('Error loading articles:', error);
                    this.articles = [];
                }
            }

            renderArticles() {
                const articleList = document.getElementById('article-list');
                if (this.articles.length === 0) {
                    articleList.innerHTML = '<div class="no-articles">No articles found.</div>';
                    return;
                }

                let articlesHTML = '';
                this.articles.forEach((article, idx) => {
                    const formattedDate = this.formatDate(article.date);
                    const tagsHTML = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
                    articlesHTML += `
                        <article class="article" data-id="${article.id}">
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
                                <button class="read-more-btn" data-id="${article.id}">Read More</button>
                            </div>
                        </article>
                    `;
                    // Insert banner ad after the first article
                    if (idx === 0) {
                        articlesHTML += `<div class='banner-ad-container'><img src='Ads/Banner/banner1.png' alt='Banner Ad' class='banner-ad'></div>`;
                    }
                });

                articleList.innerHTML = articlesHTML;

                // Add click handlers for read more buttons
                document.querySelectorAll('.read-more-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.toggleArticleContent(e.target.dataset.id);
                    });
                });
            }

            toggleArticleContent(articleId) {
                const article = document.querySelector(`[data-id="${articleId}"]`);
                const content = article.querySelector('.article-content');
                const btn = article.querySelector('.read-more-btn');
                
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    btn.textContent = 'Read Less';
                } else {
                    content.style.display = 'none';
                    btn.textContent = 'Read More';
                }
            }

            renderRecentPosts() {
                const recentList = document.getElementById('recent-posts');
                const recentArticles = this.articles.slice(0, 4);
                
                const recentHTML = recentArticles.map(article => `
                    <li>
                        <a href="#article-${article.id}">${article.title}</a>
                        <div class="recent-date">${this.formatDate(article.date)}</div>
                    </li>
                `).join('');

                recentList.innerHTML = recentHTML;
            }

            renderTopics() {
                const topicsGrid = document.getElementById('topics-grid');
                const allTags = [...new Set(this.articles.flatMap(article => article.tags))];
                
                const topicsHTML = allTags.map(tag => `
                    <a href="#" class="category-item" data-topic="${tag}">${tag}</a>
                `).join('');

                topicsGrid.innerHTML = topicsHTML;

                // Add click handlers for topic filtering
                document.querySelectorAll('.category-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.filterByTopic(e.target.dataset.topic);
                    });
                });
            }

            filterByTopic(topic) {
                const articles = document.querySelectorAll('.article');
                articles.forEach(article => {
                    const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent);
                    article.style.display = tags.includes(topic) ? 'block' : 'none';
                });
            }

            setupSearch() {
                const searchInput = document.querySelector('.search-input');
                searchInput.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase();
                    this.filterArticles(term);
                });
            }

            filterArticles(term) {
                const articles = document.querySelectorAll('.article');
                
                articles.forEach(article => {
                    const title = article.querySelector('.article-title').textContent.toLowerCase();
                    const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
                    const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
                    
                    if (title.includes(term) || excerpt.includes(term) || tags.includes(term) || term === '') {
                        article.style.display = 'block';
                    } else {
                        article.style.display = 'none';
                    }
                });
            }

            setupNavigation() {
                // Smooth scroll for nav links
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const target = document.querySelector(this.getAttribute('href'));
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                });
            }

            formatDate(dateString) {
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
          // Side Ad
          const sideAdContainer = document.getElementById('side-ad-container');
          if (sideAdContainer) {
            const sideImg = document.createElement('img');
            sideImg.src = 'Ads/Side/side1.jpg';
            sideImg.alt = 'Side Ad';
            sideImg.className = 'side-ad';
            sideAdContainer.appendChild(sideImg);
          }

          // Popup Ad (example: show after 5 seconds)
          setTimeout(function() {
            const popupOverlay = document.getElementById('popup-overlay');
            const popupAdImage = document.getElementById('popup-ad-image');
            if (popupOverlay && popupAdImage) {
              popupAdImage.src = 'Ads/popup/1.jpg';
              popupOverlay.style.display = 'flex';
            }
          }, 5000);

          // Close popup function
          window.closePopup = function() {
            const popupOverlay = document.getElementById('popup-overlay');
            if (popupOverlay) popupOverlay.style.display = 'none';
          };
        });