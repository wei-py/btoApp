import appJson from '../../manifest.json'
import { initToken } from '@/config/request'
export const person = [
  {
    formType: 'text',
    value: '',
    name: 'setting',
    title: '个人设置',
    titleIcon: 'user-circle',
    suffix: 'arrow-right'
  },
  {
    formType: 'text',
    value: '',
    name: 'changePassword',
    title: '更换密码',
    titleIcon: 'lock-on',
    suffix: 'arrow-right'
  },
  {
    formType: 'text',
    value: appJson.versionName,
    name: 'versionInfo',
    title: '版本信息'
  },
  {
    formType: 'slot',
    value: 'sit',
    name: 'env',
    title: '当前环境',
    list: ['boge', 'mingjie', 'sit', 'uat'],
    change(e) {
      initToken()
    }
  }
]
