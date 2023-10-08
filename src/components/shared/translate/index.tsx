import React from 'react'
import { gql, useQuery } from '@/components/api'
import { useLiveQuery } from 'dexie-react-hooks'

import { getUser } from '@/components/models/user'
import { getLocale } from '@/components/models/locales'

function TRemote({ lang, children, tc }: { lang: string, children: any, tc: string }) {
	const { loading, error, data } = useQuery(gql`query translate($en: String!, $tc: String){
		translate(en: $en, tc: $tc){
			id
			en
			ru
			et
			key
		}
	}`, { variables: { en: children, tc } })

	if (loading) return

	return <>
		{data && data.translate && data.translate[lang] ? data.translate[lang] : children}
	</>
}

export default function T({ children, ctx = '' }: { children: any, ctx?: string }) {
	let user = useLiveQuery(() => getUser(), [])

	if(!user || !user.lang){
		return children
	}

	let translated = useLiveQuery(() => {
		if (!user || !user?.lang) return
		const where = { en: children }
		return getLocale(where)
	}, [user])

	if (translated && translated[user.lang]) return <>{translated[user.lang]}</>

	return <TRemote lang={user?.lang} tc={ctx}>{children}</TRemote>
}