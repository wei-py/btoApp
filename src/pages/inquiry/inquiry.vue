<template>
  <view class="fullScreen bg-slate-200">
    <notice />
    <uniForm :form="_.lessorInfo" title="出租人信息" />
    <uniForm :form="_.salespersonInfo" title="销售人员信息" />
    <uniForm :form="_.guarantor" title="保证人" />
    <uniForm :form="_.signInfo" title="授权协议签署">
      <template #signeType="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <view>{{ scope.title }}</view>
            <view class="flex-end">
              <wd-radio-group
                v-model="scope.value"
                shape="button"
                checked-color="#fff"
                :disabled="get(scope, 'disabled')">
                <wd-radio value="sms">短信签署</wd-radio>
                <wd-radio value="app">App</wd-radio>
              </wd-radio-group>
            </view>
          </view>
          <view v-if="scope.value && _.name('fddSignTaskId').hasFdd" class="text-end py-[5px]">
            <wd-button @tap="signContract" custom-class="!bg-[#ffab30] !text-white" type="warning">开始签署</wd-button>
          </view>
        </uniCell>
      </template>
    </uniForm>
    <uniBtn />
  </view>
</template>

<script setup>
import uniCell from '@/components/uniCell.vue'
import notice from '@/components/notice.vue'
import uniForm from '@/components/uniForm.vue'
import uniBtn from '@/components/uniBtn/uniBtn.vue'
import { get } from 'lodash'
import { lessorInfo, salespersonInfo, guarantor, signInfo } from './inquire'
import { util } from '@/utils/util'

const _ = util.data({ lessorInfo, salespersonInfo, guarantor, signInfo })
_.orderState = {} // 订单状态

util.onceShow(() => {
  if (_.option.orderId) {
    // 从列表中跳转过来
    _.getData()
  } else {
    // 从新建中跳转过来
    _.btns = { hasEditBtn: true, canEdit: true }
  }
})



_.getData = async () => {
  if (_.option.orderId) {
    const { data } = await http.get(`order/get-pre-approval?orderId=${_.option.orderId}`)
    util.initRoot(_, data.data)
    console.log(util.getParams(_));
    _.orderState = data.data.orderState
    await returnFile(data.data)
  } else {
    _.name('fddSignTaskId').value = '0'
    _.orderState = {
      taskId: 'TASK_YSXX',
      stateId: 'WAITING_FILLED'
    }
  }
}

/**
 * @description 保存预审信息，其中只校验姓名、身份证和出租员电话是否有填写
 * @param {*} toastShow 保存是否要有提示 toast
 */
_.save = async (toastShow = true) => {
  const validMessage = ['name', 'idNumber', 'phone'].map((n) => util.validFormItem(_.name(n)))
  if (!validMessage.every((n) => lo.isEmpty(n))) {
    util.toast.error('校验不通过')
    return
  }

  const params = util.getParams(_)
  const { data } = await http.post('order/put-pre-approval', params)
  if (toastShow) {
    util.toastSave(data)
  }
  _.option.orderId = data.data
}

_.putApproval = async () => {
  await _.save(false)
  util.valid(_)
  const { data } = await http.post(`approval/put-approval/lease/pre-approval?orderId=${_.option.orderId}`)
  if (data.code == 200) {
    util.toastPutApproval(data)
    util.go('/itemDetail/itemDetail', { orderId: _.option.orderId })
  }
}

async function returnFile(data) {
  if (data.fddSignTaskId && !data.authorizationLetter) {
    const { data } = await http.get(`fdd/get-preview-url?orderId=${_.option.orderId}`)
    if (data.code == 200) {
      await qiniu.getToken()
      const filePath = await util.downFile(data.data, '信息使用授权协议.pdf')
      uni.uploadFile({
        url: qiniu.url,
        filePath: filePath,
        name: 'file',
        formData: { token: qiniu.token },
        success(uploadFileRes) {
          const resp = xx.toStringJSON(uploadFileRes.data)
          _.name('authorizationLetter').value = resp.data.src
          _.name('fddSignTaskId').value = '已签署'
        },
        fail(error) {
          console.log(error)
        }
      })
    }
  }
}

/**
 * @description 开始签约按钮事件
 */
async function signContract() {
  await _.save()
  const params = util.getParams(_)

  const newSign = async () => {
    const signeType = params.signeType
    let query = xx.serialize({ orderId: _.option.orderId, signeType })
    const { data } = await http.get(`fdd/get-actor-url?${query}`)
    if (data.code == 200) {
      const flag = await util.messageCallback({
        title: '是否跳转至签署页面',
        msg: ''
      })
      if (flag) {
        util.openUrl(data.data.actorSignTaskEmbedUrl)
      } else {
        _.name('authorizationLetter').value = data.authorizationLetter
      }
    }
  }

  // 查询客户是否已经法大大签约
  const { data } = await http.get('customer/fdd-signed?' + xx.serialize({ idNumber: params.idNumber }))
  if (lo.get(data, 'data.authorizationLetter')) {
    const flag = await util.messageCallback({
      title: '该客户已签署信息使用授权书, 是否使用已有的授权书',
      confirmText: '使用',
      cancelText: '不使用'
    })
    if (flag) {
      _.name('authorizationLetter').value = data.data.authorizationLetter
      console.log()
      _.name('fddSignTaskId').value = data.data.fddSignTaskId
      _.name('signeType').value = data.data.signingType
    } else {
      newSign()
    }
  } else {
    newSign()
  }
}
</script>

<style scope lang="scss">
:deep(.is-checked) {
  .wd-radio__label {
    background-color: #ffab30 !important;
  }
}
</style>
