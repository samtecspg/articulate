import React, { Component } from 'react';
import update from 'immutability-helper';
import SortableSlotRow from './SortableSlotRow';
import messages from '../messages';

export default class SortableSlotsRows extends Component {
	constructor(props) {
		super(props);
		this.moveSlot = this.moveSlot.bind(this);
		/*this.state = {
			slotRows: props.slotRows,
		};*/
	}

	/*componentWillReceiveProps(nextProps, nextContext) {
		this.setState({
			slotRows: nextProps.slotRows
		});
	}*/

	moveSlot(dragIndex, hoverIndex) {
		const { slotRows } = this.props;
		const dragSlot = slotRows[dragIndex];

		this.props.onSortSlots(dragIndex, hoverIndex);
		/*this.setState(
			update(this.state, {
				slotRows: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragSlot]],
				},
			}),
		);*/
	}

	render() {
		const { slotRows, onAddSlot, enableSlotOrder } = this.props;

		return (
			<tbody>
				{slotRows.map((slotRow, i) => (
					<SortableSlotRow
						enableSlotOrder={enableSlotOrder}
						key={`slotRow_${i}`}
						index={i}
						id={`slotRow_${i}`}
						slotRow={slotRow}
						moveSlot={this.moveSlot}
					/>
				))}
				<tr>
					<td>
					<a
						onClick={onAddSlot}
						className={`btn-floating btn-small`}>
							{messages.newSlotButton.defaultMessage}
						</a>
					</td>
				</tr>
			</tbody>
		);
	}
}