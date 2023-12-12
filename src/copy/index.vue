<template>
  <view class="flex h-[100vh] w-[100vw] items-center justify-center">
    <!-- <wd-input v-bind="_.form[0]" @input="_.form[0].input" />
    <view @tap="tap" class="h-[100rpx] w-[100rpx] bg-slate-300"></view> -->
  </view>
</template>

<script setup>
const _ = reactive({})
_.form = [
  {
    formType: 'input',
    name: 'username',
    modelValue: 'cxk',
    value: 'cxk',
    label: '姓名',
    realValue: '',
    input(e) {
      console.log(e, 99)
    },
    mounted(_) {
      console.log(this.dom)
    }
  }
]

enhance(_)

function tap() {}
</script>
