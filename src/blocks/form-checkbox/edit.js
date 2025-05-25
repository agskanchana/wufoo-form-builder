import { __ } from '@wordpress/i18n';
import { TextControl, ToggleControl } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-checkbox ${isSelected ? 'is-selected' : ''}`
    });
    const { label, fieldId, value, checked, required, validationMessage } = attributes;

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={__('Checkbox Settings', 'ekwa-wufoo-form-builder')}>
                    <TextControl
                        label={__('Label', 'ekwa-wufoo-form-builder')}
                        value={label}
                        onChange={(value) => setAttributes({ label: value })}
                    />
                    <TextControl
                        label={__('Field ID', 'ekwa-wufoo-form-builder')}
                        value={fieldId}
                        onChange={(value) => setAttributes({ fieldId: value })}
                        help={__('Unique identifier for this field', 'ekwa-wufoo-form-builder')}
                    />
                    <TextControl
                        label={__('Value', 'ekwa-wufoo-form-builder')}
                        value={value}
                        onChange={(value) => setAttributes({ value: value })}
                        help={__('Value sent when checkbox is checked', 'ekwa-wufoo-form-builder')}
                    />
                    <ToggleControl
                        label={__('Default Checked', 'ekwa-wufoo-form-builder')}
                        checked={checked}
                        onChange={(value) => setAttributes({ checked: value })}
                    />
                    <ToggleControl
                        label={__('Required Field', 'ekwa-wufoo-form-builder')}
                        checked={required}
                        onChange={(value) => setAttributes({ required: value })}
                        help={__('Make this field mandatory', 'ekwa-wufoo-form-builder')}
                    />
                    {required && (
                        <TextControl
                            label={__('Validation Message', 'ekwa-wufoo-form-builder')}
                            value={validationMessage}
                            onChange={(value) => setAttributes({ validationMessage: value })}
                            help={__('Message to display when validation fails', 'ekwa-wufoo-form-builder')}
                        />
                    )}
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <label htmlFor={fieldId}>
                    <input
                        type="checkbox"
                        id={fieldId}
                        name={fieldId}
                        value={value}
                        checked={checked}
                        disabled
                        style={{ marginRight: '8px' }}
                    />
                    {label} {required && <span style={{ color: 'red' }}>*</span>}
                </label>
                {required && validationMessage && (
                    <span className="validation-message" style={{ color: '#d94f4f', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        {validationMessage}
                    </span>
                )}
            </div>
        </Fragment>
    );
};

export default Edit;