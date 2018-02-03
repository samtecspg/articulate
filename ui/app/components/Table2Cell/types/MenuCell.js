/**
 *
 * StringCell
 *
 */
import React from 'react';
import { Icon } from 'react-materialize';
import Dropdown from '../../Dropdown';

class MenuCell extends React.Component {// eslint-disable-line react/prefer-stateless-function

  render() {
    const { menu, item } = this.props;
    return (
      <Dropdown
        element={<Icon>more_vert</Icon>}
        menu={menu}
        item={item}
        belowOrigin={false}
      />
    );
  }
}

MenuCell.propTypes = {
  menu: React.PropTypes.array.isRequired,
  item: React.PropTypes.object,
};

export default MenuCell;
