import { __ } from '@wordpress/i18n';
import { TextControl, SelectControl, ToggleControl, Button, Spinner } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment, useState, useEffect } from '@wordpress/element';
import IconPicker from '../../components/IconPicker';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-input ${isSelected ? 'is-selected' : ''}`
    });

    const {
        label,
        placeholder,
        inputType,
        fieldId,
        required,
        validationMessage,
        iconName,
        iconPosition,
        iconSvgContent,
        enablePhoneMask,
        phoneFormat
    } = attributes;

    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [iconPreview, setIconPreview] = useState('');

    // Auto-enable phone mask when input type is tel
    useEffect(() => {
        if (inputType === 'tel' && !enablePhoneMask) {
            setAttributes({ enablePhoneMask: true });
        }
    }, [inputType]);

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
                            { label: 'Phone (Tel)', value: 'tel' },
                            { label: 'URL', value: 'url' },
                        ]}
                        onChange={(value) => setAttributes({ inputType: value })}
                    />

                    {inputType === 'tel' && (
                        <>
                            <ToggleControl
                                label={__('Enable Phone Masking', 'ekwa-wufoo-form-builder')}
                                checked={enablePhoneMask}
                                onChange={(value) => setAttributes({ enablePhoneMask: value })}
                                help={__('Automatically format phone numbers as user types', 'ekwa-wufoo-form-builder')}
                            />
                            {enablePhoneMask && (
                                <SelectControl
                                    label={__('Phone Format', 'ekwa-wufoo-form-builder')}
                                    value={phoneFormat}
                                    options={[
                                        { label: '111-111-1111', value: '###-###-####' },
                                        { label: '(111) 111-1111', value: '(###) ###-####' },
                                        { label: '111.111.1111', value: '###.###.####' },
                                        { label: '111 111 1111', value: '### ### ####' },
                                    ]}
                                    onChange={(value) => setAttributes({ phoneFormat: value })}
                                    help={__('Choose how phone numbers should be formatted', 'ekwa-wufoo-form-builder')}
                                />
                            )}
                        </>
                    )}

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
                        type={inputType}
                        id={fieldId}
                        name={fieldId}
                        placeholder={inputType === 'tel' && enablePhoneMask ? phoneFormat.replace(/#/g, '_') : placeholder}
                        disabled
                        style={{
                            width: '100%',
                            paddingLeft: iconName && iconPosition === 'left' ? '35px' : '10px',
                            paddingRight: iconName && iconPosition === 'right' ? '35px' : '10px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>
                {inputType === 'tel' && enablePhoneMask && (
                    <small style={{ color: '#666', fontSize: '11px', marginTop: '2px', display: 'block' }}>
                        Format: {phoneFormat}
                    </small>
                )}
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