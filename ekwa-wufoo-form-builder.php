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

// Enqueue block editor assets.
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

// Enqueue frontend assets.
function ekwa_wufoo_form_builder_frontend_assets() {
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
add_action( 'wp_enqueue_scripts', 'ekwa_wufoo_form_builder_frontend_assets' );

// Enqueue styles for both editor and frontend
function ekwa_wufoo_form_builder_block_assets() {
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
add_action( 'enqueue_block_assets', 'ekwa_wufoo_form_builder_block_assets' );

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

    $required_indicator = $attributes['required'] ? ' <span style="color: red;">*</span>' : '';

    $validation_html = '';
    if ( $attributes['required'] && !empty( $validation_message ) ) {
        $validation_html = sprintf(
            '<span class="validation-message" style="color: #d94f4f; font-size: 12px; margin-top: 4px; display: none;">%s</span>',
            $validation_message
        );
    }

    return sprintf(
        '<div class="form-input"><label for="%s">%s%s</label><input type="%s" id="%s" name="%s" placeholder="%s" %s />%s</div>',
        $field_id,
        $label,
        $required_indicator,
        $input_type,
        $field_id,
        $field_id,
        $placeholder,
        $required,
        $validation_html
    );
}

function ekwa_wufoo_form_select_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $options_string = $attributes['options'];
    $field_id = !empty( $attributes['fieldId'] ) ? esc_attr( $attributes['fieldId'] ) : 'select-' . uniqid();
    $required = $attributes['required'] ? 'required' : '';
    $validation_message = esc_html( $attributes['validationMessage'] );

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

    return sprintf(
        '<div class="form-select"><label for="%s">%s%s</label><select id="%s" name="%s" %s>%s</select>%s</div>',
        $field_id,
        $label,
        $required_indicator,
        $field_id,
        $field_id,
        $required,
        $options_html,
        $validation_html
    );
}

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
        '<div class="form-checkbox"><label for="%s"><input type="checkbox" id="%s" name="%s" value="%s" %s %s /> %s%s</label>%s</div>',
        $field_id, $field_id, $field_id, $value, $checked, $required, $label, $required_indicator, $validation_html
    );
}

function ekwa_wufoo_form_radio_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $field_name = !empty( $attributes['fieldName'] ) ? esc_attr( $attributes['fieldName'] ) : 'radio-' . uniqid();
    $options_string = $attributes['options'];
    $option_ids_string = $attributes['optionIds'];
    $selected_value = esc_attr( $attributes['selectedValue'] );
    $required = $attributes['required'] ? 'required' : '';
    $validation_message = esc_html( $attributes['validationMessage'] );

    $required_indicator = $attributes['required'] ? ' <span style="color: red;">*</span>' : '';

    $options_array = explode( ',', $options_string );
    $ids_array = explode( ',', $option_ids_string );
    $options_html = '';

    foreach ( $options_array as $index => $option ) {
        $option = trim( $option );
        if ( !empty( $option ) ) {
            $option_id = !empty( $ids_array[$index] ) ? trim( $ids_array[$index] ) : $field_name . '_' . $index;
            $option_id = esc_attr( $option_id );
            $checked = ($selected_value === $option) ? 'checked="checked"' : '';
            $required_attr = ($index === 0) ? $required : ''; // Only add required to first radio button

            $options_html .= sprintf(
                '<label for="%s" style="display: block; margin-bottom: 8px;"><input id="%s" name="%s" type="radio" class="field radio" value="%s" %s %s tabindex="0" style="margin-right: 8px;" /> %s</label>',
                $option_id,
                $option_id,
                $field_name,
                esc_attr($option),
                $checked,
                $required_attr,
                esc_html($option)
            );
        }
    }

    $validation_html = '';
    if ( $attributes['required'] && !empty( $validation_message ) ) {
        $validation_html = sprintf(
            '<span class="validation-message" style="color: #d94f4f; font-size: 12px; margin-top: 4px; display: none;">%s</span>',
            $validation_message
        );
    }

    return sprintf(
        '<div class="form-radio"><fieldset><legend>%s%s</legend>%s</fieldset>%s</div>',
        $label, $required_indicator, $options_html, $validation_html
    );
}

function ekwa_wufoo_form_textarea_render( $attributes ) {
    $label = esc_html( $attributes['label'] );
    $placeholder = esc_attr( $attributes['placeholder'] );
    $field_id = !empty( $attributes['fieldId'] ) ? esc_attr( $attributes['fieldId'] ) : 'textarea-' . uniqid();
    $rows = intval( $attributes['rows'] );
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
        '<div class="form-textarea"><label for="%s">%s%s</label><textarea id="%s" name="%s" placeholder="%s" rows="%d" %s></textarea>%s</div>',
        $field_id, $label, $required_indicator, $field_id, $field_id, $placeholder, $rows, $required, $validation_html
    );
}
?>