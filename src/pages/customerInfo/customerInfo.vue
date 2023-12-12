<template>
  <view class="fullScreen bg-slate-200">
    <notice />
    <uniForm :form="_.lessorInfo" title="出租人信息">
      <!-- 身份证照片 👇 -->
      <template #idCard="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <view>身份证照片</view>
            <view class="flex-end">
              <wd-button plain custom-class="!p-1 !h-[40rpx]" size="small" type="warning">查看示例图</wd-button>
            </view>
          </view>
          <uniCard :form="scope.data" class="grid grid-cols-2"></uniCard>
        </uniCell>
      </template>

      <!-- 省市区 👇 -->
      <template #code="{ scope }">
        <uniCell>
          <view class="flex justify-between h-[70rpx] items-center">
            <view class="w-1/5">省市区</view>
            <view class="w-4/5 text-right">
              <wd-picker
                :columns="scope.columns"
                label=""
                v-model="scope.value"
                :column-change="scope.change"
                @confirm="scope.confirm"
                use-default-slot>
                <!-- {{ scope.displayArea(scope.value) }} -->
                {{ _.name('provinceCode').value }} - {{ _.name('cityCode').value }} - {{ _.name('areaCode').value }}
              </wd-picker>
            </view>
          </view>
        </uniCell>
      </template>
    </uniForm>

    <uniForm :form="_.bankInfo" title="租金收益银行卡">
      <!-- 银行卡照片 👇 -->
      <template #bankCardFrontSlot="{ scope }">
        <uniCell>
          <uniCard :form="scope.data" class="grid grid-cols-1 pt-[30rpx]"></uniCard>
        </uniCell>
      </template>

      <!-- 开户行名称 👇 -->
      <template #bankNameTitle="{ scope }">
        {{ scope.title }}
      </template>
      <template #bankNameValue="{ scope }">
        <view @tap="() => scope.tap()">
          <view v-if="scope.value">
            {{ scope.value }}
          </view>
          <view v-else class="text-gray-400">
            {{ scope.placeholder }}
          </view>
        </view>
        <wd-popup v-model="scope.popupShow" position="left" custom-class="w-full h-full !z-20">
          <view class="mx-auto w-[90%] relative">
            <wd-search
              custom-class="mt-[50rpx] !text-left sticky top-[65rpx] w-full "
              v-model="scope.searchTag"
              @change="() => scope.search()"
              @cancel="scope.popupShow = false" />
            <wd-radio-group @change="scope.popupShow = false" v-model="scope.value" checked-color="#ffab30">
              <template v-for="bankName of scope.bankNameList" :key="bankName">
                <wd-radio :value="bankName" class="box-shadow">
                  {{ bankName }}
                </wd-radio>
                <view class="splitLine h-[15rpx]"></view>
              </template>
            </wd-radio-group>
          </view>
        </wd-popup>
      </template>

      <!-- 开户支行 👇 -->
      <template #accountOpeningBranchTitle="{ scope }">
        {{ scope.title }}
      </template>
      <template #accountOpeningBranchValue="{ scope }">
        <view @tap="() => scope.tap()">
          <view v-if="scope.value">
            {{ scope.value }}
          </view>
          <view v-else class="text-gray-400">
            {{ scope.placeholder }}
          </view>
        </view>
        <wd-popup v-model="scope.popupShow" position="left" custom-class="w-full h-full !z-20">
          <view class="mx-auto w-[90%] relative">
            <wd-search
              custom-class="mt-[50rpx] !text-left sticky top-[65rpx] w-full "
              v-model="scope.searchTag"
              @change="() => scope.search()"
              @cancel="scope.popupShow = false" />
            <wd-radio-group @change="(e) => scope.change(e)" v-model="scope.fakeValue" checked-color="#ffab30">
              <template v-for="accountOpeningBranch of scope.accountOpeningBranchList" :key="accountOpeningBranch">
                <wd-radio
                  :value="accountOpeningBranch.bankNum + '==' + accountOpeningBranch.bankFullName"
                  class="box-shadow">
                  {{ accountOpeningBranch.bankFullName }}
                </wd-radio>
                <view class="splitLine h-[15rpx]"></view>
              </template>
            </wd-radio-group>
          </view>
        </wd-popup>
      </template>
    </uniForm>

    <uniForm :form="_.lesseeInfo" title="承租人"></uniForm>
    <uniForm :form="_.productWithArea" title="安装地区"></uniForm>

    <uniBtn />
  </view>
</template>

<script setup>
import uniCell from '@/components/uniCell.vue'
import uniCard from '@/components/uniCard.vue'
import notice from '@/components/notice.vue'
import uniForm from '@/components/uniForm.vue'
import uniBtn from '@/components/uniBtn/uniBtn.vue'
import { lessorInfo, bankInfo, lesseeInfo, productWithArea } from './customerInfo'

const _ = util.data({ lessorInfo, bankInfo, lesseeInfo, productWithArea })

util.onceShow(async () => {
  await _.getData()
})

_.getData = async () => {
  const params = xx.serialize({ orderId: _.option.orderId })
  const { data } = await http.get('order/get-customer-info?' + params)
  util.initRoot(_, data.data)
  _.name('code').value = ['provinceCode', 'cityCode', 'areaCode'].map((n) => _.name(n).value)
}

_.save = async () => {
  const params = util.getParams(_)
  const { data } = await http.post('order/put-customer-info', params)
  util.toastSave(data)
}

_.putApproval = async () => {
  const { data } = await http.post(`approval/put-approval/bto/customer?orderId=${_.option.orderId}`)
  util.toastPutApproval(data)
}

_.approval = async (params) => {
  const { data } = await http.post(`approval/do-approval/bto/customer`, params)
  util.toastApproval(data)
}
</script>

<style lang="scss" scoped>
:deep(.wd-picker__arrow) {
  display: none;
}
</style>
