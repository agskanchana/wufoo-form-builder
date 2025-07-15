import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('ekwa-wufoo/form-datepicker', {
    apiVersion: 2,
    title: 'Form Datepicker',
    icon: 'calendar-alt',
    category: 'widgets',
    parent: ['ekwa-wufoo/form-builder', 'core/group', 'core/column'],
    supports: {
        reusable: false,
    },
    attributes: {
        label: {
            type: 'string',
            default: 'Select Date',
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
        disablePastDates: {
            type: 'boolean',
            default: true
        },
        disableFutureDates: {
            type: 'boolean',
            default: false
        },
        disableWeekends: {
            type: 'boolean',
            default: false
        },
        minDate: {
            type: 'string',
            default: ''
        },
        maxDate: {
            type: 'string',
            default: ''
        },
        defaultValue: {
            type: 'string',
            default: ''
        },
        placeholder: {
            type: 'string',
            default: 'Select a date'
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
        }
    },
    edit: Edit,
    save: () => null // Server-side rendering
});