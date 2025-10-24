// Storage for ads
let ads = [];
let filteredAds = [];

// Category names mapping
const categoryNames = {
    'transport': 'Transport i Logistika',
    'it': 'IT Usluge',
    'marketing': 'Marketing i Reklama',
    'consulting': 'Konsultantske Usluge',
    'manufacturing': 'Proizvodnja',
    'finance': 'Finansijske Usluge',
    'other': 'Ostalo'
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
            date: new Date('2024-01-15')
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
            date: new Date('2024-01-14')
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
            date: new Date('2024-01-13')
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
            date: new Date('2024-01-12')
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
            date: new Date('2024-01-11')
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
            date: new Date('2024-01-10')
        }
    ];

    // Load from localStorage or use sample data
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
    displayAds();
}

// Save ads to localStorage
function saveAds() {
    localStorage.setItem('b2bAds', JSON.stringify(ads));
}

// Display ads in the grid
function displayAds() {
    const container = document.getElementById('adsContainer');
    const noResults = document.getElementById('noResults');

    if (filteredAds.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    noResults.style.display = 'none';

    // Sort by date (newest first)
    const sortedAds = [...filteredAds].sort((a, b) => b.date - a.date);

    container.innerHTML = sortedAds.map(ad => `
        <div class="ad-card">
            <div>
                <span class="ad-type-badge ${ad.type === 'offer' ? 'ad-type-offer' : 'ad-type-request'}">
                    ${ad.type === 'offer' ? '✓ Nudim uslugu' : '⚡ Tražim uslugu'}
                </span>
                <span class="ad-category">${categoryNames[ad.category]}</span>
            </div>
            <h3>${ad.title}</h3>
            <p>${ad.description}</p>
            <div class="ad-meta">
                <div class="ad-meta-item">
                    <span class="ad-meta-icon">🏢</span>
                    <span>${ad.companyName}</span>
                </div>
                ${ad.location ? `
                    <div class="ad-meta-item">
                        <span class="ad-meta-icon">📍</span>
                        <span>${ad.location}</span>
                    </div>
                ` : ''}
                <div class="ad-meta-item">
                    <span class="ad-meta-icon">📅</span>
                    <span>${formatDate(ad.date)}</span>
                </div>
                ${ad.phone ? `
                    <div class="ad-meta-item">
                        <span class="ad-meta-icon">📞</span>
                        <span>${ad.phone}</span>
                    </div>
                ` : ''}
            </div>
            <button class="ad-contact-btn" onclick="contactCompany('${ad.email}', '${ad.companyName}')">
                Kontaktiraj
            </button>
        </div>
    `).join('');
}

// Format date for display
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('sr-RS', options);
}

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
        date: new Date()
    };

    ads.unshift(newAd);
    saveAds();

    // Reset filters and display
    resetFilters();
    filteredAds = [...ads];
    displayAds();

    // Reset form
    document.getElementById('adForm').reset();

    // Scroll to services section
    alert('Oglas je uspešno objavljen! ✓');
    scrollToSection('services');
}

// Search functionality
function searchAds() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    filteredAds = ads.filter(ad => {
        return ad.title.toLowerCase().includes(searchTerm) ||
               ad.description.toLowerCase().includes(searchTerm) ||
               ad.companyName.toLowerCase().includes(searchTerm) ||
               categoryNames[ad.category].toLowerCase().includes(searchTerm);
    });

    // Apply existing filters
    applyFilters();
    displayAds();
}

// Filter by category
function filterByCategory() {
    applyFilters();
}

// Filter by type
function filterByType() {
    applyFilters();
}

// Apply all active filters
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    filteredAds = ads.filter(ad => {
        const matchesCategory = !categoryFilter || ad.category === categoryFilter;
        const matchesType = !typeFilter || ad.type === typeFilter;
        const matchesSearch = !searchTerm ||
                            ad.title.toLowerCase().includes(searchTerm) ||
                            ad.description.toLowerCase().includes(searchTerm) ||
                            ad.companyName.toLowerCase().includes(searchTerm) ||
                            categoryNames[ad.category].toLowerCase().includes(searchTerm);

        return matchesCategory && matchesType && matchesSearch;
    });

    displayAds();
}

// Reset filters
function resetFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('searchInput').value = '';
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

// Handle search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchAds();
            }
        });
    }

    // Initialize the page
    initializeSampleAds();
});

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
        saveAds();
        displayAds();
    }
}
