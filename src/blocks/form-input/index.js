import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('ekwa-wufoo/form-input', {
    apiVersion: 2,
    title: 'Form Input',
    icon: 'edit',
    category: 'widgets',
    parent: ['ekwa-wufoo/form-builder', 'core/group', 'core/column'],
    supports: {
        reusable: false,
    },
    attributes: {
        label: {
            type: 'string',
            default: 'Input Label',
        },
        placeholder: {
            type: 'string',
            default: 'Enter text...',
        },
        inputType: {
            type: 'string',
            default: 'text'
        },
        fieldId: {
            type: 'string',
            default: ''
        },
        required: {
            type: 'boolean',
            default: false
        },
        validationMessage: {
            type: 'string',
            default: ''
        },
        iconName: {
            type: 'string',
            default: ''
        },
        iconPosition: {
            type: 'string',
            default: 'left'
        },
        iconSvgContent: {
            type: 'string',
            default: ''
        },
        enablePhoneMask: {
            type: 'boolean',
            default: true
        },
        phoneFormat: {
            type: 'string',
            default: '###-###-####'
        }
    },
    edit: Edit,
    save: () => null // Server-side rendering
});