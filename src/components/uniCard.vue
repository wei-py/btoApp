<template>
  <view>
    <template v-for="formItem of props.form" :key="formItem.name">
      <uploadFile v-if="formItem.formType == 'file'" :formItem="formItem" />
      <uploadImg v-if="formItem.formType == 'img'" :formItem="formItem" />
    </template>
  </view>
</template>

<script setup>
import { get } from 'lodash'
import uploadFile from './uploadFile.vue'
import uploadImg from './uploadImg.vue'
const props = defineProps(['form'])
</script>

<style lang="scss" scoped></style>
