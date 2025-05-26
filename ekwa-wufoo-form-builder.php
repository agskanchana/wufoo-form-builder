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

        // Form validation CSS
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
            'validationMessage' => array('type' => 'string', 'default' => '')
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
}
add_action( 'init', 'ekwa_wufoo_form_builder_register_blocks' );

// Render callback for parent form block
function ekwa_wufoo_form_builder_render( $attributes, $content ) {
    $form_id = !empty( $attributes['formId'] ) ? esc_attr( $attributes['formId'] ) : 'ekwa-form-' . uniqid();
    $submit_text = !empty( $attributes['submitText'] ) ? esc_html( $attributes['submitText'] ) : 'Submit';
    $action_url = !empty( $attributes['actionUrl'] ) ? esc_url( $attributes['actionUrl'] ) : '';
    $id_stamp = !empty( $attributes['idStamp'] ) ? esc_attr( $attributes['idStamp'] ) : '';

    // Build ID stamp HTML as hidden input if provided
    $id_stamp_html = '';
    if ( !empty( $id_stamp ) ) {
        $id_stamp_html = sprintf(
            '<input type="hidden" id="idstamp" name="idstamp" value="%s">',
            $id_stamp
        );
    }

    return sprintf(
        '<div class="ekwa-wufoo-form-builder"><form id="%s" name="%s" method="post" action="%s">%s<div class="form-submit"><button type="submit" class="submit-button primary">%s</button></div>%s</form></div>',
        $form_id,
        $form_id,
        $action_url,
        $content,
        $submit_text,
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
        $input_wrapper_start = '<div style="position: relative; display: flex; align-items: center;">';
        $input_wrapper_end = '</div>';
        $icon_position_style = $icon_position === 'left' ? 'left: 10px;' : 'right: 10px;';
        $icon_in_input = sprintf(
            '<div style="position: absolute; %s z-index: 1; pointer-events: none;">%s</div>',
            $icon_position_style,
            $icon_html
        );
    }

    return sprintf(
        '<div class="form-input">%s%s%s<input type="%s" id="%s" name="%s" placeholder="%s" %s %s />%s%s</div>',
        $label_html,
        $input_wrapper_start,
        $icon_in_input,
        $input_type,
        $field_id,
        $field_id,
        $placeholder,
        $required,
        $input_style,
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
            '<div style="position: absolute; %s z-index: 1; pointer-events: none;">%s</div>',
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
        $textarea_style = sprintf('style="padding-top: 35px; %s: 35px;"', $padding_side);
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

?>