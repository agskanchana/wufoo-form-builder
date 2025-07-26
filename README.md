# EKWA Wufoo Form Builder

The EKWA Wufoo Form Builder is a comprehensive WordPress plugin that allows users to create custom forms using a block-based interface. This plugin provides a parent form block that integrates with Wufoo services and includes various child blocks for form elements, layout blocks, and advanced features like icons, validation, and styling options.

## Features

### Core Features
- **Block-based form creation** using WordPress Gutenberg editor
- **Wufoo integration** for form submission handling
- **Real-time validation** with custom error messages
- **Icon support** via Iconify icons for enhanced visual appeal
- **Multiple form templates** (Contact Form, Appointment Form, Blank Form)
- **Responsive design** with mobile-friendly layouts
- **Advanced styling options** for submit buttons
- **Phone number masking** for telephone inputs
- **Date picker** with various restriction options

### Layout & Structure Blocks
The form builder supports WordPress core layout blocks for flexible form design:
- **Columns** (`core/columns`) - Create multi-column layouts
- **Column** (`core/column`) - Individual column containers
- **Group** (`core/group`) - Group related form elements
- **Heading** (`core/heading`) - Form section headings
- **Paragraph** (`core/paragraph`) - Descriptive text and instructions
- **Spacer** (`core/spacer`) - Add spacing between elements
- **Separator** (`core/separator`) - Visual dividers

### Form Input Blocks

#### 1. Form Input (`ekwa-wufoo/form-input`)
**Supported input types:**
- Text
- Email
- Password
- Number
- Telephone (with automatic masking)

**Features:**
- Custom labels and placeholders
- Required field validation
- Custom validation messages
- Icon positioning (left, right, above)
- Phone number formatting (e.g., `(###) ###-####`)

#### 2. Form Select (`ekwa-wufoo/form-select`)
- Dropdown selection with custom options
- Required field validation
- Custom validation messages
- Icon support with positioning options

#### 3. Form Radio Group (`ekwa-wufoo/form-radio`)
- Radio button groups with multiple options
- Individual ID assignment for each radio button
- Default selection options
- Required field validation
- Custom validation messages

#### 4. Form Checkbox (`ekwa-wufoo/form-checkbox`)
- Single checkbox inputs
- Custom values and labels
- Required field validation
- Custom validation messages

#### 5. Form Checkbox Group (`ekwa-wufoo/form-checkbox-group`)
- Multiple checkbox selections
- Minimum and maximum selection limits
- Group validation with custom messages
- Individual checkbox ID management

#### 6. Form Textarea (`ekwa-wufoo/form-textarea`)
- Multi-line text input
- Configurable row height
- Custom placeholders
- Icon positioning (top-left, top-right, above)
- Required field validation

#### 7. Form Datepicker (`ekwa-wufoo/form-datepicker`)
**Date restriction options:**
- Disable past dates
- Disable future dates
- Disable weekends
- Set minimum and maximum date ranges
- Default value setting

**Features:**
- Custom placeholder text
- Icon support with positioning
- Required field validation
- Custom validation messages

#### 8. Form Privacy Checkbox (`ekwa-wufoo/form-privacy-checkbox`)
- Privacy policy acceptance checkbox
- Customizable privacy text
- Privacy policy URL linking
- Required field validation
- Custom link text options

## Icon System

### Adding Icons
1. Click on any form field block
2. In the block settings panel, find "Icon Settings"
3. Click "Add Icon" or "Change Icon"
4. Browse and select from thousands of Iconify icons
5. Choose icon position: Left, Right, or Above

### Icon Positions
- **Left/Right**: Icons appear inside the input field
- **Above**: Icons appear above the field label
- **Top-left/Top-right**: For textarea fields

## Custom Validation

### Setting Up Validation
1. Select any form field block
2. In the Inspector panel, find the field settings
3. Toggle "Required Field" if needed
4. Enter your custom validation message in "Validation Message"
5. Messages appear when validation fails during form submission

### Validation Features
- Real-time validation on field blur
- Custom error messages for each field
- Visual error states with red borders
- Automatic error clearing on field interaction
- Form-wide validation before submission

## Wufoo Integration Setup

### Step 1: Create Wufoo Form
1. Log into your Wufoo account
2. Create a new form with matching field names
3. Note down the form's integration details

### Step 2: Configure Main Form Block
Select the main "Ekwa Wufoo Form Builder" block and configure:

**Required Settings:**
- **Form ID**: Unique identifier for your form (e.g., `contact-form-1`)
- **Ekwa URL**: Form submission endpoint (default: `https://www.ekwa.com/ekwa-wufoo-handler/en-no-recaptcha.php`)
- **Form Action URL**: Wufoo form action URL for encryption
- **Form ID Stamp**: Wufoo-provided ID stamp code

**Optional Settings:**
- Submit button text, style, colors, and alignment
- Form templates selection

### Step 3: Configure Child Block Field IDs
For each form field block, set the **Field ID** to match your Wufoo form fields:

**Examples:**
- Input fields: `Field1`, `Field2`, `Field3`
- Select fields: `Field4`, `Field5`
- Radio groups: `Field6` (group name)
- Individual radio buttons: `Field6_1`, `Field6_2`, `Field6_3`
- Checkboxes: `Field7`, `Field8`
- Textarea: `Field9`
- Date picker: `Field10`

## Form Templates

### Available Templates

#### 1. Contact Form
Pre-configured with:
- Name field (text input with user icon)
- Email field (email input with email icon)
- Phone field (tel input with phone icon and masking)
- Comments field (textarea with comment icon)
- Privacy checkbox

#### 2. Appointment Form
Pre-configured with:
- Two-column layout for date and time
- Date picker with calendar icon
- Time selection dropdown
- New patient selection
- Contact information fields
- Comments section
- Privacy acceptance

#### 3. Blank Form
Empty template for custom form creation

## Installation

1. Download the plugin files
2. Upload the `ekwa-wufoo-form-builder` folder to `/wp-content/plugins/`
3. Activate the plugin through the 'Plugins' menu in WordPress
4. The block will be available in the "Widgets" category of the block editor

## Usage

### Quick Start
1. Add "Ekwa Wufoo Form Builder" block to your page
2. Choose a template or start with a blank form
3. Configure Wufoo integration settings
4. Customize field labels, validation, and icons
5. Set appropriate Field IDs to match your Wufoo form
6. Test form submission and validation

### Advanced Customization
- Use WordPress layout blocks for complex form structures
- Add icons to enhance visual appeal
- Set up comprehensive validation messages
- Configure phone number masking for international formats
- Implement date restrictions for appointment forms

## Styling & Appearance

### Submit Button Styles
- **Default**: Standard button appearance
- **Rounded**: Rounded corners
- **Square**: Sharp corners
- **Outline**: Transparent background with colored border

### Color Customization
- Custom background colors for submit buttons
- Custom text colors
- Button alignment options (left, center, right)

## Validation & Error Handling

### Client-side Validation
- Real-time field validation
- Custom error message display
- Visual error indicators
- Automatic error clearing
- Form-wide validation before submission

### Supported Validation Types
- Required field validation
- Email format validation
- Phone number format validation
- Date range validation
- Checkbox group min/max selections
- Radio group selection requirements

## Browser Compatibility

- Modern browsers with ES6 support
- Mobile-responsive design
- Touch-friendly date pickers
- Progressive enhancement for older browsers

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for enhancements and bug reports.

## License

This project is licensed under the GPL v2 or later. See the license file for more details.

## Support

For support with Wufoo integration or plugin functionality, please refer to the plugin documentation or contact the development team.