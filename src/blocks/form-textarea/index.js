import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('ekwa-wufoo/form-textarea', {
    apiVersion: 2,
    title: 'Form Textarea',
    icon: 'text',
    category: 'widgets',
    parent: ['ekwa-wufoo/form-builder', 'core/group', 'core/column'],
    supports: {
        reusable: false,
    },
    attributes: {
        label: {
            type: 'string',
            default: 'Textarea Label',
        },
        placeholder: {
            type: 'string',
            default: 'Enter your message...',
        },
        fieldId: {
            type: 'string',
            default: ''
        },
        rows: {
            type: 'number',
            default: 4
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