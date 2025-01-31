// Static document data
const documents = [
    {
        id: 1,
        title: "Award Winning Portfolio",
        description: "Example of a very good portfolio overall.",
        tags: ["World Championship", "Balanced", "Landscape"],
        awardLevel: "Inspire",
        season: "CENTERSTAGE",
        file: "very-good-portfolio.pdf"
    },
    {
        id: 2,
        title: "Technical Portfolio",
        description: "Very technical portfolio, focussing on the robot.",
        tags: ["National Championship", "Engineering", "Technical"],
        awardLevel: "Control",
        season: "CENTERSTAGE",
        file: "engineering-heavy-portfolio.pdf"
    },
    {
        id: 3,
        title: "Community Portfolio",
        description: "A portfolio focusing on advocacy, social impact and sponsorship.",
        tags: ["National Championship", "Social", "Aesthetic"],
        awardLevel: "Motivate",
        season: "POWERPLAY",
        file: "advocacy-based-portfolio.pdf"
    },
    {
        id: 4,
        title: "Rookie Portfolio",
        description: "A portfolio highlighting a good example for rookie teams.",
        tags: ["Regional Championship", "Rookie", "Portrait"],
        awardLevel: "Design",
        season: "INTO THE DEEP",
        file: "beginner-portfolio.pdf"
    }
];

class DocumentDisplay {
    constructor() {
        this.documents = [...documents];
        this.currentView = 'grid';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAwardCounts();
        this.sortDocuments();  
        this.renderDocuments();
    }

    setupEventListeners() {
        // View Controls
        const viewToggles = document.querySelectorAll('.view-toggle');
        viewToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleView(toggle));
        });

        // Search and Filter
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const seasonSelect = document.getElementById('season-select');
        const filterOptions = document.querySelectorAll('.filter-option input');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterDocuments());
        }
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.sortDocuments());
        }
        if (seasonSelect) {
            seasonSelect.addEventListener('change', () => this.filterDocuments());
        }
        filterOptions.forEach(option => {
            option.addEventListener('change', () => this.filterDocuments());
        });
    }

    updateAwardCounts() {
        const awardCounts = this.documents.reduce((counts, doc) => {
            counts[doc.awardLevel] = (counts[doc.awardLevel] || 0) + 1;
            return counts;
        }, {});

        // Update the count displays
        document.querySelectorAll('.filter-option').forEach(option => {
            const input = option.querySelector('input');
            const countSpan = option.querySelector('.count');
            if (input && countSpan) {
                const count = awardCounts[input.value] || 0;
                countSpan.textContent = count;
            }
        });
    }

    renderDocuments() {
        const grid = document.querySelector('.document-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        this.documents.forEach(doc => {
            const card = this.createDocumentCard(doc);
            grid.appendChild(card);
        });
    }

    createDocumentCard(doc) {
        const awardIcons = {
            'Inspire': '<i class="fas fa-star"></i>',
            'Think': '<i class="fas fa-brain"></i>',
            'Connect': '<i class="fas fa-handshake"></i>',
            'Innovate': '<i class="fas fa-rocket"></i>',
            'Control': '<i class="fas fa-compass"></i>',
            'Motivate': '<i class="fas fa-fire"></i>',
            'Design': '<i class="fas fa-palette"></i>'
        };

        const card = document.createElement('div');
        card.className = 'document-card';
        
        card.innerHTML = `
            <div class="document-preview">
                <i class="fas fa-file-alt fa-3x"></i>
            </div>
            <div class="document-info">
                <h3>${doc.title}</h3>
                <p class="document-description">${doc.description}</p>
                <div class="document-tags">
                    ${doc.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="document-meta">
                    <span class="award-badge">
                        ${awardIcons[doc.awardLevel] || '<i class="fas fa-award"></i>'} 
                        ${doc.awardLevel}
                    </span>
                    <span class="season">
                        ${doc.season}
                    </span>
                </div>
            </div>
        `;

        return card;
    }

    toggleView(toggle) {
        const viewToggles = document.querySelectorAll('.view-toggle');
        viewToggles.forEach(t => t.classList.remove('active'));
        toggle.classList.add('active');

        const grid = document.querySelector('.document-grid');
        this.currentView = toggle.classList.contains('grid-view') ? 'grid' : 'list';
        grid.className = `document-grid ${this.currentView}-view`;
    }

    filterDocuments() {
        const seasonFilter = document.getElementById('season-select').value;
        const awardFilters = Array.from(document.querySelectorAll('.filter-option input:checked')).map(cb => cb.value);
        const searchQuery = document.getElementById('search-input').value.toLowerCase();

        this.documents = [...documents].filter(doc => {
            const matchesSeason = !seasonFilter || doc.season === seasonFilter.replace(/^\d{4}\s*/, '');
            const matchesAwards = awardFilters.length === 0 || awardFilters.includes(doc.awardLevel);
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery) || 
                                doc.description.toLowerCase().includes(searchQuery) ||
                                doc.tags.some(tag => tag.toLowerCase().includes(searchQuery));

            return matchesSeason && matchesAwards && matchesSearch;
        });

        this.sortDocuments();
        this.renderDocuments();
    }

    sortDocuments() {
        const sortBy = document.getElementById('sort-select').value;
        const seasonYears = {
            'INTO THE DEEP': 2024,
            'CENTERSTAGE': 2023,
            'POWERPLAY': 2022
        };
        
        const sortedDocs = [...this.documents].sort((a, b) => {
            switch(sortBy) {
                case 'recent':
                    const seasonA = a.season.replace(/^\d{4}\s*/, '');
                    const seasonB = b.season.replace(/^\d{4}\s*/, '');
                    return (seasonYears[seasonB] || 0) - (seasonYears[seasonA] || 0);
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'success':
                    const rankOrder = {
                        'World Championship': 3,
                        'National Championship': 2,
                        'Regional Championship': 1
                    };
                    const aRank = rankOrder[a.tags[0]] || 0;
                    const bRank = rankOrder[b.tags[0]] || 0;
                    return bRank - aRank;
                default:
                    return 0;
            }
        });

        this.documents = sortedDocs;
        this.renderDocuments();
    }

    renderFilteredDocuments(documents) {
        const grid = document.querySelector('.document-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        documents.forEach(doc => {
            const card = this.createDocumentCard(doc);
            grid.appendChild(card);
        });
    }
}

// Initialize the document display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DocumentDisplay();
});