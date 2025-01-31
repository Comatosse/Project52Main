// Sample blog posts data
const posts = [
    {
        id: 1,
        title: "Revolutionizing FIRST Tech Challenge: The Impact of Project52",
        excerpt: "Discover how Project52 is changing the way teams approach their engineering documentation and outreach efforts.",
        image: "images/featured-post.jpg",
        category: "Updates",
        date: "2024-01-30",
        tags: ["Project52", "FTC", "Innovation"],
        featured: true,
        views: 1205
    },
    {
        id: 2,
        title: "From Rookie to World Champions: A Documentation Journey",
        excerpt: "Learn how proper documentation and portfolio management can elevate your team's performance.",
        image: "images/success-story.jpg",
        category: "Tips",
        date: "2024-01-25",
        tags: ["Success Story", "Documentation", "World Championship"],
        views: 856
    },
    {
        id: 3,
        title: "Virtual Portfolio Workshop Series Announced",
        excerpt: "Join our upcoming workshop series to master the art of creating compelling engineering portfolios.",
        image: "images/workshop.jpg",
        category: "Events",
        date: "2024-01-20",
        tags: ["Workshop", "Virtual Event", "Learning"],
        views: 634
    },
    {
        id: 4,
        title: "The Evolution of Engineering Documentation",
        excerpt: "Exploring how digital tools are transforming the way teams document their journey.",
        image: "images/documentation.jpg",
        category: "Tutorials",
        date: "2024-01-15",
        tags: ["Digital Tools", "Innovation", "Best Practices"],
        views: 945
    }
];

class BlogManager {
    constructor() {
        this.posts = [...posts];
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderFeaturedPost();
        this.renderPosts();
        this.renderTrendingPosts();
        this.renderTags();
    }

    setupEventListeners() {
        // Filter pills
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                this.setActiveFilter(pill);
            });
        });

        // Time select
        document.getElementById('time-select').addEventListener('change', () => {
            this.filterPosts();
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Load more
        document.querySelector('.load-more').addEventListener('click', () => {
            this.loadMorePosts();
        });

        // Newsletter form
        document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletter(e.target);
        });
    }

    setActiveFilter(pill) {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCategory = pill.dataset.category;
        this.currentPage = 1;
        this.filterPosts();
    }

    handleSearch(query) {
        this.currentPage = 1;
        this.filterPosts(query);
    }

    filterPosts(searchQuery = '') {
        const timeFilter = document.getElementById('time-select').value;
        searchQuery = searchQuery.toLowerCase();

        const filtered = posts.filter(post => {
            const matchesCategory = this.currentCategory === 'all' || post.category === this.currentCategory;
            const matchesSearch = post.title.toLowerCase().includes(searchQuery) || 
                                post.excerpt.toLowerCase().includes(searchQuery) ||
                                post.tags.some(tag => tag.toLowerCase().includes(searchQuery));
            const matchesTime = this.checkTimeFilter(post.date, timeFilter);

            return matchesCategory && matchesSearch && matchesTime;
        });

        this.posts = filtered;
        this.renderPosts();
    }

    checkTimeFilter(postDate, timeFilter) {
        if (!timeFilter) return true;
        
        const postTime = new Date(postDate).getTime();
        const now = new Date().getTime();
        const msPerDay = 24 * 60 * 60 * 1000;
        
        switch(timeFilter) {
            case 'week':
                return now - postTime <= 7 * msPerDay;
            case 'month':
                return now - postTime <= 30 * msPerDay;
            case 'year':
                return now - postTime <= 365 * msPerDay;
            default:
                return true;
        }
    }

    renderFeaturedPost() {
        const featured = posts.find(post => post.featured);
        if (!featured) return;

        const container = document.querySelector('.featured-post');
        container.innerHTML = `
            <img src="${featured.image}" alt="${featured.title}">
            <div class="featured-content">
                <span class="category">${featured.category}</span>
                <h2>${featured.title}</h2>
                <p>${featured.excerpt}</p>
                <div class="meta">
                    <span>${new Date(featured.date).toLocaleDateString()}</span>
                    <span>${featured.views} views</span>
                </div>
            </div>
        `;
    }

    renderPosts() {
        const container = document.querySelector('.posts-grid');
        container.innerHTML = '';

        const postsToShow = this.posts.slice(0, this.currentPage * this.postsPerPage);
        
        postsToShow.forEach(post => {
            const card = document.createElement('article');
            card.className = 'post-card';
            
            card.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="post-image">
                <div class="post-content">
                    <div class="post-meta">
                        <span>${post.category}</span>
                        <span>${new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="tags-cloud">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });

        // Show/hide load more button
        const loadMoreBtn = document.querySelector('.load-more');
        loadMoreBtn.style.display = postsToShow.length < this.posts.length ? 'block' : 'none';
    }

    renderTrendingPosts() {
        const trending = [...posts]
            .sort((a, b) => b.views - a.views)
            .slice(0, 3);

        const container = document.querySelector('.trending-posts');
        container.innerHTML = trending.map(post => `
            <div class="trending-post">
                <img src="${post.image}" alt="${post.title}">
                <div class="trending-post-info">
                    <h3>${post.title}</h3>
                    <span>${post.views} views</span>
                </div>
            </div>
        `).join('');
    }

    renderTags() {
        const allTags = posts.reduce((tags, post) => {
            post.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
            return tags;
        }, {});

        const sortedTags = Object.entries(allTags)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        const container = document.querySelector('.tags-cloud');
        container.innerHTML = sortedTags.map(([tag, count]) => `
            <span class="tag">${tag} (${count})</span>
        `).join('');
    }

    loadMorePosts() {
        this.currentPage++;
        this.renderPosts();
    }

    handleNewsletter(form) {
        const email = form.querySelector('input[type="email"]').value;
        // Here you would typically send this to your backend
        console.log('Newsletter signup:', email);
        alert('Thanks for subscribing! We\'ll keep you updated.');
        form.reset();
    }
}

// Initialize blog manager
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});