<template>
  <view>
    <wd-overlay :show="overlayShow" :zIndex="999" customStyle="background: rgba(20, 20, 20, 0.8)" />

    <!---------------- toast ---------------->
    <wd-toast />
    <!---------------- toast ---------------->

    <!---------------- mexssage ---------------->
    <wd-message-box use-slot selector="notice">
      <slot name="message" />
    </wd-message-box>
    <!---------------- mexssage ---------------->
  </view>
</template>

<script setup>
import { util } from '@/utils/util'
////////////// wd-overlay //////////////
const overlayShow = ref(false)
util.showOverlay = () => {
  overlayShow.value = true
}
util.hiddenOverlay = () => {
  util.setTimeout(() => {
    overlayShow.value = false
  }, 500)
}
//  computedAsync(() => util.wdOverlay)

////////////// wd-toast //////////////
const toast = wot.useToast()
util.toast = toast

////////////// wd-message-box //////////////
const message = wot.useMessage('notice')
util.messageCallback = ({ title, msg, confirmText: confirmButtonText, cancelText: cancelButtonText }) => {
  return new Promise((resolve) => {
    message
      .confirm({
        title,
        msg,
        confirmButtonText,
        cancelButtonText
      })
      .then((resp) => {
        resolve(true)
      })
      .catch((error) => {
        resolve(false)
      })
  })
}
////////////// wd-message-box //////////////

util.onceShow(() => {
  // console.log(util._, '根')
})
</script>

<style lang="scss" scoped>
////////////// wd-message-box //////////////

:deep(.wd-message-box__actions) {
  * {
    background: #ffab30 !important;
    color: white;
  }
}
:deep(.wd-popup--center) {
  top: 40%;
}
:deep(.wd-message-box__container) {
  width: 550rpx;
}

////////////// wd-message-box //////////////
</style>
