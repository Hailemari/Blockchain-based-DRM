import React, { useState } from "react";
import PropTypes from "prop-types";

const FormInput = (props) => {
  const { id, label, type, name, placeholder, onChange, errormessage, ...inputProps } = props;
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={handleFocus}
        focused={focused.toString()}
        {...inputProps}
        className="mt-1 p-3 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
      />
      {errormessage && (
        <span className="text-red-500 text-sm">{errormessage}</span>
      )}
    </div>
  );
};

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errormessage: PropTypes.string,
};

export default FormInput;
