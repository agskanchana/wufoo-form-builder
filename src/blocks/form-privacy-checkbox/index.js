import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('ekwa-wufoo/form-privacy-checkbox', {
    apiVersion: 2,
    title: 'Privacy Policy Checkbox',
    icon: 'privacy',
    category: 'widgets',
    parent: ['ekwa-wufoo/form-builder', 'core/group', 'core/column'],
    supports: {
        reusable: false,
    },
    attributes: {
        fieldId: {
            type: 'string',
            default: ''
        },
        privacyText: {
            type: 'string',
            default: 'By submitting the above form you agree and accept our Privacy Policy.*'
        },
        privacyUrl: {
            type: 'string',
            default: ''
        },
        linkText: {
            type: 'string',
            default: 'Privacy Policy'
        },
        value: {
            type: 'string',
            default: 'I Agree'
        },
        checked: {
            type: 'boolean',
            default: false
        },
        required: {
            type: 'boolean',
            default: true
        },
        validationMessage: {
            type: 'string',
            default: 'You must accept the privacy policy to continue.'
        }
    },
    edit: Edit,
    save: () => null // Server-side rendering
});
