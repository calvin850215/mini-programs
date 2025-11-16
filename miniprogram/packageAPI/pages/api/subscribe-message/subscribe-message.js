import { i18n,lang } from '../../../../i18n/lang'

const BASEURL = 'https://miniapp.appao.com'
const APPID = 'mpgmv9l06ptin91f'

Page({

  /**
   * Page initial data
   */
  data: {
    t: i18n,
    lang,
    theme: 'light',
    eventTitle: 'Play together',
    eventSubtitle: 'The game is about to start, please join us!',
    openPath: 'packageAPI/pages/api/subscribe-message/subscribe-message',
    openParams: 'key1=value1',
    appVersionType: 3
  },

  bindEventTitleInput(e) {
    this.setData({
      eventTitle: e.detail.value
    })
  },
  bindOpenSubtitleInput(e) {
    this.setData({
      eventSubtitle: e.detail.value
    })
  },
  bindOpenPathInput(e) {
    this.setData({
      openPath: e.detail.value
    })
  },
  bindOpenParamsInput(e) {
    this.setData({
      openParams: e.detail.value
    })
  },
  bindAppVersionTypeInput(e) {
    this.setData({
      appVersionType: e.detail.value
    })
  },
  // Request subscription
  requestSubscribeMessage() {
    wx.showLoading()
    wx.login({
      success: (res) => {
        console.log('wx.login success===', res)
        if (res.code) {
          wx.request({
            url: `${BASEURL}/minibackend/getOpenId`,
            method: "POST",
            data: {
              appId: APPID,
              jscode: res.code
            },
            success: (res) => {
              // const tmplIds = ['mti_eIvkmaWGdBHsBxjOiWUuQHiHzDEeRCnBYyuyIgr']
              // wx.requestSubscribeMessage({
              //   tmplIds: tmplIds,
              //   success: (res) => {
              //       console.log('wx.requestSubscribeMessage===success', res)
              //       const keysWithAccept = Object.entries(res)
              //       .filter(([key, value]) => value === "accept")
              //       .map(([key]) => key);
              //       if (keysWithAccept.length > 0) {
              //             // Send subscription message
              //             this.orderSubscribe(keysWithAccept)
              //       } else {
              //             wx.showModal({
              //                 title: 'No available message templates',
              //                 confirmText: 'Confirm',
              //                 showCancel: false
              //             })
              //       }
              //   },
              //   fail: (res) => {
              //       console.log('wx.requestSubscribeMessage===fail', res)
              //       wx.showModal({
              //             title: 'wx.requestSubscribeMessage fail',
              //             confirmText: 'Confirm',
              //             content: `${res.errMsg}【${res.errCode}】`,
              //             showCancel: false
              //       })
              //   }
              // })

              console.log('wx.request getOpenId success===', res)
              var openId = res.data.data.openId
              wx.invokeNativePlugin({
                api_name: 'authorizeNotification',
                data: {
                  validity: 'timebound',
                  options: [
                    {
                      type: 'eventUpdate',
                      description: i18n['eventUpdateDescription'],
                    }
                  ]
                },
                success: (res) => {
                  console.log('===success[invokeNativePlugin authorizeNotification]===', res);
                  wx.request({
                    url: `${BASEURL}/minibackend/sendActivity`,
                    method: "POST",
                    data: {
                      appId: APPID,
                      openId: openId,
                      title: this.data.eventTitle,
                      subtitle: this.data.eventSubtitle,
                      imageUrl: 'https://picsum.photos/500',
                      notificationToken: res.token,
                      // env: "staging",
                      openPath: this.data.openPath,
                      openParams: this.data.openParams,
                      appVersionType: this.data.appVersionType
                    },
                    success: (res) => {
                      wx.hideLoading()
                      console.log('wx.request sendActivity success==', res)
                    },
                    fail: (err) => {
                      wx.hideLoading()
                      console.log('wx.request sendActivity failed==', err)
                    }
                  })
                },
                fail: (err) => {
                  wx.hideLoading()
                  console.log('===err[invokeNativePlugin authorizeNotification]===', err);
                },
              })
            },
            fail: (err) => {
              wx.hideLoading()
              console.log('wx.request fail', err)
              wx.showModal({
                title: 'getOpenId failed',
                confirmText: 'Confirm',
                content: err.errMsg,
                showCancel: false
              })
            },
          })
        } else {
          wx.hideLoading()
          console.log('wx.login does not return code', res)
          wx.showModal({
            title: 'Login failed',
            confirmText: 'Confirm',
            content: res.errMsg,
            showCancel: false
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log('wx.login fail===', err)
        wx.showModal({
          title: 'Login failed',
          confirmText: 'Confirm',
          content: err.errMsg,
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
