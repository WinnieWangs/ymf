export type TPlantsGrownTime = 1 | 6 | 12 | 16 | 32

export type TPlantsGrownTimeItem = {
    name: string
    value: TPlantsGrownTime
}

export type TVisibleCollection = {
    plantType: boolean;
    waterRemainTime: boolean;
    plantGrownLeftTime: boolean
}

export const PlantsGrownTime: TPlantsGrownTime[] = [1, 6, 12, 16, 32];

export const PlantsGrownTimeList: TPlantsGrownTimeItem[] = PlantsGrownTime.map((value) => ({
    name: `${value}小时`,
    value,
}))
