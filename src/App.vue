<script setup>
import notice from './components/notice.vue'

</script>

<template>
  <view></view>
</template>

<style lang="scss">
// 统一字号 和 统一字体都可复制
* {
  font-size: 22rpx;
  -webkit-user-select: text;
  user-select: text;
}

// 水平垂直居中
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 垂直居中
.yCenter {
  display: flex;
  align-items: center;
}

// 水平居中
.xCenter {
  display: flex;
  justify-content: center;
}

// 全屏
.fullScreen {
  @apply w-screen;
  @apply min-h-screen;
  @apply flex;
  @apply flex-col;
}

// 字体换行且居中
.textCenter {
  display: tabel-cell;
  vertical-align: middle;
  text-align: center;
}

.splitLine {
  border-bottom: 1rpx solid #eee;
}

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
