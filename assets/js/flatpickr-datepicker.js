/**
 * Flatpickr Datepicker with Lazy Loading
 * Loads Flatpickr only when user interacts with the page (mousemove, scroll, touch)
 * This improves initial page load performance
 */
(function() {
    'use strict';

    let flatpickrLoaded = false;
    let flatpickrInstances = [];
    let interactionListenersAdded = false;

    // Flatpickr CDN URLs
    const FLATPICKR_CSS = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    const FLATPICKR_JS = 'https://cdn.jsdelivr.net/npm/flatpickr';

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeDatepickers();
    });

    function initializeDatepickers() {
        const datepickers = document.querySelectorAll('input.ekwa-datepicker');

        if (datepickers.length > 0 && !interactionListenersAdded) {
            // Add event listeners for user interaction to trigger lazy loading
            addInteractionListeners();
            interactionListenersAdded = true;
        }

        datepickers.forEach(function(datepicker) {
            if (!datepicker.hasAttribute('data-datepicker-setup')) {
                setupDatepickerPlaceholder(datepicker);
                datepicker.setAttribute('data-datepicker-setup', 'true');
            }
        });
    }

    function addInteractionListeners() {
        const events = ['mousemove', 'scroll', 'touchstart', 'click'];

        function handleInteraction() {
            if (!flatpickrLoaded) {
                loadFlatpickr();
            }
            // Remove listeners after first interaction
            events.forEach(event => {
                document.removeEventListener(event, handleInteraction, { passive: true });
            });
        }

        events.forEach(event => {
            document.addEventListener(event, handleInteraction, { passive: true });
        });

        // Also load immediately if user focuses on a datepicker
        document.addEventListener('focusin', function(e) {
            if (e.target.classList.contains('ekwa-datepicker') && !flatpickrLoaded) {
                loadFlatpickr();
            }
        });
    }

    function loadFlatpickr() {
        if (flatpickrLoaded) return;

        flatpickrLoaded = true;

        // Load CSS first
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = FLATPICKR_CSS;
        document.head.appendChild(cssLink);

        // Load JS
        const script = document.createElement('script');
        script.src = FLATPICKR_JS;
        script.onload = function() {
            // Initialize all datepickers with Flatpickr once loaded
            initializeFlatpickrInstances();
        };
        document.head.appendChild(script);
    }

    function setupDatepickerPlaceholder(datepicker) {
        // Change input type from date to text to prevent native datepicker
        datepicker.type = 'text';

        // Store original classes to preserve them
        const originalClasses = datepicker.className;

        // Ensure consistent styling before Flatpickr loads
        // Let CSS handle the styling to maintain consistency
        datepicker.classList.add('ekwa-datepicker-placeholder');

        // Add click listener to load Flatpickr immediately if clicked before interaction
        datepicker.addEventListener('click', function() {
            if (!flatpickrLoaded) {
                loadFlatpickr();
            }
        }, { once: true });
    }

    function initializeFlatpickrInstances() {
        const datepickers = document.querySelectorAll('input.ekwa-datepicker');

        datepickers.forEach(function(datepicker) {
            if (!datepicker.hasAttribute('data-flatpickr-setup')) {
                setupFlatpickrInstance(datepicker);
                datepicker.setAttribute('data-flatpickr-setup', 'true');
            }
        });
    }

    function setupFlatpickrInstance(datepicker) {
        // Get configuration from data attributes
        const disablePast = datepicker.hasAttribute('data-disable-past') && datepicker.getAttribute('data-disable-past') === 'true';
        const disableFuture = datepicker.hasAttribute('data-disable-future') && datepicker.getAttribute('data-disable-future') === 'true';
        const disableWeekends = datepicker.hasAttribute('data-disable-weekends') && datepicker.getAttribute('data-disable-weekends') === 'true';

        // Build Flatpickr configuration
        const config = {
            dateFormat: 'Y-m-d',
            allowInput: true,
            clickOpens: true,
            altInput: true,
            altFormat: 'F j, Y',
            disableMobile: true, // Force same input field on both mobile and desktop
            onChange: function(selectedDates, dateStr, instance) {
                // Custom validation after date selection
                validateDateSelection(datepicker, selectedDates[0], instance);
            }
        };

        // Configure date restrictions
        if (disablePast && !disableFuture) {
            config.minDate = 'today';
        } else if (disableFuture && !disablePast) {
            config.maxDate = 'today';
        } else if (disablePast && disableFuture) {
            config.minDate = 'today';
            config.maxDate = 'today';
        }

        // Handle weekend restrictions
        if (disableWeekends) {
            config.disable = [
                function(date) {
                    // Disable Saturday (6) and Sunday (0)
                    return (date.getDay() === 0 || date.getDay() === 6);
                }
            ];
        }

        // Handle min/max date attributes
        const minDate = datepicker.getAttribute('min');
        const maxDate = datepicker.getAttribute('max');

        if (minDate && !config.minDate) {
            config.minDate = minDate;
        }
        if (maxDate && !config.maxDate) {
            config.maxDate = maxDate;
        }

        // Initialize Flatpickr
        const instance = flatpickr(datepicker, config);

        // Remove placeholder class and ensure consistent styling after initialization
        datepicker.classList.remove('ekwa-datepicker-placeholder');

        // Force CSS class to maintain styling
        datepicker.classList.add('ekwa-datepicker');

        flatpickrInstances.push(instance);
    }

    function validateDateSelection(datepicker, selectedDate, instance) {
        if (!selectedDate) return;

        const disablePast = datepicker.hasAttribute('data-disable-past') && datepicker.getAttribute('data-disable-past') === 'true';
        const disableFuture = datepicker.hasAttribute('data-disable-future') && datepicker.getAttribute('data-disable-future') === 'true';
        const disableWeekends = datepicker.hasAttribute('data-disable-weekends') && datepicker.getAttribute('data-disable-weekends') === 'true';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let isValid = true;
        let errorMessage = '';

        // Check weekend restriction
        if (disableWeekends) {
            const dayOfWeek = selectedDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                isValid = false;
                errorMessage = 'Weekend dates are not allowed. Please select a weekday.';
            }
        }

        // Check past date restriction
        if (isValid && disablePast) {
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Past dates are not allowed. Please select today or a future date.';
            }
        }

        // Check future date restriction
        if (isValid && disableFuture) {
            if (selectedDate > today) {
                isValid = false;
                errorMessage = 'Future dates are not allowed. Please select today or a past date.';
            }
        }

        if (!isValid) {
            // Clear the selection
            instance.clear();
            showDateWarning(datepicker, errorMessage);
        } else {
            clearDateWarning(datepicker);
        }
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

            // Auto-hide warning after 5 seconds
            setTimeout(function() {
                clearDateWarning(input);
            }, 5000);
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

    // Public API
    window.EkwaFlatpickrDatepicker = {
        loadFlatpickr: loadFlatpickr,
        initializeDatepickers: initializeDatepickers,
        flatpickrInstances: flatpickrInstances,
        isLoaded: function() { return flatpickrLoaded; }
    };

    // Handle dynamic content
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            const newDatepickers = node.querySelectorAll ? node.querySelectorAll('input.ekwa-datepicker') : [];
                            if (newDatepickers.length > 0) {
                                setTimeout(function() {
                                    initializeDatepickers();
                                    // If Flatpickr is already loaded, initialize new instances
                                    if (flatpickrLoaded && window.flatpickr) {
                                        initializeFlatpickrInstances();
                                    }
                                }, 100);
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