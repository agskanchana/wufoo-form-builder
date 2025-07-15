import { __ } from '@wordpress/i18n';
import { TextControl, ToggleControl, DatePicker, Button, Spinner, SelectControl } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment, useState, useEffect } from '@wordpress/element';
import IconPicker from '../../components/IconPicker';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-datepicker ${isSelected ? 'is-selected' : ''}`
    });

    const {
        label,
        fieldId,
        required,
        validationMessage,
        disablePastDates,
        disableFutureDates,
        disableWeekends,
        minDate,
        maxDate,
        defaultValue,
        placeholder,
        iconName,
        iconPosition,
        iconSvgContent
    } = attributes;

    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [iconPreview, setIconPreview] = useState('');

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get min date based on settings
    const getMinDate = () => {
        if (minDate) return minDate;
        if (disablePastDates) return getTodayDate();
        return '';
    };

    // Get max date based on settings
    const getMaxDate = () => {
        if (maxDate) return maxDate;
        if (disableFutureDates) return getTodayDate();
        return '';
    };

    // Format date for display
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Handle min date auto-update when disablePastDates changes
    useEffect(() => {
        if (disablePastDates && !minDate) {
            setAttributes({ minDate: getTodayDate() });
        } else if (!disablePastDates && minDate === getTodayDate()) {
            setAttributes({ minDate: '' });
        }
    }, [disablePastDates]);

    // Handle max date auto-update when disableFutureDates changes
    useEffect(() => {
        if (disableFutureDates && !maxDate) {
            setAttributes({ maxDate: getTodayDate() });
        } else if (!disableFutureDates && maxDate === getTodayDate()) {
            setAttributes({ maxDate: '' });
        }
    }, [disableFutureDates]);

    // Handle mutual exclusivity: if future dates disabled, uncheck past dates
    useEffect(() => {
        if (disableFutureDates && disablePastDates) {
            setAttributes({ disablePastDates: false });
        }
    }, [disableFutureDates]);

    // Load icon preview when iconName changes
    useEffect(() => {
        if (!iconName) {
            setIconPreview('');
            return;
        }

        if (iconName.includes(':')) {
            // It's an Iconify icon
            if (iconSvgContent) {
                setIconPreview(iconSvgContent);
            } else {
                // Fetch from API if not stored
                fetch(`https://api.iconify.design/${iconName}.svg`)
                    .then(response => response.text())
                    .then(svgText => {
                        setIconPreview(svgText);
                        setAttributes({ iconSvgContent: svgText });
                    })
                    .catch(error => {
                        console.error('Error loading icon preview:', error);
                        setIconPreview('');
                    });
            }
        }
    }, [iconName, iconSvgContent]);

    const handleIconSelect = (iconId, svgContent = '') => {
        setAttributes({
            iconName: iconId,
            iconSvgContent: svgContent
        });
    };

    const renderIcon = () => {
        if (!iconName || !iconName.includes(':')) return null;

        const iconStyle = {
            width: '20px',
            height: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
        };

        // Only Iconify SVG icons
        if (iconSvgContent || iconPreview) {
            return (
                <span
                    className="ekwa-icon-svg"
                    style={iconStyle}
                    dangerouslySetInnerHTML={{ __html: iconSvgContent || iconPreview }}
                />
            );
        }
        return <Spinner />;
    };

    return (
        <Fragment>
            <IconPicker
                isOpen={isIconPickerOpen}
                onClose={() => setIsIconPickerOpen(false)}
                onSelect={handleIconSelect}
                currentIcon={iconName}
            />

            <InspectorControls>
                <PanelBody title={__('Datepicker Settings', 'ekwa-wufoo-form-builder')}>
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
                        label={__('Placeholder Text', 'ekwa-wufoo-form-builder')}
                        value={placeholder}
                        onChange={(value) => setAttributes({ placeholder: value })}
                        help={__('Text shown when no date is selected', 'ekwa-wufoo-form-builder')}
                    />

                    <ToggleControl
                        label={__('Disable Past Dates', 'ekwa-wufoo-form-builder')}
                        checked={disablePastDates}
                        onChange={(value) => setAttributes({ disablePastDates: value })}
                        help={__('Prevent users from selecting dates before today', 'ekwa-wufoo-form-builder')}
                        disabled={disableFutureDates}
                    />

                    <ToggleControl
                        label={__('Disable Future Dates', 'ekwa-wufoo-form-builder')}
                        checked={disableFutureDates}
                        onChange={(value) => setAttributes({ disableFutureDates: value })}
                        help={__('Prevent users from selecting dates after today', 'ekwa-wufoo-form-builder')}
                    />

                    <ToggleControl
                        label={__('Disable Weekends', 'ekwa-wufoo-form-builder')}
                        checked={disableWeekends}
                        onChange={(value) => setAttributes({ disableWeekends: value })}
                        help={__('Prevent users from selecting Saturday and Sunday', 'ekwa-wufoo-form-builder')}
                    />

                    <TextControl
                        label={__('Minimum Date', 'ekwa-wufoo-form-builder')}
                        type="date"
                        value={minDate}
                        onChange={(value) => setAttributes({ minDate: value })}
                        help={__('Earliest selectable date (YYYY-MM-DD format)', 'ekwa-wufoo-form-builder')}
                    />

                    <TextControl
                        label={__('Maximum Date', 'ekwa-wufoo-form-builder')}
                        type="date"
                        value={maxDate}
                        onChange={(value) => setAttributes({ maxDate: value })}
                        help={__('Latest selectable date (YYYY-MM-DD format)', 'ekwa-wufoo-form-builder')}
                    />

                    <TextControl
                        label={__('Default Value', 'ekwa-wufoo-form-builder')}
                        type="date"
                        value={defaultValue}
                        onChange={(value) => setAttributes({ defaultValue: value })}
                        help={__('Pre-selected date (YYYY-MM-DD format)', 'ekwa-wufoo-form-builder')}
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

                <PanelBody title={__('Icon Settings', 'ekwa-wufoo-form-builder')} initialOpen={false}>
                    {iconName && (
                        <div className="ekwa-current-icon">
                            <p>{__('Current Icon:', 'ekwa-wufoo-form-builder')}</p>
                            <div className="ekwa-icon-preview" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                {renderIcon()}
                                <span>{iconName}</span>
                                <Button
                                    isDestructive
                                    isSmall
                                    onClick={() => setAttributes({ iconName: '', iconSvgContent: '' })}
                                >
                                    {__('Remove', 'ekwa-wufoo-form-builder')}
                                </Button>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="secondary"
                        onClick={() => setIsIconPickerOpen(true)}
                        className="ekwa-open-icon-picker"
                    >
                        {iconName ? __('Change Icon', 'ekwa-wufoo-form-builder') : __('Add Icon', 'ekwa-wufoo-form-builder')}
                    </Button>

                    {iconName && (
                        <SelectControl
                            label={__('Icon Position', 'ekwa-wufoo-form-builder')}
                            value={iconPosition || 'left'}
                            options={[
                                { label: 'Left of Input', value: 'left' },
                                { label: 'Right of Input', value: 'right' },
                                { label: 'Above Label', value: 'above' },
                            ]}
                            onChange={(value) => setAttributes({ iconPosition: value })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <label htmlFor={fieldId} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    {iconName && iconPosition === 'above' && renderIcon()}
                    <span>
                        {label} {required && <span style={{ color: 'red' }}>*</span>}
                    </span>
                </label>

                <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row'
                }}>
                    {iconName && (iconPosition === 'left' || iconPosition === 'right') && (
                        <div style={{
                            position: 'absolute',
                            [iconPosition]: '10px',
                            zIndex: 1,
                            pointerEvents: 'none'
                        }}>
                            {renderIcon()}
                        </div>
                    )}
                    <input
                        type="date"
                        id={fieldId}
                        name={fieldId}
                        value={defaultValue}
                        min={getMinDate()}
                        max={getMaxDate()}
                        placeholder={placeholder}
                        disabled
                        style={{
                            width: '100%',
                            paddingLeft: iconName && iconPosition === 'left' ? '35px' : '10px',
                            paddingRight: iconName && iconPosition === 'right' ? '35px' : '10px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                    {disablePastDates && <span>• Past dates disabled</span>}
                    {disableFutureDates && <span>• Future dates disabled</span>}
                    {disableWeekends && <span>• Weekends disabled</span>}
                    {minDate && <span>• Min: {formatDateForDisplay(minDate)}</span>}
                    {maxDate && <span>• Max: {formatDateForDisplay(maxDate)}</span>}
                </div>

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