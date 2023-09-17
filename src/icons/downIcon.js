import React from 'react'

export default function DownIcon({ size = 16, onClick = () => { } }) {
	return <svg onClick={onClick}
		height={size}
		width={size}
		xmlns="http://www.w3.org/2000/svg"
		fill="white"
		viewBox="0 0 512 512"
		stroke="currentColor">

		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M383.6,322.7L278.6,423c-5.8,6-13.7,9-22.4,9c-8.7,0-16.5-3-22.4-9L128.4,322.7c-12.5-11.9-12.5-31.3,0-43.2  c12.5-11.9,32.7-11.9,45.2,0l50.4,48.2v-217c0-16.9,14.3-30.6,32-30.6c17.7,0,32,13.7,32,30.6v217l50.4-48.2  c12.5-11.9,32.7-11.9,45.2,0C396.1,291.4,396.1,310.7,383.6,322.7z" />
	</svg>
}