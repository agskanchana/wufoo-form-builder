import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl, SelectControl, ToggleControl } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-radio ${isSelected ? 'is-selected' : ''}`
    });
    const { label, fieldName, options, optionIds, selectedValue, required, validationMessage } = attributes;

    const optionsArray = options.split(',').map(option => option.trim()).filter(option => option);
    const idsArray = optionIds.split(',').map(id => id.trim()).filter(id => id);

    // Ensure idsArray has the same length as optionsArray
    while (idsArray.length < optionsArray.length) {
        idsArray.push('');
    }

    const updateOptionIds = (index, newId) => {
        const updatedIds = [...idsArray];
        updatedIds[index] = newId;
        setAttributes({ optionIds: updatedIds.join(',') });
    };

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
                        label={__('Field Name', 'ekwa-wufoo-form-builder')}
                        value={fieldName}
                        onChange={(value) => setAttributes({ fieldName: value })}
                        help={__('Common name attribute for all radio buttons (e.g., Field112)', 'ekwa-wufoo-form-builder')}
                    />
                    <TextareaControl
                        label={__('Options', 'ekwa-wufoo-form-builder')}
                        value={options}
                        onChange={(value) => setAttributes({ options: value })}
                        help={__('Enter options separated by commas', 'ekwa-wufoo-form-builder')}
                    />
                    <div>
                        <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                            {__('Individual IDs for Radio Buttons', 'ekwa-wufoo-form-builder')}
                        </label>
                        {optionsArray.map((option, index) => (
                            <TextControl
                                key={index}
                                label={`ID for "${option}"`}
                                value={idsArray[index] || ''}
                                onChange={(value) => updateOptionIds(index, value)}
                                placeholder={`e.g., Field112_${index}`}
                                style={{ marginBottom: '8px' }}
                            />
                        ))}
                    </div>
                    <SelectControl
                        label={__('Default Selected', 'ekwa-wufoo-form-builder')}
                        value={selectedValue}
                        options={[
                            { label: 'None', value: '' },
                            ...optionsArray.map(option => ({ label: option, value: option }))
                        ]}
                        onChange={(value) => setAttributes({ selectedValue: value })}
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
                <fieldset>
                    <legend>
                        {label} {required && <span style={{ color: 'red' }}>*</span>}
                    </legend>
                    {optionsArray.map((option, index) => {
                        const radioId = idsArray[index] || `radio_${index}`;
                        return (
                            <label key={index} htmlFor={radioId} style={{ display: 'block', marginBottom: '8px' }}>
                                <input
                                    type="radio"
                                    id={radioId}
                                    name={fieldName || 'radio_group'}
                                    value={option}
                                    checked={selectedValue === option}
                                    disabled
                                    style={{ marginRight: '8px' }}
                                />
                                {option} <small style={{ color: '#666' }}>(ID: {radioId})</small>
                            </label>
                        );
                    })}
                </fieldset>
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