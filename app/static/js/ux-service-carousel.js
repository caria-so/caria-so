// UX Service Carousel Component
class UXServiceCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Carousel container not found:', containerId);
            return;
        }
        
        this.currentSlide = 0;
        // this.slides = [
        //     {
        //         badge: "Philosophy",
        //         title: "No best experience.",
        //         subtitle: "Only a better one than your competitors.",
        //         content: "I don't chase ideals. I study what hundreds of sites in your vertical actually do — and find where you can beat them."
        //     },
        //     {
        //         badge: "Method",
        //         title: "Automated forensics.",
        //         subtitle: "At a scale humans can't match.",
        //         content: "Crawlers, screenshots, performance data, UX patterns — harvested across your competitive landscape while you sleep."
        //     },
        //     {
        //         badge: "Outcome",
        //         title: "A dossier, not a deck.",
        //         subtitle: "Evidence you can act on Monday morning.",
        //         content: "Prioritized fixes ranked by revenue impact. What to change, where, and why — with the data to back every recommendation."
        //     }
        // ];

        this.slides = [
            {
                badge: "Layer 1 — Technical",
                title: "What the browser sees.",
                subtitle: "Across hundreds of sites.",
                content: "Performance, accessibility, SEO. The baseline. Standardized, comparable, automated."
            },
            {
                badge: "Layer 2 — Structural",
                title: "What the code reveals.",
                subtitle: "DOM parsing and feature detection.",
                content: "What's built, what's missing, how it's organized. Not guessing — reading the HTML."
            },
            {
                badge: "Layer 3 — Perceptual",
                title: "What a human would see.",
                subtitle: "AI Vision above the fold.",
                content: "A search bar can exist in the code and be invisible on screen. When layers disagree, you've found something."
            },
            {
                badge: "Layer 4 — Behavioral",
                title: "What happens when you use it.",
                subtitle: "Automation interacts like a real user.",
                content: "Type a query. Click a filter. Trigger autocomplete. Test what breaks. This isn't observation — it's engagement."
            }
        ];
        
        this.init();
    }
    
    init() {
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        const currentSlideData = this.slides[this.currentSlide];
        
        this.container.innerHTML = `
            <div class="carousel-content">
                <div class="card-badge flex horizontal gap-s aligncenter mb-m">
                    <div class="card-badge-dot dot-pulse" style="background-color: #667eea; animation-delay: 0.3s;"></div>
                    <div class="card-badge-text txt-mono txt-light uppercase txt-xsmall">${currentSlideData.badge}</div>
                </div>
                <h3 class="txt-bold" style="margin: 0 0 16px 0; color: var(--c-text-primary)">${currentSlideData.title}</h2>
                <h5 class="txt-light mb-m">${currentSlideData.subtitle}</h4>
                <p class="txt-light mb-m">${currentSlideData.content}</p>
                
                <div class="carousel-controls" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--c-border); display: flex; justify-content: space-between; align-items: center;">
                    <button class="carousel-btn carousel-prev" ${this.currentSlide === 0 ? 'disabled' : ''}>
                        <i class="ph ph-caret-left"></i>
                    </button>
                    
                    <div class="carousel-indicators">
                        ${this.slides.map((_, index) => `
                            <div class="carousel-dot ${index === this.currentSlide ? 'active' : ''}" data-slide="${index}"></div>
                        `).join('')}
                    </div>
                    
                    <button class="carousel-btn carousel-next" ${this.currentSlide === this.slides.length - 1 ? 'disabled' : ''}>
                        <i class="ph ph-caret-right"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Previous button
        this.container.querySelector('.carousel-prev')?.addEventListener('click', () => {
            if (this.currentSlide > 0) {
                this.currentSlide--;
                this.render();
                this.setupEventListeners();
            }
        });
        
        // Next button
        this.container.querySelector('.carousel-next')?.addEventListener('click', () => {
            if (this.currentSlide < this.slides.length - 1) {
                this.currentSlide++;
                this.render();
                this.setupEventListeners();
            }
        });
        
        // Dot indicators
        this.container.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.currentSlide = slideIndex;
                this.render();
                this.setupEventListeners();
            });
        });
    }
}

// CSS styles for the carousel
const carouselStyles = `
<style>
.carousel-btn {
    background: var(--c-background-gray);
    border: 1px solid var(--c-border);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--c-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.carousel-btn:hover:not(:disabled) {
    background: var(--c-border);
    color: var(--c-text-primary);
    transform: scale(1.05);
}

.carousel-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.carousel-indicators {
    display: flex;
    gap: 8px;
}

.carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--c-border);
    cursor: pointer;
    transition: all 0.2s ease;
}

.carousel-dot.active {
    background: var(--c-accent);
    transform: scale(1.2);
}

.carousel-dot:hover {
    background: var(--c-text-secondary);
}

.carousel-content {
    transition: opacity 0.3s ease;
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', carouselStyles);

// Export for use
window.UXServiceCarousel = UXServiceCarousel;