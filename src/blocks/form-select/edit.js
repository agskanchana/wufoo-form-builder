import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl, ToggleControl, Button, SelectControl, Spinner } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment, useState, useEffect } from '@wordpress/element';
import IconPicker from '../../components/IconPicker';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-select ${isSelected ? 'is-selected' : ''}`
    });

    const {
        label,
        options,
        fieldId,
        required,
        validationMessage,
        iconName,
        iconPosition,
        iconSvgContent
    } = attributes;

    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [iconPreview, setIconPreview] = useState('');

    const optionsArray = options.split(',').map(option => option.trim()).filter(option => option);

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
                                { label: 'Left of Select', value: 'left' },
                                { label: 'Right of Select', value: 'right' },
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
                    <select
                        id={fieldId}
                        name={fieldId}
                        disabled
                        style={{
                            width: '100%',
                            paddingLeft: iconName && iconPosition === 'left' ? '35px' : '10px',
                            paddingRight: iconName && iconPosition === 'right' ? '35px' : '10px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="">{__('Select an option...', 'ekwa-wufoo-form-builder')}</option>
                        {optionsArray.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
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