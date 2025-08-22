// Password Generator Logic
class PasswordGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updateLengthDisplay();
    }

    initializeElements() {
        this.lengthSlider = document.getElementById('password-length');
        this.lengthValue = document.querySelector('.length-value');
        this.uppercaseCheckbox = document.getElementById('uppercase');
        this.lowercaseCheckbox = document.getElementById('lowercase');
        this.numbersCheckbox = document.getElementById('numbers');
        this.symbolsCheckbox = document.getElementById('symbols');
        this.generateBtn = document.getElementById('generate-btn');
        this.passwordInput = document.getElementById('generated-password');
        this.copyBtn = document.getElementById('copy-btn');
        this.strengthFill = document.getElementById('strength-fill');
        this.strengthText = document.getElementById('strength-text');
    }

    bindEvents() {
        this.lengthSlider.addEventListener('input', () => this.updateLengthDisplay());
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyBtn.addEventListener('click', () => this.copyPassword());
        
        // Add event listeners for checkboxes to ensure at least one is selected
        [this.uppercaseCheckbox, this.lowercaseCheckbox, this.numbersCheckbox, this.symbolsCheckbox].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validateCheckboxes());
        });
    }

    updateLengthDisplay() {
        this.lengthValue.textContent = this.lengthSlider.value;
    }

    validateCheckboxes() {
        const checkboxes = [this.uppercaseCheckbox, this.lowercaseCheckbox, this.numbersCheckbox, this.symbolsCheckbox];
        const checkedCount = checkboxes.filter(cb => cb.checked).length;
        
        if (checkedCount === 0) {
            // If no checkboxes are selected, re-check the first one
            this.uppercaseCheckbox.checked = true;
        }
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        const useUppercase = this.uppercaseCheckbox.checked;
        const useLowercase = this.lowercaseCheckbox.checked;
        const useNumbers = this.numbersCheckbox.checked;
        const useSymbols = this.symbolsCheckbox.checked;

        // Validate that at least one character type is selected
        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
            alert('Please select at least one character type!');
            return;
        }

        // Build character pool based on selected options
        let charPool = '';
        if (useUppercase) charPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLowercase) charPool += 'abcdefghijklmnopqrstuvwxyz';
        if (useNumbers) charPool += '0123456789';
        if (useSymbols) charPool += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        // Ensure the password includes at least one character from each selected type
        let password = '';
        if (useUppercase) password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (useLowercase) password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz');
        if (useNumbers) password += this.getRandomChar('0123456789');
        if (useSymbols) password += this.getRandomChar('!@#$%^&*()_+-=[]{}|;:,.<>?');

        // Fill the remaining length with random characters from the pool
        const remainingLength = length - password.length;
        for (let i = 0; i < remainingLength; i++) {
            password += this.getRandomChar(charPool);
        }

        // Shuffle the password to make character order unpredictable
        password = this.shuffleString(password);

        // Display the password
        this.passwordInput.value = password;
        
        // Update strength indicator
        this.updateStrengthIndicator(password);
        
        // Add success animation
        this.addSuccessAnimation();
    }

    getRandomChar(charSet) {
        return charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    updateStrengthIndicator(password) {
        let strength = 0;
        let strengthText = '';
        let strengthColor = '';

        // Calculate strength based on various factors
        if (password.length >= 12) strength += 1;
        if (password.length >= 16) strength += 1;
        if (password.length >= 20) strength += 1;
        
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // Determine strength level
        if (strength <= 3) {
            strengthText = 'Weak';
            strengthColor = '#ff4444';
        } else if (strength <= 5) {
            strengthText = 'Fair';
            strengthColor = '#ffaa00';
        } else if (strength <= 7) {
            strengthText = 'Good';
            strengthColor = '#00aa00';
        } else {
            strengthText = 'Strong';
            strengthColor = '#008800';
        }

        // Update UI
        this.strengthFill.style.width = `${(strength / 8) * 100}%`;
        this.strengthFill.style.background = strengthColor;
        this.strengthText.textContent = `Strength: ${strengthText}`;
    }

    addSuccessAnimation() {
        this.passwordInput.style.animation = 'none';
        this.passwordInput.offsetHeight; // Trigger reflow
        this.passwordInput.style.animation = 'successPulse 0.6s ease-in-out';
    }

    async copyPassword() {
        if (!this.passwordInput.value) {
            alert('Generate a password first!');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.passwordInput.value);
            
            // Update button text temporarily
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '✅ Copied!';
            this.copyBtn.style.background = '#00aa00';
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.style.background = '';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            this.passwordInput.select();
            document.execCommand('copy');
            
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '✅ Copied!';
            this.copyBtn.style.background = '#00aa00';
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.style.background = '';
            }, 2000);
        }
    }
}

// FAQ Functionality
class FAQManager {
    constructor() {
        this.initializeFAQ();
    }

    initializeFAQ() {
        const faqItems = Array.from(document.querySelectorAll('.cs-faq-item'));
        
        for (const item of faqItems) {
            const button = item.querySelector('.cs-button');
            const onClick = () => {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            };
            
            button.addEventListener('click', onClick);
        }
    }
}

// Smooth Scrolling for Navigation
class SmoothScroller {
    constructor() {
        this.initializeSmoothScrolling();
    }

    initializeSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Header Scroll Effect
class HeaderScrollEffect {
    constructor() {
        this.header = document.querySelector('.header');
        this.initializeScrollEffect();
    }

    initializeScrollEffect() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                this.header.style.background = 'rgba(255, 255, 255, 0.98)';
                this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                this.header.style.background = 'rgba(255, 255, 255, 0.95)';
                this.header.style.boxShadow = 'none';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Add CSS animations
const addAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addAnimations();
    
    // Initialize all components
    new PasswordGenerator();
    new FAQManager();
    new SmoothScroller();
    new HeaderScrollEffect();
    
    // Add fade-in animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Generate initial password
    setTimeout(() => {
        document.getElementById('generate-btn').click();
    }, 1000);
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero .cs-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
});

// Add some additional utility functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Generate a random color for fun
    getRandomColor: () => {
        const colors = ['#ff6a3e', '#ffba43', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

// Add some fun interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to tech stack items
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.borderColor = utils.getRandomColor();
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.borderColor = '';
        });
    });
    

});
