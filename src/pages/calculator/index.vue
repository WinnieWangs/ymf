<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { nanoid } from 'nanoid'
import { PlantsGrownTimeList, type TPlantsGrownTimeItem, type TVisibleCollection } from './constants'
import useListStore from '@/stores/modules/list'

const listStore = useListStore()
const router = useRouter()

// 获取当前日期和时间，并格式化为 "YYYY-MM-DD HH:mm"
definePage({
  name: 'calculator',
  meta: {
    level: 2,
    title: '推荐浇水时间',
  },
})

const currentTime = ref(dayjs().format('YYYY年MM月DD日 HH:mm'))

const visibleCollection = reactive<TVisibleCollection>({
  plantType: false,
  waterRemainTime: false,
  plantGrownLeftTime: false,
})

const currentPlant = ref({ name: '32小时', value: 32 })
const totalTime = computed(() => currentPlant.value.value * 60)
const maxWaterRemainTime = computed(() => Math.floor(totalTime.value / 3))
const maxWaterRemainHour = computed(() => Math.floor(maxWaterRemainTime.value / 60))
const maxWaterMinusTime = computed(() => Math.floor(totalTime.value / 12))
const maxPlantGrownLeftTimeHour = computed(() => Math.floor(totalTime.value / 60))

const waterRemainTime = ref(['07', '00'])
const waterRemainTimeText = computed(() => {
  return `${waterRemainTime.value[0]}小时${waterRemainTime.value[1]}分钟`
})

const plantGrownLeftTime = ref(['07', '01'])
const plantGrownLeftTimeText = computed(() => {
  return `${plantGrownLeftTime.value[0]}小时${plantGrownLeftTime.value[1]}分钟`
})

function onPlantSelect(item: TPlantsGrownTimeItem) {
  toggleVisible('plantType', false)
  currentPlant.value = item

  if (currentPlant.value.value) {
    waterRemainTime.value = [`00`, `00`]
    plantGrownLeftTime.value = [`${Math.floor(totalTime.value / 60)}`, `${totalTime.value % 60}`]
  }
}

function toggleVisible(name: keyof TVisibleCollection, visible: boolean) {
  visibleCollection[name] = visible
}

function getTimeAfterAddMinute(minute: number) {
  return dayjs().add(minute, 'minute').format('YYYY年MM月DD日 HH:mm')
}

function calculate() {
  // 剩余生长时间
  const _plantLeftTime = ~~plantGrownLeftTime.value[0] * 60 + ~~plantGrownLeftTime.value[1]
  // 水分保持时间
  const _waterRemainTime = ~~waterRemainTime.value[0] * 60 + ~~waterRemainTime.value[1]
  // 水分距离最大保水时间有多少分钟
  const _waterRemainMax = maxWaterRemainTime.value - _waterRemainTime
  // 本次浇水可以减少的时间
  const _fillTime = _waterRemainMax * maxWaterMinusTime.value / maxWaterRemainTime.value
  // 一轮浇水 + 一轮等待浇水的时间
  const _oneTurnTime = maxWaterRemainTime.value + maxWaterMinusTime.value
  // 轮次
  const count = (_plantLeftTime - _fillTime) / _oneTurnTime

  const id = nanoid()

  listStore.addToList({
    id,
    time: currentTime.value,
    waterRemainTimeText: waterRemainTimeText.value,
    plantGrownLeftTimeText: plantGrownLeftTimeText.value,
    type: currentPlant.value.name,
    maxWaterRemainTime: `${maxWaterRemainTime.value}分钟`,
    fullyWateredTime: getTimeAfterAddMinute(count * maxWaterRemainTime.value),
  })

  router.push({ name: 'resultItem', params: { id } })
}

onMounted(() => {
  onPlantSelect({ name: '32小时', value: 32 })
})
</script>

<template>
  <Container>
    <!-- 当前时间 -->
    <van-cell :value="currentTime" title="当前时间" />

    <!-- 选择作物类型 -->
    <van-cell
      is-link
      :value="currentPlant.name"
      title="选择作物时间"
      @click="toggleVisible('plantType', true)"
    />
    <van-action-sheet
      v-model:show="visibleCollection.plantType"
      :actions="PlantsGrownTimeList"
      @select="onPlantSelect"
    />

    <!-- 剩余生长时间 -->
    <van-cell
      v-if="currentPlant.value"
      is-link
      :value="plantGrownLeftTimeText"
      title="剩余生长时间"
      @click="toggleVisible('plantGrownLeftTime', true)"
    />
    <van-popup
      v-model:show="visibleCollection.plantGrownLeftTime"
      :style="{ width: '100vh', height: '300px' }"
    >
      <van-time-picker
        v-model="plantGrownLeftTime"
        :max-hour="maxPlantGrownLeftTimeHour"
        title="选择剩余生长时间"
        @confirm="toggleVisible('plantGrownLeftTime', false)"
      />
    </van-popup>

    <!-- 水分可保持时间 -->
    <van-cell
      v-if="currentPlant.value"
      is-link
      :value="waterRemainTimeText"
      title="水分可保持时间"
      @click="toggleVisible('waterRemainTime', true)"
    />
    <van-popup
      v-model:show="visibleCollection.waterRemainTime"
      :style="{ width: '100vh', height: '300px' }"
    >
      <van-time-picker
        v-model="waterRemainTime"
        :max-hour="maxWaterRemainHour"
        title="选择水分保持时间"
        @confirm="toggleVisible('waterRemainTime', false)"
      />
    </van-popup>

    <van-button
      v-if="currentPlant.value"
      class="calc-btn"
      round
      block
      type="primary"
      @click="calculate"
    >
      开始计算
    </van-button>
  </Container>
</template>

<style scoped>
.calc-btn {
  margin: 50px auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
