import React from 'react'

import FramesIcon from '@/icons/framesIcon'
import DeleteIcon from '@/icons/deleteIcon'

import { PopupButtonGroup, PopupButton } from '@/components/shared/popupButton'
import Button from '@/components/shared/button'
import { useMutation } from '@/components/api'
import {
	removeBox,
	swapBoxPositions,
	getBoxAtPosition,
	getBox,
} from '@/components/models/boxes'
import {
	countBoxFrames,
	frameTypes,
	addFrame,
} from '@/components/models/frames'

export default function FrameButtons({
	frameId,
	showDownButton,
	box,
	onError,
}) {
	let [removeBoxMutation] = useMutation(`mutation deactivateBox($id: ID!) {
		deactivateBox(id: $id)
	}
	`)

	let [addFrameMutation] =
		useMutation(`mutation addFrame($boxId: ID!, $type: String!, $position: Int!) {
		addFrame(boxId: $boxId, type: $type, position: $position){
			id
			leftSide{
				id
			}
			rightSide{
				id
			}
		}
	}
	`)

	let [removeFrameMutation] = useMutation(`mutation deactivateFrame($id: ID!) {
		deactivateFrame(id: $id)
	}
	`)

	let [swapBoxPositionsMutation] = useMutation(
		`mutation swapBoxPositions($id: ID!, $id2: ID!) {swapBoxPositions(id: $id, id2: $id2)}`
	)

	async function onFrameAdd(boxId, type) {
		let position = (await countBoxFrames(boxId)) + 1
		const {
			data: {
				addFrame: { id, left, right },
			},
			error,
		} = await addFrameMutation({
			boxId,
			position,
			type,
		})

		if (error) {
			return onError(error)
		}

		await addFrame({
			id: +id,
			position,
			boxId,
			type,
			leftId: +left?.id,
			rightId: +right?.id,
		})
	}

	async function onMoveDown(boxId: number) {
		const box = await getBox(boxId)
		const box2 = await getBoxAtPosition(box.hiveId, box.position + 1)
		console.log('moving',{
			box,
			box2
		})

		const { error } = await swapBoxPositionsMutation({ id: box.id, id2: box2.id })

		if (error) {
			return onError(error)
		}

		await swapBoxPositions(box, box2)
	}

	async function onMoveUp(boxId: number) {
		const box = await getBox(boxId)
		const box2 = await getBoxAtPosition(box.hiveId, box.position - 1)
		const { error } = await swapBoxPositionsMutation({ id: box.id, id2: box2.id })

		if (error) {
			return onError(error)
		}

		await swapBoxPositions(box, box2)
	}

	function onFrameRemove() {
		// removeFrameMutation
	}

	async function onBoxRemove(id: number) {
		const { error } = await removeBoxMutation({ id })

		if (error) {
			return onError(error)
		}

		await removeBox(id)
	}

	return (
		<div style={{ display: 'flex' }}>
			<PopupButtonGroup style={`margin-right:3px`}>
				<Button
					onClick={() => {
						onFrameAdd(box.id, frameTypes.EMPTY_COMB)
					}}
				>
					<FramesIcon /> Add comb
				</Button>

				<PopupButton>
					<Button
						onClick={() => {
							onFrameAdd(box.id, frameTypes.VOID)
						}}
					>
						empty frame
					</Button>
					<Button
						onClick={() => {
							onFrameAdd(box.id, frameTypes.FOUNDATION)
						}}
					>
						foundation
					</Button>
					<Button
						onClick={() => {
							onFrameAdd(box.id, frameTypes.FEEDER)
						}}
					>
						feeder
					</Button>
					<Button
						onClick={() => {
							onFrameAdd(box.id, frameTypes.PARTITION)
						}}
					>
						partition
					</Button>

					<Button
						className="red"
						title="Delete frame"
						onClick={() => {
							// onFrameRemove(box.id, frameId)
						}}
					>
						<DeleteIcon />
						Delete frame
					</Button>
				</PopupButton>
			</PopupButtonGroup>

			{showDownButton && <Button
				title="Move down"
				onClick={() => {
					onMoveDown(+box.id)
				}}
			>⬇️</Button>}

			{box.position > 1 && <Button
					title="Move up"
					onClick={() => {
							onMoveUp(+box.id)
					}}
				>⬆️</Button>
			}

			<Button
				className="red"
				title="Delete box"
				onClick={() => {
					onBoxRemove(+box.id)
				}}
			>
				<DeleteIcon />
			</Button>
		</div>
	)
}
