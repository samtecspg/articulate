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
    }
}

export class Logs extends React.Component {

    constructor(props) {
        super(props);
        this.getLogsContent = this.getLogsContent.bind(this);
    }

    getLogsContent() {
        var result = '';
        this.props.logs.map((log) => {
            result = result + log._source.container.name + ' :' + log._source.message + '\n';
        });
        return result;
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Grid className={classes.formContainer} container item xs={12}>
                    <Grid className={classes.formSubContainer} container item xs={12}>
                        <Grid className={classes.logHeaders} item xs={12} container direction={'row'}>
                            <Grid item xs={6}>
                                <span>
                                    logs:
                            </span>
                            </Grid>
                            <Grid item xs={6}>
                                <a onClick={this.props.refreshLogs}>
                                    <span>refresh logs</span>
                                </a>
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
                                //onChange={value =>
                                //    this.onChangeEditorValue('agentLanguages', value)
                                //}
                                fontSize={14}
                                readOnly={true}
                                value={this.props.logsText}
                                /*value={
                                    this.props.logs[0]._source.container.name + ' :' +
                                    this.props.logs[0]._source.message +
                                    '\n' +
                                    this.props.logs[1]._source.container.name + ' :' +
                                    this.props.logs[1]._source.message}
                                    */
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
    //logs: PropTypes.array,
    logsText: PropTypes.string,
    loading: PropTypes.bool
};

export default injectIntl(withStyles(styles)(Logs));