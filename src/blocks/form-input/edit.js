import { __ } from '@wordpress/i18n';
import { TextControl, SelectControl } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-input ${isSelected ? 'is-selected' : ''}`
    });
    const { label, placeholder, inputType, fieldId, validationMessage } = attributes;

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={__('Input Settings', 'ekwa-wufoo-form-builder')}>
                    <TextControl
                        label={__('Label', 'ekwa-wufoo-form-builder')}
                        value={label}
                        onChange={(value) => setAttributes({ label: value })}
                    />
                    <TextControl
                        label={__('Field ID', 'ekwa-wufoo-form-builder')}
                        value={fieldId}
                        onChange={(value) => setAttributes({ fieldId: value })}
                        help={__('Unique identifier for this field (used for name and id attributes)', 'ekwa-wufoo-form-builder')}
                    />
                    <TextControl
                        label={__('Placeholder', 'ekwa-wufoo-form-builder')}
                        value={placeholder}
                        onChange={(value) => setAttributes({ placeholder: value })}
                    />
                    <SelectControl
                        label={__('Input Type', 'ekwa-wufoo-form-builder')}
                        value={inputType}
                        options={[
                            { label: 'Text', value: 'text' },
                            { label: 'Email', value: 'email' },
                            { label: 'Password', value: 'password' },
                            { label: 'Number', value: 'number' },
                        ]}
                        onChange={(value) => setAttributes({ inputType: value })}
                    />
                    <TextControl
                        label={__('Validation Message', 'ekwa-wufoo-form-builder')}
                        value={validationMessage}
                        onChange={(value) => setAttributes({ validationMessage: value })}
                        help={__('Message to display when validation fails', 'ekwa-wufoo-form-builder')}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <label htmlFor={fieldId}>{label}</label>
                <input
                    type={inputType}
                    id={fieldId}
                    name={fieldId}
                    placeholder={placeholder}
                    disabled
                />
                {validationMessage && (
                    <span className="validation-message" style={{ color: '#d94f4f', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        {validationMessage}
                    </span>
                )}
            </div>
        </Fragment>
    );
};

export default Edit;