<template>
  <view>
    <uv-drop-down
      sign="dropDown_1"
      :text-style="{ activeColor: 'red' }"
      text-active-color="#ffab30"
      text-color="#ffab30"
      text-size="22rpx"
      :extra-icon="{ name: 'arrow-down-fill', color: '#ffab30', size: '22rpx' }"
      :extra-active-icon="{ name: 'arrow-up-fill', color: '#ffab30', size: '22rpx' }"
      @click="selectMenu">
      <template v-for="item of util._.dropMenuOptions" :key="item.name">
        <uv-drop-down-item :name="item.name" :type="2" :label="item.title" :value="item.value" />
      </template>
    </uv-drop-down>
    <uv-drop-down-popup
      ref="popupDom"
      sign="dropDown_1"
      z-index="900"
      :click-overlay-on-close="true"
      :currentDropItem="currentDropItem"
      @popupChange="() => {}"
      @clickItem="clickItem"></uv-drop-down-popup>
  </view>
</template>

<script setup>
import { util } from '@/utils/util'
const currentDropItem = ref([]) // 当前下拉出来的选项
const popupDom = ref(null)
const emits = defineEmits(['changeMenu'])

/**
 * @description 点击了下拉倒三角事件
 * @param {*} e
 */
function selectMenu(e) {
  const { name, active, type } = e
  const activeIndex = util._.dropMenuOptions.findIndex((n) => n.name == name)
  currentDropItem.value = util._.dropMenuOptions[activeIndex] // 浅拷贝
}

/**
 * @description 选中拉下选项的事件
 * @param {*} e
 */
function clickItem(e) {
  currentDropItem.value.value = e.value
  emits('changeMenu')
  
  // console.log(util._.dropMenuOptions);
}
</script>

<style lang="scss" scoped>
:deep(.uv-text__value) {
  font-size: 22rpx !important;
}
:deep(.uv-icon--right) {
  position: relative;
  top: 2rpx;
}
</style>
