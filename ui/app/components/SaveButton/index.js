import React from 'react';
import { FormattedMessage } from "react-intl";
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import checkIcon from "../../images/check-save-icon.svg";

const styles = {
    profileMainLoader: {
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: '5px'
    },
    loader: {
      position: 'relative',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      width: '20px',
      height: '20px'
    },
    circularLoader: {
      WebkitAnimation: 'rotate 2s linear infinite',
      animation: 'rotate 2s linear infinite',
      height: '100%',
      WebkitTransformOrigin: 'center center',
      msTransformOrigin: 'center center',
      transformOrigin: 'center center',
      width: '100%',
      position: 'absolute',
      top: -3,
      left: 0,
      margin: 'auto',
    },
    loaderPath: {
      strokeDasharray: '150,200',
      strokeDashoffset: -10,
      WebkitAnimation: 'dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite',
      animation: 'dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite',
      strokeLinecap: 'round'
    },
    '@global': {
      '@keyframes rotate': {
        '100%': {
          WebkitTransform: 'rotate(360deg)',
          transform: 'rotate(360deg)'
        },
        '30%':{
          opacity: 0.15,
        },
      },
      '@keyframes dash': {
        '0%': {
          strokeDasharray: '1,200',
          strokeDashoffset: 0
        },
        '50%': {
          strokeDasharray: '89,200',
          strokeDashoffset: -35
        },
        '100%': {
          strokeDasharray: '89,200',
          strokeDashoffset: -124
        }
      },
      '@keyframes color': {
        '0%': {
          stroke: '#4e4e4e'
        },
        '40%': {
          stroke: '#4e4e4e'
        },
        '60%': {
          stroke: '#4e4e4e'
        },
        '80%': {
          stroke: '#4e4e4e'
        }
      }
    },
};

export function SaveButton(props) {

  const { classes, label, loading, onClick, success, formError, touched } = props;
  return (
    <Button style={{color: formError ? '#f44336' : success && !touched ? '#00bd6f' : '' }} onClick={() => { onClick() }} key='btnJustSave' variant='contained'>
        { loading ?             
            <div className={classes.profileMainLoader}>
                <div className={classes.loader}>
                    <svg className={classes.circularLoader} viewBox="25 25 50 50" >
                        <circle className={classes.loaderPath} cx="50" cy="50" r="20" fill="none" stroke="#4e4e4e" strokeWidth="4" />
                    </svg>
                </div>
            </div>
            : 
            success && !formError && !touched ? 
                <img src={checkIcon}></img> :
                <FormattedMessage {...label} /> 
        }
    </Button>
  );
}

SaveButton.propTypes = {
    label: PropTypes.object,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    success: PropTypes.bool,
    formError: PropTypes.any,
    touched: PropTypes.bool,
};

export default withStyles(styles)(SaveButton);
