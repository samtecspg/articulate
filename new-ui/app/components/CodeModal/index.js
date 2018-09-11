import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Modal }  from '@material-ui/core';

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
        "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)"
    },
    jsonContent: {
      padding: '10px',
    }
};

function CodeModal(props) { // eslint-disable-line react/prefer-stateless-function

    const { classes } = props;
    return (
        <Grid>
            <Modal open={props.open} onClose={props.handleClose}>
              <Grid className={classes.modalContent} container>
                <Grid item xs={12}>
                    <pre className={classes.jsonContent}>
                        {JSON.stringify(props.doc, null, 2)}
                    </pre>
                </Grid>
              </Grid>
            </Modal>
        </Grid>
    );
}

CodeModal.propTypes = {
    classes: PropTypes.object.isRequired,
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    doc: PropTypes.object,
};

export default withStyles(styles)(CodeModal);
