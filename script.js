// Storage for ads and favorites
let ads = [];
let filteredAds = [];
let favorites = JSON.parse(localStorage.getItem('b2bFavorites') || '[]');
let currentView = 'grid';
let currentTab = 'all';
let currentCarouselIndex = 0;
let currentFormStep = 1;

// Category names and icons mapping
const categoryNames = {
    'transport': 'Transport i Logistika',
    'it': 'IT Usluge',
    'marketing': 'Marketing i Reklama',
    'consulting': 'Konsultantske Usluge',
    'manufacturing': 'Proizvodnja',
    'finance': 'Finansijske Usluge',
    'other': 'Ostalo'
};

const categoryIcons = {
    'transport': '🚚',
    'it': '💻',
    'marketing': '📢',
    'consulting': '📊',
    'manufacturing': '🏭',
    'finance': '💰',
    'other': '📦'
};

// Initialize with sample data
function initializeSampleAds() {
    const sampleAds = [
        {
            id: 1,
            companyName: 'TransLog d.o.o.',
            email: 'kontakt@translog.rs',
            phone: '+381 64 123 4567',
            type: 'offer',
            category: 'transport',
            title: 'Profesionalni transportni servis širom Srbije',
            description: 'Nudimo pouzdanu uslugu transporta robe svih vrsta. Posedujemo flotu od 20+ vozila različitih kapaciteta. Dostupni 24/7, praćenje pošiljki u realnom vremenu.',
            location: 'Beograd',
            date: new Date('2024-01-15'),
            budget: 'Po dogovoru',
            verified: true,
            featured: true,
            rating: 4.8,
            views: 245
        },
        {
            id: 2,
            companyName: 'TechSolutions',
            email: 'info@techsolutions.rs',
            phone: '+381 63 987 6543',
            type: 'offer',
            category: 'it',
            title: 'Web razvoj i digitalne usluge',
            description: 'Specijalizovani smo za izradu web aplikacija, e-commerce platformi i mobilnih aplikacija. Tim od 15 iskusnih developera spreman da realizuje vaš projekat.',
            location: 'Novi Sad',
            date: new Date('2024-01-14'),
            budget: 'Od 2000 EUR',
            verified: true,
            featured: true,
            rating: 4.9,
            views: 312
        },
        {
            id: 3,
            companyName: 'ProMarket Agency',
            email: 'hello@promarket.rs',
            phone: '+381 65 555 1234',
            type: 'request',
            category: 'marketing',
            title: 'Potrebna agencija za digitalni marketing',
            description: 'Tražimo partnera za dugoročnu saradnju u oblasti digitalnog marketinga. Potrebne nam usluge SEO optimizacije, upravljanje društvenim mrežama i Google Ads kampanje.',
            location: 'Beograd',
            date: new Date('2024-01-13'),
            budget: '1500 EUR mesečno',
            verified: false,
            featured: false,
            rating: 4.5,
            views: 189
        },
        {
            id: 4,
            companyName: 'ExportCo',
            email: 'export@exportco.rs',
            phone: '+381 62 444 5555',
            type: 'request',
            category: 'transport',
            title: 'Potreban međunarodni transport - EU',
            description: 'Kompanija za izvoz traži pouzdanog partnera za međunarodni transport robe ka EU zemljama. Potrebna redovna mesečna saradnja, oko 10 tura mesečno.',
            location: 'Niš',
            date: new Date('2024-01-12'),
            budget: 'Po dogovoru',
            verified: true,
            featured: false,
            rating: 4.6,
            views: 156
        },
        {
            id: 5,
            companyName: 'BizConsult',
            email: 'office@bizconsult.rs',
            phone: '+381 64 777 8888',
            type: 'offer',
            category: 'consulting',
            title: 'Konsultantske usluge za optimizaciju poslovanja',
            description: 'Pružamo profesionalne konsultantske usluge u oblasti finansija, upravljanja ljudskim resursima i poslovne strategije. 10+ godina iskustva.',
            location: 'Beograd',
            date: new Date('2024-01-11'),
            budget: '100 EUR/sat',
            verified: true,
            featured: true,
            rating: 4.7,
            views: 201
        },
        {
            id: 6,
            companyName: 'Manufacturing Plus',
            email: 'sales@manplus.rs',
            phone: '+381 63 222 3333',
            type: 'offer',
            category: 'manufacturing',
            title: 'Proizvodnja delova od plastike po narudžbini',
            description: 'Moderna proizvodnja plastičnih delova korišćenjem 3D štampe i injekcionog brizganja. Mogućnost proizvodnje prema tehničkoj dokumentaciji naručioca.',
            location: 'Kragujevac',
            date: new Date('2024-01-10'),
            budget: 'Po specifikaciji',
            verified: false,
            featured: false,
            rating: 4.4,
            views: 134
        },
        {
            id: 7,
            companyName: 'FinanceExpert',
            email: 'info@financeexpert.rs',
            phone: '+381 64 888 9999',
            type: 'offer',
            category: 'finance',
            title: 'Računovodstvene i finansijske usluge',
            description: 'Nudimo kompletne računovodstvene usluge, poresko savetovanje, finansijsko planiranje i konsalting za mala i srednja preduzeća.',
            location: 'Beograd',
            date: new Date('2024-01-09'),
            budget: 'Od 500 EUR mesečno',
            verified: true,
            featured: false,
            rating: 4.8,
            views: 178
        }
    ];

    const stored = localStorage.getItem('b2bAds');
    if (stored) {
        ads = JSON.parse(stored).map(ad => ({
            ...ad,
            date: new Date(ad.date)
        }));
    } else {
        ads = sampleAds;
        saveAds();
    }

    filteredAds = [...ads];
    updateStats();
    updateCategoryCounts();
    displayAds();
    initCarousel();
}

// Save ads to localStorage
function saveAds() {
    localStorage.setItem('b2bAds', JSON.stringify(ads));
}

// Save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('b2bFavorites', JSON.stringify(favorites));
}

// Update statistics
function updateStats() {
    const totalCompanies = new Set(ads.map(ad => ad.companyName)).size;
    const totalAds = ads.length;

    animateNumber('totalCompanies', totalCompanies);
    animateNumber('totalAds', totalAds);
}

// Animate number counting
function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
}

// Update category counts
function updateCategoryCounts() {
    Object.keys(categoryNames).forEach(category => {
        const count = ads.filter(ad => ad.category === category).length;
        const element = document.getElementById(`cat-${category}`);
        if (element) {
            element.textContent = `${count} ${count === 1 ? 'oglas' : 'oglasa'}`;
        }
    });
}

// Display ads in the grid
function displayAds() {
    const container = document.getElementById('adsContainer');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');

    if (!container) return;

    let adsToDisplay = filteredAds;

    // Filter by current tab
    if (currentTab === 'favorites') {
        adsToDisplay = adsToDisplay.filter(ad => favorites.includes(ad.id));
    } else if (currentTab === 'trending') {
        adsToDisplay = [...adsToDisplay].sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    if (adsToDisplay.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        resultsCount.textContent = 'Prikazano: 0 oglasa';
        return;
    }

    container.style.display = 'grid';
    noResults.style.display = 'none';
    resultsCount.textContent = `Prikazano: ${adsToDisplay.length} ${adsToDisplay.length === 1 ? 'oglas' : 'oglasa'}`;

    // Apply view mode
    if (currentView === 'list') {
        container.classList.add('list-view');
    } else {
        container.classList.remove('list-view');
    }

    container.innerHTML = adsToDisplay.map(ad => `
        <div class="ad-card ${currentView === 'list' ? 'list-view' : ''}">
            <div>
                <span class="ad-type-badge ${ad.type === 'offer' ? 'ad-type-offer' : 'ad-type-request'}">
                    ${ad.type === 'offer' ? '✓ Nudim uslugu' : '⚡ Tražim uslugu'}
                </span>
                <span class="ad-category">${categoryIcons[ad.category]} ${categoryNames[ad.category]}</span>
                ${ad.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verifikovano</span>' : ''}
            </div>
            <h3>${ad.title}</h3>
            <p>${ad.description}</p>
            ${ad.budget ? `<div class="ad-price"><i class="fas fa-tag"></i> ${ad.budget}</div>` : ''}
            ${ad.rating ? `
                <div class="ad-rating">
                    <span class="rating-stars">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(ad.rating))}
                        ${ad.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    </span>
                    <span>${ad.rating.toFixed(1)}</span>
                </div>
            ` : ''}
            <div class="ad-meta">
                <div class="ad-meta-item">
                    <i class="fas fa-building ad-meta-icon"></i>
                    <span>${ad.companyName}</span>
                </div>
                ${ad.location ? `
                    <div class="ad-meta-item">
                        <i class="fas fa-map-marker-alt ad-meta-icon"></i>
                        <span>${ad.location}</span>
                    </div>
                ` : ''}
                <div class="ad-meta-item">
                    <i class="fas fa-calendar ad-meta-icon"></i>
                    <span>${formatDate(ad.date)}</span>
                </div>
                ${ad.phone ? `
                    <div class="ad-meta-item">
                        <i class="fas fa-phone ad-meta-icon"></i>
                        <span>${ad.phone}</span>
                    </div>
                ` : ''}
                ${ad.views ? `
                    <div class="ad-meta-item">
                        <i class="fas fa-eye ad-meta-icon"></i>
                        <span>${ad.views} pregleda</span>
                    </div>
                ` : ''}
            </div>
            <div class="ad-actions">
                <button class="ad-contact-btn" onclick="contactCompany('${ad.email}', '${ad.companyName}')">
                    <i class="fas fa-envelope"></i> Kontaktiraj
                </button>
                <button class="favorite-btn ${favorites.includes(ad.id) ? 'active' : ''}"
                        onclick="toggleFavorite(${ad.id})"
                        title="Dodaj u omiljene">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="share-btn" onclick="shareAd(${ad.id})" title="Podeli">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize carousel
function initCarousel() {
    const featuredAds = ads.filter(ad => ad.featured);
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track || featuredAds.length === 0) return;

    track.innerHTML = featuredAds.map(ad => `
        <div class="ad-card" style="min-width: 350px;">
            <div>
                <span class="ad-type-badge ${ad.type === 'offer' ? 'ad-type-offer' : 'ad-type-request'}">
                    ${ad.type === 'offer' ? '✓ Nudim uslugu' : '⚡ Tražim uslugu'}
                </span>
                <span class="ad-category">${categoryIcons[ad.category]} ${categoryNames[ad.category]}</span>
                ${ad.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verifikovano</span>' : ''}
            </div>
            <h3>${ad.title}</h3>
            <p>${ad.description.substring(0, 120)}...</p>
            ${ad.budget ? `<div class="ad-price"><i class="fas fa-tag"></i> ${ad.budget}</div>` : ''}
            <div class="ad-meta">
                <div class="ad-meta-item">
                    <i class="fas fa-building ad-meta-icon"></i>
                    <span>${ad.companyName}</span>
                </div>
                <div class="ad-meta-item">
                    <i class="fas fa-map-marker-alt ad-meta-icon"></i>
                    <span>${ad.location}</span>
                </div>
            </div>
            <button class="ad-contact-btn" onclick="contactCompany('${ad.email}', '${ad.companyName}')">
                <i class="fas fa-envelope"></i> Kontaktiraj
            </button>
        </div>
    `).join('');

    // Create dots
    dotsContainer.innerHTML = featuredAds.map((_, index) =>
        `<div class="carousel-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>`
    ).join('');
}

// Move carousel
function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dot');
    const featuredCount = ads.filter(ad => ad.featured).length;

    if (featuredCount === 0) return;

    currentCarouselIndex += direction;

    if (currentCarouselIndex < 0) {
        currentCarouselIndex = featuredCount - 1;
    } else if (currentCarouselIndex >= featuredCount) {
        currentCarouselIndex = 0;
    }

    track.style.transform = `translateX(-${currentCarouselIndex * (350 + 32)}px)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCarouselIndex);
    });
}

// Go to specific slide
function goToSlide(index) {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dot');

    currentCarouselIndex = index;
    track.style.transform = `translateX(-${currentCarouselIndex * (350 + 32)}px)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentCarouselIndex);
    });
}

// Auto-play carousel
setInterval(() => {
    const featuredCount = ads.filter(ad => ad.featured).length;
    if (featuredCount > 0) {
        moveCarousel(1);
    }
}, 5000);

// Format date for display
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('sr-RS', options);
}

// Multi-step form navigation
function nextStep(step) {
    // Hide current step
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active'));

    // Mark previous steps as completed
    for (let i = 1; i < step; i++) {
        document.querySelectorAll('.progress-step')[i - 1].classList.add('completed');
    }

    // Show new step
    document.getElementById(`step${step}`).classList.add('active');
    document.querySelectorAll('.progress-step')[step - 1].classList.add('active');

    currentFormStep = step;
}

function prevStep(step) {
    nextStep(step);
}

// Character counter for form inputs
document.addEventListener('DOMContentLoaded', function() {
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');

    if (titleInput) {
        titleInput.addEventListener('input', function() {
            const counter = document.getElementById('titleCounter');
            counter.textContent = `${this.value.length}/100`;
        });
    }

    if (descInput) {
        descInput.addEventListener('input', function() {
            const counter = document.getElementById('descCounter');
            counter.textContent = `${this.value.length}/500`;
        });
    }

    // Search suggestions
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', showSearchSuggestions);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchAds();
            }
        });
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('b2bTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }

    // Initialize page
    initializeSampleAds();

    // Back to top button
    window.addEventListener('scroll', function() {
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
});

// Add new ad
function addNewAd(event) {
    event.preventDefault();

    const newAd = {
        id: Date.now(),
        companyName: document.getElementById('companyName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('phone').value,
        type: document.getElementById('adType').value,
        category: document.getElementById('category').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        location: document.getElementById('location').value,
        budget: document.getElementById('budget').value,
        website: document.getElementById('website').value,
        verified: document.getElementById('verified').checked,
        featured: document.getElementById('featured').checked,
        date: new Date(),
        rating: 0,
        views: 0
    };

    ads.unshift(newAd);
    saveAds();

    resetAllFilters();
    filteredAds = [...ads];
    updateStats();
    updateCategoryCounts();
    displayAds();
    initCarousel();

    document.getElementById('adForm').reset();
    nextStep(1);

    showToast('Oglas je uspešno objavljen!', 'success');

    setTimeout(() => {
        scrollToSection('services');
    }, 1000);
}

// Search functionality
function searchAds() {
    applyFilters();
}

// Search suggestions
function showSearchSuggestions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const suggestions = document.getElementById('searchSuggestions');

    if (searchTerm.length < 2) {
        suggestions.style.display = 'none';
        return;
    }

    const matches = ads.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm) ||
        ad.description.toLowerCase().includes(searchTerm) ||
        ad.companyName.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    if (matches.length > 0) {
        suggestions.innerHTML = matches.map(ad => `
            <div class="suggestion-item" onclick="selectSuggestion('${ad.title}')">
                <strong>${ad.title}</strong>
                <br><small>${ad.companyName}</small>
            </div>
        `).join('');
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

function selectSuggestion(title) {
    document.getElementById('searchInput').value = title;
    document.getElementById('searchSuggestions').style.display = 'none';
    searchAds();
}

// Filter by specific category (from category cards)
function filterBySpecificCategory(category) {
    document.getElementById('categoryFilter').value = category;
    applyFilters();
    scrollToSection('services');
}

// Apply all active filters
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    const verifiedFilter = document.getElementById('verifiedFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    filteredAds = ads.filter(ad => {
        const matchesCategory = !categoryFilter || ad.category === categoryFilter;
        const matchesType = !typeFilter || ad.type === typeFilter;
        const matchesVerified = !verifiedFilter || (verifiedFilter === 'verified' && ad.verified);
        const matchesSearch = !searchTerm ||
                            ad.title.toLowerCase().includes(searchTerm) ||
                            ad.description.toLowerCase().includes(searchTerm) ||
                            ad.companyName.toLowerCase().includes(searchTerm) ||
                            categoryNames[ad.category].toLowerCase().includes(searchTerm);

        return matchesCategory && matchesType && matchesVerified && matchesSearch;
    });

    // Apply sorting
    if (sortFilter === 'date-desc') {
        filteredAds.sort((a, b) => b.date - a.date);
    } else if (sortFilter === 'date-asc') {
        filteredAds.sort((a, b) => a.date - b.date);
    } else if (sortFilter === 'price-asc') {
        filteredAds.sort((a, b) => (a.budget || '').localeCompare(b.budget || ''));
    } else if (sortFilter === 'price-desc') {
        filteredAds.sort((a, b) => (b.budget || '').localeCompare(a.budget || ''));
    } else if (sortFilter === 'rating-desc') {
        filteredAds.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    displayAds();
}

// Reset all filters
function resetAllFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('sortFilter').value = 'date-desc';
    document.getElementById('verifiedFilter').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchSuggestions').style.display = 'none';

    filteredAds = [...ads];
    displayAds();
}

// Switch between tabs
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayAds();
}

// Toggle favorite
function toggleFavorite(adId) {
    const index = favorites.indexOf(adId);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Uklonjeno iz omiljenih', 'info');
    } else {
        favorites.push(adId);
        showToast('Dodato u omiljene', 'success');
    }
    saveFavorites();
    displayAds();
}

// Share ad
function shareAd(adId) {
    const ad = ads.find(a => a.id === adId);
    if (!ad) return;

    const shareText = `Pogledaj ovaj oglas: ${ad.title} - ${ad.companyName}`;

    if (navigator.share) {
        navigator.share({
            title: ad.title,
            text: shareText,
            url: window.location.href
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Link kopiran u clipboard!', 'success');
    });
}

// Set view mode
function setView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));

    if (view === 'grid') {
        document.getElementById('gridViewBtn').classList.add('active');
    } else {
        document.getElementById('listViewBtn').classList.add('active');
    }

    displayAds();
}

// Contact company
function contactCompany(email, companyName) {
    const subject = encodeURIComponent(`Upit sa B2B Marketplace platforme`);
    const body = encodeURIComponent(`Poštovani,\n\nVideo sam vaš oglas na B2B Marketplace platformi i želeo bih da stupim u kontakt.\n\nSrdačan pozdrav`);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle theme (dark mode)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const icon = document.getElementById('themeIcon');

    if (isDark) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('b2bTheme', 'dark');
        showToast('Tamna tema aktivirana', 'info');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('b2bTheme', 'light');
        showToast('Svetla tema aktivirana', 'info');
    }
}

// Mobile menu toggle
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');

    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');

    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

// FAQ accordion
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const wasActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    if (!wasActive) {
        faqItem.classList.add('active');
    }
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;

    showToast('Uspešno ste se prijavili na newsletter!', 'success');
    event.target.reset();
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// Handle login (placeholder)
function handleLogin(event) {
    event.preventDefault();
    showToast('Funkcionalnost prijave će biti dostupna uskoro!', 'info');
    closeModal('loginModal');
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// Export functionality for potential future use
function exportAdsToJSON() {
    const dataStr = JSON.stringify(ads, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'b2b-ads-export.json';
    link.click();
}

// Clear all ads (for testing)
function clearAllAds() {
    if (confirm('Da li ste sigurni da želite da obrišete sve oglase?')) {
        ads = [];
        filteredAds = [];
        favorites = [];
        saveAds();
        saveFavorites();
        updateStats();
        updateCategoryCounts();
        displayAds();
        showToast('Svi oglasi su obrisani', 'info');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

console.log('🚀 B2B Marketplace loaded successfully!');
console.log(`📊 Total ads: ${ads.length}`);
console.log(`⭐ Featured ads: ${ads.filter(ad => ad.featured).length}`);
