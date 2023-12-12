export default [
  {
    formType: 'text',
    title: '订单',
    ignoreParam: true,
    value: '',
    name: 'orderId'
  },
  {
    formType: 'text',
    title: '审核方式',
    value: '',
    name: 'approvalType',
    type: 'text',
    dictionary: {
      APPROVAL_INNER: '内部审核',
      APPROVAL_BTO: '博通审核',
      APPROVAL_LEASE: '资方审核'
    },
    mounted() {
      // const stateId = computedAsync(() => lo.get(util, '_.orderState.stateId'))
      // console.log(stateId, 3333);
      // this.value = computedAsync(() => {
      //   console.log(stateId.value, 3333);
      //   return this.value ? this.value : (stateId.value == 'WAITING_APPROVAL_BTO' ? 'APPROVAL_BTO' : 'APPROVAL_INNER')
      // })
    }
  },
  {
    formType: 'select',
    title: '审批结果',
    required: true,
    value: '',
    name: 'result',
    columns: [
      { value: 'PASS', label: '通过' },
      { value: 'REJECT', label: '拒绝' }
    ]
  },
  {
    formType: 'input',
    title: '原因',
    type: 'textarea',
    value: '',
    error: true,
    placeholder: '请输入原因',
    name: 'rejectReason'
  },
  {
    formType: 'slot', // 身份证
    name: 'rejectFilesSlot',
    required: false,
    ignoreParam: true,
    data: [
      {
        formType: 'file',
        title: '附件',
        count: 999,
        name: 'rejectFiles',
        value: [],
        filePath: ''
      }
    ]
  }
]
