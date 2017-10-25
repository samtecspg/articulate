import React, { PropTypes } from 'react';

import { Row, Col, CardPanel } from 'react-materialize';

export function AgentMessage(props) {
  
  return (
    <Row>
      <Col s={6} m={10}>
        <CardPanel className="transparent teal-text">
          <span>{props.text}</span>
        </CardPanel>
      </Col>
      <Col s={6} m={2}>
      </Col>
    </Row>
  );
}

AgentMessage.propTypes = {
  text: React.PropTypes.string.isRequired,
};

export default AgentMessage;
