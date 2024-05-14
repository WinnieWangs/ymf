<script setup lang="ts">
import { ref } from "vue";
import darkQrCode from "@/assets/qrcode_dark.jpg";
import lightQrCode from "@/assets/qrcode_light.jpg";

const imgSrc = ref(darkQrCode);

definePage({
  name: "about",
  meta: {
    level: 1,
  },
});

onMounted(() => {
  imgSrc.value = isDark.value ? darkQrCode : lightQrCode;
});
</script>

<template>
  <Container>
    <div align-center mb-20 flex justify-center text-16 text-dark dark:text-white>
      <span mr-10>欢迎加群交流元梦内容</span>
      <van-button
        plain
        hairline
        size="mini"
        type="primary"
        url="https://qm.qq.com/q/kvYaDyaHd0"
      >
        一键加群
      </van-button>
    </div>
    <div mx-auto mb-20 text-center text-16 text-dark dark:text-white>
      <van-image width="calc(100% - 32px)" :src="imgSrc" />
    </div>
  </Container>
</template>
