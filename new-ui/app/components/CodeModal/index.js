import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Modal, Tabs, Tab }  from '@material-ui/core';

import messages from './messages';

function TabContainer(props) {
  const { classes, doc } = props;
  return (
      <Grid className={classes.codeContainer} item xs={12}>
        <pre className={classes.jsonContent}>
          {JSON.stringify(doc, null, 2)}
        </pre>
      </Grid>
  );
}

TabContainer.propTypes = {
  classes: PropTypes.object,
  doc: PropTypes.object
};


const styles = {
  modalContent: {
    top: "50%",
    left: "50%",
    overflowY: 'scroll',
    transform: `translate(-50%, -50%)`,
    position: "absolute",
    width: window.window.innerWidth < 675 ? 350 : 750,
    height: window.window.innerWidth < 675 ? 215 : 450,
    backgroundColor: "#fff",
    boxShadow:
        "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
  },
  jsonContent: {
    padding: '10px',
  },
  tabsRoot: {
    height: '53px',
    paddingTop: '5px',
    paddingLeft: '15px',
  },
  tab: {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  codeContainer: {
    position: 'absolute',
    top: '8%',
    left: '15px',
  }
};

class CodeModal extends React.Component { // eslint-disable-line react/prefer-stateless-function

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render(){
    const { classes, intl } = this.props;
    const { value } = this.state;
    return (
      <Grid>
        <Modal open={this.props.open} onClose={this.props.handleClose}>
          <Grid className={classes.modalContent} container>
            <Tabs 
              fullWidth={true}
              className={classes.tabsRoot}
              value={value}
              indicatorColor='primary'
              textColor='secondary'
              scrollable
              scrollButtons="off"
              onChange={this.handleChange}
            >
              <Tab className={classes.tab} label={intl.formatMessage(messages.rasaParseResults)} />
              <Tab className={classes.tab} label={intl.formatMessage(messages.context)}/>
              <Tab className={classes.tab} label={intl.formatMessage(messages.currentFrame)} />
              {this.props.conversationStateObject.webhookResponses ? <Tab label={intl.formatMessage(messages.webhookResponses)} /> : null}
            </Tabs>
            {value === 0 && <TabContainer classes={classes} doc={this.props.conversationStateObject.parse}></TabContainer>}
            {value === 1 && <TabContainer classes={classes} doc={this.props.conversationStateObject.context}></TabContainer>}
            {value === 2 && <TabContainer classes={classes} doc={this.props.conversationStateObject.currentFrame}></TabContainer>}
            {value === 3 && (this.props.conversationStateObject.webhookResponses ? <TabContainer classes={classes} doc={this.props.conversationStateObject.webhookResponses}></TabContainer> : null)}
          </Grid>
        </Modal>
      </Grid>
    );
  }
}

CodeModal.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  conversationStateObject: PropTypes.object,
};

export default injectIntl(withStyles(styles)(CodeModal));
