        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const articles = document.querySelectorAll('.article');

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            articles.forEach(article => {
                const title = article.querySelector('.article-title').textContent.toLowerCase();
                const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
                const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
                
                if (title.includes(term) || excerpt.includes(term) || tags.includes(term)) {
                    article.style.display = 'block';
                } else {
                    article.style.display = term === '' ? 'block' : 'none';
                }
            });
        });

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