import React, { Component } from 'react';
import update from 'immutability-helper';
import SortableSlotRow from './SortableSlotRow';

export default class SortableSlotsRows extends Component {
	constructor(props) {
		super(props)
		this.moveCard = this.moveCard.bind(this)
		this.state = {
			slotRows: props.slotRows,
        }
	}

	moveCard(dragIndex, hoverIndex) {
		const { slotRows } = this.state
		const dragCard = slotRows[dragIndex]

		this.setState(
			update(this.state, {
				slotRows: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
				},
			}),
		)
	}

	render() {
		const { slotRows } = this.state

		return (
			<tbody>
				{slotRows.map((slotRow, i) => (
					<SortableSlotRow
						key={`slotRow_${i}`}
						index={i}
						id={`slotRow_${i}`}
						slotRow={slotRow}
						moveCard={this.moveCard}
					/>
				))}
			</tbody>
		)
	}
}