class FullWidthCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dots = document.querySelectorAll('.carousel-dot-fw');
        this.prevBtn = document.querySelector('.carousel-arrow-prev');
        this.nextBtn = document.querySelector('.carousel-arrow-next');
        this.autoplayInterval = null;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.startAutoplay();
        
        const carousel = document.querySelector('.hero-carousel-fullwidth');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoplay());
            carousel.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    goToSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        this.currentSlide = index % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1 + this.slides.length);
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), 8000);
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
}
const carousel = new FullWidthCarousel();


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

    class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;
    
        this.inputs = {
        nombre:   this.form.querySelector('#nombre'),
        email:    this.form.querySelector('#email'),
        telefono: this.form.querySelector('#telefono'),
        empresa:  this.form.querySelector('#empresa'),
        proyecto: this.form.querySelector('#proyecto'),
        };
    
        this.submitBtn  = this.form.querySelector('.btn-submit');
        this.btnText    = this.form.querySelector('.btn-text');
        this.btnArrow   = this.form.querySelector('.btn-arrow');
        this.btnLoader  = this.form.querySelector('.btn-loader');
        this.successMsg = this.form.querySelector('.form-success');
    
        this._init();
    }
    
    _init() {
        this._observeCards();
    
        Object.values(this.inputs).forEach(input => {
        if (!input) return;
        input.addEventListener('blur',  () => this._validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) this._validateField(input);
        });
        });
    
        this.form.addEventListener('submit', e => this._handleSubmit(e));
    }
    
    _observeCards() {
        const targets = document.querySelectorAll('.info-item, .info-cta, .contact-form');
        if (!targets.length || !window.IntersectionObserver) return;
    
        const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${i * 80}ms`;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
            }
        });
        }, { threshold: 0.15 });
    
        const style = document.createElement('style');
        style.textContent = `
        .info-item, .info-cta, .contact-form {
            opacity: 0;
            transform: translateY(24px);
            transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .info-item.is-visible, .info-cta.is-visible, .contact-form.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        `;
        document.head.appendChild(style);
    
        targets.forEach(el => observer.observe(el));
    }
    
    _validateField(field) {
        const value     = field.value.trim();
        const errorSpan = field.closest('.form-group').querySelector('.form-error');
        let isValid  = true;
        let errorMsg = '';
    
        if (!value) {
        isValid  = false;
        errorMsg = 'Este campo es requerido';
        } else {
        switch (field.type) {
            case 'email':
            isValid  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            errorMsg = 'Ingresa un email válido';
            break;
            case 'tel':
            isValid  = /^[\d\s+\-()]+$/.test(value) && value.replace(/\D/g, '').length >= 9;
            errorMsg = 'Ingresa un teléfono válido (mín. 9 dígitos)';
            break;
        }
        }
    
        if (isValid) {
        field.classList.remove('error');
        if (errorSpan) { errorSpan.textContent = ''; errorSpan.classList.remove('show'); }
        } else {
        field.classList.add('error');
        if (errorSpan) { errorSpan.textContent = errorMsg; errorSpan.classList.add('show'); }
        }
    
        return isValid;
    }
    
    _validateForm() {
        let valid = true;
        Object.values(this.inputs).forEach(input => {
        if (input && !this._validateField(input)) valid = false;
        });
        return valid;
    }
    
    _handleSubmit(e) {
        e.preventDefault();
        if (!this._validateForm()) return;
    
        this._setLoading(true);
    
        const formData = Object.fromEntries(
        Object.entries(this.inputs).map(([k, v]) => [k, v?.value ?? ''])
        );

        console.log('[ContactForm] data:', formData);
    
        setTimeout(() => {
        this._setLoading(false);
        this._showSuccess();
        this.form.reset();
        }, 1600);
    }
    
    _setLoading(on) {
        this.submitBtn.disabled = on;
        this.btnText.classList.toggle('hide', on);
        this.btnArrow?.classList.toggle('hide', on);
        this.btnLoader.classList.toggle('show', on);
    }
    
    _showSuccess() {
        this.successMsg.classList.remove('hidden');
        setTimeout(() => this.successMsg.classList.add('hidden'), 5000);
    }
    }
    
    document.addEventListener('DOMContentLoaded', () => new ContactForm());

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .proceso-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


    (function initProcesoReveal() {
    const steps = document.querySelectorAll('.proceso-step');
    if (!steps.length || !window.IntersectionObserver) {
        steps.forEach(s => s.classList.add('is-visible'));
        return;
    }
    
    const observer = new IntersectionObserver(
        (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            const siblings = [...entry.target.parentElement.children];
            const index    = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 90}ms`;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
            }
        });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    
    steps.forEach(step => observer.observe(step));
    })();