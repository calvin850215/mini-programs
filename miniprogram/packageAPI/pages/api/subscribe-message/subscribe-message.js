import { i18n,lang } from '../../../../i18n/lang'
Page({

  /**
   * Page initial data
   */
  data: {
    t: i18n,
    lang,
    theme: 'light'
  },

  // Request subscription
  requestSubscribeMessage() {
    const self = this
    const tmplIds = ['mti_OFrfsIuDZjzxCaCNGCAMJAFQzDsaTTrAHoolLhz']
    wx.requestSubscribeMessage({
          tmplIds: tmplIds,
          success: (res) => {
              console.log('wx.requestSubscribeMessage===success', res)
              const keysWithAccept = Object.entries(res)
              .filter(([key, value]) => value === "accept")
              .map(([key]) => key);
              if (keysWithAccept.length > 0) {
                    // Send subscription message
                    this.orderSubscribe(keysWithAccept)
              } else {
                    wx.showModal({
                        title: 'No available message templates',
                        confirmText: 'Confirm',
                        showCancel: false
                    })
              }
          },
          fail: (res) => {
              console.log('wx.requestSubscribeMessage===fail', res)
              wx.showModal({
                    title: 'wx.requestSubscribeMessage fail',
                    confirmText: 'Confirm',
                    content: `${res.errMsg}【${res.errCode}】`,
                    showCancel: false
              })
          }
    })
  },

  // Send subscription message
  subscribeMessageSend() {
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        theme: 'light',
        action: 'sendSubscribeMessage'
      },
      success: res => {
        console.warn('[Cloud Function] [openapi] templateMessage.send call successful:', res)
        wx.showModal({
          confirmText: i18n['confirm'],
          cancelText: i18n['cancel'],
          title: 'Successful subscription',
          content: 'Please return to WeChat main interface to view',
          showCancel: false
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: 'Call failure'
        })
        console.error('[Cloud Function] [openapi] templateMessage.send call failed:', err)
      }
    })
  },

  /**
   * Life cycle function--Load on the monitoring page
   */
  onLoad() {
    this.setData({
      t: i18n,
      lang
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }

  },

  /**
   * Life cycle function--The first rendering of the monitoring page is completed
   */
  onReady() {

  },

  /**
   * Life cycle function--Surveillance page display
   */
  onShow() {

  },

  /**
   * Life cycle function--Monitoring page hidden
   */
  onHide() {

  },

  /**
   * Life cycle function--Supervision page uninstallation
   */
  onUnload() {

  },

  /**
   * Page related event processing function--Surveying user drop -down action
   */
  onPullDownRefresh() {

  },

  /**
   * Page the processing function of the bottoming event
   */
  onReachBottom() {

  },

  /**
   * User click to share in the upper right corner
   */
  onShareAppMessage() {
    return {
      title: 'Subscription message',
      path: 'packageAPI/pages/api/subscribe-message/subscribe-message'
    }
  }
})
