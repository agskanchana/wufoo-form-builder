import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('ekwa-wufoo/form-input', {
    apiVersion: 2,
    title: 'Form Input',
    icon: 'edit',
    category: 'widgets',
    parent: ['ekwa-wufoo/form-builder'],
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
        validationMessage: {
            type: 'string',
            default: ''
        }
    },
    edit: Edit,
    save: () => null // Server-side rendering
});