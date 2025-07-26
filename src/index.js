import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, SelectControl, ColorPalette } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

// Import child blocks
import './blocks/form-input';
import './blocks/form-select';
import './blocks/form-checkbox';
import './blocks/form-radio';
import './blocks/form-textarea';
import './blocks/form-datepicker';
import './blocks/form-privacy-checkbox';

// Register parent form builder block
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
        }
    },
    supports: {
        html: false
    },
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({
            className: 'ekwa-wufoo-form-builder'
        });

        const { formId, submitText, actionUrl, ekwaUrl, idStamp, submitButtonStyle, submitButtonColor, submitButtonTextColor, submitButtonAlignment } = attributes;

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

        // Template with a basic layout example
        const TEMPLATE = [
            ['core/heading', { level: 3, content: 'Contact Form' }],
            ['core/paragraph', { content: 'Please fill out the form below:' }],
            ['core/group', {
                className: 'form-section'
            }, [
                ['ekwa-wufoo/form-input', { label: 'Name', fieldId: 'name', required: true }],
                ['ekwa-wufoo/form-input', { label: 'Email', fieldId: 'email', inputType: 'email', required: true }]
            ]],
            ['core/columns', {}, [
                ['core/column', {}, [
                    ['ekwa-wufoo/form-input', { label: 'Phone', fieldId: 'phone' }]
                ]],
                ['core/column', {}, [
                    ['ekwa-wufoo/form-select', { label: 'Subject', fieldId: 'subject', options: 'General Inquiry,Support,Sales' }]
                ]]
            ]],
            ['ekwa-wufoo/form-textarea', { label: 'Message', fieldId: 'message', rows: 5, required: true }],
            ['ekwa-wufoo/form-privacy-checkbox', { fieldId: 'privacy', required: true }]
        ];

        return (
            <Fragment>
                <InspectorControls>
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
                            template={TEMPLATE}
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