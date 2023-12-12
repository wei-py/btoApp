<template>
  <view class="fullScreen bg-gray-200">
    <view class="text-[30rpx] text-center leading-[200rpx] text-white bgImg h-[30vh] mb-[80rpx]">个人中心</view>
    <view class="rounded-xl mx-auto w-[650rpx] h-[550rpx] mt-[-300rpx] bg-white flex flex-col">
      <view>
        <view class="text-center text-[30rpx] h-[50rpx] pt-[80rpx]">
          {{ user.name }}
        </view>
        <view class="text-center text-[22rpx] h-[30rpx] text-gray-500">
          {{ user.company.name }}
        </view>
      </view>
      <view class="flex-1 flex flex-col justify-center">
        <uniForm :form="_.person" class="flex-end">
          <template #env="{ scope }">
            <uniCell>
              <view class="flex justify-between h-[70rpx] items-center">
                <view>{{ scope.title }}</view>
                <view v-if="who == 'prod'">生产环境</view>
                <view v-else class="flex-end">
                  <wd-radio-group v-model="who" shape="button" checked-color="#ffab30" @change="scope.change">
                    <template v-for="n of scope.list" :key="n">
                      <wd-radio :value="n">{{ n }}</wd-radio>
                    </template>
                  </wd-radio-group>
                </view>
              </view>
            </uniCell>
          </template>
        </uniForm>
      </view>
    </view>
    <view
      @tap="logout"
      class="w-[650rpx] text-center h-[60rpx] rounded mt-[50rpx] bg-[#ffab30] text-white mx-auto center">
      退出登录
    </view>
  </view>
</template>
<script setup>
import uniForm from '@/components/uniForm.vue'
import uniCell from '@/components/uniCell'
import { person } from './person'
import { who } from '@/config/request'
const _ = util.data({ person })
const user = util.getStore('user')

function logout() {
  util.go('/login/login')
}
</script>

<style scoped lang="scss">
.bgImg {
  background: #fff url('@/static/background/login.png') center no-repeat;
  border-bottom-right-radius: 50% 100rpx;
  border-bottom-left-radius: 50% 100rpx;
}
:deep(.wd-icon-user-circle) {
  font-size: 40rpx;
  margin-left: -10rpx;
}

:deep(.wd-icon-lock-on) {
  font-size: 40rpx;
  margin-left: -10rpx;
}

:deep(.wd-icon-arrow-right) {
  color: #808080 !important;
  font-size: 25rpx;
}
</style>
