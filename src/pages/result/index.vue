<script setup lang="ts">
import { storeToRefs } from "pinia";
import useListStore from "@/stores/modules/list";
import { useRouter } from "vue-router";

const router = useRouter();

definePage({
  path: "/result",
  name: "result",
  meta: {
    level: 2,
    title: "历史查询记录",
  },
});

const listStore = useListStore();
const { list } = storeToRefs(listStore);

function backHome() {
  router.push({ name: "home" });
}
</script>

<template>
  <container>
    <div v-if="list.length">
      <router-link v-for="item in list" :to="`/result/${item.id}`">
        <van-cell-group inset class="c-item">
          <van-cell title="查询时间" :value="item.time" />
          <van-cell title="植物类型" :value="item.type" />
          <van-cell title="最终浇水成熟时间" :value="item.fullyWateredTime" />
        </van-cell-group>
      </router-link>
    </div>
    <van-empty v-else image="error" description="暂无数据">
      <van-button @click="backHome" round type="primary" class="bottom-button"
        >返回主页</van-button
      >
    </van-empty>
  </container>
</template>

<style>
.c-item {
  margin: 10px 0 !important;
}
</style>
