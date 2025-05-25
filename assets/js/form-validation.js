(function() {
    'use strict';

    // Initialize form validation when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeFormValidation();
    });

    // Also initialize for any forms loaded after DOM ready (e.g., AJAX loaded content)
    function initializeFormValidation() {
        const forms = document.querySelectorAll('.ekwa-wufoo-form-builder form');

        forms.forEach(function(form, index) {
            // Check if form already has validation setup
            if (!form.hasAttribute('data-validation-setup')) {
                setupFormValidation(form, index);
                form.setAttribute('data-validation-setup', 'true');
            }
        });
    }

    function setupFormValidation(form, formIndex) {
        const submitButton = form.querySelector('.submit-button, button[type="submit"], input[type="submit"]');

        if (!submitButton) {
            console.warn('No submit button found for form:', form);
            return;
        }

        // Disable browser default validation
        form.setAttribute('novalidate', 'novalidate');

        // Add unique identifier to form if it doesn't exist
        if (!form.id) {
            form.id = 'ekwa-form-' + formIndex + '-' + Date.now();
        }

        // Create a named function for the submit handler
        function handleFormSubmit(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Validating form:', form.id);

            if (validateAllFields(form)) {
                console.log('Validation passed, submitting form:', form.id);
                // Remove the event listener temporarily to avoid infinite loop
                form.removeEventListener('submit', handleFormSubmit);
                // Create a new form element to submit without validation
                const tempForm = document.createElement('form');
                tempForm.action = form.action;
                tempForm.method = form.method;
                tempForm.target = form.target;
                tempForm.style.display = 'none';

                // Copy all form data
                const formData = new FormData(form);
                formData.forEach(function(value, key) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    tempForm.appendChild(input);
                });

                // Submit the temporary form
                document.body.appendChild(tempForm);
                tempForm.submit();
                document.body.removeChild(tempForm);
            } else {
                console.log('Validation failed for form:', form.id);
            }
        }

        // Handle form submission
        form.addEventListener('submit', handleFormSubmit);

        // Add real-time validation on field blur
        const formFields = form.querySelectorAll('input, select, textarea');
        formFields.forEach(function(field) {
            field.addEventListener('blur', function(e) {
                e.stopPropagation();
                validateSingleField(field, form);
            });

            field.addEventListener('input', function(e) {
                e.stopPropagation();
                clearFieldError(field, form);
            });

            field.addEventListener('change', function(e) {
                e.stopPropagation();
                clearFieldError(field, form);
            });
        });
    }

    function validateAllFields(form) {
        if (!form) {
            console.error('Form not provided to validateAllFields');
            return false;
        }

        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');

        console.log('Found', requiredFields.length, 'required fields in form:', form.id);

        // Clear all previous errors first
        clearAllErrors(form);

        // If no required fields, validation passes
        if (requiredFields.length === 0) {
            console.log('No required fields found, validation passes');
            return true;
        }

        // Validate all individual required fields
        requiredFields.forEach(function(field) {
            if (field.type !== 'radio') { // Handle radio separately
                if (!validateSingleField(field, form)) {
                    isValid = false;
                }
            }
        });

        // Validate radio groups separately
        const radioGroups = getRadioGroups(form);
        radioGroups.forEach(function(groupName) {
            const radioButtons = form.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
            const firstRadio = radioButtons[0];

            if (firstRadio && firstRadio.hasAttribute('required')) {
                const isChecked = Array.from(radioButtons).some(radio => radio.checked);
                if (!isChecked) {
                    showFieldError(firstRadio, getValidationMessage(firstRadio, 'Please select an option.'), form);
                    isValid = false;
                }
            }
        });

        if (!isValid) {
            // Scroll to first error within this form
            const firstError = form.querySelector('.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return isValid;
    }

    function validateSingleField(field, form) {
        if (!field || !field.hasAttribute('required')) {
            return true;
        }

        let isValid = true;
        let errorMessage = '';

        // Clear previous errors for this field only
        clearFieldError(field, form);

        // Validate based on field type
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                errorMessage = getValidationMessage(field, 'This field is required.');
            }
        } else if (field.type === 'radio') {
            // Radio validation is handled in validateAllFields for the group
            return true;
        } else if (field.tagName.toLowerCase() === 'select') {
            if (!field.value || field.value === '') {
                isValid = false;
                errorMessage = getValidationMessage(field, 'Please select an option.');
            }
        } else {
            // Text inputs, textareas, etc.
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = getValidationMessage(field, 'This field is required.');
            }
        }

        // Show error if validation failed
        if (!isValid) {
            showFieldError(field, errorMessage, form);
        }

        return isValid;
    }

    function getValidationMessage(field, defaultMessage) {
        const fieldContainer = field.closest('.form-input, .form-select, .form-textarea, .form-checkbox, .form-radio');
        const validationSpan = fieldContainer ? fieldContainer.querySelector('.validation-message') : null;

        if (validationSpan && validationSpan.textContent.trim()) {
            return validationSpan.textContent.trim();
        }

        return defaultMessage;
    }

    function showFieldError(field, message, form) {
        const fieldContainer = field.closest('.form-input, .form-select, .form-textarea, .form-checkbox, .form-radio');

        if (fieldContainer && form.contains(fieldContainer)) {
            fieldContainer.classList.add('has-error');
            field.classList.add('error');

            let validationMessage = fieldContainer.querySelector('.validation-message');
            if (validationMessage) {
                // Update existing validation message
                validationMessage.textContent = message;
                validationMessage.style.display = 'block';
                validationMessage.style.color = '#d94f4f';
                validationMessage.style.fontSize = '12px';
                validationMessage.style.marginTop = '4px';
            } else {
                // Create validation message if it doesn't exist
                validationMessage = document.createElement('span');
                validationMessage.className = 'validation-message';
                validationMessage.textContent = message;
                validationMessage.style.cssText = 'color: #d94f4f; font-size: 12px; margin-top: 4px; display: block;';
                fieldContainer.appendChild(validationMessage);
            }
        }
    }

    function clearFieldError(field, form) {
        const fieldContainer = field.closest('.form-input, .form-select, .form-textarea, .form-checkbox, .form-radio');

        if (fieldContainer && form.contains(fieldContainer)) {
            fieldContainer.classList.remove('has-error');
            field.classList.remove('error');

            const validationMessage = fieldContainer.querySelector('.validation-message');
            if (validationMessage) {
                validationMessage.style.display = 'none';
            }
        }
    }

    function clearAllErrors(form) {
        if (!form) return;

        const errorContainers = form.querySelectorAll('.has-error');
        errorContainers.forEach(function(container) {
            container.classList.remove('has-error');
        });

        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(function(field) {
            field.classList.remove('error');
        });

        const validationMessages = form.querySelectorAll('.validation-message');
        validationMessages.forEach(function(message) {
            message.style.display = 'none';
        });
    }

    function getRadioGroups(form) {
        if (!form) return [];

        const radioButtons = form.querySelectorAll('input[type="radio"]');
        const groups = new Set();

        radioButtons.forEach(function(radio) {
            if (radio.name) {
                groups.add(radio.name);
            }
        });

        return Array.from(groups);
    }

    // Public API for manual initialization (useful for AJAX loaded content)
    function reinitialize() {
        initializeFormValidation();
    }

    // Make functions available globally for testing and manual initialization
    window.EkwaFormValidation = {
        initializeFormValidation: initializeFormValidation,
        validateAllFields: validateAllFields,
        validateSingleField: validateSingleField,
        reinitialize: reinitialize
    };

    // Also run initialization when new content is loaded
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            const newForms = node.querySelectorAll ? node.querySelectorAll('.ekwa-wufoo-form-builder form') : [];
                            if (newForms.length > 0) {
                                setTimeout(initializeFormValidation, 100);
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