import React from 'react';
import Linkify from 'react-linkify'

import {
  CardPanel,
  Col,
  Row,
} from 'react-materialize';

export function AgentMessage(props) {

  return (
    <Row>
      <Col s={6} m={10}>
        <div className="bot-bubble left clearfix">
          <div className="bubble-container">
            <p><Linkify properties={{target: '_blank', style: {color: 'blue'}}}><span>{props.text}</span></Linkify></p>
          </div>
        </div>
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
