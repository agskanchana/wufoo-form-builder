import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl, ToggleControl, RangeControl, Button } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-checkbox-group ${isSelected ? 'is-selected' : ''}`
    });

    const {
        label,
        fieldName,
        options,
        optionIds,
        selectedValues,
        required,
        validationMessage,
        minSelections,
        maxSelections
    } = attributes;

    const [showIndividualIds, setShowIndividualIds] = useState(false);

    const optionsArray = options.split(',').map(option => option.trim()).filter(option => option);
    const idsArray = optionIds ? optionIds.split(',').map(id => id.trim()) : [];

    // Ensure idsArray has the same length as optionsArray
    while (idsArray.length < optionsArray.length) {
        idsArray.push('');
    }

    const handleOptionToggle = (optionValue) => {
        const newSelectedValues = selectedValues.includes(optionValue)
            ? selectedValues.filter(val => val !== optionValue)
            : [...selectedValues, optionValue];

        setAttributes({ selectedValues: newSelectedValues });
    };

    // Generate individual field IDs if not provided
    const getFieldId = (index) => {
        if (idsArray[index] && idsArray[index].trim()) {
            return idsArray[index].trim();
        }
        return `Field${index + 1}`;
    };

    // Update individual field ID
    const updateFieldId = (index, newId) => {
        const newIdsArray = [...idsArray];
        newIdsArray[index] = newId;
        setAttributes({ optionIds: newIdsArray.join(',') });
    };

    const renderContent = () => {
        const checkboxElements = optionsArray.map((option, index) => {
            const fieldId = getFieldId(index);
            const isChecked = selectedValues.includes(option);

            return (
                <label
                    key={index}
                    htmlFor={fieldId}
                    style={{
                        display: 'block',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        userSelect: 'none'
                    }}
                    onClick={() => handleOptionToggle(option)}
                >
                    <input
                        type="checkbox"
                        id={fieldId}
                        name={fieldId}
                        value={option}
                        checked={isChecked}
                        disabled
                        style={{ marginRight: '8px' }}
                    />
                    {option} <small style={{ color: '#666' }}>({fieldId})</small>
                </label>
            );
        });

        // If there's a label, wrap in fieldset, otherwise just return checkboxes
        if (label && label.trim()) {
            return (
                <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '15px', margin: '0' }}>
                    <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>
                        {label} {required && <span style={{ color: 'red' }}>*</span>}
                    </legend>
                    {checkboxElements}
                </fieldset>
            );
        } else {
            return (
                <div style={{ padding: '0', margin: '0' }}>
                    {checkboxElements}
                </div>
            );
        }
    };

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={__('Checkbox Group Settings', 'ekwa-wufoo-form-builder')}>
                    <TextControl
                        label={__('Group Label (optional)', 'ekwa-wufoo-form-builder')}
                        value={label}
                        onChange={(value) => setAttributes({ label: value })}
                        help={__('Leave empty to remove fieldset border', 'ekwa-wufoo-form-builder')}
                    />
                    <TextControl
                        label={__('Field Name Base (optional)', 'ekwa-wufoo-form-builder')}
                        value={fieldName}
                        onChange={(value) => setAttributes({ fieldName: value })}
                        help={__('Used for grouping validation, not for field names', 'ekwa-wufoo-form-builder')}
                    />
                    <TextareaControl
                        label={__('Options', 'ekwa-wufoo-form-builder')}
                        value={options}
                        onChange={(value) => setAttributes({ options: value })}
                        help={__('Enter options separated by commas', 'ekwa-wufoo-form-builder')}
                    />

                    <div style={{ marginBottom: '16px' }}>
                        <Button
                            variant={showIndividualIds ? 'primary' : 'secondary'}
                            onClick={() => setShowIndividualIds(!showIndividualIds)}
                            style={{ marginBottom: '8px' }}
                        >
                            {showIndividualIds ? __('Hide Field IDs', 'ekwa-wufoo-form-builder') : __('Customize Field IDs', 'ekwa-wufoo-form-builder')}
                        </Button>

                        {showIndividualIds && (
                            <div>
                                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                    {__('Set custom ID and name for each checkbox:', 'ekwa-wufoo-form-builder')}
                                </p>
                                {optionsArray.map((option, index) => (
                                    <TextControl
                                        key={index}
                                        label={`${option} - Field ID/Name`}
                                        value={idsArray[index] || ''}
                                        onChange={(value) => updateFieldId(index, value)}
                                        placeholder={`Field${index + 1}`}
                                        help={__('Leave empty to use default (Field1, Field2, etc.)', 'ekwa-wufoo-form-builder')}
                                    />
                                ))}
                            </div>
                        )}

                        {!showIndividualIds && (
                            <p style={{ fontSize: '12px', color: '#666' }}>
                                {__('Field IDs will be automatically generated as Field1, Field2, etc.', 'ekwa-wufoo-form-builder')}
                            </p>
                        )}
                    </div>

                    <ToggleControl
                        label={__('Required Field', 'ekwa-wufoo-form-builder')}
                        checked={required}
                        onChange={(value) => setAttributes({ required: value })}
                        help={__('Require at least one checkbox to be selected', 'ekwa-wufoo-form-builder')}
                    />
                    {required && (
                        <>
                            <RangeControl
                                label={__('Minimum Selections', 'ekwa-wufoo-form-builder')}
                                value={minSelections}
                                onChange={(value) => setAttributes({ minSelections: value })}
                                min={1}
                                max={optionsArray.length}
                                help={__('Minimum number of checkboxes that must be selected', 'ekwa-wufoo-form-builder')}
                            />
                            <RangeControl
                                label={__('Maximum Selections (0 = unlimited)', 'ekwa-wufoo-form-builder')}
                                value={maxSelections}
                                onChange={(value) => setAttributes({ maxSelections: value })}
                                min={0}
                                max={optionsArray.length}
                                help={__('Maximum number of checkboxes that can be selected (0 for unlimited)', 'ekwa-wufoo-form-builder')}
                            />
                            <TextControl
                                label={__('Validation Message', 'ekwa-wufoo-form-builder')}
                                value={validationMessage}
                                onChange={(value) => setAttributes({ validationMessage: value })}
                                help={__('Message to display when validation fails', 'ekwa-wufoo-form-builder')}
                            />
                        </>
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {renderContent()}

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