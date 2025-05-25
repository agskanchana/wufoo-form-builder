import { useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

const Save = ( { attributes } ) => {
    const blockProps = useBlockProps.save();

    return (
        <form { ...blockProps }>
            <Fragment>
                { attributes.children }
            </Fragment>
        </form>
    );
};

export default Save;