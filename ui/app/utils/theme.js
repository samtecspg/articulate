import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  'breakpoints': {
    'keys': [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ],
    'values': {
      'xs': 0,
      'sm': 600,
      'md': 960,
      'lg': 1280,
      'xl': 1920,
    },
  },
  'direction': 'ltr',
  'mixins': {
    'toolbar': {
      'minHeight': 56,
      '@media (min-width:0px) and (orientation: landscape)': {
        'minHeight': 48,
      },
      '@media (min-width:600px)': {
        'minHeight': 64,
      },
    },
  },
  'overrides': {
    'MuiButton': {
      'contained': {
        'color': '#4e4e4e',
        'backgroundColor': '#fff',
        'border': '1px solid',
        'borderBottom': '2px solid',
        'boxShadow': 'none',
        'fontWeight': 500,
        'height': '43px',
      },
      'containedPrimary': {
        'color': '#fff',
        'backgroundColor': '#00c582',
        'border': '1px solid #00c582',
        'borderBottom': '2px solid #00c582',
        'WebkitBoxShadow': '0px 1px 4px 1px rgba(0,197,130,0.3)',
        'MozBoxShadow': '0px 1px 4px 1px rgba(0,197,130,0.3)',
        'boxShadow': '0px 1px 4px 1px rgba(0,197,130,0.3)',
        'opacity': 0.9,
        '&:hover': {
          'backgroundColor': '#00c582',
          'opacity': 1,
          '@media (hover: none)': {
            'backgroundColor': '#00c582',
            'opacity': 1,
          },
        },
      },
      'outlined': {
        'padding': '0px',
        'minHeight': '15px',
        'minWidth': '15px',
      },
    },
    'MuiTab': {
      'root': {
        'fontWeight': 500,
        '@media (min-width: 960px)': {
          'minWidth': '75px',
        },
      },
      'wrapper': {
        'display': 'inline',
      },
      'label': {
        'position': 'relative',
        'bottom': '5px',
      },
      'labelIcon': {
        'minHeight': '48px',
        'padding-top': '0px',
      },
      'labelContainer': {
        'paddingRight': '0px',
        '@media (min-width: 960px)': {
          'paddingLeft': '0px',
          'paddingRight': '0px',
        },
      },
      'textColorInherit': {
        'opacity': 1,
      },
    },
    'MuiFormLabel': {
      'root': {
        'color': '#a2a7b1',
      },
    },
    'MuiInput': {
      'input': {
        'color': '#4e4e4e',
        'padding': '15px',
        'border': '1px solid #a2a7b1',
        'borderRadius': '5px',
      },
      'inputMultiline': {
        'padding': '15px',
        'border': '1px solid #a2a7b1',
        'borderRadius': '5px',
      },
      'formControl': {
        'marginTop': '25px !important',
      },
      'underline': {
        '&:before': {
          'display': 'none',
        },
        '&:after': {
          'display': 'none',
        },
      },
    },
    'MuiPopover': {
      'paper': {
        'backgroundColor': '#fafafa',
        'border': '1px solid #4e4e4e',
        'borderRadius': '5px',
      },
    },
    'MuiSelect': {
      'select': {
        'borderRadius': '5px',
        '&:focus': {
          'borderRadius': '5px',
        },
      },
    },
    'MuiSlider': {
      'root': {
        'padding': '20px 0px',
      },
      'thumb': {
        'borderRadius': '5px',
        'height': '20px',
        'widht': '10px',
      },
    },
    'MuiTable': {
      'root': {
        'border': '1px solid #a2a7b1',
        'borderRadius': '5px',
        'borderCollapse': 'unset',
      },
    },
    'MuiTableRow': {
      'root': {
        '&:hover': {
          'backgroundColor': '#f6f7f8',
          'borderRadius': '5px',
        },
      },
    },
    'MuiTableCell': {
      'root': {
        'borderBottom': 'none',
        'padding': '10px 10px 10px 15px',
      },
      'body': {
        'color': '#4e4e4e',
        'fontSize': '14px',
      },
    },
    'MuiExpansionPanel': {
      'root': {
        'backgroundColor': '#f6f7f8',
        'boxShadow': 'none !important',
        'borderTop': '1px solid #a2a7b1',
        'borderLeft': '1px solid #a2a7b1',
        'borderRight': '1px solid #a2a7b1',
        '&:before': {
          'height': 'none',
        },
        '&:first-child': {
          'borderTopLeftRadius': '5px',
          'borderTopRightRadius': '5px',
        },
        '&:last-child': {
          'borderBottomLeftRadius': '5px',
          'borderBottomRightRadius': '5px',
          'borderBottom': '1px solid #a2a7b1',
        },
        '&:hover': {
          'backgroundColor': '#e2e3e6',
        },
      },
      'expanded': {
        'margin': 'none',
      },
    },
    'MuiExpansionPanelSummary': {
      'root': {
        '&$expanded': {
          'borderBottom': '1px solid #a2a7b1',
        },
      },
    },
    'MuiExpansionPanelDetails': {
      'root': {
        'padding': '24px',
        'backgroundColor': '#fff',
        'borderRadius': '5px',
      },
    },
    'MuiMenuItem': {
      'root': {
        'color': '#4e4e4e',
      },
    },
    'MuiPrivateTabScrollButton': {
      'root': {
        'flex': '0 0 30px',
      },
    },
    'MuiChip': {
      'root': {
        'color': '#4e4e4e',
        'border': '1px solid #a2a7b1',
        'borderRadius': '5px',
        'backgroundColor': 'none',
      },
    },
  },
  'palette': {
    'common': {
      'black': '#000',
      'white': '#fff',
    },
    'type': 'light',
    'primary': {
      'light': '#00c582',
      'main': '#00c582',
      'dark': '#00c582',
      'contrastText': '#fff',
    },
    'secondary': {
      'light': '#4e4e4e',
      'main': '#4e4e4e',
      'dark': '#4e4e4e',
      'contrastText': '#fff',
    },
    'error': {
      'light': '#e57373',
      'main': '#f44336',
      'dark': '#d32f2f',
      'contrastText': '#fff',
    },
    'grey': {
      '50': '#fafafa',
      '100': '#f5f5f5',
      '200': '#eeeeee',
      '300': '#e0e0e0',
      '400': '#bdbdbd',
      '500': '#9e9e9e',
      '600': '#757575',
      '700': '#616161',
      '800': '#424242',
      '900': '#212121',
      'A100': '#d5d5d5',
      'A200': '#aaaaaa',
      'A400': '#303030',
      'A700': '#616161',
    },
    'contrastThreshold': 3,
    'tonalOffset': 0.2,
    'text': {
      'primary': 'rgba(0, 0, 0, 0.87)',
      'secondary': 'rgba(0, 0, 0, 0.54)',
      'disabled': 'rgba(0, 0, 0, 0.38)',
      'hint': 'rgba(0, 0, 0, 0.38)',
    },
    'divider': 'rgba(0, 0, 0, 0.12)',
    'background': {
      'paper': '#fff',
      'default': '#bbb',
    },
    'action': {
      'active': 'rgba(0, 0, 0, 0.54)',
      'hover': 'rgba(0, 0, 0, 0.08)',
      'hoverOpacity': 0.08,
      'selected': 'rgba(0, 0, 0, 0.14)',
      'disabled': 'rgba(0, 0, 0, 0.26)',
      'disabledBackground': 'rgba(0, 0, 0, 0.12)',
    },
  },
  'props': {},
  'shadows': [
    'none',
    '0px 1px 3px 0px rgba(0, 0, 0, 0.2),0px 1px 1px 0px rgba(0, 0, 0, 0.14),0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
    '0px 1px 5px 0px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    '0px 1px 8px 0px rgba(0, 0, 0, 0.2),0px 3px 4px 0px rgba(0, 0, 0, 0.14),0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
    '0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
    '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 6px 10px 0px rgba(0, 0, 0, 0.14),0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
    '0px 4px 5px -2px rgba(0, 0, 0, 0.2),0px 7px 10px 1px rgba(0, 0, 0, 0.14),0px 2px 16px 1px rgba(0, 0, 0, 0.12)',
    '0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
    '0px 5px 6px -3px rgba(0, 0, 0, 0.2),0px 9px 12px 1px rgba(0, 0, 0, 0.14),0px 3px 16px 2px rgba(0, 0, 0, 0.12)',
    '0px 6px 6px -3px rgba(0, 0, 0, 0.2),0px 10px 14px 1px rgba(0, 0, 0, 0.14),0px 4px 18px 3px rgba(0, 0, 0, 0.12)',
    '0px 6px 7px -4px rgba(0, 0, 0, 0.2),0px 11px 15px 1px rgba(0, 0, 0, 0.14),0px 4px 20px 3px rgba(0, 0, 0, 0.12)',
    '0px 7px 8px -4px rgba(0, 0, 0, 0.2),0px 12px 17px 2px rgba(0, 0, 0, 0.14),0px 5px 22px 4px rgba(0, 0, 0, 0.12)',
    '0px 7px 8px -4px rgba(0, 0, 0, 0.2),0px 13px 19px 2px rgba(0, 0, 0, 0.14),0px 5px 24px 4px rgba(0, 0, 0, 0.12)',
    '0px 7px 9px -4px rgba(0, 0, 0, 0.2),0px 14px 21px 2px rgba(0, 0, 0, 0.14),0px 5px 26px 4px rgba(0, 0, 0, 0.12)',
    '0px 8px 9px -5px rgba(0, 0, 0, 0.2),0px 15px 22px 2px rgba(0, 0, 0, 0.14),0px 6px 28px 5px rgba(0, 0, 0, 0.12)',
    '0px 8px 10px -5px rgba(0, 0, 0, 0.2),0px 16px 24px 2px rgba(0, 0, 0, 0.14),0px 6px 30px 5px rgba(0, 0, 0, 0.12)',
    '0px 8px 11px -5px rgba(0, 0, 0, 0.2),0px 17px 26px 2px rgba(0, 0, 0, 0.14),0px 6px 32px 5px rgba(0, 0, 0, 0.12)',
    '0px 9px 11px -5px rgba(0, 0, 0, 0.2),0px 18px 28px 2px rgba(0, 0, 0, 0.14),0px 7px 34px 6px rgba(0, 0, 0, 0.12)',
    '0px 9px 12px -6px rgba(0, 0, 0, 0.2),0px 19px 29px 2px rgba(0, 0, 0, 0.14),0px 7px 36px 6px rgba(0, 0, 0, 0.12)',
    '0px 10px 13px -6px rgba(0, 0, 0, 0.2),0px 20px 31px 3px rgba(0, 0, 0, 0.14),0px 8px 38px 7px rgba(0, 0, 0, 0.12)',
    '0px 10px 13px -6px rgba(0, 0, 0, 0.2),0px 21px 33px 3px rgba(0, 0, 0, 0.14),0px 8px 40px 7px rgba(0, 0, 0, 0.12)',
    '0px 10px 14px -6px rgba(0, 0, 0, 0.2),0px 22px 35px 3px rgba(0, 0, 0, 0.14),0px 8px 42px 7px rgba(0, 0, 0, 0.12)',
    '0px 11px 14px -7px rgba(0, 0, 0, 0.2),0px 23px 36px 3px rgba(0, 0, 0, 0.14),0px 9px 44px 8px rgba(0, 0, 0, 0.12)',
    '0px 11px 15px -7px rgba(0, 0, 0, 0.2),0px 24px 38px 3px rgba(0, 0, 0, 0.14),0px 9px 46px 8px rgba(0, 0, 0, 0.12)',
  ],
  'typography': {
    'useNextVariants': true,
    'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
    'fontSize': 14,
    'fontWeightLight': 300,
    'fontWeightRegular': 400,
    'fontWeightMedium': 500,
    'h1': {
      'fontSize': '22px',
      'fontWeight': 'bold',
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'letterSpacing': '-.02em',
      'lineHeight': '1.14286em',
      'marginLeft': '-.04em',
      'color': '#a4a5a5',
      'display': 'inline',
    },
    'h2': {
      'fontSize': '18px',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'letterSpacing': '-.02em',
      'color': '#4e4e4e',
    },
    'h3': {
      'fontSize': '2.8125rem',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'lineHeight': '1.06667em',
      'marginLeft': '-.02em',
      'color': 'rgba(0, 0, 0, 0.54)',
    },
    'h4': {
      'fontSize': '2.125rem',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'lineHeight': '1.20588em',
      'color': 'rgba(0, 0, 0, 0.54)',
    },
    'h5': {
      'fontSize': '22px',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'lineHeight': '1.35417em',
      'color': '#4e4e4e',
    },
    'h6': {
      'fontSize': '1.3125rem',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'lineHeight': '1.16667em',
      'color': 'rgba(0, 0, 0, 0.87)',
    },
    'subtitle1': {
      'fontSize': '1rem',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'lineHeight': '1.5em',
      'color': 'rgba(0, 0, 0, 0.87)',
    },
    'body1': {
      'fontSize': '0.875rem',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'lineHeight': '1.71429em',
      'color': 'rgba(0, 0, 0, 0.87)',
    },
    'body2': {
      'fontSize': '0.875rem',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'lineHeight': '1.46429em',
      'color': 'rgba(0, 0, 0, 0.87)',
    },
    'caption': {
      'fontSize': '0.75rem',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'lineHeight': '1.375em',
      'color': 'rgba(0, 0, 0, 0.54)',
    },
    'button': {
      'fontSize': '14px',
      'textTransform': 'none',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
    },
    'actionButton': {
      'fontSize': '14px',
      'textTransform': 'none',
      'fontWeight': 400,
      'fontFamily': '"Montserrat", "Helvetica", "Arial", sans-serif',
      'color': '#00BD6F',
    },
  },
  'transitions': {
    'easing': {
      'easeInOut': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'easeOut': 'cubic-bezier(0.0, 0, 0.2, 1)',
      'easeIn': 'cubic-bezier(0.4, 0, 1, 1)',
      'sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    'duration': {
      'shortest': 150,
      'shorter': 200,
      'short': 250,
      'standard': 300,
      'complex': 375,
      'enteringScreen': 225,
      'leavingScreen': 195,
    },
  },
  'spacing': {
    'unit': 8,
  },
  'zIndex': {
    'mobileStepper': 1000,
    'appBar': 1100,
    'drawer': 1200,
    'modal': 1300,
    'snackbar': 1400,
    'tooltip': 1500,
  },
});
