<script setup lang="ts">
import { storeToRefs } from "pinia";
import useListStore from "@/stores/modules/list";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePage({
  path: "/result/:id",
  name: "resultItem",
  meta: {
    level: 3,
    title: "历史查询记录",
  },
});

const listStore = useListStore();
const { list } = storeToRefs(listStore);
const data = ref({
  id: -1,
  time: "",
  type: "",
  waterRemainTimeText: "",
  plantGrownLeftTimeText: "",
  fullyWateredTime: "",
});

onMounted(() => {
  const id = String(route.params.id);
  if (!id) router.push({ name: "home" });
  data.value = list.value.find((item) => item.id === id);
});

function backHome() {
  router.push({ name: "home" });
}
</script>

<template>
  <container>
    <div></div>
    <van-cell-group v-if="data.fullyWateredTime" inset>
      <van-cell title="查询时间" :value="data.time" />
      <van-cell title="植物类型" :value="data.type" />
      <van-cell title="剩余生长时间" :value="data.plantGrownLeftTimeText" />
      <van-cell title="水分保持时间" :value="data.waterRemainTimeText" />
      <van-cell title="最终浇水成熟时间" :value="data.fullyWateredTime" />
    </van-cell-group>
    <van-empty v-else image="error" description="暂无数据">
      <van-button @click="backHome" round type="primary" class="bottom-button"
        >返回主页</van-button
      >
    </van-empty>
  </container>
</template>
