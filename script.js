// Global variables
let scene, camera, renderer, particles, logoMesh, avatarMesh, fabMesh;
let chatbotOpen = false;
let currentSlide = 0;
const totalSlides = 3;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThreeJS();
    initNavigation();
    initAnimations();
    initChatbot();
    initPortfolioFilter();
    initShowcase();
    initContactForm();
    initNewsletterForm();
    initScrollEffects();
});

// Three.js Initialization
function initThreeJS() {
    // Hero 3D Background
    initHero3D();
    
    // Logo 3D
    initLogo3D();
    
    // Chatbot Avatar 3D
    initChatbotAvatar3D();
    
    // FAB 3D
    initFAB3D();
}

function initHero3D() {
    const heroContainer = document.getElementById('hero-3d');
    if (!heroContainer) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    heroContainer.appendChild(renderer.domElement);

    // Create floating geometric shapes
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, 32, 32),
        new THREE.ConeGeometry(0.7, 1.5, 32),
        new THREE.OctahedronGeometry(0.8)
    ];

    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.3 }),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.3 }),
        new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.3 }),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.3 })
    ];

    const meshes = [];
    for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 50;
        mesh.position.y = (Math.random() - 0.5) * 30;
        mesh.position.z = (Math.random() - 0.5) * 30;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        scene.add(mesh);
        meshes.push(mesh);
    }

    camera.position.z = 20;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        meshes.forEach((mesh, index) => {
            mesh.rotation.x += 0.005 + index * 0.001;
            mesh.rotation.y += 0.005 + index * 0.001;
            mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });
        
        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initLogo3D() {
    const logoContainer = document.getElementById('logo-3d');
    if (!logoContainer) return;

    const logoScene = new THREE.Scene();
    const logoCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const logoRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    logoRenderer.setSize(40, 40);
    logoRenderer.setClearColor(0x000000, 0);
    logoContainer.appendChild(logoRenderer.domElement);

    // Create logo geometry
    const logoGeometry = new THREE.RingGeometry(0.5, 1, 6);
    const logoMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x8b5cf6, 
        transparent: true, 
        opacity: 0.8 
    });
    logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoScene.add(logoMesh);

    logoCamera.position.z = 3;

    function animateLogo() {
        requestAnimationFrame(animateLogo);
        logoMesh.rotation.z += 0.02;
        logoRenderer.render(logoScene, logoCamera);
    }
    animateLogo();
}

function initChatbotAvatar3D() {
    const avatarContainer = document.getElementById('chatbot-avatar');
    if (!avatarContainer) return;

    const avatarScene = new THREE.Scene();
    const avatarCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const avatarRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    avatarRenderer.setSize(24, 24);
    avatarRenderer.setClearColor(0x000000, 0);
    avatarContainer.appendChild(avatarRenderer.domElement);

    // Create avatar geometry
    const avatarGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const avatarMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x06b6d4, 
        wireframe: true,
        transparent: true, 
        opacity: 0.8 
    });
    avatarMesh = new THREE.Mesh(avatarGeometry, avatarMaterial);
    avatarScene.add(avatarMesh);

    avatarCamera.position.z = 2;

    function animateAvatar() {
        requestAnimationFrame(animateAvatar);
        avatarMesh.rotation.x += 0.01;
        avatarMesh.rotation.y += 0.02;
        avatarRenderer.render(avatarScene, avatarCamera);
    }
    animateAvatar();
}

function initFAB3D() {
    const fabContainer = document.getElementById('fab-3d');
    if (!fabContainer) return;

    const fabScene = new THREE.Scene();
    const fabCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const fabRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    fabRenderer.setSize(30, 30);
    fabRenderer.setClearColor(0x000000, 0);
    fabContainer.appendChild(fabRenderer.domElement);

    // Create FAB geometry
    const fabGeometry = new THREE.OctahedronGeometry(0.6);
    const fabMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.9 
    });
    fabMesh = new THREE.Mesh(fabGeometry, fabMaterial);
    fabScene.add(fabMesh);

    fabCamera.position.z = 2;

    function animateFAB() {
        requestAnimationFrame(animateFAB);
        fabMesh.rotation.x += 0.02;
        fabMesh.rotation.y += 0.02;
        fabRenderer.render(fabScene, fabCamera);
    }
    animateFAB();
}

// Navigation
function initNavigation() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Animations and scroll effects
function initAnimations() {
    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / 100;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 20);
            } else {
                counter.innerText = target;
            }
        });
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Trigger counter animation when stats section is visible
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Observe stats section
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Chatbot functionality
function initChatbot() {
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotContainer = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Predefined responses
    const responses = {
        'hello': 'Hello! Welcome to Browque. How can I help you with your advertising needs today?',
        'hi': 'Hi there! I\'m here to help you learn about our advertising services. What would you like to know?',
        'services': 'We offer comprehensive advertising solutions including newspaper advertising, digital marketing, social media campaigns, and cross-media analytics. Which service interests you most?',
        'newspaper': 'Our newspaper advertising service partners with top-tier publications like The Wall Street Journal and The New York Times. We help you reach affluent, engaged audiences with proven purchasing power.',
        'digital': 'Our digital marketing services include Google Ads, social media campaigns, email marketing, and programmatic advertising. We\'ve generated over 2.5 billion digital impressions for our clients!',
        'pricing': 'Our pricing varies based on your specific needs and campaign scope. I\'d recommend scheduling a consultation with our team to discuss your goals and get a customized quote.',
        'contact': 'You can reach us at campaigns@browque.com or call us at +1 (555) 123-GROW. We\'re also located at 456 Media Plaza, Suite 200, New York, NY 10001.',
        'portfolio': 'We\'ve helped clients achieve amazing results like +340% online sales growth, +500% brand awareness increases, and 3M+ app downloads. Check out our portfolio section for more success stories!',
        'default': 'That\'s a great question! For detailed information about that topic, I\'d recommend speaking with one of our advertising specialists. You can contact us through the form on this page or call us directly.'
    };

    // Open/close chatbot
    chatbotFab.addEventListener('click', () => {
        toggleChatbot();
    });

    chatbotToggle.addEventListener('click', () => {
        toggleChatbot();
    });

    function toggleChatbot() {
        chatbotOpen = !chatbotOpen;
        if (chatbotOpen) {
            chatbotContainer.classList.add('active');
            chatbotFab.style.display = 'none';
        } else {
            chatbotContainer.classList.remove('active');
            chatbotFab.style.display = 'flex';
        }
    }

    // Send message
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
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Portfolio filter
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Digital showcase slider
function initShowcase() {
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const controlBtns = document.querySelectorAll('.control-btn');

    function showSlide(index) {
        showcaseItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        controlBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
    }

    controlBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }, 5000);
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you within 24 hours.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Newsletter form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        const submitBtn = newsletterForm.querySelector('button');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Scroll effects
function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Smooth reveal animations
    const revealElements = document.querySelectorAll('.service-card, .portfolio-item, .feature-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
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

// Performance optimization
const debouncedResize = debounce(() => {
    if (renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// Console log for debugging
console.log('[v0] Browque website initialized successfully');