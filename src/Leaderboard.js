import React from 'react';
import PropTypes from 'prop-types';

function Leading(props) {
  const { name } = props;
  return (
    <li>
      {' '}
      {name[0]}
      {' '}
      |
      {name[1]}
      {' '}
    </li>
  );
}
Leading.propTypes = {
  name: PropTypes.any.isRequired,

};

export default Leading;
