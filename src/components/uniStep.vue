<template>
  <view class="h-[200rpx] bg-[#ffab30] overscroll-auto">
    <view class="flex justify-between h-[80rpx] items-center px-[20rpx]">
      <view class="text-[30rpx] font-bold text-white">当前进度: {{ props.step }}</view>
      <view class="flex">
        <wd-button @tap.stop="util.go('/pages/operateLog/operateLog')" custom-class="!p-1 !h-[40rpx] !text-[#ffab30] bg-white flex-end" size="small" type="info">操作记录</wd-button>
      </view>
    </view>
    <scroll-view scroll-x="true" :show-scrollbar="false">
      <wd-steps :active="statusIndex" align-center custom-class="w-[1500rpx] pt-2">
        <template v-for="(sta, index) of status" :key="sta">
          <wd-step icon-slot title-slot>
            <template #title>
              <view class="text-white">
                {{ sta }}
              </view>
            </template>
            <template #icon>
              <wd-icon v-if="statusIndex > index" color="#fff" custom-class="text-[40rpx]" name="check-circle-filled"></wd-icon>
              <wd-icon v-if="statusIndex == index" color="#fff" custom-class="text-[40rpx]" name="minus-circle-filled"></wd-icon>
              <wd-icon v-if="statusIndex < index" color="#fff" custom-class="text-[40rpx]" name="info-circle-filled"></wd-icon>
            </template>
          </wd-step>
        </template>
      </wd-steps>
    </scroll-view>
  </view>
</template>

<script setup>
import { util } from '@/utils/util'
const props = defineProps(['step'])

const status = ['预审', '客户信息', '勘察', '合同签约', '备案证', '初设评审', '施工', '并网', '结算', '购售电合同', '完成']

const statusIndex = computed(() => {
  let index = status.findIndex((n) => {
    return props.step.includes(n)
  })
  if (props.step == '同步进件') {
    return 2
  }
  if (index == 12) index += 1
  return index
})
</script>

<style scoped lang="scss">
:deep(.wd-step__line) {
  background: #fff;
  left: 70% !important;
  right: -50% !important;
  width: 60%;
}
:deep(.wd-step__icon) {
  background: transparent;
}
</style>
