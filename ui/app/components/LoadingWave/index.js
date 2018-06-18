import React from 'react';

import {
  CardPanel,
  Col,
  Row,
} from 'react-materialize';

export function LoadingWave(props) {

  return (
    <Row>
      <Col s={6} m={10}>
        <div id="wave" className="left">
          <span className="dot"></span>&nbsp;
          <span className="dot"></span>&nbsp;
          <span className="dot"></span>
				</div>
      </Col>
      <Col s={6} m={2}>
      </Col>
    </Row>
  );
}

LoadingWave.propTypes = {};

export default LoadingWave;
