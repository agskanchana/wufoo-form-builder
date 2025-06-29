import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('ekwa-wufoo/form-checkbox-group', {
    apiVersion: 2,
    title: 'Form Checkbox Group',
    icon: 'yes-alt',
    category: 'widgets',
    parent: ['ekwa-wufoo/form-builder', 'core/group', 'core/column'],
    supports: {
        reusable: false,
    },
    attributes: {
        label: {
            type: 'string',
            default: 'Checkbox Group Label',
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
        selectedValues: {
            type: 'array',
            default: []
        },
        required: {
            type: 'boolean',
            default: false
        },
        validationMessage: {
            type: 'string',
            default: ''
        },
        minSelections: {
            type: 'number',
            default: 1
        },
        maxSelections: {
            type: 'number',
            default: 0 // 0 = unlimited
        }
    },
    edit: Edit,
    save: () => null // Server-side rendering
});