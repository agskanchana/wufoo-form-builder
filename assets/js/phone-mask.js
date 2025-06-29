(function() {
    'use strict';

    // Initialize phone masking when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializePhoneMasking();
    });

    function initializePhoneMasking() {
        const phoneInputs = document.querySelectorAll('input.ekwa-phone-mask[data-mask]');

        phoneInputs.forEach(function(input) {
            if (!input.hasAttribute('data-mask-setup')) {
                setupPhoneMask(input);
                input.setAttribute('data-mask-setup', 'true');
            }
        });
    }

    function setupPhoneMask(input) {
        const mask = input.getAttribute('data-mask');
        const placeholder = input.getAttribute('data-mask-placeholder');

        if (!mask) return;

        // Set placeholder if not already set
        if (!input.placeholder && placeholder) {
            input.placeholder = placeholder;
        }

        // Add event listeners
        input.addEventListener('input', function(e) {
            maskPhoneNumber(e.target, mask);
        });

        input.addEventListener('keydown', function(e) {
            handleKeydown(e, mask);
        });

        input.addEventListener('paste', function(e) {
            setTimeout(function() {
                maskPhoneNumber(e.target, mask);
            }, 10);
        });

        // Apply mask to existing value
        if (input.value) {
            maskPhoneNumber(input, mask);
        }
    }

    function maskPhoneNumber(input, mask) {
        let value = input.value;
        let cursorPosition = input.selectionStart;

        // Remove all non-numeric characters
        let numbers = value.replace(/\D/g, '');

        // Limit to 10 digits for US phone numbers
        numbers = numbers.substring(0, 10);

        // Apply the mask
        let masked = '';
        let numberIndex = 0;

        for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
            if (mask[i] === '#') {
                masked += numbers[numberIndex];
                numberIndex++;
            } else {
                masked += mask[i];
            }
        }

        // Update input value
        input.value = masked;

        // Restore cursor position
        setCursorPosition(input, cursorPosition, value, masked);
    }

    function setCursorPosition(input, oldCursor, oldValue, newValue) {
        let newCursor = oldCursor;

        // If the new value is longer, move cursor forward
        if (newValue.length > oldValue.length) {
            newCursor = oldCursor + (newValue.length - oldValue.length);
        }
        // If the new value is shorter, keep cursor in same position or move back
        else if (newValue.length < oldValue.length) {
            newCursor = Math.min(oldCursor, newValue.length);
        }

        // Make sure cursor doesn't go past the end
        newCursor = Math.min(newCursor, newValue.length);

        // Set cursor position
        setTimeout(function() {
            input.setSelectionRange(newCursor, newCursor);
        }, 0);
    }

    function handleKeydown(e, mask) {
        const input = e.target;
        const key = e.key;
        const cursorPosition = input.selectionStart;

        // Allow navigation and editing keys
        if (['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) {
            return;
        }

        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
        if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(key.toLowerCase())) {
            return;
        }

        // Only allow numeric input
        if (!/^\d$/.test(key)) {
            e.preventDefault();
            return;
        }

        // Don't allow more than 10 digits
        const currentNumbers = input.value.replace(/\D/g, '');
        if (currentNumbers.length >= 10) {
            e.preventDefault();
            return;
        }
    }

    // Public API for manual initialization (useful for AJAX loaded content)
    function reinitialize() {
        initializePhoneMasking();
    }

    // Make functions available globally
    window.EkwaPhoneMask = {
        initializePhoneMasking: initializePhoneMasking,
        reinitialize: reinitialize
    };

    // Also run initialization when new content is loaded
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            const newPhoneInputs = node.querySelectorAll ? node.querySelectorAll('input.ekwa-phone-mask[data-mask]') : [];
                            if (newPhoneInputs.length > 0) {
                                setTimeout(initializePhoneMasking, 100);
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