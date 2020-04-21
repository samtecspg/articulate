import {
  TableCell,
  Typography,
  Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import es from 'javascript-time-ago/locale/es';
import pt from 'javascript-time-ago/locale/pt';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import React, { Fragment } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import messages from '../messages';

TimeAgo.addLocale(en);
TimeAgo.addLocale(es);
TimeAgo.addLocale(pt);

const styles = {
  button: {
    border: '1px solid',
    fontSize: '12px',
    padding: '1px 5px',
    minHeight: '0',
    minWidth: '0',
  }
};

/* eslint-disable react/prefer-stateless-function */
class TrainingsRow extends React.Component {

  render() {
    const {
      classes,
      trainingTest,
      intl,
    } = this.props;

    return (
      <Fragment>
        <TableCell>
          <Typography>
            {new Date(trainingTest.timeStamp).toString()}
          </Typography>
        </TableCell>
        <TableCell
          style={{ textAlign: 'right' }}
        >
          <Button
            className={classes.button}
            onClick={
              async () => {
                await this.props.onCloseTestTrainNotification();
                await this.props.onLoadAgentTrainTest(this.props.trainingTestIndex);
                if (new Date(this.props.agent.lastTraining) > new Date(trainingTest.timeStamp)
                  || this.props.agent.status !== 'Ready'
                ) {
                  this.props.onTrainingTestSummaryModalChange(true);
                } else {
                  await this.props.onGoToUrl(`/agent/${this.props.agent.id}/trainingTestSummary`);
                }
              }
            }
          >
            {intl.formatMessage(messages.testSummary)}
          </Button>
        </TableCell>
      </Fragment >
    );
  }
}

TrainingsRow.propTypes = {
  intl: intlShape,
  agent: PropTypes.object,
  classes: PropTypes.object,
  locale: PropTypes.string,
  onCloseTestTrainNotification: PropTypes.func,
  trainingTest: PropTypes.object,
  onLoadAgentTrainTest: PropTypes.func,
  trainingTestIndex: PropTypes.number,
  onGoToUrl: PropTypes.func,
  onCloseTestTrainNotification: PropTypes.func
};

export default injectIntl(withStyles(styles)(TrainingsRow));
