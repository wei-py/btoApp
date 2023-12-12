<template>
  <view>
    <wd-grid square :column="5" custom-class="w-full">
      <wd-grid-item use-slot v-for="menu in props.menuList" :key="menu.text">
        <view @tap="menu.tap" class="h-full w-full center">
          <view>
            <image class="w-[90rpx] h-[90rpx] rounded-lg" :class="menu.path ? 'bg-[#ffcf48]' : 'bg-[#ccc]'" center :src="menu.icon"></image>
            <view class="text-[22rpx] text-slate-700 center">
              {{ menu.text }}
            </view>
          </view>
        </view>
      </wd-grid-item>
    </wd-grid>
  </view>
</template>

<script setup>
const props = defineProps(['menuList'])
</script>
