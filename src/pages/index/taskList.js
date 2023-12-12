/*
 * @description 常见数据
 */
const commonTask = [
  {
    text: '订单列表',
    icon: 'orderList',
    path: '/realLease/realLease',
    query: {
      stageId: '',
      stateId: '',
      taskId: ''
    }
  },
  {
    text: '测试页面1',
    icon: 'orderList',
    path: '/test/test',
    query: { num: 1 }
  },
  {
    text: '测试页面2',
    icon: 'orderList',
    path: '/test/test2'
  },
  {
    text: '查看图标',
    icon: 'orderList',
    path: '/test/icon'
  },
  {
    text: '登录页面',
    icon: 'orderList',
    path: '/login/login'
  }
].map((n) => {
  return {
    ...n,
    from: '常见数据',
    icon: `../../static/icons/realLeaseTop/${n.icon}.png`,
    tap() {
      util.go(n.path, { ...n.query, from: 'cjsj', title: n.text })
    }
  }
})

/**
 * @description 任务大全
 */
const phaseTask = [
  {
    text: '预审',
    icon: 'inquiry',
    path: '/realLease/realLease',
    query: {
      stageId: 'PRE_APPROVAL',
      stateId: '',
      taskId: 'TASK_YSXX'
    }
  },
  {
    text: '客户信息',
    icon: 'customerInfo',
    detailPath: 'customerInfo',
    path: '/realLease/realLease',
    query: {
      stageId: 'CUSTOMER_INFO',
      stateId: '',
      taskId: ''
    }
  },
  {
    text: '业务踏勘',
    icon: 'reconnaissance', // 改
    detailPath: 'businessReconnaissance',
    path: '/realLease/realLease',
    query: {
      stageId: 'KAN_CHA',
      stateId: '',
      taskId: 'TASK_TA_KAN'
    }
  },
  {
    text: '技术勘察',
    icon: 'technicalInvestigation',
    detailPath: 'technicalLnvestigation',
    path: '/realLease/realLease',
    query: {
      stageId: 'KAN_CHA',
      stateId: '',
      taskId: 'TASK_JSKC'
    }
  },
  {
    text: '合同签约',
    icon: 'contractSigning',
    detailPath: 'contractAward',
    path: '/realLease/realLease',
    query: {
      stageId: 'LEASE_SIGN',
      stateId: 'WAITING_SIGN',
      taskId: 'TASK_HTQY'
    }
  },
  {
    text: '备案证',
    icon: 'certificate',
    detailPath: 'certificate',
    path: '/realLease/realLease',
    query: {
      stageId: 'BAZING',
      stateId: '',
      taskId: 'TASK_BAZXX'
    }
  },
  {
    text: '初设评审',
    icon: 'initialReview',
    detailPath: 'InitialReview',
    path: '/realLease/realLease',
    query: {
      stageId: 'DESIGN',
      stateId: '',
      taskId: 'TASK_CSPSXX'
    }
  },
  {
    text: '施工',
    icon: 'build',
    detailPath: 'build',
    path: '/realLease/realLease',
    query: {
      stageId: 'CONSTRUCT',
      stateId: '',
      taskId: 'CONSTRUCT'
    }
  },
  {
    text: '并网',
    icon: 'gridConnected',
    detailPath: 'gridConnected',
    path: '/realLease/realLease',
    query: {
      stageId: 'GRID_CONNECTION',
      stateId: '',
      taskId: 'TASK_BWXX'
    }
  },
  {
    text: '结算',
    icon: 'settlement',
    detailPath: 'gridConnectedAccount',
    path: '/realLease/realLease',
    query: {
      stageId: 'SETTLEMENT',
      stateId: '',
      taskId: ''
    }
  },
  {
    text: '购售电合同',
    icon: 'purchaseContract',
    detailPath: 'electricityContract',
    path: '/realLease/realLease',
    query: {
      stageId: 'GS_CONTRACT',
      stateId: '',
      taskId: 'TASK_GSDHTXX'
    }
  },
  {
    text: '完成',
    icon: 'complete',
    path: '/realLease/realLease',
    query: {
      stageId: 'FINISHED',
      stateId: 'FINISHED',
      taskId: ''
    }
  },
  {
    text: '内审驳回',
    icon: 'internalSummary',
    path: '/realLease/realLease',
    query: {
      stageId: '',
      stateId: 'REJECT',
      taskId: '',
      excludeStateIds: 'APPROVAL_REJECT_LEASE'
    }
  },
  {
    text: '资方驳回',
    icon: 'capitalSummary',
    path: '/realLease/realLease',
    query: {
      stageId: '',
      stateId: 'APPROVAL_REJECT_LEASE'
    }
  }
].map((n) => {
  return {
    ...n,
    from: '任务大全',
    icon: `../../static/icons/realLeaseTop/${n.icon}.png`,
    tap() {
      util.go(n.path, { ...n.query, from: 'rwdq', title: n.text })
    }
  }
})

/**
 * @description 审核大全
 */
const checkTask = [
  {
    text: '客户审核',
    icon: 'businessAudit',
    path: '/realLease/realLease',
    query: {
      stageId: 'CUSTOMER_INFO',
      stateId: 'WAITING_APPROVAL',
      taskId: ''
    }
  },
  {
    text: '踏勘内审',
    icon: 'reconnaissanceFirstAudit',
    path: '/realLease/realLease',
    query: {
      stageId: 'KAN_CHA',
      stateId: 'WAITING_APPROVAL',
      taskId: 'TASK_TA_KAN'
    }
  },
  {
    text: '勘察审核',
    icon: 'multiAudit',
    path: '/realLease/realLease',
    query: {
      stageId: 'KAN_CHA',
      stateId: 'WAITING_APPROVAL',
      taskId: ''
    }
  },
  {
    text: '初设审核',
    icon: 'changeAudit',
    path: '/realLease/realLease',
    query: {
      stageId: 'DESIGN',
      stateId: 'WAITING_APPROVAL'
      // taskId: 'TASK_CSPSXX'
    }
  },
  {
    text: '施工审核',
    icon: 'buildAudit',
    path: '/realLease/realLease',
    query: {
      stageId: 'CONSTRUCT',
      stateId: 'WAITING_APPROVAL'
    }
  },
  {
    text: '并网审核',
    icon: 'gridConnectedAudit',
    path: '/realLease/realLease',
    query: {
      stageId: 'GRID_CONNECTION',
      stateId: 'WAITING_APPROVAL'
      // taskId: 'TASK_CSPSXX'
    }
  },
  {
    text: '结算审核',
    icon: 'completeAudit',
    path: '/realLease/realLease',
    query: {
      stageId: 'SETTLEMENT',
      stateId: 'WAITING_APPROVAL'
    }
  },
  {
    text: '购售电审核',
    icon: 'businessAudit',
    path: '/realLease/realLease',
    query: {
      stageId: 'GS_CONTRACT',
      stateId: 'WAITING_APPROVAL',
      taskId: 'TASK_GSDHTXX'
    }
  }
].map((n) => {
  return {
    ...n,
    from: '审核大全',
    icon: `../../static/icons/realLeaseTop/${n.icon}.png`,
    tap() {
      util.go(n.path, { ...n.query, from: 'shdq', title: n.text })
    }
  }
})

/**
 * @commonTask 常见数据
 * @phaseTask 任务大全
 * @checkTask 审核大全
 */
export { commonTask, phaseTask, checkTask }
