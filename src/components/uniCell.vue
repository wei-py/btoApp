<template>
  <view>
    <wd-cell>
      <template #default>
        <view :class="props.customClass">
          <slot />
        </view>
      </template>
    </wd-cell>
  </view>
</template>

<script setup>
const props = defineProps({
  customClass: {
    default: ''
  }
})
</script>

<style lang="scss" scoped>
:deep(.wd-cell__left) {
  display: none;
}

:deep(.wd-cell__value) {
  text-align: left;
  padding-left: 10rpx;
}

:deep(.wd-cell__wrapper) {
  height: auto !important;
  min-height: 70rpx;
}
</style>
