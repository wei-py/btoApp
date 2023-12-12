<template>
  <view class="bg-slate-200 w-screen h-screen">
    <notice />
    <!-- 测试 uniform -->
    <uniForm :form="_.form" title="测试表单">
      <template #pictureTitle>
        {{ 123 }}
      </template>
      <template #pictureValue>
        {{ 123 }}
      </template>
      <!-- <template #picture="item">

        <wd-cell :title="item.scope.title">
          {{ item.scope.value }}
        </wd-cell>
      </template> -->
    </uniForm>
    <uniBtn @save="_.saveData" @put="_.putData" />
  </view>
</template>
<script setup>
import notice from "@/components/notice.vue"
import uniForm from '@/components/uniForm.vue'
import uniBtn from '@/components/uniBtn/uniBtn.vue'
import form from './form'

const _ = util.data({ form })

_.getData = () => { }

_.saveData = () => {
  util.messageCallback("退出后是否保存", '点击空白继续填写', '', '', () => {
    console.log('点击了保存');
  }, () => {
    console.log('点击了取消');
  })
}

_.putData = () => { }

_.checkData = () => { }


util.onceShow(() => {
  _.btns = 999
})
</script>

<style lang="scss" scoped></style>
