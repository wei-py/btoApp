<template>
  <view :class="get(props, 'formItem.customClass')">
    <view class="flex flex-wrap justify-center">
      <!-- 显示文件 -->
      <template v-if="isString(fileList) && fileList.length">
        <!-- <imgPreview :imgList="[fileList]" ref="preview" /> -->
        <view class="h-[170rpx] xCenter w-1/3 mb-[10rpx]">
          <view
            v-if="(fileList, 'name').endsWith('pdf')"
            @tap="util.go('/pages/webview/uniWebView?pdfUrl=' + file.url)"
            class="h-[170rpx] w-[170rpx] rounded bg-[#ff211c] text-white inline-flex items-center justify-center">
            <view class="!text-center"></view>
          </view>
          <image
            v-else
            :src="fileList"
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
      <template v-else-if="isArray(fileList) && fileList.length">
        <template v-for="(file, idx) of fileList" :key="file.name">
          <view class="relative h-[170rpx] xCenter w-1/3 mb-[10rpx]">
            <!-- PDF文件 -->
            <template v-if="(get(file, 'name') + '').endsWith('pdf')">
              <view
                @tap="util.go('/pages/webview/uniWebView?pdfUrl=' + file.url)"
                class="h-[170rpx] w-[170rpx] rounded bg-[#ff211c] text-white inline-flex items-center justify-center">
                <view class="!text-center"></view>
              </view>
              <wd-icon
                @tap="remove(idx)"
                name="error-fill"
                size="40rpx"
                class="relative leading-[50rpx] left-[60rpx] h-[20rpx]"
                color="#545657" />
            </template>

            <!-- 图片文件 -->

            <template v-else>
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
            <!-- <image
            v-else-if="isString(file)"
            :src="file"
            @tap="previewImage(idx)"
            class="h-[170rpx] w-[170rpx] inline-block rounded absolute bg-slate-100"
            mode="aspectFit" />
          <image
            v-else
            :src="file.path || file.url || file.src"
            @tap="previewImage(idx)"
            class="h-[170rpx] w-[170rpx] inline-block rounded absolute bg-slate-100"
            mode="aspectFit" /> -->
            <!-- 删除按钮 -->
          </view>
        </template>
      </template>

      <!-- 上传方框 -->
      <view v-if="get(props, 'formItem.value.length', 0) < count" class="xCenter w-1/3 mb-[10rpx]">
        <lsjUpload
          :childId="props.formItem.name"
          :option="option"
          :ref="setRef"
          width="170rpx"
          height="170rpx"
          @change="change"
          @uploadEnd="uploadEnd">
          <view class="w-[170rpx] h-[170rpx] bg-slate-100 center rounded">
            <wd-icon name="add" size="80rpx" color="#ddd" />
          </view>
        </lsjUpload>
      </view>
    </view>

    <!-- 标题 -->
    <view class="text-center py-[10rpx]">
      <wd-button plain custom-class="!p-1 !h-[40rpx] !text-[#999]" size="small" type="info">
        <view v-if="props.formItem.required" class="inline-block text-red-500">*</view>
        {{ props.formItem.title }}
      </wd-button>
    </view>
  </view>
</template>

<script setup>
import { get, isString, isArray } from 'lodash'
import lsjUpload from './lsj-upload/components/lsj-upload/lsj-upload.vue'
const props = defineProps(['formItem'])
// const emit = defineEmits(['update:formItem'])
// const formItem = useVModel(props, 'formItem', emit)
const fileList = computed(() => lo.get(props, 'formItem.value'))
const count = computed(() => lo.get(props, 'formItem.count') || 999) // 默认没有上传个数限制
const curDom = ref() // 当前组件的DOM
// 配置项
const option = reactive({
  url: qiniu.url,
  token: computedAsync(() => qiniu.token.value),
  name: 'file',
  header: { uid: util.getStore('uid') },
  list: [],
  count: 999,
  value: [],
  // 自定义 body 参数
  formData: { token: computed(() => qiniu.token.value) }
})

/**
 * @description 一个页面可能有多个上传组件，由于uniApp webview的原因 只能每一次上传后需要调整位置
 * @param {DOM} el
 */
const setRef = (el) => {
  if (el) {
    curDom.value = el
    qiniu.fileDoms.value.push(el)
  }
}
let timer = null // 临时定时器置空用

util.onceShow(async () => {
  // 获取token
  await qiniu.getToken()
  // 每一秒都调整 webview
  timer = setInterval(() => {
    moveDom()
  }, 1000)
})

// 清空处理
onUnmounted(() => {
  qiniu.fileDoms.value.length = 0
  timer = null
  clearInterval(timer)
})

/**
 * @description 选中上传
 * @param {} files
 * @param {*} id
 */
function change(files, id) {
  // if (props.formItem.value.length > count.value) {
  //   util.toast.error('上传最多是' + count.value + '张图片')
  //   return
  // }
  if (!lo.isMap(files)) return
  curDom.value.upload()
}

// if (props.formItem.name == 'rejectFiles') {
//   util._.btns.rejectReason.rejectFiles = computedAsync(() => props.formItem.value || [])
// }

/**
 * @description 上传结束
 */
async function uploadEnd(item) {
  item.responseText = xx.toStringJSON(item.responseText)
  const resp = lo.get(item, 'responseText.data')
  // 后续加判空

  const file = {
    src: lo.get(resp, 'src'),
    path: item.path,
    fname: lo.get(resp, 'fname') || lo.get(resp, 'name'),
    name: lo.get(resp, 'fname') || lo.get(resp, 'name'),
    url: lo.get(resp, 'src')
  }

  if (lo.isArray(props.formItem.value)) {
    props.formItem.value.push(file)
    // console.log(formItem.value, 3333);
    // props.formItem.value.push(file)
  } else if (lo.isString(props.formItem.value)) {
    props.formItem.value = file.src
  } else if (lo.isUndefined(props.formItem.value)) {
    if (props.formItem.count == 1) {
      props.formItem.value = file.src
    } else {
      props.formItem.value = [file.src]
    }
  }

  await qiniu.getToken()
}
function remove(idx, name) {
  if (lo.isString(props.formItem.value)) {
    props.formItem.value = ''
  }
  if (lo.isArray(props.formItem.value)) {
    props.formItem.value.splice(idx, 1)
  }
  // if (props.formItem.name == 'rejectFiles') {
  //   // props.formItem.value.splice(idx, 1)
  //   util._.btns.rejectReason.rejectFiles.splice(idx, 1)
  // }

  // curDom.value.clear(name)
  moveDom()
}

/**
 * @description 移动调整 webview 的位置
 */
function moveDom() {
  nextTick(() => {
    if (qiniu.fileDoms.value.length) {
      qiniu.fileDoms.value.forEach(async (dom) => {
        if (dom.lsjFile.dom.setStyle) {
          dom.getDomStyles((e) => {
            dom.lsjFile.dom.setStyle(e)
          })
        }
      })
    }
  })
}

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
</script>
