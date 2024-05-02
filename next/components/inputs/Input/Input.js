import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// Styles
import inputStyle from 'components/forms/stylesFloatingLabel';

// Components
import PriceIcon from 'components/commonBlocks/Quote/Renderer/PriceIcon/PriceIcon';
import customInputStyles from 'components/forms/customStylesFloatingLabel';
import FloatingLabel from 'components/inputs/FloatingLabel';

const Style = styled.div`
    ${props => props.customStyles ? 'max-height: 40px; padding-top: 0; border-radius: 0px;' :'max-height: 54px'};
    .floating-input{
        display: flex;
        align-items: center;
        padding-right: 8px;
    }

    &.input-box.floating-input-error {
        overflow: initial;
    }
    .floating-input label input {
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
        &::placeholder {
            visibility: visible;
            color: transparent!important;
        }
        @media only screen and (max-width: 680px) {
            &::placeholder {
                visibility: visible;
                color: #b3bac5!important;
            }
        }
        outline: none;
        max-height: 55px;
        -webkit-box-shadow: ${ props => !props.disabled ? 'inset 1 0 0 50px white !important' : 'none'};
        &:-webkit-autofill{
          -webkit-text-fill-color: ${ props => !props.disabled ? 'rgb(80, 95, 121);' : 'initial'};
        }
    }
    .password-font label input {
        font-family: 'password', sans-serif!important;
    }
`;

const getClassString = (classRules) => {
    const result = [];
    classRules.map(item=>{
        if (item.rule) {
            result.push(item.classes);
        }
    });
    return result.join(' ');
};

const Input = ({
    initialValidation = false,
    input,
    meta,
    multiline,
    disabled,
    classes,
    customInputStyle,
    customStyles,
    styledBorder,
    secured,
    mainClass,
    withoutScrollBar,
    onChange,
    ...rest
}) => {
    const isInvalid = meta?.error && (meta.touched && input?.value || meta.submitFailed || initialValidation);
    const isValid = meta && styledBorder && !meta.error && meta.touched;
    const isFilled = input?.value && input.value !== 0;
    const customStylesData = customStyles || inputStyle;

    const styleClasses = [
        {
            rule:disabled,
            classes:'floating-input-disabled'
        },{
            rule:isInvalid,
            classes:'floating-input-error input-box-error'
        },{
            rule:isValid,
            classes:'input-box-valid'
        },{
            rule:isFilled,
            classes:'input-box-filled'
        },{
            rule:mainClass,
            classes:mainClass
        }
    ];

    const wrapperClasses = [
        {
            rule:classes,
            classes:classes
        },{
            rule:secured,
            classes:'password-font'
        }
    ];

    const handleChange = (event) => {
        if (input.onChange) {
            input.onChange(event);
        }
        onChange(event);
    };

    return (
        <Style className={`input-box ${getClassString(styleClasses)}`} disabled={disabled} customStyles={customStyles}>
            <div className={`floating-input ${getClassString(wrapperClasses)}`}>
                <FloatingLabel
                    {...input}
                    {...rest}
                    className={withoutScrollBar && 'hidden-scrollbar'}
                    disabled={disabled}
                    element={multiline?'textarea':'input'}
                    styles={customInputStyle ? customInputStyles : customStylesData}
                    onChange={handleChange}
                />
                {rest.withIcon && <PriceIcon />}
            </div>
            {isInvalid && ( <div className="validation">{meta.error}</div> )}
        </Style>
    );
};

Input.propTypes = {
    initialValidation: PropTypes.bool,
    input: PropTypes.object,
    meta: PropTypes.object,
    multiline: PropTypes.bool,
    withoutScrollBar: PropTypes.bool,
    disabled: PropTypes.bool,
    classes: PropTypes.string,
    customInputStyle: PropTypes.bool,
    customStyles: PropTypes.any,
    styledBorder: PropTypes.bool,
    secured:PropTypes.bool,
    mainClass:PropTypes.string,
    onChange: PropTypes.func,
};

Input.defaultProps = {
    input: {},
    meta: {},
    customStyles: null,
    multiline: false,
    disabled: false,
    classes: '',
    customInputStyle: false,
    styledBorder: false,
    onChange: function onChange() { },
};

export default Input;
