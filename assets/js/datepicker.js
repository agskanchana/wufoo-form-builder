(function() {
    'use strict';

    // Initialize datepicker functionality when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeDatepickers();
    });

    function initializeDatepickers() {
        const datepickers = document.querySelectorAll('input.ekwa-datepicker');

        datepickers.forEach(function(datepicker) {
            if (!datepicker.hasAttribute('data-datepicker-setup')) {
                setupDatepickerValidation(datepicker);
                datepicker.setAttribute('data-datepicker-setup', 'true');
            }
        });
    }

    function setupDatepickerValidation(datepicker) {
        // Ensure the datepicker opens on focus and click
        datepicker.addEventListener('focus', function(e) {
            // Force the datepicker to open by triggering a click if needed
            if (e.target.type === 'date') {
                try {
                    e.target.showPicker();
                } catch (error) {
                    // showPicker() is not supported in all browsers, fallback to click
                    console.log('showPicker not supported, using click fallback');
                }
            }
        });

        datepicker.addEventListener('click', function(e) {
            // Ensure the datepicker opens when clicked anywhere on the input
            if (e.target.type === 'date') {
                try {
                    e.target.showPicker();
                } catch (error) {
                    // showPicker() is not supported in all browsers
                    console.log('showPicker not supported in this browser');
                }
            }
        });

        // Add change event listener to validate selected date
        datepicker.addEventListener('change', function(e) {
            const selectedDate = new Date(e.target.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of day for comparison

            let isValid = true;
            let errorMessage = '';

            // Check weekend restriction
            if (e.target.hasAttribute('data-disable-weekends') && e.target.getAttribute('data-disable-weekends') === 'true') {
                const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    isValid = false;
                    errorMessage = 'Weekend dates are not allowed. Please select a weekday.';
                }
            }

            // Check past date restriction
            if (isValid && e.target.hasAttribute('data-disable-past') && e.target.getAttribute('data-disable-past') === 'true') {
                if (selectedDate < today) {
                    isValid = false;
                    errorMessage = 'Past dates are not allowed. Please select today or a future date.';
                }
            }

            // Check future date restriction
            if (isValid && e.target.hasAttribute('data-disable-future') && e.target.getAttribute('data-disable-future') === 'true') {
                if (selectedDate > today) {
                    isValid = false;
                    errorMessage = 'Future dates are not allowed. Please select today or a past date.';
                }
            }

            if (!isValid) {
                // Clear the value and show warning
                e.target.value = '';
                showDateWarning(e.target, errorMessage);
            } else {
                // Clear any existing warnings
                clearDateWarning(e.target);
            }
        });

        // Add input event to provide real-time feedback
        datepicker.addEventListener('input', function(e) {
            clearDateWarning(e.target);
        });
    }

    function showDateWarning(input, message) {
        clearDateWarning(input);

        const container = input.closest('.form-datepicker');
        if (container) {
            const warning = document.createElement('span');
            warning.className = 'date-warning';
            warning.style.cssText = 'color: #ff9800; font-size: 11px; margin-top: 2px; display: block;';
            warning.textContent = message;
            container.appendChild(warning);
        }
    }

    function clearDateWarning(input) {
        const container = input.closest('.form-datepicker');
        if (container) {
            const warning = container.querySelector('.date-warning');
            if (warning) {
                warning.remove();
            }
        }
    }

    // Utility functions to check date restrictions
    function isWeekend(dateString) {
        const date = new Date(dateString);
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    }

    function isPastDate(dateString) {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today;
    }

    function isFutureDate(dateString) {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
    }

    // Public API
    window.EkwaDatepicker = {
        initializeDatepickers: initializeDatepickers,
        isWeekend: isWeekend,
        isPastDate: isPastDate,
        isFutureDate: isFutureDate
    };

    // Also run initialization when new content is loaded
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            const newDatepickers = node.querySelectorAll ? node.querySelectorAll('input.ekwa-datepicker') : [];
                            if (newDatepickers.length > 0) {
                                setTimeout(initializeDatepickers, 100);
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