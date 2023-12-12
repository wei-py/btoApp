<template>
  <view class="w-full grid-cols-3 grid gap-[10rpx]">
    <!-- :disabled="props.item.limit == props.item.value.length" -->
    <view
      class="w-[170rpx] h-[170rpx] !z-10 inline-flex relative border-gray-1"
      v-for="(img, idx) in props.item.value"
      :key="idx">
      <wd-icon
        v-if="formShow && props.item.name != 'rejectFiles'"
        name="clear"
        size="1.5rem"
        color="#666"
        class="absolute top-0 right-0"
        style="z-index: 99 !important"
        @tap.stop="remove(idx, img.name)" />
      <wd-icon
        v-if="approvalShow && props.item.name == 'rejectFiles'"
        name="clear"
        size="1.5rem"
        color="#666"
        class="absolute top-0 right-0"
        style="z-index: 99 !important"
        @tap.stop="remove(idx, img.name)" />
      <view
        v-if="img?.name?.endsWith('pdf')"
        @tap.stop="util.go('/pages/webview/uniWebView?pdfUrl=' + img.url)"
        class="h-[170rpx] !z-10 w-[170rpx] rounded bg-[#ff211c] text-white inline-flex items-center justify-center">
        <view class="!text-center">
          {{ img.name }}
        </view>
      </view>
      <image
        v-else
        @tap.stop="previewImage(idx)"
        :src="img.url || img.path || img.src"
        mode="aspectFill"
        class="h-[170rpx] w-[170rpx] !z-10 leading-[180rpx]"></image>
    </view>
    <lsj-upload
      v-if="formShow && props.item.name != 'rejectFiles'"
      v-bind="props.item"
      :childId="props.item.name"
      width="170rpx"
      height="170rpx"
      :ref="setItemRef"
      :class="props.item.class"
      class="border-gray-1 inline-block z-index"
      @uploadEnd="(e) => (props.item?.uploadEnd ? props.item.uploadEnd(e) : uploadEnd(e))"
      @change="(e) => (props.item?.change ? props.item.change(e) : change(e))">
      <view class="w-[170rpx] h-[170rpx] rounded inline-flex justify-center items-center">
        <wd-icon name="plus" color="#f1f1f1" class="!text-[60px]"></wd-icon>
      </view>
    </lsj-upload>
    <lsj-upload
      v-if="approvalShow && props.item.name == 'rejectFiles'"
      v-bind="props.item"
      :childId="props.item.name"
      width="170rpx"
      height="170rpx"
      :ref="setItemRef"
      :class="props.item.class"
      class="border-gray-1 inline-block z-index"
      @uploadEnd="(e) => (props.item?.uploadEnd ? props.item.uploadEnd(e) : uploadEnd(e))"
      @change="(e) => (props.item?.change ? props.item.change(e) : change(e))">
      <view class="w-[170rpx] h-[170rpx] rounded inline-flex justify-center items-center">
        <!-- <uv-icon name="plus" color="#f1f1f1" class="!text-[60px]"></uv-icon> -->
      </view>
    </lsj-upload>
  </view>
</template>

<script setup>
// import { getCurrentInstatnce } from 'vue'
import lsjUpload from '@/components/lsj-upload/components/lsj-upload/lsj-upload.vue'
import { util } from '@/utils/util'
// const props = defineProps(['item', 'top'])
const props = defineProps({
  item: { default: { name: '-' } }
})

// const qiniu = qiniuStore()
const refList = ref([])

const approvalShow = computed(() => lo.get(util, '_.btns.canApprovalModule'))
const formShow = computedAsync(() => lo.get(util, '_.btns.canEdit'))

onLoad(() => {
  setTimeout(() => {
    console.log(util._, 3333)
  }, 3000)
})

// console.log(, 99999);
props.item.option = {
  ...props.item.option,
  url: qiniu.url,
  name: 'file',
  header: { uid: uni.getStorageSync('uid') },
  list: [],
  count: 999,
  value: [],
  // 自定义 body 参数
  formData: {
    token: qiniu.token
  }
}
// const qiniu = userStore()
const curDom = ref()
let timer = null

onLoad(async () => {
  await qiniu.getToken()
  props.item.option.formData.token = qiniu.token
  timer = setInterval(() => {
    moveDom()
  }, 1000)
})

onUnmounted(() => {
  qiniu.fileDoms.length = 0
  timer = null
  clearInterval(timer)
})

const setItemRef = (el) => {
  if (el) {
    refList.value.push(el)
    curDom.value = el
    qiniu.fileDoms.push(el)
  }
}

/**
 * @description 选中
 * @param {*} files 文件
 * @param {*} id 文件 id
 */
function change(files, id) {
  // if (props.item, 9999)
  if (!lo.isMap(files)) return
  if (props.item.disabled) {
    util.notice({ message: '上传已禁用', type: 'error' })
    return
  }
  uni.showLoading({ title: '上传中' })

  curDom.value.upload()
  // for (let i = 0; i < refList.value.length; i++) {
  //   const dom = refList.value[i]
  //   dom.lsjFile.option = props.item.option
  //   dom.upload()
  // }
}

/**
 * @description 结束回调
 */
async function uploadEnd(item, index, idx, id, multiple) {
  uni.hideLoading()
  await qiniu.getToken()
  props.item.option.formData.token = qiniu.token
  item.responseText = xx.toStringJSON(item.responseText)
  props.item.value.push({
    src: item.responseText.data.src,
    path: item.path,
    fname: item.responseText.data.fname,
    name: item.responseText.data.fname,
    url: item.responseText.data.src
  })
  // getApp().$forceUpdate()
}

function remove(idx, name) {
  curDom.value.clear(name)

  props.item.value.splice(idx, 1)
  nextTick(() => {
    moveDom()
  })
}

function moveDom() {
  nextTick(() => {
    if (qiniu.fileDoms.length) {
      // console.log(qiniu.fileDoms, 99999)
      qiniu.fileDoms.forEach(async (dom) => {
        if (dom.lsjFile.dom.setStyle) {
          dom.getDomStyles((e) => {
            dom.lsjFile.dom.setStyle(e)
          })
        }
      })
    }
  })
}

function previewImage(idx) {
  uni.previewImage({
    urls: props.item.value.map((n) => n.url),
    current: idx,
    indicator: 'default',
    loop: true
  })
}
</script>

<style scoped lang="scss">
:deep(.uv-icon) {
  * {
    font-size: 140rpx !important;
  }
}

// :deep(.uni-icons) {
//   color: gray !important;
// }
// @apply border-;
.border-gray-1 {
  @apply border;
  @apply border-dashed;
  @apply border-gray-200;
}

.z-index {
  z-index: 0 !important;
  * {
    z-index: 0 !important;
  }
}
</style>
