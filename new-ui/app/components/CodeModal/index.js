import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Modal, Tabs, Tab }  from '@material-ui/core';

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
    height: '48px',
    paddingLeft: '15px',
  },
  tab: {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  codeContainer: {
    position: 'absolute',
    top: '7%',
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
    const { classes } = this.props;
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
              <Tab className={classes.tab} label="Rasa Parse Result" />
              <Tab className={classes.tab} label="Context" />
              <Tab className={classes.tab} label="Current Frame" />
              {this.props.conversationStateObject.webhookResponses ? <Tab label="Webhook Responses" /> : null}
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
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  conversationStateObject: PropTypes.object,
};

export default withStyles(styles)(CodeModal);
