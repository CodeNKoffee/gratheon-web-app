import { Box } from '@/components/api/schema'
import { db } from './db'

let boxes: Box[] = [] // db.get('boxes')

export const boxTypes = {
	DEEP: 'DEEP',
	SUPER: 'SUPER',
}

export async function getBox(id: number): Promise<Box> {
	if(!id) {
		return null;
	}
	
	try {
		return await db['box'].get({id})
	} catch (e) {
		console.error(e,{id});
	}
}

export async function getBoxAtPosition(hiveId, position): Promise<Box>{
	try {
		return await db['box'].where({hiveId, position}).first()
	} catch (e) {
		console.error(e)
		throw e
	}
}

export async function getBoxes(where = {}): Promise<Box[]> {
	try {
		return await db['box'].where(where).sortBy('position')
	} catch (e) {
		console.error(e)
		throw e
	}
}

export async function countHiveBoxes(hiveId: number) {
	try {
		return await db['box']
			.where({
				hiveId,
			})
			.count()
	} catch (e) {
		console.error(e)
		throw e
	}
}

export async function removeBox(id: number) {
	try {
		return await db['box'].delete(id)
	} catch (e) {
		console.error(e)
		throw e
	}
}

export async function addBox({
	id,
	hiveId,
	position,
	type,
}: {
	id: number
	hiveId: number
	position: number
	type: string
}) {
	try {
		await db['box'].put({
			id,
			hiveId,
			position,
			type,
		})
	} catch (e) {
		console.error(e)
		throw e
	}
}


export async function swapBoxPositions(box1:Box, box2:Box ) {
	const tmp = +`${box1.position}`;

	box1.position = box2.position;
	box2.position = tmp;

	await db['box'].put(box1)
	await db['box'].put(box2)

	return true
}
