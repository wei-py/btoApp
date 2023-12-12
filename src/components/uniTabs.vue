<template>
  <view>
    <wd-tabs v-model="tab" swipeable animated @handleClick="changeTab" :lineWidth="60">
      <block v-for="tab in props.tabs" :key="tab">
        <wd-tab v-bind="tab" :title="`${tab.title}`" :name="tab.name" class="bg-slate-200">
          <template v-for="curTab in props.tabs" :key="curTab.name">
            <view v-show="curTab.name == tab.name">
              <slot :name="tab.name" />
            </view>
          </template>
          <slot />
        </wd-tab>
      </block>
    </wd-tabs>
  </view>
</template>

<script setup>
// 查看 tab 属性详情 https://wot-design-uni.cn/component/tabs.html#%E7%A6%81%E7%94%A8-tab
const props = defineProps(['tabs', 'tab'])
const emits = defineEmits(['changeTab'])

const tab = ref(props.tabs[0].name)

function changeTab(tab) {
  emits('changeTab', tab.value)
}
</script>

<style lang="scss" scoped>
:deep(.wd-tabs__nav-item) {
  @apply bg-slate-200;
  @apply text-[24rpx]
}
:deep(.wd-tabs__line) {
  background: #ffab30;
}
</style>
