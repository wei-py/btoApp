function pathEachDeep(target, callback, path = '') {
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      const currentPath = `${path}.${i}`
      callback(currentPath)
      pathEachDeep(target[i], callback, currentPath)
    }
  } else if (typeof target === 'object' && target !== null) {
    for (let key in target) {
      if (key === 'root') {
        continue
      }
      const currentPath = path ? `${path}.${key}` : key
      callback(currentPath)
      pathEachDeep(target[key], callback, currentPath)
    }
  }
}
/**
 * @description 递归遍历目标对象或数组，对每个路径执行回调函数。
 * @param {Object|Array} target - 需要遍历的对象或数组。
 * @param {Function} callback - 每个路径遇到时要执行的回调函数。
 * @param {string} [path=''] - 当前正在遍历的路径。默认为空字符串。
 * @return {undefined}
 */
function pathEachWidth(target, callback) {
  const queue = [{ obj: target, path: '' }]
  const visited = new Set()
  while (queue.length > 0) {
    const { obj, path } = queue.shift()
    if (visited.has(obj)) {
      continue // Skip if the object has been visited
    }
    visited.add(obj)
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const currentPath = `${path}.${i}`
        callback(currentPath)
        queue.push({ obj: obj[i], path: currentPath })
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        if (key === 'root') {
          continue
        }
        const currentPath = path ? `${path}.${key}` : key
        callback(currentPath)
        queue.push({ obj: obj[key], path: currentPath })
      }
    }
  }
}
export const pathEach = pathEachDeep
export const initFlag = ref(false)

/**
 * @description 增强输入对象，通过添加属性和函数来扩展它。
 * @description mounted 初始化表单项并增强它
 * @param {Object} _ - 要增强的输入对象。
 * @return {undefined} - 没有返回值。
 */
export function enhance(_) {
  _ = reactive(_)
  const allPath = []
  pathEach(_, async (path) => {
    const value = lo.get(_, path)
    allPath.push(path)
    // _.allPath.push(path)

    if (lo.isPlainObject(value) && !lo.isEqual(value, null)) {
      value.absolutePath = path
    }
    if (util.isFormItem(value) && lo.has(value, 'mounted')) {
      watchOnce(initFlag, () => {
        // 控制在mounted的时候已经初始化好了数据
        value.mounted(_)
      })
    }
    if (util.isFormItem(value) && lo.has(value, 'rules')) {
      lo.set(value, 'errorTip', '')

      // 下面可以修改为实时校验表单项的代码
      // computedAsync(() => {
      //   lo.set(value, 'errorTip', '')
      //   return lo.get(value, 'value')
      // })
    }

    // if (util.isFormItem(value) && lo.has(value, 'initData')) {
    //   await value.initData(_)
    // }
    // if (util.isForm(value)) {
    //   value._ = _
    // }
  })

  _.name = (keyName) => util.find(_, 'name', keyName)
  _.title = (keyName) => util.find(_, 'title', keyName)

  _.allPath = allPath

  return _
}

export class util {
  /**
   * @description 当前的根
   */
  static _ = null
  /**
   * @description message 事件封装 参考 /src/pages/components/notice.vue
   * @description 参数参考 https://wot-design-uni.cn/component/message-box.html#confirm-%E5%BC%B9%E6%A1%86
   * @param {*} param0
   * @returns
   */
  static async messageCallback({ title, msg, confirmText, cancelText }) {
    return await util.sleep(1000)
  }
  /**
   * @description 全局通知
   */
  static toast = null
  static showOverlay() {}
  static hiddenOverlay() {}

  ////////////////////////////////////// 其他数据操作 //////////////////////////////////////
  /**
   * @description 并发操作
   * @param  {...any} callbackList
   */
  static async concurrent(...callbackList) {
    lo.forIn(callbackList, async (callback) => {
      await callback()
    })
  }

  /**
   * @description 设置阈值
   * @param {*} min
   * @param {*} value
   * @param {*} max
   * @returns
   */
  static limitNum(min, value, max) {
    if (value < min) {
      return min
    } else if (value > max) {
      return max
    } else {
      return value
    }
  }

  /**
   * @description 开发时测试性能
   * @param {*} callback
   * @param {*} name
   */
  static logTime(callback, name = 'time') {
    console.time(name)
    callback()
    console.timeEnd(name)
  }

  /**
   * 获取目标原始类型
   * @param target 任意类型
   * @returns {string} type 数据类型
   */
  static getType(target) {
    // 得到原生类型
    const typeStr = Object.prototype.toString.call(target)
    // 拿到类型值
    const match = typeStr.match(/\[object (\w+)\]/)
    const type = match && match.length ? match[1].toLowerCase() : ''
    // 类型值转小写并返回
    return type
  }

  /**
   * 单位进制转换
   * @param {Number} value
   * @param {<String>} unitList
   * @returns {Object<value: Number, unit: String>}
   */
  static uniConver(value, unitList = ['W', 'kW', 'mW']) {
    let unit = unitList.shift()
    while (value >= 1000 && unitList.length) {
      value /= 1000
      unit = unitList.shift()
    }
    if (!value) {
      return { value: '0', unit: 'W' }
    }
    return { value, unit }
  }

  /**
   * @description 自动清除缓存 定时事件
   * @param {Function} callback
   * @param {Number} time
   */
  static setTimeout(callback, time) {
    let timer = setTimeout(() => {
      callback()
      clearTimeout(timer)
      timer = null
    }, time)
  }

  /**
   * @use util.statusColor('待提交') => 'yellow'
   * @description 状态颜色的映射
   * @param {String} status 状态
   * @returns
   */
  static statusColor(status) {
    if (status.includes('通过') || status.includes('完毕') || status.includes('已签约') || status == '起租') {
      return 'green'
    }

    if (status.includes('拒绝')) {
      return 'red'
    }
    if (status.includes('审')) {
      return 'blue'
    }
    if (status.includes('填写') || status.includes('待')) {
      return 'yellow'
    }
  }

  /**
   * @description 颜色字典
   */
  static color = {
    green: '#48985d',
    yellow: '#ffa300',
    red: '#e51400',
    blue: '#007dff'
  }

  static arrayTowotColumns(array) {
    return array.map((n) => ({
      label: n,
      value: n
    }))
  }
  ////////////////////////////////////// uniApp 原生简化 //////////////////////////////////////
  /**
   * @description 简化路由跳转操作
   * @param {string} routerPath 路由路径 - 参考 pages.json
   * @param {Object} option 路由参数 - 已做拼接处理
   * @param {string} [baseRoute='/pages'] 路由前缀路径 - uniAPP 都是 '/pages'
   * @returns {Promise}
   */
  static go(routerPath, option, baseRoute = '/pages') {
    return uni.navigateTo({
      url: baseRoute + routerPath + '?' + xx.serialize(option)
    })
  }

  /**
   * @description 打开外部网页链接🔗
   * @param {*} href
   */
  static openUrl(href) {
    // #ifdef APP-PLUS
    plus.runtime.openURL(href) //这里默认使用外部浏览器打开而不是内部web-view组件打开
    // #endif
    // #ifdef H5
    window.open(href)
    // #endif
  }

  /**
   * @use util.downFile(请求路径, 保存路径)
   * @description 下载文件
   * @param {String} url 请求路径
   * @param {String} filePath 保存路径
   * @return {String} src 临时的blob路径
   */
  static downFile(
    url,
    extname = 'pdf',
    filePath = `_downloads/${dayjs().format('YYYY-MM-DD_') + lo.random(0, 1000)}.` + extname
  ) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
      plus.downloader
        .createDownload(
          url,
          {
            timeout: 60,
            retry: 0,
            filename: filePath
          },
          (data, status) => {
            if (status == 200) {
              resolve(data.filename)
            } else {
              util.notice({
                message: '下载失败',
                type: 'error'
              })
              plus.downloader.clear()
            }
            uni.hideLoading()
          }
        )
        .start()
    })
    // #endif
    // #ifdef H5
    console.log(url)
    return new Promise(() => {})
    // #endif
  }

  /**
   * @use util.setTitle('标题')
   * @description 动态设置标题
   * @param {string} title
   */
  static setTitle(title) {
    uni.setNavigationBarTitle({
      title: decodeURI(title)
    })
  }

  /**
   * @use util.copyText('只因你太美')
   * @description 复制内容到剪切板
   * @param {string} data
   */
  static copyText(data) {
    uni.setClipboardData({
      data: data,
      success: () => {
        // util.toast.success('复制成功')
      }
    })
  }

  /**
   * @description 拨打电话
   * @param {number|string} value 电话号码
   */
  static callPhone(value) {
    if (isPhoneNumber(value)) {
      uni.makePhoneCall({
        phoneNumber: value,
        success() {},
        fail() {
          util.toast.error('电话号码格式错误')
        }
      })
    } else {
      util.toast.error('电话号码格式错误')
    }
  }

  /**
   * @description 只执行一次的onShow
   * @description 减少onLoad的接口处理, 后面就是需要调用onLoad了
   * @param {Function} callback
   */
  static onceShow(callback) {
    onLoad(() => {})
    const onceFlag = ref(false)
    onShow(() => {
      watchOnce(onceFlag, () => {
        nextTick(() => {
          callback()
        })
      })
      onceFlag.value = true
    })
  }

  /**
   * @description 将遍历对象键值对保存到storage中
   * @param {Object} target
   */
  static setStore(target) {
    lo.forIn(target, (item, key) => {
      uni.setStorageSync(key, item)
    })
  }

  /**
   * @description 通过键获取storage对应的值
   * @param {string} key
   * @returns
   */
  static getStore(key) {
    return uni.getStorageSync(key)
  }

  static sleep(time = 500) {
    return new Promise((resolve) => {
      let timer = setTimeout(() => {
        resolve()
        clearTimeout(timer)
        timer = null
      }, time)
    })
  }

  /**
   * @description 当前页面的路径
   * @returns
   */
  static router() {
    const routers = getCurrentPages()
    return routers[routers.length - 1].route
  }

  ////////////////////////////////////// 表单操作 //////////////////////////////////////

  /**
   * @description 把它当作 vue2 中的 data
   * @description 强化表单源数据 🔈每个表单项都加载了根的循环引用(数组也是可以有属性的)
   * @option 提前加载路由数据加载到 _.option
   * --------------------------------------
   * @👇 表单项的属性
   * @rule 表单项的规则
   * @initValue {} 回传后的判空值
   * --------------------------------------
   * @👇 表单项的方法
   * @mounted 表单项中的 mounted 方法 会提前加载
   * @title 查找表拥有相同label的表单项 _.title('姓名')
   * @name 查找表拥有相同label的表单项 _.name('username')
   * --------------------------------------
   *  @👇 调用
   * @param {Object} _
   * @returns _
   * --------------------------------------
   * @description 默认挂在下拉方法 其他配置 util.refresh
   */
  static data(_) {
    initFlag.value = false
    let target = lo.cloneDeep(_)
    enhance(target)
    target = reactive(target)
    util._ = target
    util.refresh(target)
    // 提前把路由参数加载上到根上
    onLoad((option) => {
      util._.option = option
    })

    return target
  }

  /**
   * @description 将后端的图片文件数据转换成组件需要的格式
   * @param {*} url
   * @returns
   */
  static formatImg(url) {
    if (!url) {
      return false
    } else {
      if (lo.isArray(url)) {
        return url.map((n) => {
          const urlList = n.split('/')
          const name = urlList[urlList.length - 1]
          return { src: n, path: n, fname: name, name: name, url: n }
        })
      } else {
        const urlList = url.split('/')
        const name = urlList[urlList.length - 1]
        return { src: url, path: url, fname: name, name: name, url: url }
      }
    }
  }

  /**
   * @description 回写表单数据
   * @param {Array} form 表单
   * @param {Object} data 接口数据
   * @param {String} valueField 回写到form的键
   * @param {String} keyField 搜寻data的键
   * @param {Boolean} initImgFile 默认是自动处理图片文件回传
   */
  static initFormItem(formItem, data, valueField = 'value', keyField = 'name', initImgFile = true) {
    lo.forIn(data, (item, key) => {
      // 找到后端对应回传的值
      if (lo.get(formItem, keyField) == key) {
        // 默认是自动处理图片文件回传
        if (initImgFile) {
          // 图片文件情况
          if (formItem.formType == 'img' || formItem.formType == 'file') {
            // 一个文件是字符串
            if (lo.isString(item)) {
              formItem[valueField] = util.setEmpty(item)
            }
            // 一个文件或多个文件 在数组中
            if (lo.isArray(item)) {
              // 一张图片或一个文件的情况
              if (formItem.count == 1) {
                const imgFile = util.formatImg(item)
                // 判空
                if (lo.isArray(imgFile)) {
                  formItem[valueField] = imgFile
                } else if (lo.isObject(imgFile)) {
                  formItem[valueField] = [imgFile]
                }
              } else {
                // 多张图片或多个文件的情况
                formItem[valueField] = item.map((n) => util.formatImg(n))
              }
            }
          } else {
            // 正常情况
            formItem[valueField] = util.setEmpty(item)
          }
        }
      }
    })
  }

  /**
   * @description 回写到根上的所有表单 包括按钮状态(保存、提交、审核)
   * @param {Object} _ 根数据
   * @param {Object} data 接口数据接口
   * @param {String} valueField 回写到form的键
   * @param {String} keyField 搜寻data的键
   */
  static initRoot(_, data, valueField = 'value', keyField = 'name', initImgFile = true) {
    if (lo.has(data, 'btns')) {
      _.btns = lo.get(data, 'btns')
    }
    if (lo.has(data, 'orderState')) {
      _.orderState = lo.get(data, 'orderState')
    }
    lo.forEach(_.allPath, async (path) => {
      const formItem = lo.get(_, path)
      if (util.isFormItem(formItem)) {
        util.initFormItem(formItem, data, valueField, keyField, initImgFile)
      }
    })

    initFlag.value = true
  }

  /**
   * @description 禁用根数据下的所有表单中的表单项
   * @param {Object} _ 根数据
   */
  static disabledRoot(_) {
    lo.forIn(_, (form) => {
      if (util.isForm(form)) {
        util.disabledForm(form)
      }
    })
  }

  /**
   * @description 禁用表单中的表单项
   * @param {Array} form 表单
   */
  static disabledForm(form) {
    form.forEach((formItem) => {
      formItem.disabled = true
    })
  }

  /**
   * @description 重置数据 onLoad 只会在第一次跳转后执行 所以需要重置数据
   * @param {Object} _
   */
  static resetForm(_) {
    lo.forIn(_.allPath, (path) => {
      const formItem = lo.get(_, path)
      if (util.isFormItem(formItem) && !formItem.ignoreParam) {
        // if ()
        // console.log(lo.get(_, path).value, 3333, lo.get(_, path).name);
        // console.log(util.setEmpty(lo.get(_, path).value), lo.get(_, path).name);
        // lo.get(_, path).value = util.setEmpty(lo.get(_, path).value)
        // lo.set(_, `${path}.value`, util.setEmpty(lo.get(_, path).value))
      }
    })
  }

  static setEmpty(value) {
    // console.log(value, lo.get(value, 'length') || value != 0)
    if (lo.isUndefined(value) || lo.isNull(value)) {
      return ''
    }
    if (lo.get(value, 'length') || value != 0) {
      return value
    }

    if (lo.isArray(value)) {
      return []
    }
    if (lo.isString(value)) {
      return ''
    }
    if (lo.isNumber(value)) {
      return 0
    }
    if (lo.isObject(value)) {
      return {}
    }
    if (lo.isBoolean(value)) {
      return false
    }
  }

  /**
   * @description 校验表单
   * @param {Object} _
   */
  static valid(_) {
    let errorResult = false
    let errorName = ''
    lo.forEach(_.allPath, (path) => {
      const formItem = lo.get(_, path)
      if (util.isFormItem(formItem) && !lo.get(formItem, 'ignoreParam')) {
        let formItemError = util.validFormItem(formItem)
        if (!errorResult) {
          // 记录有一次错误就行
          errorResult = !lo.isEmpty(formItemError + '')
          errorName = formItem.name
        }
      }
    })
    if (errorResult) {
      const showApprovalModule = lo.get(util, '_.btns.canEdit') && lo.get(util, '_.btns.hasEditBtn')
      if (errorName == 'result' && showApprovalModule) {
        console.log('校验通过')
        return
      } else {
        util.toast.error('校验不通过')
        throw new Error('校验不通过' + errorName) // 中断后续执行
      }
    } else {
      console.log('校验通过')
      return
    }
  }

  /**
   * @description 校验表单项
   * @param {Object} formItem
   */
  static validFormItem(formItem) {
    let formItemError = ''
    if (lo.has(formItem, 'rules') && formItem.rules.length) {
      formItem.rules.forEach((rule) => {
        const valid = rule(formItem.value)
        if (lo.isString(valid)) {
          formItemError = valid
        }
      })
    }
    if (formItem.required && lo.isEmpty(formItem.value + '')) {
      formItemError = formItem.title + ': 必填'
      if (lo.isString(formItem.required)) {
        formItemError = formItem.required
      }
    }
    lo.set(util._, formItem.absolutePath + '.errorTip', formItemError)
    return formItemError
  }

  /**
   * @description 根据指定的键值对在对象中查找值。
   * @param {Object} obj - 要搜索的对象。
   * @param {string} key - 要搜索的键。
   * @param {string} value - 要搜索的值。
   * @returns {Object|undefined} - 找到的对象，如果未找到则返回undefined。
   */
  static find(_, key, keyName) {
    // let result
    // pathEachDeep(_, (path) => {
    //   const value = lo.get(_, path)
    //   if (lo.get(value, key) == keyName) {
    //     result = value
    //   }
    // })
    // return result || {}

    for (let i = 0; i < _.allPath.length; i++) {
      const path = _.allPath[i]
      const value = lo.get(_, path)
      if (lo.get(value, key) == keyName) {
        return value
      }
    }
    return {}
  }

  /**
   * @description 从当前对象中获取参数。
   * @param {Object} _ - 当前对象。
   * @return {Object} 包含参数的对象。
   */
  static getParams(_) {
    const result = {}
    lo.forEach(_.allPath, (path) => {
      const formItem = lo.get(_, path)
      if (util.isFormItem(formItem) && !lo.get(formItem, 'ignoreParam')) {
        // 之前放弃的代码
        // const sup = lo.get(_, formItem.absolutePath)
        // result[sup.name] = sup.value

        // 正常请求
        result[formItem.name] = formItem.value
        if (lo.isUndefined(formItem.value)) {
          result[formItem.name] = formItem.emptyValue || ''
        }

        // 如果有 realValue 优先选择其为值
        if (lo.has(formItem, 'realValue')) {
          result[formItem.name] = formItem.realValue
        }

        // 图片|文件 处理
        if (formItem.formType == 'img' || formItem.formType == 'file') {
          if (lo.isString(formItem.value)) {
            result[formItem.name] = formItem.value
          } else if (lo.isArray(formItem.value)) {
            result[formItem.name] = lo.get(result, formItem.name, []).map((n) => n.src || n.url || n)
            if (formItem.count == 1) {
              result[formItem.name] = result[formItem.name][0] || ''
            }
          }
        }
      }
    })
    if (_.option.orderId) {
      result.orderId = _.option.orderId
    }
    return result
  }

  /**
   * @description 判断给定的值是否为表单项。
   * @param {any} formItem - 要检查的表单项
   * @return {boolean} 如果值是表单项则返回true，否则返回false。
   */
  static isFormItem(formItem) {
    return lo.has(formItem, 'formType') && lo.has(formItem, 'name')
  }

  /**
   * @description 判断是否为表单源数据
   * @param {Array} form - 表单
   * @returns
   */
  static isForm(form) {
    return util.isFormItem(lo.get(form, '0'))
  }

  /**
   *
   * @param  {...any} name
   * @returns
   */
  static pickValue(...name) {
    return name.reduce((pre, cur) => {
      pre[cur] = util._.name(cur).value
      return pre
    }, {})
  }

  /**
   * @description 表单组件传值时进行剪枝处理
   * @param {Array} form 表单
   * @param {Objectj} formItem 表单项
   * @returns
   */
  static trimForm(form) {
    return form.map((formItem) => {
      return util.trimFormItem(formItem)
    })
  }

  /**
   * @description 结合uniForm组件使用减少标签DOM的传值
   * @param {Array} formItem
   * @returns
   */
  static trimFormItem(formItem) {
    const formItemTmp = lo.omit(formItem, [
      'absolutePath', // 距根的绝对路径
      'formType', // 表单项的类型
      'initValue', // 回传空时的初始值
      'wdCell', // 使用wdCell格式的插槽
      'rules', // 校验规则
      'errorTip', // 提示校验的错误问题
      'formType', // 表单项的类型
      // 'title', // 表单项的label值
      'columns',
      'ignoreParam' // 在 util.getParams 方法中不当作后端传参
    ])
    const result = {}
    // 减去方法传值
    lo.forIn(formItemTmp, (item, key) => {
      if (!lo.isFunction(item)) {
        result[key] = item
      }
    })
    return result
  }

  /**
   * @description 下拉刷新判断方法是否存在进行请求数据替换
   * @description 退出清空操作
   * @param {Object} _
   */
  static refresh(_) {
    onPullDownRefresh(async () => {
      if (lo.has(_, 'save') && lo.isFunction(_.save) && lo.get(_, 'btns.canEdit')) {
        await _.save()
      }
      if (lo.has(_, 'getData') && lo.isFunction(_.getData)) {
        await _.getData()
      } else {
        uni.stopPullDownRefresh()
        return
      }
      if (lo.isFunction(util.toast.success)) {
        util.toast.success('刷新数据成功')
      }
      uni.stopPullDownRefresh()
    })
    onUnmounted(() => {
      util.resetForm(_)
    })
  }

  /**
   * @description 删除空值的参数
   * @param {Object} params
   * @returns
   */
  static trimParams(params) {
    return Object.entries(params).reduce((pre, [key, value]) => {
      if (value == 'null') {
        value = ''
      }
      if (value) {
        pre[key] = value
      }
      return pre
    }, {})
  }

  /**
   * @description 保存的提示
   * @param {*} data
   */
  static toastSave(data) {
    if (data.code == 200) {
      util.toast.success('保存成功')
    } else {
      util.toast.error('保存失败')
    }
  }

  /**
   * @description 提交审批的提示
   * @param {*} data
   */
  static toastPutApproval(data) {
    if (data.code == 200) {
      util.toast.success('提交成功')
    } else {
      util.toast.error('提交失败')
    }
  }
  /**
   * @description 提交审批的提示
   * @param {*} data
   */
  static toastApproval(data) {
    if (data.code == 200) {
      util.toast.success('提交审核成功')
    } else {
      util.toast.error('提交审核失败')
    }
  }
}

// const _ = reactive({})
// _.form = [
//   {
//     formType: 'input',
//     name: 'username',
//     value: 'cxk',
//     label: '姓名',
//     realValue: '',
//     ref: 'cxk',
//     dom: templateRef('cxk'),
//     mounted(_) {
//       // computedAsync(() => {
//       //   this.realValue = this.value + 'jntm'
//       //   return this.value
//       // })
//     }
//   }
// ]

// enhance(_)
// console.log(_.label('姓名').value)
