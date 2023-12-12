<template>
  <view class="bg-slate-200 flex-wrap h-min-screen">
    <view
      v-for="icon of wdIconList"
      :key="icon"
      class="w-[100rpx] h-[100rpx] inline-flex text-center flex-col items-centera justify-center">
      <wd-icon :name="icon" />
      {{ icon }}
    </view>
  </view>
</template>
<script setup>
import { wdIconList } from '@/utils/icon'
const _ = util.data({})

util.onceShow(async () => {
  console.log(wdIconList, 9999)
  util.setTitle(_.option.title)
})
</script>
