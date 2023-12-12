<template>
  <view>
    <web-view :src="url" :update-title="false" />
  </view>
</template>

<script setup>
const url = ref('')
onLoad((options) => {
  if (options.pdfUrl) {
    util.setTitle(options.pdfUrl.replace(/.*\/(.*?).pdf/, '$1.pdf'))
  }
  if (options.pdfUrl) {
    url.value = 'http://pdf.view.315mao.com/web/viewer.html?file=' + options.pdfUrl
  }
  if (options.url) {
    url.value = options.url
  }
})
</script>

<style></style>
