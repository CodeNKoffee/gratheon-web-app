import React from 'react'
import isNil from 'lodash/isNil'
import { Container, Draggable } from '@edorivai/react-smooth-dnd'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from "dexie-react-hooks";

import { gql, useMutation, useQuery } from '@/components/api'
import { getFrames, moveFrame } from '@/components/models/frames'
import ErrorMessage from '@/components/shared/messageError'
import Loader from '@/components/shared/loader'

import styles from './index.less'
import Frame from './boxFrame'
import FRAMES_QUERY from './framesQuery.graphql'
import { getFrameSideCells } from '@/components/models/frameSideCells';
import { getFrameSideIDsFrames } from '@/components/models/frameSide';

export default function Box({
	box,
	inspectionId,
	boxId,
	frameId,
	frameSideId,
	apiaryId,
	hiveId,
	editable = true
}) {
	const navigate = useNavigate();
	let framesDiv = []

	const [updateFramesRemote, { error }] = useMutation(gql`mutation updateFrames($frames: [FrameInput]!) { updateFrames(frames: $frames) { id } }`)

	const frames = useLiveQuery(async () => {
		let tmp = await getFrames({
			boxId: +box.id
		})

		for (const r in tmp) {
			if (tmp[r].leftSide) {
				tmp[r].leftSide.cells = await getFrameSideCells(+tmp[r].leftId)
			}

			if (tmp[r].rightSide) {
				tmp[r].rightSide.cells = await getFrameSideCells(+tmp[r].rightId)
			}
		}
	

		return tmp
	}, [boxId, box], false);

	if (frames === false) {
		return <Loader />
	}

	let { loading } = useQuery(FRAMES_QUERY, {
		variables: {
			id: +hiveId,
			apiaryId: +apiaryId,
		}
	})

	if (loading) {
		return <Loader />
	}

	if (frames && frames.length > 0) {
		for (let i = 0; i < frames.length; i++) {
			const frame = frames[i]

			let frameDiv = <Frame
				box={box}
				frameId={frameId}
				frameSideId={frameSideId}
				hiveId={hiveId}
				apiaryId={apiaryId}
				frame={frame}
				editable={editable}
			/>

			if (editable) {
				framesDiv.push(</* @ts-ignore */ Draggable key={i}>{frameDiv}</Draggable>)
			} else {
				framesDiv.push(frameDiv)
			}
		}
	}

	let framesWrapped: any = framesDiv

	if (editable) {
		async function swapFrames({ removedIndex, addedIndex }) {
			await moveFrame({
				boxId,
				addedIndex,
				removedIndex
			})

			const frames = await getFrames({ boxId: +boxId })
			await updateFramesRemote({
				frames: frames.map((v) => {
					let r = {
						...v
					}
					delete r.rightId
					delete r.leftId
					delete r.leftSide
					delete r.rightSide
					return r
				})
			})

			if (!isNil(frameSideId)) {
				navigate(
					`/apiaries/${apiaryId}/hives/${hiveId}/box/${box.id}/frame/${frameId}/${frameSideId}`,
					{ replace: true }
				)
			}
		}

		framesWrapped = (<>
			{/* @ts-ignore */}
			<Container
				style={{ height: `calc(100% - 10px)` }}
				onDrop={swapFrames}
				orientation="horizontal"
			>{framesDiv}</Container>
		</>)
	}

	return (
		<div>
			<ErrorMessage error={error} />

			<div
				className={`${styles['boxType_' + box.type]} ${styles.boxOuter} ${+boxId === box.id && styles.selected
					}`}
			>
				<div className={styles.boxInner}>
					{!frames && <Loader size={1} />}

					{framesWrapped}
				</div>
			</div>
		</div>
	)
}
