import React from 'react';
import propTypes from 'prop-types';

const ConfirmMailSent = ({ imgSrc, msg, p1, p2 }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img src={imgSrc} alt="Confirmation" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-3xl font-extrabold text-gray-900">{msg}</h1>
        <p className="mt-2 text-sm text-gray-600">{p1}</p>
        <p className="mt-1 text-sm text-gray-600">{p2}</p>
      </div>
    </div>
  );
};

ConfirmMailSent.propTypes = {
  imgSrc: propTypes.string.isRequired,
  msg: propTypes.string.isRequired,
  p1: propTypes.string.isRequired,
  p2: propTypes.string.isRequired,
};

export default ConfirmMailSent;
