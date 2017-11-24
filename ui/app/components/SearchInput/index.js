/**
 *
 * SearchInput
 *
 */

import React from 'react';

// import styled from 'styled-components';

function SearchInput(props) {

  return (
    <div className={'search-input'}>
      <input {...props} placeholder={`Search ${props.name}`} />
    </div>
  );
}

SearchInput.propTypes = {
  name: React.PropTypes.string,
};

export default SearchInput;
