import React, { useState, useRef, useEffect } from 'react'
import style from './index.less'
import Button from '../button'

const useOutsideClickHandler = (ref, callback) => {
	useEffect(() => {
		const handleClickOutside = (evt) => {
			if (ref.current && !ref.current.contains(evt.target)) {
				callback() //Do what you want to handle in the callback
			}
		}
		if (typeof window === 'undefined') {
			return () => {}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	})
}

export function PopupButtonGroup({
	children,
	style: inlineStyle = '',
	className = 'black',
}) {
	return (
		<div className={`${style[className]} popupButtonGroup`} style={inlineStyle}>
			{children}
		</div>
	)
}

export function PopupButton({ children, className = '' }) {
	const [extraButtonsVisible, setExtraButtonsVisible] = useState(false)
	const modalRef = useRef(null)

	useOutsideClickHandler(modalRef, () => setExtraButtonsVisible(false))

	return (
		<div ref={modalRef}>
			<Button
				className={[`popupTrigger`, className]}
				onClick={(e) => {
					setExtraButtonsVisible(!extraButtonsVisible)
					e.preventDefault()
				}}
			>
				...
			</Button>
			{extraButtonsVisible && <div className={style.popup}>{children}</div>}
		</div>
	)
}
