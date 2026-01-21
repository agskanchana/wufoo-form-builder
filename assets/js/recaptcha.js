/**
 * EKWA Wufoo Form Builder - reCAPTCHA Integration
 * Handles Google reCAPTCHA v2 "I'm not a robot" checkbox validation
 */

(function() {
    'use strict';

    // Track reCAPTCHA verification status for each form
    var recaptchaVerified = {};

    /**
     * Callback function when reCAPTCHA is successfully completed
     * This is called by Google's reCAPTCHA API
     */
    window.ekwaRecaptchaCallback = function(response) {
        // Find the form that contains this reCAPTCHA
        var recaptchaWidgets = document.querySelectorAll('.g-recaptcha');
        recaptchaWidgets.forEach(function(widget) {
            var form = widget.closest('form');
            if (form) {
                var formId = form.id || form.name || 'unknown';
                recaptchaVerified[formId] = true;
                
                // Hide error message if visible
                var errorDiv = widget.parentElement.querySelector('.recaptcha-error');
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }
                
                // Remove any error styling from the widget
                widget.classList.remove('recaptcha-invalid');
            }
        });
    };

    /**
     * Callback function when reCAPTCHA expires
     * This is called by Google's reCAPTCHA API when the verification expires
     */
    window.ekwaRecaptchaExpired = function() {
        // Find all forms with reCAPTCHA and mark as unverified
        var recaptchaWidgets = document.querySelectorAll('.g-recaptcha');
        recaptchaWidgets.forEach(function(widget) {
            var form = widget.closest('form');
            if (form) {
                var formId = form.id || form.name || 'unknown';
                recaptchaVerified[formId] = false;
            }
        });
    };

    /**
     * Check if reCAPTCHA is verified for a specific form
     * @param {HTMLFormElement} form - The form element to check
     * @returns {boolean} - True if verified, false otherwise
     */
    function isRecaptchaVerified(form) {
        var formId = form.id || form.name || 'unknown';
        return recaptchaVerified[formId] === true;
    }

    /**
     * Show reCAPTCHA error for a form
     * @param {HTMLFormElement} form - The form element
     */
    function showRecaptchaError(form) {
        var wrapper = form.querySelector('.ekwa-recaptcha-wrapper');
        if (wrapper) {
            var errorDiv = wrapper.querySelector('.recaptcha-error');
            var recaptchaWidget = wrapper.querySelector('.g-recaptcha');
            
            if (errorDiv) {
                errorDiv.style.display = 'block';
            }
            
            if (recaptchaWidget) {
                recaptchaWidget.classList.add('recaptcha-invalid');
            }

            // Scroll to reCAPTCHA if not in view
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Initialize reCAPTCHA validation for all forms
     */
    function initRecaptchaValidation() {
        // Find all forms with reCAPTCHA enabled
        var formsWithRecaptcha = document.querySelectorAll('.ekwa-wufoo-form-builder[data-recaptcha="true"] form');
        
        formsWithRecaptcha.forEach(function(form) {
            // Remove any existing listener to prevent duplicates
            form.removeEventListener('submit', handleFormSubmit);
            
            // Add submit handler
            form.addEventListener('submit', handleFormSubmit);
        });
    }

    /**
     * Handle form submission with reCAPTCHA validation
     * @param {Event} event - The submit event
     */
    function handleFormSubmit(event) {
        var form = event.target;
        var hasRecaptcha = form.querySelector('.g-recaptcha');
        
        if (hasRecaptcha && !isRecaptchaVerified(form)) {
            event.preventDefault();
            event.stopPropagation();
            showRecaptchaError(form);
            return false;
        }
    }

    /**
     * Render all reCAPTCHA widgets on the page
     * Required when using render=explicit mode
     */
    function renderRecaptchaWidgets() {
        var recaptchaWidgets = document.querySelectorAll('.g-recaptcha:not([data-rendered="true"])');
        recaptchaWidgets.forEach(function(widget) {
            var sitekey = widget.getAttribute('data-sitekey');
            if (sitekey && typeof grecaptcha !== 'undefined' && grecaptcha.render) {
                try {
                    grecaptcha.render(widget, {
                        'sitekey': sitekey,
                        'callback': 'ekwaRecaptchaCallback',
                        'expired-callback': 'ekwaRecaptchaExpired'
                    });
                    widget.setAttribute('data-rendered', 'true');
                } catch (e) {
                    // Widget may already be rendered, ignore error
                    console.log('reCAPTCHA render skipped:', e.message);
                }
            }
        });
    }

    /**
     * Callback when reCAPTCHA API is loaded
     * This is called by Google's reCAPTCHA script
     */
    window.ekwaRecaptchaOnLoad = function() {
        // Explicitly render all reCAPTCHA widgets
        renderRecaptchaWidgets();
        // Initialize our validation handlers
        initRecaptchaValidation();
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRecaptchaValidation);
    } else {
        // DOM is already ready
        initRecaptchaValidation();
    }

    // Re-initialize if new content is added (for dynamic page loading)
    if (typeof MutationObserver !== 'undefined') {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    // Check if any new forms with reCAPTCHA were added
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.querySelector) {
                            if (node.querySelector('.ekwa-wufoo-form-builder[data-recaptcha="true"]') ||
                                node.classList && node.classList.contains('ekwa-wufoo-form-builder')) {
                                // Render any new reCAPTCHA widgets
                                if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
                                    renderRecaptchaWidgets();
                                }
                                initRecaptchaValidation();
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
