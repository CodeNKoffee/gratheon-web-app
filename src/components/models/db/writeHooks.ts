import { FrameSide } from '@/components/api/schema'
import { FrameSideFile } from '@/components/models/frameSideFile'
import { FrameSideCells } from '@/components/models/frameSideCells'
import { upsertEntity } from './index'

export const writeHooks = {
	Apiary: async (_, apiary) => await upsertEntity('apiary', apiary),
	Hive: async (_, hive) => await upsertEntity('hive', hive),
	Box: async (parent, box) => {
		box.hiveId = +parent.id
		await upsertEntity('box', box)
	},
	Family: async ({ id }, family) => {
		family.hiveId = +id
		await upsertEntity('family', family)
	},
	Frame: async (parent, value, { originalValue: frame }) => {
		value.boxId = +parent.id

		if (frame.leftSide) {
			value.leftId = +frame.leftSide?.id
		}

		if (frame.rightSide) {
			value.rightId = +frame.rightSide?.id
		}
		
		await upsertEntity('frame', value)
	},
	FrameSide: async ({ id }, frameside:FrameSide) => {
		frameside.frameId = +id

		await upsertEntity('frameside', frameside)
	},
	FrameSideFile: async (_, fsf: FrameSideFile, { originalValue }) => {
		if (Object.keys(fsf).length === 0) return

		fsf.queenDetected= fsf?.queenDetected ? true : false;

		delete fsf.hiveId

		fsf.fileId = +originalValue?.file?.id;
		fsf.frameSideId = +fsf.frameSideId
		fsf.id = +fsf.frameSideId

		if(fsf.fileId){
			await upsertEntity('framesidefile', fsf)
		}
	},
	FrameSideCells: async (_, cells: FrameSideCells, { originalValue }) => {
		if (Object.keys(cells).length === 0) return

		cells.broodPercent = cells?.broodPercent ? +cells.broodPercent : 0;
		cells.cappedBroodPercent= cells?.cappedBroodPercent ? +cells.cappedBroodPercent : 0;
		cells.eggsPercent= cells?.eggsPercent ? +cells.eggsPercent : 0;
		cells.pollenPercent= cells?.pollenPercent ? +cells.pollenPercent : 0;
		cells.honeyPercent= cells?.honeyPercent ? +cells.honeyPercent : 0;

		cells.frameSideId = +cells.id
		cells.id = +cells.id
		await upsertEntity('framesidecells', cells)
	},
	File: async (_, file) => {
		// file.hiveId = +hiveId
		await upsertEntity('file', file)
	},
	User: async (_, user) => await upsertEntity('user', user),
	Locale: async (_, locale) => {
		// console.log('storing translation', locale)
		await upsertEntity('locale', locale)
	},
}
