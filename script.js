// Global variables
let scene, camera, renderer, particles, logo3D, chatbot3D, fab3D;
let showcaseIndex = 0;
let showcaseInterval;
let isScrolling = false;
const THREE = window.THREE; // Declare the THREE variable

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeHero3D();
    initializeChatbot();
    initializeAnimations();
    initializePortfolioFilter();
    initializeShowcase();
    initializeFormHandling();
    initializeScrollEffects();
    initializeLazyLoading(); // Initialize lazy loading when DOM is ready
    
    // Start animations
    animate();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Initialize 3D elements for hero section
function initializeHero3D() {
    // Initialize Three.js scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    const hero3DContainer = document.getElementById('hero-3d');
    if (hero3DContainer) {
        renderer.setSize(hero3DContainer.clientWidth, hero3DContainer.clientHeight);
        renderer.setClearColor(0x000000, 0);
        hero3DContainer.appendChild(renderer.domElement);
    }

    // Create animated background geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 5000; i++) {
        vertices.push(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
        
        colors.push(
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.3 + 0.7,
            1
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Create 3D logo
    const logoGeometry = new THREE.BoxGeometry(2, 2, 2);
    const logoMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.8
    });
    logo3D = new THREE.Mesh(logoGeometry, logoMaterial);
    logo3D.position.set(0, 0, -5);
    scene.add(logo3D);

    camera.position.z = 5;

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Initialize chatbot functionality
function initializeChatbot() {
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotContainer = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Chatbot responses
    const responses = {
        'hello': 'Hello! Welcome to Browque. How can I help you with your advertising needs today?',
        'services': 'We offer comprehensive advertising solutions including newspaper advertising, digital marketing, social media campaigns, and cross-media analytics. Which service interests you most?',
        'newspaper': 'Our newspaper advertising service partners with top-tier publications like The Wall Street Journal and The New York Times. We help you reach affluent, engaged audiences with proven purchasing power.',
        'digital': 'Our digital marketing services include Google Ads, social media campaigns, email marketing, and programmatic advertising. We use data-driven strategies to maximize your ROI.',
        'pricing': 'Our pricing varies based on campaign scope and media mix. Would you like to schedule a consultation to discuss your specific needs and get a custom quote?',
        'contact': 'You can reach us at campaigns@browque.com or call +1 (555) 123-GROW. We\'re also located at 456 Media Plaza, Suite 200, New York, NY 10001.',
        'portfolio': 'We\'ve helped clients achieve amazing results: +340% online sales growth, +500% brand awareness increases, and +180% showroom traffic boosts. Would you like to see specific case studies?',
        'default': 'That\'s a great question! Our advertising experts would love to discuss this with you in detail. Would you like to schedule a consultation or learn more about our services?'
    };

    // Toggle chatbot
    function toggleChatbot() {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    }

    chatbotFab.addEventListener('click', toggleChatbot);
    chatbotToggle.addEventListener('click', toggleChatbot);

    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Generate bot response
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Generate bot response
    function generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }

    // Event listeners
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initialize 3D chatbot elements
    initializeChatbot3D();
}

// Initialize 3D elements for chatbot
function initializeChatbot3D() {
    // Create 3D avatar for chatbot header
    const avatarContainer = document.getElementById('chatbot-avatar');
    if (avatarContainer) {
        const avatarScene = new THREE.Scene();
        const avatarCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const avatarRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        avatarRenderer.setSize(30, 30);
        avatarRenderer.setClearColor(0x000000, 0);
        avatarContainer.appendChild(avatarRenderer.domElement);

        const avatarGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const avatarMaterial = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.8
        });
        chatbot3D = new THREE.Mesh(avatarGeometry, avatarMaterial);
        avatarScene.add(chatbot3D);

        avatarCamera.position.z = 2;

        function animateAvatar() {
            requestAnimationFrame(animateAvatar);
            chatbot3D.rotation.y += 0.02;
            avatarRenderer.render(avatarScene, avatarCamera);
        }
        animateAvatar();
    }

    // Create 3D FAB
    const fabContainer = document.getElementById('fab-3d');
    if (fabContainer) {
        const fabScene = new THREE.Scene();
        const fabCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const fabRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        fabRenderer.setSize(30, 30);
        fabRenderer.setClearColor(0x000000, 0);
        fabContainer.appendChild(fabRenderer.domElement);

        const fabGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const fabMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        fab3D = new THREE.Mesh(fabGeometry, fabMaterial);
        fabScene.add(fab3D);

        fabCamera.position.z = 2;

        function animateFab() {
            requestAnimationFrame(animateFab);
            fab3D.rotation.x += 0.01;
            fab3D.rotation.y += 0.01;
            fabRenderer.render(fabScene, fabCamera);
        }
        animateFab();
    }
}

// Initialize scroll-triggered animations
function initializeAnimations() {
    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // General scroll animations
    const animatedElements = document.querySelectorAll('[data-aos]');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        animationObserver.observe(element);
    });
}

// Animate counter numbers
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Initialize portfolio filter
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hidden');
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.classList.add('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                }
            });
        });
    });
}

// Initialize showcase slider
function initializeShowcase() {
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const controlButtons = document.querySelectorAll('.control-btn');

    function showSlide(index) {
        showcaseItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        controlButtons.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        showcaseIndex = (showcaseIndex + 1) % showcaseItems.length;
        showSlide(showcaseIndex);
    }

    // Auto-advance slides
    showcaseInterval = setInterval(nextSlide, 4000);

    // Manual control
    controlButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            clearInterval(showcaseInterval);
            showcaseIndex = index;
            showSlide(showcaseIndex);
            showcaseInterval = setInterval(nextSlide, 4000);
        });
    });

    // Pause on hover
    const showcaseContainer = document.querySelector('.digital-showcase');
    if (showcaseContainer) {
        showcaseContainer.addEventListener('mouseenter', () => {
            clearInterval(showcaseInterval);
        });
        
        showcaseContainer.addEventListener('mouseleave', () => {
            showcaseInterval = setInterval(nextSlide, 4000);
        });
    }
}

// Initialize form handling
function initializeFormHandling() {
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                alert('Thank you for your message! We\'ll get back to you within 24 hours.');
                this.reset();
                submitButton.textContent = 'Launch My Campaign';
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Show loading state
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            // Simulate subscription
            setTimeout(() => {
                alert('Successfully subscribed to our newsletter!');
                this.reset();
                submitButton.textContent = 'Subscribe';
                submitButton.disabled = false;
            }, 1500);
        });
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// 3D Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }

    if (logo3D) {
        logo3D.rotation.x += 0.01;
        logo3D.rotation.y += 0.01;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Handle window resize
function onWindowResize() {
    if (camera && renderer) {
        const hero3DContainer = document.getElementById('hero-3d');
        if (hero3DContainer) {
            camera.aspect = hero3DContainer.clientWidth / hero3DContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(hero3DContainer.clientWidth, hero3DContainer.clientHeight);
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization
const debouncedResize = debounce(onWindowResize, 250);
window.addEventListener('resize', debouncedResize);

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}