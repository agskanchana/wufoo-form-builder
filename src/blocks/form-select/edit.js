import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl, ToggleControl } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-select ${isSelected ? 'is-selected' : ''}`
    });
    const { label, options, fieldId, required, validationMessage } = attributes;

    const optionsArray = options.split(',').map(option => option.trim()).filter(option => option);

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={__('Select Settings', 'ekwa-wufoo-form-builder')}>
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
                    <TextareaControl
                        label={__('Options', 'ekwa-wufoo-form-builder')}
                        value={options}
                        onChange={(value) => setAttributes({ options: value })}
                        help={__('Enter options separated by commas', 'ekwa-wufoo-form-builder')}
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
                    {label} {required && <span style={{ color: 'red' }}>*</span>}
                </label>
                <select id={fieldId} name={fieldId} disabled>
                    <option value="">{__('Select an option...', 'ekwa-wufoo-form-builder')}</option>
                    {optionsArray.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
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