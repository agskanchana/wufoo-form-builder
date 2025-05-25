import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl, SelectControl } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-radio ${isSelected ? 'is-selected' : ''}`
    });
    const { label, fieldId, options, selectedValue, validationMessage } = attributes;

    const optionsArray = options.split(',').map(option => option.trim()).filter(option => option);

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={__('Radio Group Settings', 'ekwa-wufoo-form-builder')}>
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
                    <TextareaControl
                        label={__('Options', 'ekwa-wufoo-form-builder')}
                        value={options}
                        onChange={(value) => setAttributes({ options: value })}
                        help={__('Enter options separated by commas', 'ekwa-wufoo-form-builder')}
                    />
                    <SelectControl
                        label={__('Default Selected', 'ekwa-wufoo-form-builder')}
                        value={selectedValue}
                        options={[
                            { label: 'None', value: '' },
                            ...optionsArray.map(option => ({ label: option, value: option }))
                        ]}
                        onChange={(value) => setAttributes({ selectedValue: value })}
                    />
                    <TextControl
                        label={__('Validation Message', 'ekwa-wufoo-form-builder')}
                        value={validationMessage}
                        onChange={(value) => setAttributes({ validationMessage: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <fieldset>
                    <legend>{label}</legend>
                    {optionsArray.map((option, index) => (
                        <label key={index} style={{ display: 'block', marginBottom: '8px' }}>
                            <input
                                type="radio"
                                name={fieldId}
                                value={option}
                                checked={selectedValue === option}
                                disabled
                                style={{ marginRight: '8px' }}
                            />
                            {option}
                        </label>
                    ))}
                </fieldset>
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