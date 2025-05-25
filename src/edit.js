const { Fragment } = wp.element;
const { InnerBlocks } = wp.blockEditor;

const TEMPLATE = [
    ['ekwa-wufoo-form-builder/blocks/form-input', {}],
    ['ekwa-wufoo-form-builder/blocks/form-select', {}],
];

const Edit = () => {
    return (
        <Fragment>
            <form>
                <InnerBlocks template={TEMPLATE} />
            </form>
        </Fragment>
    );
};

export default Edit;