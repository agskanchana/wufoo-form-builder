<?php

/**
 * Plugin Name: EKWA Wufoo Form Builder
 * Description: A custom block for building forms using input and select elements.
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL2
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define the plugin path.
define( 'EKWA_WUFOO_FORM_BUILDER_PATH', plugin_dir_path( __FILE__ ) );

// Enqueue block editor assets (EDITOR ONLY)
function ekwa_wufoo_form_builder_editor_assets() {
    $js_file = EKWA_WUFOO_FORM_BUILDER_PATH . 'build/index.js';
    $editor_css_file = EKWA_WUFOO_FORM_BUILDER_PATH . 'build/editor.css';

    // Only enqueue if files exist
    if ( file_exists( $js_file ) ) {
        wp_enqueue_script(
            'ekwa-wufoo-form-builder',
            plugins_url( 'build/index.js', __FILE__ ),
            array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components' ),
            filemtime( $js_file )
        );
    }

    // EDITOR.CSS - Only loads in block editor
    if ( file_exists( $editor_css_file ) ) {
        wp_enqueue_style(
            'ekwa-wufoo-form-builder-editor',
            plugins_url( 'build/editor.css', __FILE__ ),
            array(),
            filemtime( $editor_css_file )
        );
    }
}
add_action( 'enqueue_block_editor_assets', 'ekwa_wufoo_form_builder_editor_assets' );

// Enqueue frontend and editor shared styles (BOTH frontend and editor)
function ekwa_wufoo_form_builder_shared_assets() {
    // Only enqueue on pages that have the form block OR in the editor
    if ( has_block('ekwa-wufoo/form-builder') || is_admin() ) {
        // STYLE.CSS - Shared frontend and editor styles
        $css_file = EKWA_WUFOO_FORM_BUILDER_PATH . 'build/style.css';
        if ( file_exists( $css_file ) ) {
            wp_enqueue_style(
                'ekwa-wufoo-form-builder-style',
                plugins_url( 'build/style.css', __FILE__ ),
                array(),
                filemtime( $css_file )
            );
        }
    }
}
add_action( 'enqueue_block_assets', 'ekwa_wufoo_form_builder_shared_assets' );

// Enqueue frontend-only assets
function ekwa_wufoo_form_builder_frontend_assets() {
    // Only enqueue on frontend pages that have the form block (NOT in admin)
    if ( !is_admin() && has_block('ekwa-wufoo/form-builder') ) {
        // Form validation JavaScript
        wp_enqueue_script(
            'ekwa-form-validation',
            plugins_url('assets/js/form-validation.js', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'assets/js/form-validation.js'),
            true
        );

        // Phone masking JavaScript
        wp_enqueue_script(
            'ekwa-phone-mask',
            plugins_url('assets/js/phone-mask.js', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'assets/js/phone-mask.js'),
            true
        );

        // Datepicker JavaScript
        wp_enqueue_script(
            'ekwa-datepicker',
            plugins_url('assets/js/datepicker.js', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'assets/js/datepicker.js'),
            true
        );

        // Form styles
        wp_enqueue_style(
            'ekwa-form-styles',
            plugins_url('assets/css/form-styles.css', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'assets/css/form-styles.css')
        );
    }
}
add_action( 'wp_enqueue_scripts', 'ekwa_wufoo_form_builder_frontend_assets' );

// Register blocks with PHP render callbacks
function ekwa_wufoo_form_builder_register_blocks() {
    // Register parent form block
    register_block_type( 'ekwa-wufoo/form-builder', array(
        'render_callback' => 'ekwa_wufoo_form_builder_render',
        'attributes' => array(
            'formId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'submitText' => array(
                'type' => 'string',
                'default' => 'Submit'
            ),
            'actionUrl' => array(
                'type' => 'string',
                'default' => ''
            ),
            'ekwaUrl' => array(
                'type' => 'string',
                'default' => 'https://www.ekwa.com/ekwa-wufoo-handler/en-no-recaptcha.php'
            ),
            'idStamp' => array(
                'type' => 'string',
                'default' => ''
            )
        )
    ) );

    // Register input block
    register_block_type( 'ekwa-wufoo/form-input', array(
        'render_callback' => 'ekwa_wufoo_form_input_render',
        'attributes' => array(
            'label' => array('type' => 'string', 'default' => 'Input Label'),
            'placeholder' => array('type' => 'string', 'default' => 'Enter text...'),
            'inputType' => array('type' => 'string', 'default' => 'text'),
            'fieldId' => array('type' => 'string', 'default' => ''),
            'required' => array('type' => 'boolean', 'default' => false),
            'validationMessage' => array('type' => 'string', 'default' => ''),
            'iconName' => array('type' => 'string', 'default' => ''),
            'iconPosition' => array('type' => 'string', 'default' => 'left'),
            'iconSvgContent' => array('type' => 'string', 'default' => ''),
            'enablePhoneMask' => array('type' => 'boolean', 'default' => true),
            'phoneFormat' => array('type' => 'string', 'default' => '###-###-####')
        )
    ) );

    // Register select block
    register_block_type( 'ekwa-wufoo/form-select', array(
        'render_callback' => 'ekwa_wufoo_form_select_render',
        'attributes' => array(
            'label' => array('type' => 'string', 'default' => 'Select Label'),
            'options' => array('type' => 'string', 'default' => 'Option 1,Option 2,Option 3'),
            'fieldId' => array('type' => 'string', 'default' => ''),
            'required' => array('type' => 'boolean', 'default' => false),
            'validationMessage' => array('type' => 'string', 'default' => '')
        )
    ) );

    // Register checkbox block
    register_block_type( 'ekwa-wufoo/form-checkbox', array(
        'render_callback' => 'ekwa_wufoo_form_checkbox_render',
        'attributes' => array(
            'label' => array('type' => 'string', 'default' => 'Checkbox Label'),
            'fieldId' => array('type' => 'string', 'default' => ''),
            'value' => array('type' => 'string', 'default' => 'checkbox_value'),
            'checked' => array('type' => 'boolean', 'default' => false),
            'required' => array('type' => 'boolean', 'default' => false),
            'validationMessage' => array('type' => 'string', 'default' => '')
        )
    ) );

    // Register radio block
    register_block_type( 'ekwa-wufoo/form-radio', array(
        'render_callback' => 'ekwa_wufoo_form_radio_render',
        'attributes' => array(
            'label' => array('type' => 'string', 'default' => 'Radio Group Label'),
            'fieldName' => array('type' => 'string', 'default' => ''),
            'options' => array('type' => 'string', 'default' => 'Option 1,Option 2,Option 3'),
            'optionIds' => array('type' => 'string', 'default' => ''),
            'selectedValue' => array('type' => 'string', 'default' => ''),
            'required' => array('type' => 'boolean', 'default' => false),
            'validationMessage' => array('type' => 'string', 'default' => '')
        )
    ) );

    // Register textarea block
    register_block_type( 'ekwa-wufoo/form-textarea', array(
        'render_callback' => 'ekwa_wufoo_form_textarea_render',
        'attributes' => array(
            'label' => array('type' => 'string', 'default' => 'Textarea Label'),
            'placeholder' => array('type' => 'string', 'default' => 'Enter your message...'),
            'fieldId' => array('type' => 'string', 'default' => ''),
            'rows' => array('type' => 'number', 'default' => 4),
            'required' => array('type' => 'boolean', 'default' => false),
            'validationMessage' => array('type' => 'string', 'default' => '')
        )
    ) );

    // Register checkbox group block
    register_block_type( 'ekwa-wufoo/form-checkbox-group', array(
        'render_callback' => 'ekwa_wufoo_form_checkbox_group_render',
        'attributes' => array(
            'label' => array('type' => 'string', 'default' => 'Checkbox Group Label'),
            'fieldName' => array('type' => 'string', 'default' => ''),
            'options' => array('type' => 'string', 'default' => 'Option 1,Option 2,Option 3'),
            'optionIds' => array('type' => 'string', 'default' => ''),
            'selectedValues' => array('type' => 'array', 'default' => array()),
            'required' => array('type' => 'boolean', 'default' => false),
            'validationMessage' => array('type' => 'string', 'default' => ''),
            'minSelections' => array('type' => 'number', 'default' => 1),
            'maxSelections' => array('type' => 'number', 'default' => 0)
        )
    ) );

    // Register datepicker block
    register_block_type( 'ekwa-wufoo/form-datepicker', array(
        'render_callback' => 'ekwa_wufoo_form_datepicker_render',
        'attributes' => array(
            'label' => array('type' => 'string', 'default' => 'Select Date'),
            'fieldId' => array('type' => 'string', 'default' => ''),
            'required' => array('type' => 'boolean', 'default' => false),
            'validationMessage' => array('type' => 'string', 'default' => ''),
            'disablePastDates' => array('type' => 'boolean', 'default' => true),
            'disableFutureDates' => array('type' => 'boolean', 'default' => false),
            'disableWeekends' => array('type' => 'boolean', 'default' => false),
            'minDate' => array('type' => 'string', 'default' => ''),
            'maxDate' => array('type' => 'string', 'default' => ''),
            'defaultValue' => array('type' => 'string', 'default' => ''),
            'placeholder' => array('type' => 'string', 'default' => 'Select a date'),
            'iconName' => array('type' => 'string', 'default' => ''),
            'iconPosition' => array('type' => 'string', 'default' => 'left'),
            'iconSvgContent' => array('type' => 'string', 'default' => '')
        )
    ) );
}
add_action( 'init', 'ekwa_wufoo_form_builder_register_blocks' );

// Encryption function for URL
function encryptString($plaintext, $key, $cipherMethod) {
    $ivLength = openssl_cipher_iv_length($cipherMethod);
    $iv = openssl_random_pseudo_bytes($ivLength);
    $encrypted = openssl_encrypt($plaintext, $cipherMethod, $key, 0, $iv);
    return base64_encode($iv . $encrypted);
}

// Render callback for parent form block
function ekwa_wufoo_form_builder_render( $attributes, $content ) {
    $form_id = !empty( $attributes['formId'] ) ? esc_attr( $attributes['formId'] ) : 'ekwa-form-' . uniqid();
    $submit_text = !empty( $attributes['submitText'] ) ? esc_html( $attributes['submitText'] ) : 'Submit';
    $action_url = !empty( $attributes['ekwaUrl'] ) ? esc_url( $attributes['ekwaUrl'] ) : 'https://www.ekwa.com/ekwa-wufoo-handler/en.php';
    $id_stamp = !empty( $attributes['idStamp'] ) ? esc_attr( $attributes['idStamp'] ) : '';
    $form_action_url = !empty( $attributes['actionUrl'] ) ? $attributes['actionUrl'] : '';

    // Build encrypted URL hidden input if Form Action URL is provided
    $encrypted_url_html = '';
    if ( !empty( $form_action_url ) ) {
        $key = "ozVu8SPWo2";
        $cipherMethod = "AES-256-CBC";
        $encrypted_url = encryptString($form_action_url, $key, $cipherMethod);
        $encrypted_url_html = sprintf(
            '<input type="hidden" name="url" value="%s">',
            esc_attr($encrypted_url)
        );
    }

    // Build ID stamp HTML as hidden input if provided
    $id_stamp_html = '';
    if ( !empty( $id_stamp ) ) {
        $id_stamp_html = sprintf(
            '<input type="hidden" id="idstamp" name="idstamp" value="%s">',
            $id_stamp
        );
    }

    return sprintf(
        '<div class="ekwa-wufoo-form-builder"><form id="%s" name="%s" method="post" action="%s">%s<div class="form-submit"><button type="submit" class="submit-button primary">%s</button></div>%s%s</form></div>',
        $form_id,
        $form_id,
        $action_url,
        $content,
        $submit_text,
        $encrypted_url_html,
        $id_stamp_html
    );
}

// Updated render callbacks to include required attribute
function ekwa_wufoo_form_input_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $placeholder = esc_attr( $attributes['placeholder'] );
    $input_type = esc_attr( $attributes['inputType'] );
    $field_id = !empty( $attributes['fieldId'] ) ? esc_attr( $attributes['fieldId'] ) : 'input-' . uniqid();
    $required = $attributes['required'] ? 'required' : '';
    $validation_message = esc_html( $attributes['validationMessage'] );
    $icon_name = !empty( $attributes['iconName'] ) ? $attributes['iconName'] : '';
    $icon_position = !empty( $attributes['iconPosition'] ) ? $attributes['iconPosition'] : 'left';
    $icon_svg_content = !empty( $attributes['iconSvgContent'] ) ? $attributes['iconSvgContent'] : '';
    $enable_phone_mask = isset( $attributes['enablePhoneMask'] ) ? $attributes['enablePhoneMask'] : true;
    $phone_format = !empty( $attributes['phoneFormat'] ) ? $attributes['phoneFormat'] : '###-###-####';

    $required_indicator = $attributes['required'] ? ' <span style="color: red;">*</span>' : '';

    $validation_html = '';
    if ( $attributes['required'] && !empty( $validation_message ) ) {
        $validation_html = sprintf(
            '<span class="validation-message" style="color: #d94f4f; font-size: 12px; margin-top: 4px; display: none;">%s</span>',
            $validation_message
        );
    }

    // Build icon HTML (only Iconify icons)
    $icon_html = '';
    if ( !empty( $icon_name ) && strpos( $icon_name, ':' ) !== false && !empty( $icon_svg_content ) ) {
        $icon_html = sprintf(
            '<span class="ekwa-icon-svg" style="width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">%s</span>',
            $icon_svg_content
        );
    }

    // Label with icon
    $label_html = sprintf('<label for="%s">', $field_id);
    if ( $icon_html && $icon_position === 'above' ) {
        $label_html .= $icon_html . ' ';
    }
    $label_html .= $label . $required_indicator . '</label>';

    // Handle phone masking attributes
    $mask_attributes = '';
    $input_class = 'ekwa-form-input';
    if ( $input_type === 'tel' && $enable_phone_mask ) {
        $mask_attributes = sprintf(' data-mask="%s" data-mask-placeholder="%s"',
            esc_attr( $phone_format ),
            esc_attr( str_replace( '#', '_', $phone_format ) )
        );
        $input_class .= ' ekwa-phone-mask';
        // Update placeholder for phone fields
        if ( empty( $placeholder ) || $placeholder === 'Enter text...' ) {
            $placeholder = str_replace( '#', '_', $phone_format );
        }
    }

    // Input with icon positioning
    $input_style = '';
    if ( $icon_html && ($icon_position === 'left' || $icon_position === 'right') ) {
        $padding_side = $icon_position === 'left' ? 'padding-left' : 'padding-right';
        $input_style = sprintf('style="%s: 35px;"', $padding_side);
    }

    $input_wrapper_start = '';
    $input_wrapper_end = '';
    $icon_in_input = '';

    if ( $icon_html && ($icon_position === 'left' || $icon_position === 'right') ) {
        $input_wrapper_start = '<div class="ekwawf-input-wrapper" style="position: relative; display: flex; align-items: center;">';
        $input_wrapper_end = '</div>';
        $icon_position_style = $icon_position === 'left' ? 'left: 10px;' : 'right: 10px;';
        $icon_in_input = sprintf(
            '<div class="ekwawf-icon-wrapper" style="position: absolute; %s z-index: 1; pointer-events: none;">%s</div>',
            $icon_position_style,
            $icon_html
        );
    }

    return sprintf(
        '<div class="form-input">%s%s%s<input type="%s" id="%s" name="%s" class="%s" placeholder="%s" %s %s%s />%s%s</div>',
        $label_html,
        $input_wrapper_start,
        $icon_in_input,
        $input_type,
        $field_id,
        $field_id,
        $input_class,
        $placeholder,
        $required,
        $input_style,
        $mask_attributes,
        $input_wrapper_end,
        $validation_html
    );
}

// Updated Select Render Function
function ekwa_wufoo_form_select_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $options_string = $attributes['options'];
    $field_id = !empty( $attributes['fieldId'] ) ? esc_attr( $attributes['fieldId'] ) : 'select-' . uniqid();
    $required = $attributes['required'] ? 'required' : '';
    $validation_message = esc_html( $attributes['validationMessage'] );
    $icon_name = !empty( $attributes['iconName'] ) ? $attributes['iconName'] : '';
    $icon_position = !empty( $attributes['iconPosition'] ) ? $attributes['iconPosition'] : 'left';
    $icon_svg_content = !empty( $attributes['iconSvgContent'] ) ? $attributes['iconSvgContent'] : '';

    $required_indicator = $attributes['required'] ? ' <span style="color: red;">*</span>' : '';

    $options_array = explode( ',', $options_string );
    $options_html = '<option value="">Select an option...</option>';

    foreach ( $options_array as $option ) {
        $option = trim( $option );
        if ( !empty( $option ) ) {
            $options_html .= sprintf( '<option value="%s">%s</option>', esc_attr( $option ), esc_html( $option ) );
        }
    }

    $validation_html = '';
    if ( $attributes['required'] && !empty( $validation_message ) ) {
        $validation_html = sprintf(
            '<span class="validation-message" style="color: #d94f4f; font-size: 12px; margin-top: 4px; display: none;">%s</span>',
            $validation_message
        );
    }

    // Build icon HTML (only Iconify icons)
    $icon_html = '';
    if ( !empty( $icon_name ) && strpos( $icon_name, ':' ) !== false && !empty( $icon_svg_content ) ) {
        $icon_html = sprintf(
            '<span class="ekwa-icon-svg" style="width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">%s</span>',
            $icon_svg_content
        );
    }

    // Label with icon
    $label_html = sprintf('<label for="%s">', $field_id);
    if ( $icon_html && $icon_position === 'above' ) {
        $label_html .= $icon_html . ' ';
    }
    $label_html .= $label . $required_indicator . '</label>';

    // Select with icon positioning
    $select_style = '';
    if ( $icon_html && ($icon_position === 'left' || $icon_position === 'right') ) {
        $padding_side = $icon_position === 'left' ? 'padding-left' : 'padding-right';
        $select_style = sprintf('style="%s: 35px;"', $padding_side);
    }

    $select_wrapper_start = '';
    $select_wrapper_end = '';
    $icon_in_select = '';

    if ( $icon_html && ($icon_position === 'left' || $icon_position === 'right') ) {
        $select_wrapper_start = '<div style="position: relative; display: flex; align-items: center;">';
        $select_wrapper_end = '</div>';
        $icon_position_style = $icon_position === 'left' ? 'left: 10px;' : 'right: 10px;';
        $icon_in_select = sprintf(
            '<div class="ekwawf-icon-wrapper" style="position: absolute; %s z-index: 1; pointer-events: none;">%s</div>',
            $icon_position_style,
            $icon_html
        );
    }

    return sprintf(
        '<div class="form-select">%s%s%s<select id="%s" name="%s" %s %s>%s</select>%s%s</div>',
        $label_html,
        $select_wrapper_start,
        $icon_in_select,
        $field_id,
        $field_id,
        $required,
        $select_style,
        $options_html,
        $select_wrapper_end,
        $validation_html
    );
}

// Updated Textarea Render Function
function ekwa_wufoo_form_textarea_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $placeholder = esc_attr( $attributes['placeholder'] );
    $field_id = !empty( $attributes['fieldId'] ) ? esc_attr( $attributes['fieldId'] ) : 'textarea-' . uniqid();
    $rows = intval( $attributes['rows'] );
    $required = $attributes['required'] ? 'required' : '';
    $validation_message = esc_html( $attributes['validationMessage'] );
    $icon_name = !empty( $attributes['iconName'] ) ? $attributes['iconName'] : '';
    $icon_position = !empty( $attributes['iconPosition'] ) ? $attributes['iconPosition'] : 'above';
    $icon_svg_content = !empty( $attributes['iconSvgContent'] ) ? $attributes['iconSvgContent'] : '';

    $required_indicator = $attributes['required'] ? ' <span style="color: red;">*</span>' : '';

    $validation_html = '';
    if ( $attributes['required'] && !empty( $validation_message ) ) {
        $validation_html = sprintf(
            '<span class="validation-message" style="color: #d94f4f; font-size: 12px; margin-top: 4px; display: none;">%s</span>',
            $validation_message
        );
    }

    // Build icon HTML (only Iconify icons)
    $icon_html = '';
    if ( !empty( $icon_name ) && strpos( $icon_name, ':' ) !== false && !empty( $icon_svg_content ) ) {
        $icon_html = sprintf(
            '<span class="ekwa-icon-svg" style="width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">%s</span>',
            $icon_svg_content
        );
    }

    // Label with icon
    $label_html = sprintf('<label for="%s">', $field_id);
    if ( $icon_html && $icon_position === 'above' ) {
        $label_html .= $icon_html . ' ';
    }
    $label_html .= $label . $required_indicator . '</label>';

    // Textarea with icon positioning
    $textarea_style = '';
    if ( $icon_html && ($icon_position === 'top-left' || $icon_position === 'top-right') ) {
        $padding_side = $icon_position === 'top-left' ? 'padding-left' : 'padding-right';
        $textarea_style = sprintf('style="padding-top: 10px; %s: 35px;"', $padding_side);
    }

    $textarea_wrapper_start = '';
    $textarea_wrapper_end = '';
    $icon_in_textarea = '';

    if ( $icon_html && ($icon_position === 'top-left' || $icon_position === 'top-right') ) {
        $textarea_wrapper_start = '<div style="position: relative; display: flex; align-items: flex-start;">';
        $textarea_wrapper_end = '</div>';
        $icon_position_style = $icon_position === 'top-left' ? 'top: 10px; left: 10px;' : 'top: 10px; right: 10px;';
        $icon_in_textarea = sprintf(
            '<div style="position: absolute; %s z-index: 1; pointer-events: none;">%s</div>',
            $icon_position_style,
            $icon_html
        );
    }

    return sprintf(
        '<div class="form-textarea">%s%s%s<textarea id="%s" name="%s" placeholder="%s" rows="%d" %s %s></textarea>%s%s</div>',
        $label_html,
        $textarea_wrapper_start,
        $icon_in_textarea,
        $field_id,
        $field_id,
        $placeholder,
        $rows,
        $required,
        $textarea_style,
        $textarea_wrapper_end,
        $validation_html
    );
}

// Add this function after your other render functions
function ekwa_wufoo_form_radio_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $field_name = !empty( $attributes['fieldName'] ) ? esc_attr( $attributes['fieldName'] ) : 'radio-group-' . uniqid();
    $options_string = $attributes['options'];
    $option_ids_string = !empty( $attributes['optionIds'] ) ? $attributes['optionIds'] : '';
    $selected_value = $attributes['selectedValue'];
    $required = $attributes['required'] ? 'required' : '';
    $validation_message = esc_html( $attributes['validationMessage'] );

    $required_indicator = $attributes['required'] ? ' <span style="color: red;">*</span>' : '';

    // Parse options and IDs
    $options_array = explode( ',', $options_string );
    $ids_array = explode( ',', $option_ids_string );

    // Clean up arrays
    $options_array = array_map( 'trim', $options_array );
    $options_array = array_filter( $options_array );

    $ids_array = array_map( 'trim', $ids_array );

    // Ensure IDs array has same length as options array
    while ( count( $ids_array ) < count( $options_array ) ) {
        $ids_array[] = '';
    }

    $validation_html = '';
    if ( $attributes['required'] && !empty( $validation_message ) ) {
        $validation_html = sprintf(
            '<span class="validation-message" style="color: #d94f4f; font-size: 12px; margin-top: 4px; display: none;">%s</span>',
            $validation_message
        );
    }

    // Build radio buttons HTML
    $radio_buttons_html = '';
    foreach ( $options_array as $index => $option ) {
        if ( empty( $option ) ) continue;

        $radio_id = !empty( $ids_array[$index] ) ? esc_attr( $ids_array[$index] ) : 'radio_' . $index . '_' . uniqid();
        $is_checked = ( $selected_value === $option ) ? 'checked' : '';

        $radio_buttons_html .= sprintf(
            '<label for="%s" style="display: block; margin-bottom: 8px; cursor: pointer;">
                <input type="radio" id="%s" name="%s" value="%s" %s %s style="margin-right: 8px;" />
                %s
            </label>',
            $radio_id,
            $radio_id,
            $field_name,
            esc_attr( $option ),
            $is_checked,
            $required,
            esc_html( $option )
        );
    }

    return sprintf(
        '<div class="form-radio">
            <fieldset style="border: 1px solid #ccc; border-radius: 4px; padding: 15px; margin: 0;">
                <legend style="padding: 0 10px;">%s%s</legend>
                %s
            </fieldset>
            %s
        </div>',
        $label,
        $required_indicator,
        $radio_buttons_html,
        $validation_html
    );
}

// Add this function to your ekwa-wufoo-form-builder.php file after the radio render function

function ekwa_wufoo_form_checkbox_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $field_id = !empty( $attributes['fieldId'] ) ? esc_attr( $attributes['fieldId'] ) : 'checkbox-' . uniqid();
    $value = esc_attr( $attributes['value'] );
    $checked = $attributes['checked'] ? 'checked="checked"' : '';
    $required = $attributes['required'] ? 'required' : '';
    $validation_message = esc_html( $attributes['validationMessage'] );

    $required_indicator = $attributes['required'] ? ' <span style="color: red;">*</span>' : '';

    $validation_html = '';
    if ( $attributes['required'] && !empty( $validation_message ) ) {
        $validation_html = sprintf(
            '<span class="validation-message" style="color: #d94f4f; font-size: 12px; margin-top: 4px; display: none;">%s</span>',
            $validation_message
        );
    }

    return sprintf(
        '<div class="form-checkbox">
            <label for="%s" style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="%s" name="%s" value="%s" %s %s style="margin-right: 8px;" />
                %s%s
            </label>
            %s
        </div>',
        $field_id,
        $field_id,
        $field_id,
        $value,
        $checked,
        $required,
        $label,
        $required_indicator,
        $validation_html
    );
}

// Add this function to your ekwa-wufoo-form-builder.php file after the checkbox render function
function ekwa_wufoo_form_checkbox_group_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $field_name = !empty( $attributes['fieldName'] ) ? esc_attr( $attributes['fieldName'] ) : 'checkbox-group-' . uniqid();
    $options_string = $attributes['options'];
    $option_ids_string = !empty( $attributes['optionIds'] ) ? $attributes['optionIds'] : '';
    $selected_values = !empty( $attributes['selectedValues'] ) ? $attributes['selectedValues'] : array();
    $required = $attributes['required'] ? 'required' : '';
    $validation_message = esc_html( $attributes['validationMessage'] );
    $min_selections = intval( $attributes['minSelections'] );
    $max_selections = intval( $attributes['maxSelections'] );

    $required_indicator = $attributes['required'] ? ' <span style="color: red;">*</span>' : '';

    // Parse options - split by comma and clean
    $options_array = array_map('trim', explode(',', $options_string));
    $options_array = array_filter($options_array);

    // Parse IDs - split by comma and clean, handle line breaks
    $ids_string_cleaned = str_replace(array("\r\n", "\r", "\n"), ',', $option_ids_string);
    $ids_array = array_map('trim', explode(',', $ids_string_cleaned));
    $ids_array = array_filter($ids_array, function($id) {
        return $id !== '';
    });

    // Reset array keys
    $options_array = array_values($options_array);
    $ids_array = array_values($ids_array);

    $validation_html = '';
    if ( $attributes['required'] && !empty( $validation_message ) ) {
        $validation_html = sprintf(
            '<span class="validation-message" style="color: #d94f4f; font-size: 12px; margin-top: 4px; display: none;" data-min-selections="%d" data-max-selections="%d">%s</span>',
            $min_selections,
            $max_selections,
            $validation_message
        );
    }

    // Build checkbox buttons HTML with individual IDs and names
    $checkbox_buttons_html = '';
    foreach ( $options_array as $index => $option ) {
        if ( empty( $option ) ) continue;

        // Generate field ID - use custom ID if provided, otherwise use Field1, Field2, etc.
        $field_id = !empty( $ids_array[$index] ) ? esc_attr( $ids_array[$index] ) : 'Field' . ( $index + 1 );
        $is_checked = in_array( $option, $selected_values ) ? 'checked' : '';

        $checkbox_buttons_html .= sprintf(
            '<label for="%s" style="display: block; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" id="%s" name="%s" value="%s" %s %s style="margin-right: 8px;" data-group="%s" />
                %s
            </label>',
            $field_id,
            $field_id,
            $field_id, // Each checkbox has its own name
            esc_attr( $option ),
            $is_checked,
            $required,
            $field_name, // Keep data-group for validation
            esc_html( $option )
        );
    }

    // Determine if we have a label to show the border
    $has_label = !empty( trim( $label ) );

    // Choose fieldset style based on whether we have a label
    if ( $has_label ) {
        // With label - show border and legend
        $fieldset_style = 'border: 1px solid #ccc; border-radius: 4px; padding: 15px; margin: 0;';
        $legend_html = sprintf(
            '<legend style="padding: 0 10px;">%s%s</legend>',
            $label,
            $required_indicator
        );
    } else {
        // Without label - no border, just padding
        $fieldset_style = 'border: none; padding: 15px; margin: 0; padding-left: 0;';
        $legend_html = '';
    }

    $content_wrapper = sprintf(
        '<fieldset style="%s">%s%s</fieldset>',
        $fieldset_style,
        $legend_html,
        $checkbox_buttons_html
    );

    return sprintf(
        '<div class="form-checkbox-group" data-field-name="%s">%s%s</div>',
        $field_name,
        $content_wrapper,
        $validation_html
    );
}

// Render callback for datepicker block
function ekwa_wufoo_form_datepicker_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $field_id = !empty( $attributes['fieldId'] ) ? esc_attr( $attributes['fieldId'] ) : 'datepicker-' . uniqid();
    $required = $attributes['required'] ? 'required' : '';
    $validation_message = esc_html( $attributes['validationMessage'] );
    $disable_past_dates = $attributes['disablePastDates'];
    $disable_future_dates = $attributes['disableFutureDates'];
    $disable_weekends = $attributes['disableWeekends'];
    $min_date = !empty( $attributes['minDate'] ) ? esc_attr( $attributes['minDate'] ) : '';
    $max_date = !empty( $attributes['maxDate'] ) ? esc_attr( $attributes['maxDate'] ) : '';
    $default_value = !empty( $attributes['defaultValue'] ) ? esc_attr( $attributes['defaultValue'] ) : '';
    $placeholder = esc_attr( $attributes['placeholder'] );
    $icon_name = !empty( $attributes['iconName'] ) ? $attributes['iconName'] : '';
    $icon_position = !empty( $attributes['iconPosition'] ) ? $attributes['iconPosition'] : 'left';
    $icon_svg_content = !empty( $attributes['iconSvgContent'] ) ? $attributes['iconSvgContent'] : '';

    $required_indicator = $attributes['required'] ? ' <span style="color: red;">*</span>' : '';

    // Set min date if past dates are disabled
    if ( $disable_past_dates && empty( $min_date ) ) {
        $min_date = date('Y-m-d');
    }

    // Set max date if future dates are disabled
    if ( $disable_future_dates && empty( $max_date ) ) {
        $max_date = date('Y-m-d');
    }

    $validation_html = '';
    if ( $attributes['required'] && !empty( $validation_message ) ) {
        $validation_html = sprintf(
            '<span class="validation-message" style="color: #d94f4f; font-size: 12px; margin-top: 4px; display: none;">%s</span>',
            $validation_message
        );
    }

    // Build data attributes for JavaScript functionality
    $data_attributes = '';
    if ( $disable_weekends ) {
        $data_attributes .= ' data-disable-weekends="true"';
    }
    if ( $disable_past_dates ) {
        $data_attributes .= ' data-disable-past="true"';
    }
    if ( $disable_future_dates ) {
        $data_attributes .= ' data-disable-future="true"';
    }

    // Build icon HTML (only Iconify icons)
    $icon_html = '';
    if ( !empty( $icon_name ) && strpos( $icon_name, ':' ) !== false && !empty( $icon_svg_content ) ) {
        $icon_html = sprintf(
            '<span class="ekwa-icon-svg" style="width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">%s</span>',
            $icon_svg_content
        );
    }

    // Label with icon
    $label_html = sprintf('<label for="%s" style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">', $field_id);
    if ( $icon_html && $icon_position === 'above' ) {
        $label_html .= $icon_html . ' ';
    }
    $label_html .= '<span>' . $label . $required_indicator . '</span></label>';

    // Input with icon positioning
    $input_style = 'width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;';
    if ( $icon_html && ($icon_position === 'left' || $icon_position === 'right') ) {
        $padding_side = $icon_position === 'left' ? 'padding-left' : 'padding-right';
        $input_style = 'width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; ' . $padding_side . ': 35px;';
    }

    $input_wrapper_start = '';
    $input_wrapper_end = '';
    $icon_in_input = '';

    if ( $icon_html && ($icon_position === 'left' || $icon_position === 'right') ) {
        $input_wrapper_start = '<div  style="position: relative; display: flex; align-items: center;">';
        $input_wrapper_end = '</div>';
        $icon_position_style = $icon_position === 'left' ? 'left: 10px;' : 'right: 10px;';
        $icon_in_input = sprintf(
            '<div class="ekwawf-icon-wrapper" style="position: absolute; %s z-index: 1; pointer-events: none;">%s</div>',
            $icon_position_style,
            $icon_html
        );
    }

    $min_attr = !empty( $min_date ) ? sprintf( 'min="%s"', $min_date ) : '';
    $max_attr = !empty( $max_date ) ? sprintf( 'max="%s"', $max_date ) : '';
    $value_attr = !empty( $default_value ) ? sprintf( 'value="%s"', $default_value ) : '';

    return sprintf(
        '<div class="form-datepicker">
            %s
            %s
            %s
            <input type="date" id="%s" name="%s" class="ekwa-datepicker" %s %s %s %s placeholder="%s" style="%s"%s />
            %s
            %s
        </div>',
        $label_html,
        $input_wrapper_start,
        $icon_in_input,
        $field_id,
        $field_id,
        $required,
        $min_attr,
        $max_attr,
        $value_attr,
        $placeholder,
        $input_style,
        $data_attributes,
        $input_wrapper_end,
        $validation_html
    );
}

?>