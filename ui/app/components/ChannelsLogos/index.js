import React from 'react';
import PropTypes from 'prop-types';

import googleAssistant from '../../images/google-assistant.png';
import slack from '../../images/slack.png';
import facebook from '../../images/fb-messenger.png';
import twilio from '../../images/twilio.png';
import rocketchat from '../../images/rocketchat.png';

const logosDir = {
  'google-home': googleAssistant,
  slack,
  facebook,
  twilio,
  rocketchat,
};

// 4285F4

function ChannelsLogos(props) {
  const { logo, ...rest } = props;

  return <img {...rest} src={logosDir[logo]} />;
}

ChannelsLogos.propTypes = {
  logo: PropTypes.string.isRequired,
};

export default ChannelsLogos;
