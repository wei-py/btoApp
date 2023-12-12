<template>
  <view class="fullScreen bg-slate-200">
    <notice />
    <view class="p-[15rpx]">
      <wd-swiper
        :list="['../../static/background/taskBackground.png']"
        autoplay
        :current="0"
        :indicator="{ type: 'dots-bar' }"
        height="180" />

      <uniTabs :tabs="_.tabs" class="pt-1">
        <template #真租顶>
          <view class="grid gap-2 mt-1">
            <wd-card
              title="常用数据"
              class="!m-0 !px-0"
              custom-title-class="font-bold h-[25rpx] ml-[20rpx]"
              custom-footer-class="h-0 !py-1">
              <uniTask :menuList="_.commonTask"></uniTask>
            </wd-card>
            <wd-card
              title="任务大全"
              class="!m-0 !px-0"
              custom-title-class="font-bold h-[25rpx] ml-[20rpx]"
              custom-footer-class="h-0 !py-1">
              <uniTask :menuList="_.phaseTask"></uniTask>
            </wd-card>
            <wd-card
              title="审核大全"
              class="!m-0 !px-0"
              custom-title-class="font-bold h-[25rpx] ml-[20rpx]"
              custom-footer-class="h-0 !py-1">
              <uniTask :menuList="_.checkTask"></uniTask>
            </wd-card>
          </view>
        </template>
      </uniTabs>
    </view>
  </view>
</template>

<script setup>
import notice from '@/components/notice.vue'
import uniTabs from '@/components/uniTabs.vue'
import uniTask from '@/components/uniTask.vue'
import { commonTask, phaseTask, checkTask } from './taskList' // 菜单跳转配置
const _ = util.data({ commonTask, phaseTask, checkTask })
_.tabs = [
  { name: '真租顶', title: '真租顶' },
  { name: '整县', title: '整县', disabled: true },
  { name: '户用', title: '户用', disabled: true },
  { name: '工商业', title: '工商业', disabled: true }
]

onLoad(async () => {
  // 状态字典
  if (util.getStore('statusDic')) return // 非空跳过
  const resp = await http.get('order-state/dic')
  const statusDic = resp.data.data
  statusDic.data = {
    ...statusDic.state,
    ...statusDic.stage,
    ...statusDic.task
  }
  uni.setStorageSync('statusDic', statusDic)
})
</script>

<style lang="scss" scoped>
:deep(.wd-card__title) {
  * {
    font-size: 28rpx !important;
  }
}
</style>
