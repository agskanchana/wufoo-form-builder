import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('ekwa-wufoo/form-checkbox', {
    apiVersion: 2,
    title: 'Form Checkbox',
    icon: 'yes',
    category: 'widgets',
    parent: ['ekwa-wufoo/form-builder'],
    supports: {
        reusable: false,
    },
    attributes: {
        label: {
            type: 'string',
            default: 'Checkbox Label',
        },
        fieldId: {
            type: 'string',
            default: ''
        },
        value: {
            type: 'string',
            default: 'checkbox_value'
        },
        checked: {
            type: 'boolean',
            default: false
        },
        validationMessage: {
            type: 'string',
            default: ''
        }
    },
    edit: Edit,
    save: () => null // Server-side rendering
});