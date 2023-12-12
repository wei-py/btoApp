<template>
  <view class="w-[100vw] h-[100vh] flex flex-col">
    <notice />
    <!-- 背景 -->
    <view class="bgImg center">
      <img src="../../static/background/btoWhiteLogo.png" class="h-[150rpx] w-[150rpx] rounded-lg" />
    </view>

    <!-- 登录框 -->
    <view class="h-[53%] pt-[100rpx]">
      <view class="px-[50rpx]">
        <view class="h-[90rpx] rounded-lg bg-slate-100 mt-[20rpx] yCenter pl-[20rpx]">
          <wd-icon name="user" color="#ffab30" size="40rpx" />
          <uniCombox
            v-model="user.phone"
            :candidates="phoneCandidates"
            @input="phoneInput"
            class="w-full !pl-[10rpx]"
            placeholder="请输入账号" />
        </view>
        <view class="h-[90rpx] rounded-lg bg-slate-100 mt-[20rpx] yCenter pl-[20rpx]">
          <wd-icon v-if="loginMode" name="lock-on" color="#ffab30" size="40rpx" />
          <wd-icon v-if="!loginMode" name="code" color="#ffab30" size="40rpx" />
          <uni-easyinput
            v-if="loginMode"
            type="password"
            padding
            v-model="user.password"
            class="!border-0 pr-[3rpx]"
            placeholder="请输入密码"></uni-easyinput>
          <uni-easyinput
            v-if="!loginMode"
            padding
            v-model="user.code"
            class="!border-0 pr-[3rpx]"
            placeholder="请输入验证码"></uni-easyinput>
          <wd-button v-if="!loginMode" @tap="getCode" type="text" custom-class="!text-[#ffab30]" class="mr-[20rpx]">
            {{ getCodeOrLoading }}
          </wd-button>
        </view>

        <view class="px-[15rpx] mt-[20rpx]">
          <view v-if="loginMode" class="flex justify-between items-center">
            <wd-checkbox v-model="isRemeberPassword" checked-color="#ffab30" shape="square">记住密码</wd-checkbox>
            <view class="flex-end">
              <wd-button type="text" custom-class="!text-[#444]">忘记密码</wd-button>
            </view>
          </view>
        </view>

        <wd-button @tap="login" size="large" custom-class="!bg-[#ffab30] !text-white !w-full mt-[20rpx]" type="info">
          登录
        </wd-button>
        <view class="mt-[30rpx]"></view>
        <uniCell v-if="who != 'prod'">
          <view class="flex justify-between h-[70rpx] items-center">
            <view>当前环境</view>
            <view class="flex-end">
              <wd-radio-group
                v-model="who"
                shape="button"
                checked-color="#ffab30"
                @change="person[person.length - 1].change">
                <template v-for="n of person[person.length - 1].list" :key="n">
                  <wd-radio :value="n">{{ n }}</wd-radio>
                </template>
              </wd-radio-group>
            </view>
          </view>
        </uniCell>
      </view>
    </view>

    <!-- 更换其他登录方式 -->
    <wd-divider color="#ccc">其他登录方式</wd-divider>
    <view class="center h-[15%] flex flex-col" @tap="changeLoginMode">
      <view class="p-[5rpx] pt-[10rpx] bg-pink-50 rounded-full">
        <wd-img width="80rpx" height="80rpx" mode="aspectFit" src="../../static/icons/loginRegister/phone.png" />
      </view>
      <view class="pt-[15rpx] text-[#ccc]">
        {{ loginMode ? '验证码登录' : '密码登录' }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { who } from '@/config/request'
import { person } from '../index/person'
import notice from '@/components/notice.vue'
import uniCell from '@/components/uniCell'
import uniCombox from '@/components/uni-combox/components/uni-combox/uni-combox.vue'
const isRemeberPassword = ref(true) // 是否记住密码
const getCodeOrLoading = ref('获取验证码') // 获取验证码的显示和倒计时
const loginMode = ref(true) // 登录模式  账号登录和验证码登录
let phoneCandidates = ref([]) // 账号可填可选的备选项
const user = reactive({
  // 用户登录信息
  phone: '', // 账号
  password: '', // 密码
  code: '', // 验证码
  type: 'password' // 后端需要的标志位 区别登录模式
})

util.onceShow(async () => {
  // 初始化登录账号选项
  const accountList = util.getStore('account') || []
  const phoneList = accountList.map((n) => n.phone)
  phoneCandidates.value = (phoneList || [])
  if (accountList.length) {
    user.phone = accountList[0].phone
    user.password = accountList[0].password
  }
})

async function login() {
  const { data } = await http.post('/login', user)
  if (data.code == 200) {
    // 缓存token
    const loginInfo = lo.pick(data.data, 'access_token', 'refresh_token', 'uid')
    util.setStore(loginInfo)
    // 记住密码保存起来 lo.uniq是去重方法
    const accountList = util.getStore('account') || []
    accountList.unshift(lo.pick(user, ['phone', 'password']))
    util.setStore({ account: lo.uniqBy(accountList, (n) => n.phone) })

    // 初始化 token
    initToken()
    {
      // 请求用户基本信息并保存起来
      const { data } = await http.get('user/my-user')
      uni.setStorageSync('user', data.data)
    }
    util.toast.success('登录成功')
    uni.switchTab({ url: '/pages/index/index' })
  }
}

function phoneInput(phone) {
  // 账号输入恰好有缓存的密码直接使用缓存的密码
  const accountList = (util.getStore('account') || []).filter((n) => n.phone == phone)
  if (accountList.length == 1) {
    lo.set(user, 'password', accountList[0].password)
  }
}

function getCode() {
  // 校验手机号码格式
  if (!isPhoneNumber(user.phone)) {
    util.toast.error('请输入手机号码')
    return
  }
  // 倒计时中不能重复请求
  if (getCodeOrLoading.value != '获取验证码') return
  // 倒计时处理
  let loading = 60
  getCodeOrLoading.value = `${loading}秒后重新获取`
  let timer = setInterval(() => {
    loading -= 1
    getCodeOrLoading.value = `${loading}秒后重新获取`
    if (!loading) {
      getCodeOrLoading.value = '获取验证码'
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

function changeLoginMode() {
  // 切换登录模式 账号登录 验证码登录
  loginMode.value = !loginMode.value
  user.type = loginMode.value ? 'password' : 'sms'
}
</script>

<style lang="scss" scoped>
.bgImg {
  height: 30%;
  width: 100%;
  background: #fff url('@/static/background/login.png') center no-repeat;
  border-bottom-right-radius: 50% 100rpx;
  border-bottom-left-radius: 50% 100rpx;
}

.bgIcon {
  background: #fff url('@/static/background/btoWhiteLogo.png') center no-repeat;
}

:deep(.wd-divider__line) {
  height: 5rpx !important;
}

:deep(.uni-combox) {
  border: none;
}

:deep(.uni-easyinput__content) {
  border: none !important;
  background: none !important;
}

// :deep(.content-clear-icon) {
//   display: none;
// }

:deep(.is-focused) {
  .content-clear-icon {
    color: #ffab30 !important;
  }
}
</style>
