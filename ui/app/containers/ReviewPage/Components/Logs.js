import {
    Grid,
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/text';
import 'brace/theme/terminal';
import refreshIcon from '../../../images/refresh-icon.svg';
import messages from '../messages';

import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

const styles = {
    formContainer: {
        backgroundColor: '#ffffff',
        borderTop: '1px solid #c5cbd8',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
    },
    formSubContainer: {
        padding: '0px 25px 40px 25px',
    },
    logHeaders: {
        paddingTop: '30px',
        paddingBottom: '15px'
    },
    logHeadersLabels: {
        fontSize: '12px',
        color: '#4e4e4e',
        fontFamily: 'Montserrat',
        opacity: '60%'
    },
    logHeadersLabelsUnderlined: {
        fontSize: '12px',
        color: '#4e4e4e',
        fontFamily: 'Montserrat',
        textDecoration: 'underline',
        cursor: 'pointer',
        opacity: '60%'
    },
    logHeadersRefreshIcon: {
        cursor: 'pointer',
        position: 'relative',
        marginLeft: '5px',
        top: '5px'
    }
}

export class Logs extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Grid className={classes.formContainer} container item xs={12}>
                    <Grid className={classes.formSubContainer} container item xs={12}>
                        <Grid className={classes.logHeaders} item xs={12} container direction={'row'}>
                            <Grid item xs={6}>
                                <span className={classes.logHeadersLabels}>
                                    <FormattedMessage {...messages.log} />
                                </span>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'end' }}>
                                <div>
                                    <a onClick={this.props.refreshLogs}>
                                        <span className={classes.logHeadersLabelsUnderlined}>
                                            <FormattedMessage {...messages.refreshLog} />
                                        </span>
                                        <img
                                            src={refreshIcon}
                                            className={classes.logHeadersRefreshIcon}
                                        />
                                    </a>
                                </div>
                            </Grid>
                            <Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <AceEditor
                                width="100%"
                                height="500px"
                                mode="text"
                                theme="terminal"
                                name="agentLanguages"
                                readOnly={false}
                                wrapEnabled={true}
                                fontSize={14}
                                readOnly={true}
                                value={this.props.logsText}
                                setOptions={{
                                    useWorker: false,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}
                                editorProps={{
                                    $blockScrolling: Infinity,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

Logs.propTypes = {
    refreshLogs: PropTypes.func,
    logsText: PropTypes.string
};

export default injectIntl(withStyles(styles)(Logs));