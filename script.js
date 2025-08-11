        class BlogLoader {
            constructor() {
                this.articles = [];
                this.articleFiles = ['articles/sample.json', 'articles/sample2.json']; // Add your article files here
                this.init();
            }

            async init() {
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

                const articlesHTML = this.articles.map(article => {
                    const formattedDate = this.formatDate(article.date);
                    const tagsHTML = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
                    
                    return `
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
                }).join('');

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
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });
            }
        }

        // Initialize the blog when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new BlogLoader();
        });