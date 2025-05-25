import { __ } from '@wordpress/i18n';
import { TextControl, RangeControl, ToggleControl } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-textarea ${isSelected ? 'is-selected' : ''}`
    });
    const { label, placeholder, fieldId, rows, required, validationMessage } = attributes;

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={__('Textarea Settings', 'ekwa-wufoo-form-builder')}>
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
                        label={__('Placeholder', 'ekwa-wufoo-form-builder')}
                        value={placeholder}
                        onChange={(value) => setAttributes({ placeholder: value })}
                    />
                    <RangeControl
                        label={__('Rows', 'ekwa-wufoo-form-builder')}
                        value={rows}
                        onChange={(value) => setAttributes({ rows: value })}
                        min={2}
                        max={20}
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
                        />
                    )}
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <label htmlFor={fieldId}>
                    {label} {required && <span style={{ color: 'red' }}>*</span>}
                </label>
                <textarea
                    id={fieldId}
                    name={fieldId}
                    placeholder={placeholder}
                    rows={rows}
                    disabled
                />
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