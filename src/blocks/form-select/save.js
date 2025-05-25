const { createElement } = wp.element;

const Save = ( { attributes } ) => {
    const { options } = attributes;

    return (
        <select>
            { options.map( ( option, index ) => (
                <option key={ index } value={ option.value }>
                    { option.label }
                </option>
            ) ) }
        </select>
    );
};

export default Save;