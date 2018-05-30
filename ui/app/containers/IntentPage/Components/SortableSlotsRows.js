import React, { Component } from 'react';
import update from 'immutability-helper';
import SortableSlotRow from './SortableSlotRow';

export default class SortableSlotsRows extends Component {
	constructor(props) {
		super(props);
		this.moveSlot = this.moveSlot.bind(this);
		this.state = {
			slotRows: props.slotRows,
        };
	}

	moveSlot(dragIndex, hoverIndex) {
		const { slotRows } = this.state;
		const dragSlot = slotRows[dragIndex];

		this.props.onSortSlots(dragIndex, hoverIndex);
		this.setState(
			update(this.state, {
				slotRows: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragSlot]],
				},
			}),
		);
	}

	render() {
		const { slotRows } = this.state;

		return (
			<tbody>
				{slotRows.map((slotRow, i) => (
					<SortableSlotRow
						key={`slotRow_${i}`}
						index={i}
						id={`slotRow_${i}`}
						slotRow={slotRow}
						moveSlot={this.moveSlot}
					/>
				))}
			</tbody>
		);
	}
}