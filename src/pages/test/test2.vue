<template>
  <view class="fullScreen bg-slate-200">
    <view class="flex bg-white text-center items-center">
      <wd-drop-menu class="flex-1">
        <wd-drop-menu-item
          v-for="menuItem of _.dropMenuOptions"
          :key="menuItem.title"
          v-model="menuItem.value"
          :options="menuItem.option"
          @change="changeMenu" />
      </wd-drop-menu>
      <view class="flex-1">
        <wd-button type="text" class="!text-black">筛选</wd-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { util } from '@/utils/util'
import dropMenuOptions from './dropMenuOptions'

const _ = util.data({ dropMenuOptions })

function changeMenu(menu) {
  console.log(menu, 'change menu')
}
</script>

<style lang="scss" scoped>
//////////////////  dropMenu //////////////////
:deep(.wd-drop-item__title) {
  &:first-child {
    color: white;
  }

  // tip 当作显示
  .wd-drop-item__tip {
    // display: float !important;
    float: left;
    color: black;
  }
}
// 打勾图标
:deep(.wd-drop-item__icon:before) {
  color: #ffab30 !important;
}

// 下拉图标
:deep(.wd-drop-menu__arrow:before) {
  color: #ffab30 !important;
}

// 
:deep(.wd-drop-menu__item-title:after) {
  background: #ffab30 !important;
}
//////////////////  dropMenu //////////////////
</style>
