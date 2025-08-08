import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl, ToggleControl, Popover, Button } from '@wordpress/components';
import { useBlockProps, InspectorControls, LinkControl } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import { link, linkOff } from '@wordpress/icons';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps({
        className: `form-privacy-checkbox ${isSelected ? 'is-selected' : ''}`
    });

    const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(false);

    const {
        fieldId,
        privacyText,
        privacyUrl,
        linkText,
        value,
        checked,
        required,
        validationMessage
    } = attributes;

    const handleCheckboxToggle = () => {
        setAttributes({ checked: !checked });
    };

    // Parse the privacy text to identify where to insert the link
    const renderPrivacyText = () => {
        if (!privacyText) {
            return <span>{privacyText || ''}</span>;
        }

        if (!linkText) {
            return <span>{privacyText}</span>;
        }

        // Find the linkText in the privacyText and replace it with a link
        const linkStart = privacyText.indexOf(linkText);
        if (linkStart === -1) {
            // If linkText is not found in privacyText, just show the text
            return <span>{privacyText}</span>;
        }

        const beforeLink = privacyText.substring(0, linkStart);
        const afterLink = privacyText.substring(linkStart + linkText.length);

        return (
            <span>
                {beforeLink}
                <a
                    href={privacyUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: '#0073aa',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                    onClick={(e) => e.preventDefault()} // Prevent actual navigation in editor
                >
                    {linkText}
                </a>
                {afterLink}
            </span>
        );
    };

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={__('Privacy Checkbox Settings', 'ekwa-wufoo-form-builder')}>
                    <TextControl
                        label={__('Field ID', 'ekwa-wufoo-form-builder')}
                        value={fieldId}
                        onChange={(value) => setAttributes({ fieldId: value })}
                        help={__('Unique identifier for this field (used for name and id attributes)', 'ekwa-wufoo-form-builder')}
                    />

                    <TextareaControl
                        label={__('Privacy Text', 'ekwa-wufoo-form-builder')}
                        value={privacyText}
                        onChange={(value) => setAttributes({ privacyText: value })}
                        help={__('The full text to display. Include the link text exactly as it should appear.', 'ekwa-wufoo-form-builder')}
                        rows={3}
                    />

                    <TextControl
                        label={__('Link Text', 'ekwa-wufoo-form-builder')}
                        value={linkText}
                        onChange={(value) => setAttributes({ linkText: value })}
                        help={__('The text that should be linked (must match text in Privacy Text above)', 'ekwa-wufoo-form-builder')}
                    />

                    <TextControl
                        label={__('Checkbox Value', 'ekwa-wufoo-form-builder')}
                        value={value}
                        onChange={(value) => setAttributes({ value: value })}
                        help={__('The value that will be submitted when the checkbox is checked', 'ekwa-wufoo-form-builder')}
                    />

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            fontWeight: '500',
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            {__('Privacy Policy URL', 'ekwa-wufoo-form-builder')}
                        </label>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Button
                                icon={privacyUrl ? link : linkOff}
                                variant={privacyUrl ? 'secondary' : 'primary'}
                                onClick={() => setIsLinkPickerVisible(!isLinkPickerVisible)}
                                style={{ minWidth: 'auto' }}
                            >
                                {privacyUrl ? __('Edit Link', 'ekwa-wufoo-form-builder') : __('Add Link', 'ekwa-wufoo-form-builder')}
                            </Button>

                            {privacyUrl && (
                                <Button
                                    icon={linkOff}
                                    variant="tertiary"
                                    onClick={() => {
                                        setAttributes({ privacyUrl: '' });
                                        setIsLinkPickerVisible(false);
                                    }}
                                    style={{ minWidth: 'auto' }}
                                >
                                    {__('Remove', 'ekwa-wufoo-form-builder')}
                                </Button>
                            )}
                        </div>

                        {privacyUrl && (
                            <div style={{
                                fontSize: '12px',
                                color: '#666',
                                marginTop: '4px',
                                wordBreak: 'break-all'
                            }}>
                                {privacyUrl}
                            </div>
                        )}

                        {isLinkPickerVisible && (
                            <Popover
                                placement="bottom-start"
                                onClose={() => setIsLinkPickerVisible(false)}
                                anchorRef={null}
                                style={{ zIndex: 999999 }}
                            >
                                <div style={{ width: '320px', padding: '16px' }}>
                                    <LinkControl
                                        value={{
                                            url: privacyUrl,
                                            opensInNewTab: true
                                        }}
                                        onChange={(newLink) => {
                                            setAttributes({ privacyUrl: newLink?.url || '' });
                                        }}
                                        onRemove={() => {
                                            setAttributes({ privacyUrl: '' });
                                            setIsLinkPickerVisible(false);
                                        }}
                                        searchInputPlaceholder={__('Search for privacy policy page...', 'ekwa-wufoo-form-builder')}
                                        settings={[
                                            {
                                                id: 'opensInNewTab',
                                                title: __('Open in new tab', 'ekwa-wufoo-form-builder'),
                                            }
                                        ]}
                                    />
                                </div>
                            </Popover>
                        )}

                        <p style={{
                            fontSize: '12px',
                            color: '#666',
                            marginTop: '4px'
                        }}>
                            {__('Select or enter the privacy policy page URL', 'ekwa-wufoo-form-builder')}
                        </p>
                    </div>

                    <ToggleControl
                        label={__('Required Field', 'ekwa-wufoo-form-builder')}
                        checked={required}
                        onChange={(value) => setAttributes({ required: value })}
                        help={__('Make this checkbox mandatory for form submission', 'ekwa-wufoo-form-builder')}
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
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '10px 0'
                }}>
                    <input
                        type="checkbox"
                        id={fieldId || 'privacy-checkbox'}
                        name={fieldId || 'privacy-checkbox'}
                        value={value}
                        checked={checked}
                        onChange={handleCheckboxToggle}
                        style={{
                            marginTop: '2px',
                            cursor: 'pointer'
                        }}
                    />
                    <label
                        htmlFor={fieldId || 'privacy-checkbox'}
                        style={{
                            fontSize: '14px',
                            lineHeight: '1.4',
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                        onClick={handleCheckboxToggle}
                    >
                        {renderPrivacyText()}
                    </label>
                </div>

                {required && validationMessage && !checked && (
                    <span
                        className="validation-message"
                        style={{
                            color: '#d94f4f',
                            fontSize: '12px',
                            marginTop: '4px',
                            display: 'block'
                        }}
                    >
                        {validationMessage}
                    </span>
                )}
            </div>
        </Fragment>
    );
};

export default Edit;
