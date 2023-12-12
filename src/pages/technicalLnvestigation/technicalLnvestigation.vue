<template>
  <view class="fullScreen bg-slate-200">
    <notice />
    <uniForm title="指派技术勘察员" :form="_.reconnaissanceUserForm">
      <template #appointBtn="{ scope }">
        <uniCell>
          <view class="xCenter">
            <wd-button
              @tap="() => scope.tap()"
              :custom-class="['!text-white', scope.disabled ? '!bg-[#ffd494]' : '!bg-[#ffab30]'].join(' ')"
              type="warning"
              :disabled="scope.disabled">
              {{ scope.value }}
            </wd-button>
          </view>
        </uniCell>
      </template>
    </uniForm>
    <view v-if="get(_, 'orderState.stateId') != 'WAITING_APPOINT'">
      <uniForm title="基本信息" :form="_.basicMessageForm"></uniForm>
    </view>
    <uniBtn />
  </view>
</template>

<script setup>
import { get } from 'lodash'
import uniCell from '@/components/uniCell.vue'
import uniCard from '@/components/uniCard.vue'
import notice from '@/components/notice.vue'
import uniForm from '@/components/uniForm.vue'
import uniBtn from '@/components/uniBtn/uniBtn.vue'
import { reconnaissanceUserForm, basicMessageForm } from './technicalLnvestigation'

const _ = util.data({ reconnaissanceUserForm, basicMessageForm })

util.onceShow(async () => {
  await _.getData()
})

_.getData = async () => {
  const url = 'order/get-tec-kancha'
  const params = xx.serialize({ orderId: _.option.orderId })
  const { data } = await http.get(url + '?' + params)
  data.data = { ...data.data, ...data.data.appointUser }
  _.orderBase = data.data.orderBase

  util.initRoot(_, data.data)
}

_.save = async (params) => {
  const url = 'order/put-tec-kancha'
  const { data } = await http.post(url, params)
  util.toastSave(data)
}

_.putApproval = async (params) => {
  const url = 'approval/put-approval/pre/takan'
  const { data } = await http.post(url + '?' + params)
  util.toastPutApproval(data)
}

_.approval = async (params) => {
  const url =
    params.approvalType == 'APPROVAL_BTO' ? 'approval/do-approval/bto/takan' : 'approval/do-approval/pre/takan'
  const { data } = await http.post(url, params)
  util.toastApproval(data)
}
</script>

<style scope lang="scss"></style>
