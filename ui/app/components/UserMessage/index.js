import React from 'react';

import {
  CardPanel,
  Col,
  Row,
} from 'react-materialize';

export function UserMessage(props) {

  return (
    <Row>
      <Col s={6} m={2}>
      </Col>
      <Col s={6} m={10}>
        <CardPanel className="teal accent-4 white-text">
          <span>{props.text}</span>
        </CardPanel>
      </Col>
    </Row>
  );
}

UserMessage.propTypes = {
  text: React.PropTypes.string.isRequired,
};

export default UserMessage;
