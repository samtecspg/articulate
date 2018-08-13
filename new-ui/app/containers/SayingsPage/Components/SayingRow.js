import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, FormControl, MenuItem, Select } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

import HighlightedSaying from './HighlightedSaying';

import addActionIcon from '../../../images/add-action-icon.svg';

const styles = {
    userSays: {
        paddingRight: '5px',
        lineHeight: '1.5'
    },
    addActionIcon: {
        '&:hover': {
            filter: 'invert(1)',
        },
        cursor: 'pointer',
        verticalAlign: 'middle'
    },
    actionBackgroundContainer: {
        '&:hover': {
            backgroundColor: '#4e4e4e',
            color: '#fff',
        },
        margin: '0px 5px 0px 5px',
        fontSize: '12px',
        padding: '4px 8px 4px 10px',
        backgroundColor: '#e2e5e7',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '10px',
        marginTop: '2px'
    },
    deleteActionX: {
        '&:hover': {
            fontWeight: 'bold'
        },
        paddingLeft: '5px',
        fontWeight: 300,
        cursor: 'pointer'
    }
}

/* eslint-disable react/prefer-stateless-function */
class SayingRow extends React.Component {

    constructor(){
        super();
        this.onHighlight = this.onHighlight.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    state = {
        openActions: false,
        openKeywords: false,
        actionsDialogX: 16,
        actionsDialogY: 16,
        keywordsDialogX: 16,
        keywordsDialogY: 16,
    };

    handleClose = (selectName) => {
        if (selectName === 'actions'){
            this.setState({ openActions: false });
        }
        if (selectName === 'keywords'){
            this.setState({ openKeywords: false });
        }
    };

    handleOpen = (selectName, target) => {
        const newX = target.x + 20;
        const newY = window.innerHeight - target.y < 210 ? target.y - 180 : target.y - 80;
        if (selectName === 'actions'){
            this.setState({
                actionsDialogX: newX,
                actionsDialogY: newY,
                openActions: true
            });
        }
        if (selectName === 'keywords'){
            this.setState({
                keywordsDialogX: newX,
                keywordsDialogY: newY,
                openKeywords: true
            });
        }
    };

    handleChange(selectName, selectedValue){
        if (selectName === 'actions'){
            if (selectedValue === 'create'){
                this.props.onCreateAction(`/agent/${this.props.agentId}/action/create`);
            }
            else {
                this.props.onAddAction(this.props.saying, selectedValue)
            }
        }
        if (selectName === 'keywords'){
            if (selectedValue === 'create'){
                this.props.onCreateAction(`/agent/${this.props.agentId}/keyword/create`);
            }
            else {
                const keyword = selectedValue.split(',');
                const keywordId = parseInt(keyword[0]);
                const keywordName = keyword[1];
                this.props.onTagKeyword(this.props.saying, window.getSelection().toString(), keywordId, keywordName);
            }
        }
    }

    onHighlight(){
        const selection = window.getSelection();
        const text = selection.toString();
        if(text.trim()){
            const range = selection.getRangeAt(0);
            const clientRects = range.getClientRects();
            const target = {
                x: clientRects[0].x + clientRects[0].width - 30,
                y: clientRects[0].y,
            }
            this.handleOpen('keywords', target);
        }
    }

    render(){
        const { classes, saying, agentKeywords } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <span className={classes.userSays} onMouseUp={this.onHighlight}>
                        <HighlightedSaying
                            agentKeywords={agentKeywords}
                            keywords={saying.keywords}
                            text={saying.userSays}
                            keywordIndex={0}
                            lastStart={0}
                            onUntagKeyword={this.props.onUntagKeyword.bind(null, saying)}
                        />
                    </span>
                    {saying.actions.map((action, index) => {
                        return (
                            <div key={`action_${index}`}  className={classes.actionBackgroundContainer}>
                                <span>{action}</span>
                                <a onClick={() => { this.props.onDeleteAction(saying, action) }} className={classes.deleteActionX}>x</a>
                            </div>
                        )
                    })}
                    <img
                        onClick={(evt) => this.handleOpen('actions', evt.target)}
                        className={classes.addActionIcon} src={addActionIcon}
                    />
                    <FormControl className={classes.formControl}>
                        <Select
                            style={{
                                display:'none',
                            }}
                            open={this.state.openActions}
                            onClose={() => this.handleClose('actions')}
                            onOpen={() => this.handleOpen('actions')}
                            value={10}
                            onChange={(evt) => { evt.preventDefault(); this.handleChange('actions', evt.target.value)}}
                            MenuProps={{
                                style:{
                                    top: `${this.state.actionsDialogY}px`,
                                    left: `${this.state.actionsDialogX}px`
                                }
                            }}
                        >
                            <MenuItem value='create'><FormattedMessage className={classes.newItem} {...messages.newAction}/></MenuItem>
                            <MenuItem value='orderPizza'>orderPizza</MenuItem>
                            <MenuItem value='greeting'>greeting</MenuItem>
                        </Select>
                        <Select
                            style={{
                                display:'none',
                            }}
                            open={this.state.openKeywords}
                            onClose={() => this.handleClose('keywords')}
                            onOpen={() => this.handleOpen('keywords')}
                            value={10}
                            onChange={(evt) => { evt.preventDefault(); this.handleChange('keywords', evt.target.value)}}
                            MenuProps={{
                                style:{
                                    top: `${this.state.keywordsDialogY}px`,
                                    left: `${this.state.keywordsDialogX}px`
                                }
                            }}
                        >
                            <MenuItem value='create'><FormattedMessage className={classes.newItem} {...messages.newKeyword}/></MenuItem>
                            {agentKeywords.map((keyword, index) => {
                                return (
                                    <MenuItem key={`keyword_${index}`} value={`${keyword.id},${keyword.keywordName}`}>
                                        <span style={{color: keyword.uiColor}} >{keyword.keywordName}</span>
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        );
    }
}

SayingRow.propTypes = {
    classes: PropTypes.object,
    saying: PropTypes.object,
    agentId: PropTypes.number,
    agentKeywords: PropTypes.array,
    onDeleteAction: PropTypes.func,
    onUntagKeyword: PropTypes.func,
    onTagKeyword: PropTypes.func,
    onAddAction: PropTypes.func,
    onCreateAction: PropTypes.func,
};

export default withStyles(styles)(SayingRow);