import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('ekwa-wufoo/form-select', {
    apiVersion: 2,
    title: 'Form Select',
    icon: 'list-view',
    category: 'widgets',
    parent: ['ekwa-wufoo/form-builder'],
    supports: {
        reusable: false,
    },
    attributes: {
        label: {
            type: 'string',
            default: 'Select Label',
        },
        options: {
            type: 'string',
            default: 'Option 1,Option 2,Option 3',
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