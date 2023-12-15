import Request from 'luch-request'

const http = new Request()

export let requestErrorList = [] // 重刷请求队列
export let requestingList = []
let isRefreshToken = false

export const baseURLDic = {
  boge: { app: 'http://192.168.30.15:30600', web: '/dev' }, // 波哥
  bogeSto: { app: 'http://192.168.30.15:30610', web: '/devSto' }, // 波哥 供应链
  mingjie: { app: 'http://192.168.30.11:30600', web: '/mj' }, // 铭杰
  mingjieSto: { app: 'http://192.168.30.11:30610', web: '/mjSto' }, // 铭杰 供应链
  sit: { app: 'http://192.168.150.250:30600', web: '/sit' }, // 测试
  uat: { app: 'https://7k20s48526.zicp.fun', web: '/uat' } // 打包测试环境
}

const whoApi = uni.getStorageSync('whoApi') || 'uat'
export const who = ref(whoApi) // 改这里就行

/**
 * @description 初始化token、baseURL、uid、timeout
 * @returns {Object} config
 */
export const initToken = () => {
  uni.setStorageSync('whoApi', who.value)
  http.setConfig((config) => {
    const appOrWeb = uni.getSystemInfoSync().uniPlatform
    config.baseURL = baseURLDic[who.value][appOrWeb]
    config.header.uid = uni.getStorageSync('uid')
    config.header.Authorization = uni.getStorageSync('access_token')
    config.timeout = 1000 * 8
    return config
  })
}

// 这个得立即设置 有跳过登录的需求 开始的设置 config uid token
initToken()

http.interceptors.request.use(
  async (config) => {
    initToken() // 每次都重新设置 config uid token
    config.custom.now = Date.now() + lo.random(3000, 5000)
    requestingList.push(config)
    toLoad()
    return config
  },
  (config) => {
    util.hiddenOverlay() // 隐藏遮罩层
    return Promise.reject(config)
  }
)

http.interceptors.response.use(
  (response) => {
    const requestingListIndex = requestingList.findIndex((n) => n.custom.now == response.config.custom.now)
    requestingList.splice(requestingListIndex, 1)
    toLoad()

    //////////////////////////////////////// 请求并非 200 ////////////////////////////////////////
    if (lo.get(response, 'data.code') != 200) {
      util.toast.error('业务操作失败 \n' + lo.get(response, 'data.msg'))
    }

    return response
  },
  async (response) => {
    const requestingListIndex = requestingList.findIndex((n) => n.custom.now == response.config.custom.now)
    requestingList.splice(requestingListIndex, 1)
    toLoad()
    if (!response.data) {
      //////////////////////////////////////// 超时处理 ////////////////////////////////////////
      util.toast.error('请求错误取消' + xx.toJSONString(response))
      return
    }
    const code = lo.get(response, 'data.code')

    //////////////////////////////////////// 拦截 500 ////////////////////////////////////////
    if (code == 500) {
      util.toast.error('接口请求 500')
    }

    //////////////////////////////////////// 刷新 token 401 ////////////////////////////////////////
    if (code == '401') {
      if (!isRefreshToken) {
        // 刷新token 中锁住请求
        isRefreshToken = true
        let refreshToken = uni.getStorageSync('refresh_token')
        // 无refreshToken 处理
        if (!refreshToken) {
          return handleAuthorized(response.data)
        }

        try {
          // 重新刷新token
          const { data } = await http.post('/login/refresh?' + xx.serialize({ refreshToken }))
          if (data.code != 200) {
            return handleAuthorized(response.data)
          }
          // 重置缓存中的token
          uni.setStorageSync('accessToken', data.data)
          // 重置request中的token
          initToken()
          // 失败请求重新请求
          requestErrorList.forEach((cb) => cb())
          // 返回接口并执行
          return new Promise((resolve) => {
            // response.config.method.toLowerCase() 请求方式有POST、GET 等等
            // response.config.url 请求地址
            // response.config.data 请求参数
            resolve(http[response.config.method.toLowerCase()](response.config.url, response.config.data))
          })
        } catch (error) {
          // 在刷新token后的错误请求也重新执行
          requestErrorList.forEach((cb) => cb())
          return handleAuthorized(response.data)
        } finally {
          // 结束处理 清空请求和refreshToken锁打开
          requestErrorList = []
          isRefreshToken = false
        }
      } else {
        // 收集失败请求并执行
        return new Promise((resolve) => {
          requestErrorList.push(() => {
            // response.config.method.toLowerCase() 请求方式有POST、GET 等等
            // response.config.url 请求地址
            // response.config.data 请求参数
            resolve(http[response.config.method.toLowerCase()](response.config.url, response.config.data))
          })
        })
      }
    }

    return Promise.reject(response)
  }
)

function handleAuthorized(data) {
  util.go('/pages/login/login')
  // 函数节流
  return data
}

function toLoad() {
  // if (num != 1) {
  //   util.showOverlay() // 显示遮罩层
  // } else {
  //   util.hiddenOverlay() // 隐藏遮罩层
  // }
  if (requestingList.length) {
    util.showOverlay()
  } else {
    util.hiddenOverlay()
  }
}

// uni.addInterceptor('navigateBack', {
//   async invoke() {
//     console.log(33333);
//     // console.log(requestingList, 3333)
//   }
// })

export { http }
