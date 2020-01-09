import React from 'react';
import PropTypes from 'prop-types';

import audio from '../../images/multimedia-icon.svg';
import buttons from '../../images/button-icon.svg';
import cardsCarousel from '../../images/card-carousel-icon.svg';
import chart from '../../images/chart-icon.svg';
import collapsible from '../../images/collapsible-icon.svg';
import image from '../../images/image-icon.svg';
import location from '../../images/location-icon.svg';
import quickResponses from '../../images/quick-response-icon.svg';
import video from '../../images/multimedia-icon.svg';

const logosDir = {
  audio,
  buttons,
  cardsCarousel,
  chart,
  collapsible,
  image,
  location,
  quickResponses,
  video
};

function RichResponsesLogos(props) {
  const { logo, ...rest } = props;

  return <img {...rest} src={logosDir[logo]} />;
}

RichResponsesLogos.propTypes = {
  logo: PropTypes.string.isRequired,
};

export default RichResponsesLogos;
