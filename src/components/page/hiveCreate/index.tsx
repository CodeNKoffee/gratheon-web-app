import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import { gql, useMutation } from '../../api'

import VisualForm from '../../shared/visualForm'
import HiveIcon from '../../shared/hiveIcon'
import Loader from '../../shared/loader'
import ErrorMsg from '../../shared/messageError'
import VisualFormSubmit from '../../shared/visualForm/VisualFormSubmit'
import Button from '../../shared/button'
import { Box } from '../../api/schema'

const defaultBoxColor = '#ffc848'

export default function HiveCreateForm() {
	let { id } = useParams()
	let [boxCount, setBoxCount] = useState(2)
	let defaultBoxes = []
	for (let i = 0; i < boxCount; i++) {
		defaultBoxes.push({
			color: `${defaultBoxColor}`,
		})
	}

	const [boxes, setBoxes] = useState(defaultBoxes)

	let navigate = useNavigate()
	let [frameCount, setFrameCount] = useState(8)
	let [name, setName] = useState('')
	let [addHive, { loading, error, data }] = useMutation(
		gql`
			mutation addHive(
				$name: String!
				$boxCount: Int!
				$frameCount: Int!
				$apiaryId: ID!
				$colors: [String]
			) {
				addHive(
					hive: {
						name: $name
						boxCount: $boxCount
						frameCount: $frameCount
						apiaryId: $apiaryId
						colors: $colors
					}
				) {
					id
					name
					boxCount
				}
			}
		`,
		{ errorPolicy: 'all' }
	)

	function onSubmit(e) {
		e.preventDefault()

		addHive({
			apiaryId: id,
			name,
			boxCount,
			frameCount,
			colors: boxes.map((b: Box) => {
				return b.color
			}),
		})
	}

	if (loading) {
		return <Loader />
	}

	if (data) {
		navigate('/apiaries', { replace: true })

		return <div>Saved!</div>
	}

	return (
		<div>
			{error && <ErrorMsg error={error} />}
			<div style={{ display: 'flex', padding: 20 }}>
				<div style={{ paddingTop: 30, width: 100, textAlign: 'center' }}>
					<HiveIcon boxes={boxes} editable={true} />
				</div>

				<VisualForm onSubmit={onSubmit.bind(this)} style="flex-grow:1">
					<div>
						<label htmlFor="name">Name</label>
						<input
							name="name"
							id="name"
							style={{ flexGrow: '1' }}
							autoFocus
							value={name}
							onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
								setName(e.target.value)
							}
						/>
					</div>

					<div>
						<label htmlFor="boxCount">Box count</label>

						<input
							style={{ width: 50 }}
							type="number"
							id="boxCount"
							name="boxCount"
							value={boxCount}
							onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
								const boxCount = parseInt(e.target.value, 10)
								if (boxCount < 1) return

								setBoxCount(boxCount)
								if (boxCount > boxes.length) {
									setBoxes([...boxes, { color: defaultBoxColor }])
								} else if (boxCount < boxes.length) {
									setBoxes([...boxes.slice(0, boxCount)])
								}
							}}
							min="1"
							max="10"
							step="1"
						/>
					</div>

					<div>
						<label htmlFor="frameCount">Frame count</label>

						<input
							style={{ width: 50 }}
							type="number"
							id="frameCount"
							name="frameCount"
							value={frameCount}
							onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
								setFrameCount(parseInt(e.target.value, 10))
							}
							min="0"
							max="40"
							step="1"
						/>
					</div>

					<VisualFormSubmit>
						<Button type="submit" className="green">
							Create
						</Button>
					</VisualFormSubmit>
				</VisualForm>
			</div>
		</div>
	)
}
