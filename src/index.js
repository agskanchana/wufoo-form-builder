import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, SelectControl, ColorPalette, Button, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';

// Import child blocks
import './blocks/form-input';
import './blocks/form-select';
import './blocks/form-checkbox';
import './blocks/form-radio';
import './blocks/form-textarea';
import './blocks/form-datepicker';
import './blocks/form-privacy-checkbox';

// Define form templates
const FORM_TEMPLATES = {
    contact: {
        name: __('Contact Form', 'ekwa-wufoo-form-builder'),
        description: __('Professional contact form with icons and enhanced styling', 'ekwa-wufoo-form-builder'),
        template: [
            ['ekwa-wufoo/form-input', {
                label: 'Name',
                placeholder: 'John Doe',
                required: true,
                validationMessage: 'Please enter your name',
                iconName: 'mdi:account-outline',
                iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/></svg>'
            }],
            ['ekwa-wufoo/form-input', {
                label: 'Email',
                placeholder: 'youremail@gmail.com',
                inputType: 'email',
                required: true,
                validationMessage: 'Please enter your email address',
                iconName: 'mdi:email-outline',
                iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"/></svg>'
            }],
            ['ekwa-wufoo/form-input', {
                label: 'Phone',
                placeholder: '(111) 111-1111',
                inputType: 'tel',
                required: true,
                validationMessage: 'Enter valid contact number',
                iconName: 'mdi:phone-dial',
                iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2q1.65.6 3.6.6c.6 0 1 .4 1 1V20c0 .6-.4 1-1 1c-9.4 0-17-7.6-17-17c0-.6.5-1 1-1h3.5c.6 0 1 .4 1 1q0 1.8.6 3.6c.1.3 0 .7-.2 1zM14 3c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m3 0c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m3 0c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m-6 3c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m3 0c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m3 0c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m-6 3c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m3 0c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1m3 0c-.6 0-1 .4-1 1s.4 1 1 1s1-.4 1-1s-.4-1-1-1"/></svg>',
                phoneFormat: '(###) ###-####'
            }],
            ['ekwa-wufoo/form-textarea', {
                label: 'Comments',
                required: true,
                validationMessage: 'Please enter your comments',
                iconName: 'mdi:comment-text-multiple',
                iconPosition: 'top-left',
                iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 15H1V3a2 2 0 0 1 2-2h16v2H3zm9 8a1 1 0 0 1-1-1v-3H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4.1l-3.7 3.71c-.2.18-.44.29-.7.29zM9 9v2h10V9zm0 4v2h8v-2z"/></svg>'
            }],
            ['ekwa-wufoo/form-privacy-checkbox', { privacyUrl: '' }]
        ]
    },
    appointment: {
        name: __('Appointment Form', 'ekwa-wufoo-form-builder'),
        description: __('Appointment booking form with date picker and patient information', 'ekwa-wufoo-form-builder'),
        template: [
            ['core/heading', { level: 3, content: 'Appointment Form' }],
            ['core/columns', {}, [
                ['core/column', {}, [
                    ['ekwa-wufoo/form-datepicker', {
                        label: 'Appointment Date',
                        required: true,
                        validationMessage: 'Please select appointment date',
                        minDate: '2025-07-26',
                        iconName: 'mdi:calendar-clock',
                        iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15 13h1.5v2.82l2.44 1.41l-.75 1.3L15 16.69zm4-5H5v11h4.67c-.43-.91-.67-1.93-.67-3a7 7 0 0 1 7-7c1.07 0 2.09.24 3 .67zM5 21a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2h1V1h2v2h8V1h2v2h1a2 2 0 0 1 2 2v6.1c1.24 1.26 2 2.99 2 4.9a7 7 0 0 1-7 7c-1.91 0-3.64-.76-4.9-2zm11-9.85A4.85 4.85 0 0 0 11.15 16c0 2.68 2.17 4.85 4.85 4.85A4.85 4.85 0 0 0 20.85 16c0-2.68-2.17-4.85-4.85-4.85"/></svg>'
                    }]
                ]],
                ['core/column', {}, [
                    ['ekwa-wufoo/form-select', {
                        label: 'Time',
                        options: 'Morning,Lunch,Afternoon',
                        required: true,
                        validationMessage: 'Please select a time',
                        iconName: 'mdi:clock-outline',
                        iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z"/></svg>'
                    }]
                ]]
            ]],
            ['ekwa-wufoo/form-select', {
                label: 'Are you a new patient?',
                options: 'Yes,No',
                required: true,
                validationMessage: 'Select if you are a new patient or not ',
                iconName: 'mdi:medical-bag',
                iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10 3L8 5v2H5C3.85 7 3.12 8 3 9L2 19c-.12 1 .54 2 2 2h16c1.46 0 2.12-1 2-2L21 9c-.12-1-.94-2-2-2h-3V5l-2-2zm0 2h4v2h-4zm1 5h2v3h3v2h-3v3h-2v-3H8v-2h3z"/></svg>'
            }],
            ['ekwa-wufoo/form-input', {
                label: 'Your Name',
                placeholder: 'Your name',
                required: true,
                validationMessage: 'Please enter your name',
                iconName: 'mdi:user',
                iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/></svg>'
            }],
            ['ekwa-wufoo/form-input', {
                label: 'Email Address',
                placeholder: 'Email Address',
                inputType: 'email',
                required: true,
                validationMessage: 'Please enter valid email address',
                iconName: 'mdi:email-newsletter',
                iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .64L8.23 3H5v2L2.97 6.29C2.39 6.64 2 7.27 2 8v10a2 2 0 0 0 2 2h16c1.11 0 2-.89 2-2V8c0-.73-.39-1.36-.97-1.71L19 5V3h-3.23M7 5h10v4.88L12 13L7 9.88M8 6v1.5h8V6M5 7.38v1.25L4 8m15-.62L20 8l-1 .63M8 8.5V10h8V8.5Z"/></svg>'
            }],
            ['ekwa-wufoo/form-input', {
                label: 'Contact Number',
                inputType: 'tel',
                required: true,
                validationMessage: 'Enter valid phone number',
                iconName: 'mdi:phone-in-talk-outline',
                iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 15.5c-1.2 0-2.5-.2-3.6-.6h-.3c-.3 0-.5.1-.7.3l-2.2 2.2c-2.8-1.5-5.2-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1c-.3-1.1-.5-2.4-.5-3.6c0-.5-.5-1-1-1H4c-.5 0-1 .5-1 1c0 9.4 7.6 17 17 17c.5 0 1-.5 1-1v-3.5c0-.5-.5-1-1-1M5 5h1.5c.1.9.3 1.8.5 2.6L5.8 8.8C5.4 7.6 5.1 6.3 5 5m14 14c-1.3-.1-2.6-.4-3.8-.8l1.2-1.2c.8.2 1.7.4 2.6.4zm-4-7h2a5 5 0 0 0-5-5v2a3 3 0 0 1 3 3m4 0h2c0-5-4.03-9-9-9v2c3.86 0 7 3.13 7 7"/></svg>'
            }],
            ['ekwa-wufoo/form-textarea', {
                label: 'Comments',
                required: true,
                validationMessage: 'Please enter your comments',
                iconName: 'mdi:comments-text',
                iconPosition: 'top-left',
                iconSvgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 15H1V3a2 2 0 0 1 2-2h16v2H3zm9 8a1 1 0 0 1-1-1v-3H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4.1l-3.7 3.71c-.2.18-.44.29-.7.29zM9 9v2h10V9zm0 4v2h8v-2z"/></svg>'
            }],
            ['ekwa-wufoo/form-privacy-checkbox', { privacyText: 'By submitting the above form you agree and accept our Privacy Policy.' }]
        ]
    },
    blank: {
        name: __('Blank Form', 'ekwa-wufoo-form-builder'),
        description: __('Start with an empty form and add your own fields', 'ekwa-wufoo-form-builder'),
        template: []
    }
};// Register parent form builder block
registerBlockType('ekwa-wufoo/form-builder', {
    apiVersion: 2,
    title: 'Ekwa Wufoo Form Builder',
    category: 'widgets',
    icon: 'forms',
    attributes: {
        formId: {
            type: 'string',
            default: ''
        },
        submitText: {
            type: 'string',
            default: 'Submit'
        },
        actionUrl: {
            type: 'string',
            default: ''
        },
        ekwaUrl: {
            type: 'string',
            default: 'https://www.ekwa.com/ekwa-wufoo-handler/en-no-recaptcha.php'
        },
        idStamp: {
            type: 'string',
            default: ''
        },
        submitButtonStyle: {
            type: 'string',
            default: 'default'
        },
        submitButtonColor: {
            type: 'string',
            default: '#007cba'
        },
        submitButtonTextColor: {
            type: 'string',
            default: '#ffffff'
        },
        submitButtonAlignment: {
            type: 'string',
            default: 'left'
        },
        selectedTemplate: {
            type: 'string',
            default: ''
        },
        hasContent: {
            type: 'boolean',
            default: false
        }
    },
    supports: {
        html: false
    },
    edit: ({ attributes, setAttributes, clientId }) => {
        const blockProps = useBlockProps({
            className: 'ekwa-wufoo-form-builder'
        });

        const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
        const { formId, submitText, actionUrl, ekwaUrl, idStamp, submitButtonStyle, submitButtonColor, submitButtonTextColor, submitButtonAlignment, selectedTemplate, hasContent } = attributes;

        // Show template selection if no template is selected and no content exists
        useEffect(() => {
            if (!selectedTemplate && !hasContent) {
                setIsTemplateModalOpen(true);
            }
        }, [selectedTemplate, hasContent]);

        const selectTemplate = (templateKey) => {
            setAttributes({
                selectedTemplate: templateKey,
                hasContent: true
            });
            setIsTemplateModalOpen(false);

            // Clear existing blocks and replace with template
            const { replaceInnerBlocks } = wp.data.dispatch('core/block-editor');
            const template = FORM_TEMPLATES[templateKey]?.template || [];

            // Create blocks from template
            const blocks = wp.blocks.createBlocksFromInnerBlocksTemplate(template);

            // Replace all inner blocks with the template blocks
            setTimeout(() => {
                replaceInnerBlocks(clientId, blocks, false);
            }, 100);
        };        const resetTemplate = () => {
            setAttributes({
                selectedTemplate: '',
                hasContent: false
            });
            setIsTemplateModalOpen(true);
        };

        // Allow WordPress core blocks + form child blocks
        const ALLOWED_BLOCKS = [
            // WordPress Core Blocks
            'core/group',
            'core/columns',
            'core/column',
            'core/heading',
            'core/paragraph',
            'core/spacer',
            'core/separator',
            // Form Child Blocks
            'ekwa-wufoo/form-input',
            'ekwa-wufoo/form-select',
            'ekwa-wufoo/form-checkbox',
            'ekwa-wufoo/form-radio',
            'ekwa-wufoo/form-textarea',
            'ekwa-wufoo/form-checkbox-group',
            'ekwa-wufoo/form-datepicker',
            'ekwa-wufoo/form-privacy-checkbox'
        ];

        // Get template based on selection
        const getTemplate = () => {
            // Only return template if one is selected, otherwise return empty for new blocks
            if (selectedTemplate && FORM_TEMPLATES[selectedTemplate]) {
                return FORM_TEMPLATES[selectedTemplate].template;
            }
            return []; // No default template
        };

        const TEMPLATE = getTemplate();

        return (
            <Fragment>
                {isTemplateModalOpen && (
                    <Modal
                        title={__('Choose a Form Template', 'ekwa-wufoo-form-builder')}
                        onRequestClose={() => {
                            if (hasContent) {
                                setIsTemplateModalOpen(false);
                            }
                        }}
                        style={{ maxWidth: '600px' }}
                        isDismissible={hasContent}
                    >
                        <div style={{ padding: '20px 0' }}>
                            <p>{__('Select a template to get started with your form:', 'ekwa-wufoo-form-builder')}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '20px' }}>
                                {Object.entries(FORM_TEMPLATES).map(([key, template]) => (
                                    <div
                                        key={key}
                                        style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            padding: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            backgroundColor: '#fff'
                                        }}
                                        onClick={() => selectTemplate(key)}
                                        onMouseOver={(e) => {
                                            e.target.style.borderColor = '#007cba';
                                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.borderColor = '#ddd';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <h4 style={{ margin: '0 0 8px 0', color: '#1e1e1e' }}>{template.name}</h4>
                                        <p style={{ margin: '0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>{template.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal>
                )}

                <InspectorControls>
                    <PanelBody title={__('Template', 'ekwa-wufoo-form-builder')}>
                        <div style={{ marginBottom: '16px' }}>
                            <p><strong>{__('Current Template:', 'ekwa-wufoo-form-builder')}</strong> {selectedTemplate ? FORM_TEMPLATES[selectedTemplate]?.name : __('None', 'ekwa-wufoo-form-builder')}</p>
                            <Button
                                variant="secondary"
                                onClick={() => setIsTemplateModalOpen(true)}
                            >
                                {__('Change Template', 'ekwa-wufoo-form-builder')}
                            </Button>
                            {selectedTemplate && (
                                <Button
                                    variant="tertiary"
                                    onClick={resetTemplate}
                                    style={{ marginLeft: '8px' }}
                                >
                                    {__('Reset', 'ekwa-wufoo-form-builder')}
                                </Button>
                            )}
                        </div>
                    </PanelBody>

                    <PanelBody title={__('Form Settings', 'ekwa-wufoo-form-builder')}>
                        <TextControl
                            label={__('Form ID', 'ekwa-wufoo-form-builder')}
                            value={formId}
                            onChange={(value) => setAttributes({ formId: value })}
                            help={__('Unique identifier for the form (used for id and name attributes)', 'ekwa-wufoo-form-builder')}
                        />
                        <TextControl
                            label={__('Ekwa URL', 'ekwa-wufoo-form-builder')}
                            value={ekwaUrl}
                            onChange={(value) => setAttributes({ ekwaUrl: value })}
                            help={__('URL where the form data will be submitted to Ekwa handler (required)', 'ekwa-wufoo-form-builder')}
                            required={true}
                        />
                        <TextControl
                            label={__('Form Action URL', 'ekwa-wufoo-form-builder')}
                            value={actionUrl}
                            onChange={(value) => setAttributes({ actionUrl: value })}
                            help={__('URL for encrypted hidden field (optional)', 'ekwa-wufoo-form-builder')}
                        />
                        <TextControl
                            label={__('Submit Button Text', 'ekwa-wufoo-form-builder')}
                            value={submitText}
                            onChange={(value) => setAttributes({ submitText: value })}
                        />
                        <SelectControl
                            label={__('Submit Button Style', 'ekwa-wufoo-form-builder')}
                            value={submitButtonStyle}
                            onChange={(value) => setAttributes({ submitButtonStyle: value })}
                            options={[
                                { label: __('Default', 'ekwa-wufoo-form-builder'), value: 'default' },
                                { label: __('Rounded', 'ekwa-wufoo-form-builder'), value: 'rounded' },
                                { label: __('Square', 'ekwa-wufoo-form-builder'), value: 'square' },
                                { label: __('Outline', 'ekwa-wufoo-form-builder'), value: 'outline' }
                            ]}
                            help={__('Choose the style for your submit button', 'ekwa-wufoo-form-builder')}
                        />
                        <SelectControl
                            label={__('Submit Button Alignment', 'ekwa-wufoo-form-builder')}
                            value={submitButtonAlignment}
                            onChange={(value) => setAttributes({ submitButtonAlignment: value })}
                            options={[
                                { label: __('Left', 'ekwa-wufoo-form-builder'), value: 'left' },
                                { label: __('Center', 'ekwa-wufoo-form-builder'), value: 'center' },
                                { label: __('Right', 'ekwa-wufoo-form-builder'), value: 'right' }
                            ]}
                            help={__('Choose the alignment for your submit button', 'ekwa-wufoo-form-builder')}
                        />
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                                {__('Submit Button Background Color', 'ekwa-wufoo-form-builder')}
                            </label>
                            <ColorPalette
                                value={submitButtonColor}
                                onChange={(value) => setAttributes({ submitButtonColor: value || '#007cba' })}
                                colors={[
                                    { name: 'Blue', color: '#007cba' },
                                    { name: 'Green', color: '#28a745' },
                                    { name: 'Red', color: '#dc3545' },
                                    { name: 'Orange', color: '#fd7e14' },
                                    { name: 'Purple', color: '#6f42c1' },
                                    { name: 'Dark', color: '#343a40' },
                                    { name: 'Black', color: '#000000' }
                                ]}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                                {__('Submit Button Text Color', 'ekwa-wufoo-form-builder')}
                            </label>
                            <ColorPalette
                                value={submitButtonTextColor}
                                onChange={(value) => setAttributes({ submitButtonTextColor: value || '#ffffff' })}
                                colors={[
                                    { name: 'White', color: '#ffffff' },
                                    { name: 'Black', color: '#000000' },
                                    { name: 'Gray', color: '#6c757d' },
                                    { name: 'Light Gray', color: '#f8f9fa' },
                                    { name: 'Dark Gray', color: '#343a40' }
                                ]}
                            />
                        </div>
                        <TextControl
                            label={__('Form ID Stamp', 'ekwa-wufoo-form-builder')}
                            value={idStamp}
                            onChange={(value) => setAttributes({ idStamp: value })}
                            help={__('ID stamp code to be inserted after submit button', 'ekwa-wufoo-form-builder')}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <form id={formId || 'ekwa-form'} name={formId || 'ekwa-form'}>
                        <InnerBlocks
                            allowedBlocks={ALLOWED_BLOCKS}
                            template={selectedTemplate ? TEMPLATE : undefined}
                            templateLock={false}
                        />
                        <div className="form-submit" style={{ textAlign: submitButtonAlignment }}>
                            <button
                                type="button"
                                className={`submit-button primary submit-${submitButtonStyle}`}
                                style={{
                                    backgroundColor: submitButtonColor,
                                    color: submitButtonTextColor,
                                    borderColor: submitButtonStyle === 'outline' ? submitButtonColor : 'transparent'
                                }}
                                disabled
                            >
                                {submitText}
                            </button>
                        </div>
                        {idStamp && (
                            <div className="form-idstamp" style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                                ID Stamp: {idStamp}
                            </div>
                        )}
                    </form>
                </div>
            </Fragment>
        );
    },
    save: () => {
        return <InnerBlocks.Content />;
    }
});