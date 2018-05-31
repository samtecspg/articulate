import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
}

const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.moveSlot(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex
	},
}

DropTarget('card', cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))


function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	};
};

function collectDropTarget(connect, monitor) {
	return {
	  connectDropTarget: connect.dropTarget()
	};
};

class SortableSlotRow extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		id: PropTypes.any.isRequired,
		slotRow: PropTypes.object.isRequired,
		moveSlot: PropTypes.func.isRequired,
	}

	render() {
		const {
			slotRow,
			isDragging,
			connectDragSource,
			connectDropTarget,
			index
		} = this.props
		const opacity = isDragging ? 0 : 1

		let originalSlotsRows = [...slotRow.props.children];
		const drag_hanlder = originalSlotsRows[6];
		originalSlotsRows.splice(-1,1);
		return (
			<tr style={{ width: '100%' }} key={index}>
				{originalSlotsRows}
				{connectDragSource(
					connectDropTarget(
						drag_hanlder
					)
				)}
			</tr>
		)
	}
}

export default DropTarget('card', cardTarget, collectDropTarget)(DragSource('card', cardSource, collect)(SortableSlotRow));