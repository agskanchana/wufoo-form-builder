Here are the contents for the file: /ekwa-wufoo-form-builder/ekwa-wufoo-form-builder/src/blocks/form-input/save.js

export default function save({ attributes }) {
    return (
        <input
            type="text"
            value={attributes.value}
            placeholder={attributes.placeholder}
            className={attributes.className}
        />
    );
}