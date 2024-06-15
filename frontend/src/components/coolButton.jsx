import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CoolButton = ({ onClick }) => {
  return (
    <Link to='/login'>
      <button className="cool-button" onClick={onClick}>
        Get Started Now
      </button>
    </Link>
  );
};

CoolButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CoolButton;
