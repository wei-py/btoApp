<template>
  <view class="fullScreen bg-slate-200">
    <notice />
    <uniStep :step="_.step" />
    <uniForm :form="_.itemDetail">
      <template #title>
        <view class="h-[75rpx] flex items-center bg-[#ffab30] pl-[15px] text-white font-bold text-[30rpx] rounded-t">
          基本信息
        </view>
      </template>
    </uniForm>
    <uniForm :form="_.inquiry" title="预审" />
    <uniForm :form="_.customerInfo" title="客户信息" />
    <uniForm :form="_.survey" title="勘察" />
    <uniForm :form="_.contractSign" title="合同签约" />
    <uniForm :form="_.record" title="备案证及权属证明" />
    <uniForm :form="_.initReview" title="初设评审" />
    <uniForm :form="_.build" title="施工" />
    <uniForm :form="_.grid" title="并网" />
    <uniForm :form="_.ZYsettlement" title="直营结算" v-if="!_.isDLS" />
    <uniForm :form="_.DLSsettlement" title="供应商结算" v-if="_.isDLS" />
    <uniForm :form="_.electricityContract" title="购售电合同" />
  </view>
</template>

<script setup>
import notice from '@/components/notice.vue'
import uniStep from '@/components/uniStep.vue'
import uniForm from '@/components/uniForm.vue'
import {
  itemDetail,
  inquiry,
  customerInfo,
  survey,
  contractSign,
  record,
  initReview,
  build,
  grid,
  ZYsettlement,
  DLSsettlement,
  electricityContract
} from './itemDetail'

const statusDic = util.getStore('statusDic').data
const _ = util.data({
  itemDetail, // 基本信息
  inquiry, // 预审
  customerInfo, // 客户信息
  survey, // 勘察
  contractSign, // 合同签约
  record, // 备案证
  initReview, // 初设评审
  build, // 施工
  grid, // 并网
  ZYsettlement, // 直营结算
  DLSsettlement, // 供应商结算
  electricityContract // 购售电合同
})
_.isDLS = true // 显示直营结算还是供应商结算
_.hasPutApprovalConstructBtn = true // 显示提交审核按钮
_.step = '预审' // 步骤条

onShow(async () => {
  _.getData()
})

_.getData = async () => {
  const { data } = await http.post(`/order/search`, { queryTag: _.option.orderId, orderId: _.option.orderId })
  const item = lo.get(data, 'data.list.0')
  const currentOrderState = lo.get(item, 'currentOrderState.0')
  _.title('系统编号').value = lo.get(currentOrderState, 'orderId')
  _.title('当前状态').value = statusDic[lo.get(currentOrderState, 'stateId')]
  _.title('进件编号').value = lo.get(item, 'leaseReview.contractNumber') || '-'
  _.isDLS = lo.get(item, 'company.type') == 'DLS'
  _.hasPutApprovalConstructBtn = lo.get(item, 'hasPutApprovalConstructBtn')
  _.step = statusDic[lo.get(currentOrderState, 'stageId')] || ''

  for (const orderState of lo.get(item, 'orderStates')) {
    const taskId = lo.get(orderState, 'taskId')
    const stateId = lo.get(orderState, 'stateId')
    const stageId = lo.get(orderState, 'stageId')
    const value = statusDic[stateId] || '未开启'
    const title = statusDic[taskId] || statusDic[stageId] || ''
    _.title(title).value = value
    _.title(title).valueStyle = {
      color: util.color[util.statusColor(value)]
    }
  }
}
</script>

<style></style>
