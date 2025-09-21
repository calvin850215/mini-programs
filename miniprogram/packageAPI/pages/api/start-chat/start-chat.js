import { i18n,lang } from '../../../../i18n/lang'
Page({
  onShareAppMessage() {
    return {
      title: 'start-chat',
      path: 'packageAPI/pages/api/start-chat/start-chat'
    }
  },

  data: {
    theme: 'light',
    friendOpenId: 'oc24dee1668917551jyVXBk01729'
  },

  bindOpenIdInput(e) {
    this.setData({
      friendOpenId: e.detail.value
    })
  },

  startChat() {
    const friendOpenId = this.data.friendOpenId;
    console.log("friendOpenId:", friendOpenId)
    wx.invokeNativePlugin({
      api_name: 'startChat',
      data: {
        openId: friendOpenId
      },
      complete(res) {
        console.log('===complete[invokeNativePlugin startChat]===', res);
      },
      success: (res) => {
        console.log('===success[invokeNativePlugin startChat]===', res);
      },
      fail: (err) => {
        console.log('===err[invokeNativePlugin startChat]===', err);
      },
      progress: (res) => {
        console.log('===progress[invokeNativePlugin startChat]===', res);
      }
    })
  },


  onLoad() {
    this.setData({
      t: i18n,
      lang
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  }
})
