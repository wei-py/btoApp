
/**
 * @description 全局返回拦截 🈲
 */
uni.addInterceptor('navigateBack', {
  async invoke() {
    console.log(333, lo.get(requestingList, '0'));
  }
})
