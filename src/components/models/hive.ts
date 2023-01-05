import { db } from './db';

type Hive = {
    id: number
    name?: String
    notes?: String
    boxCount: number
}

export function getHive(id: number){
    return async(): Promise<Hive> => {
		return await db['hive'].get({id})
	}
}

export async function updateHive(id:number, delta:object){
    return await db['hive'].update(id, delta);
}