<template>
  <view :class="get(props, 'formItem.customClass')">
    <view class="flex flex-wrap justify-center">
      <!-- 显示文件 - 图片 -->
      <template v-if="isString(props.formItem.value) && props.formItem.value.length">
        <!-- <imgPreview :imgList="[props.formItem.value]" ref="preview" /> -->
        <view class="h-[170rpx] xCenter w-1/3 mb-[10rpx]">
          <image
            :src="props.formItem.value"
            @tap="previewImage(idx)"
            class="h-[170rpx] w-[170rpx] inline-block rounded absolute bg-slate-100"
            mode="aspectFit" />
          <wd-icon
            @tap="remove(idx)"
            name="error-fill"
            size="40rpx"
            class="relative leading-[50rpx] left-[60rpx] h-[20rpx]"
            color="#545657" />
        </view>
      </template>
      <template v-else>
        <template v-for="(file, idx) of props.formItem.value" :key="file.url">
          <view class="h-[170rpx] xCenter w-1/3 mb-[10rpx]">
            <image
              :src="file.path || file.url || file.src || file"
              @tap="previewImage(idx)"
              class="h-[170rpx] w-[170rpx] inline-block rounded absolute bg-slate-100"
              mode="aspectFit" />

            <wd-icon
              @tap="remove(idx)"
              name="error-fill"
              size="40rpx"
              class="relative leading-[50rpx] left-[60rpx] h-[20rpx]"
              color="#545657" />
          </view>
        </template>
      </template>

      <!-- 上传方框 -->
      <view class="xCenter w-1/3 mb-[10rpx]" v-if="get(props, 'formItem.value.length', 0) < count">
        <wd-upload
          multiple
          :file-list="[]"
          :action="action"
          :formData="formData"
          :header="header"
          @change="change"
          use-default-slot>
          <view class="w-[170rpx] h-[170rpx] bg-slate-100 center rounded mx-[25rpx]">
            <wd-icon name="add" size="80rpx" color="#ddd" />
          </view>
        </wd-upload>
      </view>
    </view>

    <!-- 标题 -->
    <view class="text-center py-[10rpx]">
      <wd-button plain custom-class="!p-1 !h-[40rpx] !text-[#999]" size="small" type="info">
        <view v-if="props.formItem.required" class="inline-block text-red-500">*</view>
        {{ props.formItem.title }}
      </wd-button>
    </view>
    <view v-if="get(formItem, 'errorTip')" class="text-center text-red-500 h-[24rpx] leading-[3px]">
      {{ get(formItem, 'errorTip') }}
    </view>
  </view>
</template>

<script setup>
// 区别 uploadFile.vue 组件 减少webview的使用，减少DOM的移动操作，uniAPP 自带的chooseImage更好一点 这个wot-upload组件是基于chooseImage封装的
import { get, isString } from 'lodash'
import imgPreview from '@/components/g-preview-img/components/g-preview-img/g-preview-img.vue'
const props = defineProps(['formItem'])
const fileList = computed(() => lo.get(props, 'formItem'))
const action = qiniu.url
const count = computed(() => lo.get(props, 'formItem.count') || 999) // 默认没有上传个数限制
const header = { uid: util.getStore('uid') }
const formData = reactive({
  token: computed(() => qiniu.token.value)
})
const preview = ref(null)

util.onceShow(async () => {
  await qiniu.getToken()
})

async function change(files) {
  console.log(files, 3333);
  await qiniu.getToken()
  const item = files.fileList[files.fileList.length - 1]
  item.response = xx.toStringJSON(item.response)
  const resp = lo.get(item, 'response.data')

  // 后续加判空
  const file = {
    src: lo.get(resp, 'src'),
    path: item.path,
    fname: lo.get(resp, 'fname') || lo.get(resp, 'name'),
    name: lo.get(resp, 'fname') || lo.get(resp, 'name'),
    url: lo.get(resp, 'src')
  }
  console.log(file, props.formItem.value)

  if (lo.isArray(props.formItem.value)) {
    props.formItem.value.push(file)
  } else if (lo.isString(props.formItem.value)) {
    props.formItem.value = file.src
  } else if (lo.isUndefined(props.formItem.value)) {
    if (props.formItem.count == 1) {
      props.formItem.value = file.src
    } else {
      props.formItem.value = [file.src]
    }
  }
}

function remove(idx) {
  console.log(props.formItem.value, 3333)
  if (lo.isString(props.formItem.value)) {
    props.formItem.value = []
  }
  if (lo.isArray(props.formItem.value)) {
    props.formItem.value.splice(idx, 1)
  }
}

/**
 * @description 预览图片
 * @param {*} idx
 */
/**
 * @description 预览图片
 * @param {*} idx
 */
function previewImage(idx) {
  let imgList = []
  if (lo.isArray(props.formItem.value)) {
    imgList = props.formItem.value.map((n) => n.url || n.src || n)
  } else if (lo.isString(props.formItem.value)) {
    imgList = [props.formItem.value]
  }
  uni.previewImage({
    urls: imgList,
    current: idx,
    indicator: 'default',
    loop: true
  })
}
// function previewImage(idx) {
//   preview.value.handlePreviewImg(idx)
//   // uni.previewImage({
//   //   urls: props.formItem.value.map((n) => n.url),
//   //   current: idx,
//   //   indicator: 'default',
//   //   loop: true
//   // })
// }
</script>

<style lang="scss" scoped>
:deep(.wd-upload__preview) {
  @apply hidden;
}
:deep(.wd-upload__close) {
  @apply leading-[70rpx];
  @apply right-[20rpx];
  @apply text-[40rpx];
}
:deep(.wd-upload) {
  @apply justify-start;
}
</style>
