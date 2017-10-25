import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../Tooltip';
import { Icon } from 'react-materialize';

function TableHeader(props) { // eslint-disable-line react/prefer-stateless-function

    return (
        <thead>
            <tr style={{width: '100%'}}>
                {
                    props.columns.map( (column, index) => {
                        return (
                            <th key={'th_' + index} style={{width: column.width, display: 'inline-block'}}>
                                {column.label}
                                <Tooltip
                                tooltip={column.tooltip}
                                delay={50}
                                position="top"
                                >
                                <a>
                                    <Icon>help_outline</Icon>
                                </a>
                                </Tooltip>
                            </th>
                        );
                    })
                }
            </tr>
        </thead>
    );
}

TableHeader.propTypes = {
    columns: PropTypes.array,
};

export default TableHeader;