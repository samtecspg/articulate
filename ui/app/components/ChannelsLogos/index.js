import React from 'react';
import PropTypes from 'prop-types';

import googleAssistant from '../../images/google-assistant.png';
import chatWidget from '../../images/chat-widget.svg';
import slack from '../../images/slack.png';
import facebook from '../../images/fb-messenger.png';
import twilio from '../../images/twilio.png';
import rocketchat from '../../images/rocketchat.png';
import webDemo from '../../images/web-demo.png';
import matterMost from '../../images/mattermost.png';

const logosDir = {
  'chat-widget': chatWidget,
  'google-home': googleAssistant,
  slack,
  facebook,
  twilio,
  rocketchat,
  'web-demo': webDemo,
  'mattermost': matterMost
};

function ChannelsLogos(props) {
  const { logo, ...rest } = props;

  return <img {...rest} src={logosDir[logo]} />;
}

ChannelsLogos.propTypes = {
  logo: PropTypes.string.isRequired,
};

export default ChannelsLogos;
