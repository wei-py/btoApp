export const qiniu = {
  url: 'https://up-cn-east-2.qiniup.com',
  token: ref(),
  tokenTime: autoResetRef(true, 1000 * 60),
  fileDoms: ref([]),
  async getToken(fileType = 'image', orderId = lo.get(util, '_.orderId')) {
    // console.log(this.tokenTime.value, 'tokenTime qiniu');
    if (this.tokenTime.value) {
      this.tokenTime.value = false
      const params = xx.serialize({ fileType, orderId })
      const { data } = await http.get('file/get-qiniu-upload-token?' + params)
      // console.log(data, 'refreshToken qiniu');
      this.token.value = data.data.upToken
    }
    return this.token.value
  }
}
