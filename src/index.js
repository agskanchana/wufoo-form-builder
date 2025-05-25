import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

// Import child blocks
import './blocks/form-input';
import './blocks/form-select';
import './blocks/form-checkbox';
import './blocks/form-radio';
import './blocks/form-textarea';

// Import styles
import './style.scss';
import './editor.scss';

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
        idStamp: {
            type: 'string',
            default: ''
        }
    },
    supports: {
        html: false
    },
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({
            className: 'ekwa-wufoo-form-builder'
        });

        const { formId, submitText, actionUrl, idStamp } = attributes;

        const ALLOWED_BLOCKS = [
            'ekwa-wufoo/form-input',
            'ekwa-wufoo/form-select',
            'ekwa-wufoo/form-checkbox',
            'ekwa-wufoo/form-radio',
            'ekwa-wufoo/form-textarea'
        ];
        const TEMPLATE = [
            ['ekwa-wufoo/form-input', {}],
            ['ekwa-wufoo/form-select', {}],
            ['ekwa-wufoo/form-checkbox', {}],
            ['ekwa-wufoo/form-radio', {}],
            ['ekwa-wufoo/form-textarea', {}],
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
                            label={__('Form Action URL', 'ekwa-wufoo-form-builder')}
                            value={actionUrl}
                            onChange={(value) => setAttributes({ actionUrl: value })}
                            help={__('URL where the form data will be submitted (leave empty for current page)', 'ekwa-wufoo-form-builder')}
                        />
                        <TextControl
                            label={__('Submit Button Text', 'ekwa-wufoo-form-builder')}
                            value={submitText}
                            onChange={(value) => setAttributes({ submitText: value })}
                        />
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
                        />
                        <div className="form-submit">
                            <button
                                type="button"
                                className="submit-button primary"
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