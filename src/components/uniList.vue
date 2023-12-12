<template>
  <view v-if="list.data.length > 0">
    <view v-for="(item, index) in list.data" :key="index">
      <slot :item="item"></slot>
    </view>
  </view>
  <wd-loadmore custom-class="loadmore" :state="wdStatus[list.status]" />
  <!-- <uni-load-more :status="list.status" v-if="props.data.length == 0" :contentText="list.contentText"></uni-load-more> -->
</template>

<script setup>
// 普通的不调接口只接收data，动态的列表 通过request 去操作
const props = defineProps({
  data: {
    type: Array,
    default: []
    // default: [{ orderBase: {}, currentOrderState: [{ stageId: '' }], customer: {} }]
  }
})

const emit = defineEmits(['request'])
const wdStatus = ref({
  more: 'loading',
  noMore: 'finished',
  error: 'error'
})
const list = reactive({
  data: props.data,
  total: props.data.length,
  page: 0,
  limit: 10,
  status: 'more',
  contentText: {
    contentnomore: '到底了'
  }
})

async function search(filter = {}) {
  list.page = 1
  list.limit = 10

  emit('request', list.page, list.limit, filter, (data, total = 0) => {
    if (data) {
      list.data = data.map((n, idx) => {
        return {
          ...n,
          idx: idx + 1,
          desIdx: total - idx
        }
      })
      list.total = total
      list.status = list.data.length >= list.total ? 'noMore' : 'more'
    } else {
      list.contentText.contentnomore = '数据请求失败，请点击重新获取'
    }
  })
}

async function getData(page, limit, filter) {
  if (list.data.length < list.total) {
    list.page = page || list.page + 1
    list.limit = limit || list.limit
    list.status = 'loading'
    emit('request', list.page, list.limit, filter, (data, total) => {
      if (data) {
        list.data = [...list.data, ...data].map((n, idx) => {
          return {
            ...n,
            idx: idx + 1,
            desIdx: total - idx
          }
        })
        list.total = total
        list.status = list.data.length >= list.total ? 'noMore' : 'more'
      } else {
        list.status = 'error'
        list.contentText.contentnomore = '数据请求失败，请点击重新获取'
      }
    })
  }
  return
}
// onMounted(()=> {
//   emit("request",1,10,(data,total) => {
//     list.data = data
//     list.total = total
//     list.status = list.data.length >= list.total ? 'noMore' : 'more'
//   })
// })
defineExpose({
  getData,
  search
})
</script>

<style></style>
