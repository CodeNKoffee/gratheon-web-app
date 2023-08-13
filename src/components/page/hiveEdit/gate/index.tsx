import CameraCapture from '@/components/page/hiveEdit/gate/cameraCapture'
import { gql, useQuery } from '@/components/api'
import styles from './styles.less'
import DashPlayer from './dashPlayer'

export default function Gate({ boxId }) {
	let {
		loading,
		error,
		errorNetwork,
		data,
	} = useQuery(gql`
	query boxStreams($boxIds: [ID]!) {
		videoStreams(boxIds: $boxIds, active: true) {
			id
			maxSegment
			manifest
			startTime
			endTime
		}
	}
`, { variables: { boxIds: [+boxId] } })

	if (loading) {
		return null
	}

	if (data.videoStreams?.length > 0) {
		return <div><DashPlayer manifestBase64={data.videoStreams[0].manifest} /></div>
	}

	return (
		<div className={styles.gateCameraWrap}>
			<div style="background:#0060d6;color:white;padding:10px;">
				Run app from the phone to stream video over good network connection.
				Position it above hive entrance. Use green landing board.
			</div>
			<div style="border:1px solid black;padding:10px;">
				<CameraCapture boxId={boxId} />
			</div>
		</div>
	)
}