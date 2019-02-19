import React from "react";
import { FormattedMessage } from "react-intl";

import PropTypes from "prop-types";
import { Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SortableSlotTab from './SortableSlotTab';

import messages from "../messages";
import trashIcon from '../../../images/trash-icon.svg';

const styles = {
  actionTabs: {
    paddingLeft: '0px',
  },
  slotTabLabel: {
    padding: '0px 10px',
  },
  dot: {
    marginRight: 5,
    height: 10,
    width: 10,
    borderRadius: '50%',
    display: 'inline-block',
  },
  sortSlots: {
    height: 20,
    width: 20,
  },
  deleteHighlight: {
	cursor: 'pointer',
	fontSize: '12px',
	position: 'relative',
	top: '-1px',
	right: '8px',
	webkitTouchCallout: 'none',
	webkitUserSelect: 'none',
	khtmlUserSelect: 'none',
	mozUserSelect: 'none',
	msUserSelect: 'none',
	userSelect: 'none',
  },
  notificationDot: {
    backgroundColor: '#Cb2121',
    height: '12px',
    width: '12px',
    borderRadius: '50%',
    position: 'absolute',
    top: '10px',
    left: '5px'
  },
  numOfErrorsLabel: {
    fontSize: '10px',
    color: 'white',
    position: 'relative',
    bottom: '4.5px',
    left: '0.5px'
  }
};

class SortableSlotsTabs extends React.Component {

	constructor(props) {
		super(props);
		this.moveSlot = this.moveSlot.bind(this);
	}
	
	state = {
		slotHovered: null,
	}
    
	moveSlot(dragIndex, hoverIndex) {
		this.props.handleTabChange(hoverIndex);
		this.props.onSortSlots(dragIndex, hoverIndex);
	}

	render() {
		const { action, classes } = this.props;

		return (
			<Tabs
				className={classes.actionTabs}
				value={this.props.selectedTab}
				indicatorColor="primary"
				textColor="secondary"
				scrollable
				onChange={(evt, value) => {
					evt.preventDefault();
					if (value === action.slots.length) {
						this.props.onAddNewSlot();
						this.props.handleTabChange(value);
					}
					else {
						if (value < action.slots.length) {
							this.props.handleTabChange(value);
						}
					}
				}}
			>
				{action.slots.map((slot, index) => (
					<SortableSlotTab
						index={index}
						key={`slotRow_${index}`}
						id={`slotRow_${index}`}
						moveSlot={this.moveSlot}
						slotRow={(
							<div
								onMouseLeave={() => { this.setState({ slotHovered: null })} }
								onMouseOver={() => {this.setState({ slotHovered: index })} }
								onClick={() => { this.props.handleTabChange(index);} }
							>
								<Tab
									key={`slot_${index}`}
									label={
										<span className={classes.slotTabLabel}>
											<span style={{backgroundColor: slot.uiColor}} className={classes.dot}>
											</span><span>{slot.slotName}</span>
										</span>
									}	
									icon={
										this.props.errorState.slotsTabs.indexOf(index) > -1 ? 
											<div id='notificationDot' className={classes.notificationDot}>
												<span className={classes.numOfErrorsLabel}>
													{(this.props.errorState.slotsTabs.filter((element) => { return element === index })).length}
												</span>
											</div> : 
											null
									}
								/>
								<img style={{display: this.state.slotHovered === index ? 'inline' : 'none' }} onClick={() => { this.props.onDeleteSlot(index) }} className={classes.deleteHighlight} src={trashIcon} />
							</div>
						)}
					/>
				))}
				<Tab
					key="newSlot"
					label={
						<span className={classes.slotTabLabel}>
							<FormattedMessage {...messages.newSlotTab} />
						</span>
					}
				/>
			</Tabs>
		);
	}
}

SortableSlotsTabs.propTypes = {
	classes: PropTypes.object.isRequired,
	action: PropTypes.object,
	onAddNewSlot: PropTypes.func,
	onSortSlots: PropTypes.func,
	handleTabChange: PropTypes.func,
	selectedTab: PropTypes.number,
	onDeleteSlot: PropTypes.func,
	errorState: PropTypes.object
};
  
export default withStyles(styles)(SortableSlotsTabs);