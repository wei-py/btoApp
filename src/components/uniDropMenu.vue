<template>
  <view>
    <wd-drop-menu>
      <wd-drop-menu-item
        v-model="value"
        :options="option"
        @change="handleChange" />
      <wd-drop-menu-item title="筛选" ref="dropMenu">
        <view>
          <wd-cell title="标题文字" value="内容" />
          <wd-cell title="标题文字" label="描述信息" value="内容" />
          <wd-button block size="large" suck @click="confirm">
            主要按钮
          </wd-button>
        </view>
      </wd-drop-menu-item>
    </wd-drop-menu>
  </view>
</template>

<script setup>
const dropMenu = ref()

const value = ref(0)
const option = ref([
  { label: '全部商品', value: 0 },
  { label: '新款商品', value: 1 },
  { label: '活动商品', value: 2 }
])
function handleChange({ value }) {
  console.log(value)
}

function confirm() {
  dropMenu.value.close()
}
</script>
