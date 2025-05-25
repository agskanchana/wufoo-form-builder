import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('ekwa-wufoo/form-radio', {
    apiVersion: 2,
    title: 'Form Radio Group',
    icon: 'marker',
    category: 'widgets',
    parent: ['ekwa-wufoo/form-builder'],
    supports: {
        reusable: false,
    },
    attributes: {
        label: {
            type: 'string',
            default: 'Radio Group Label',
        },
        fieldName: {
            type: 'string',
            default: ''
        },
        options: {
            type: 'string',
            default: 'Option 1,Option 2,Option 3'
        },
        optionIds: {
            type: 'string',
            default: ''
        },
        selectedValue: {
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
        }
    },
    edit: Edit,
    save: () => null // Server-side rendering
});