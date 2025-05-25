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
        }
    },
    supports: {
        html: false
    },
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({
            className: 'ekwa-wufoo-form-builder'
        });

        const { submitText, actionUrl } = attributes;

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
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <form>
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
                    </form>
                </div>
            </Fragment>
        );
    },
    save: () => {
        return <InnerBlocks.Content />;
    }
});