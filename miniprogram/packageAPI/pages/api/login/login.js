const app = getApp()
const BASEURL = 'https://miniapp.appao.com'
const APPID = 'mpgmv9l06ptin91f'

import { i18n,lang } from '../../../../i18n/lang'
Page({
  onShareAppMessage() {
    return {
      path: 'packageAPI/pages/api/login/login'
    }
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: i18n['login3']
    })
    this.setData({
      t: i18n,
      lang
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
  },
  data: {
    hasLogin: false,
    theme: 'light',
    code: '',
    phoneNumber: '',
    emailAddress: '',
    userHead: '',
    userHeadBase64: '',
    nickName: '',
  },
  login: function () {
    wx.showLoading()
    // step 1: get jscode
    wx.login({
      success: (res) => {
        wx.hideLoading()
        if (res.code) {
          this.setData({
            hasLogin: true,
            code: res.code
          })
          console.log('wx.login succeed. res:', res)
          this.jscode = res.code
          wx.showToast({
              title: 'Logged in successfully',
              icon: 'success',
              duration: 500
          })

          // NOTE: step 2 and 3 are only required when the current user need to interact with other host app users
          // step 2: get openid from server and bind openid with host app userid
          wx.request({
            url: `${BASEURL}/minibackend/getOpenId`,
            method: "POST",
            data: {
              appId: APPID,
              jscode: this.jscode
            },
            success: (res) => {
              console.log('getOpenId request success===', res)
              const { data = {} } = res || {};
              // check data.data.openId is not null
              if (data.data.openId) {
                // step 3: bind openid with host app userid
                wx.invokeNativePlugin({
                  api_name: 'bindOpenId',
                  data: {
                    openId: data.data.openId,
                  },
                  success: (res) => {
                    console.log('===success[invokeNativePlugin bindOpenId]===', res);
                    // delay 1 second
                    setTimeout(() => {
                      wx.showToast({ title: "bindOpenId:complete res:" + res });
                    }, 1000);
                  },
                  fail: (err) => {
                    console.log('===err[invokeNativePlugin bindOpenId]=== err:', err);
                    const { errMsg = "" } = err;
                    setTimeout(() => {
                      wx.showToast({
                      title: `${errMsg}`,
                        icon: "error"
                      });
                    }, 1000);
                  },
                  complete(res) {
                    console.log('===complete[invokeNativePlugin bindOpenId]===', res);
                  },
                })
              }
            },
            fail: (err) => {
              console.log('getOpenId request fail===', err)
            }
          })
        } else {
          console.log('wx.login does not return code. res:', res)
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

  clickGetEmailAddress() {
    wx.showLoading();
  },

  clickGetPhoneNumber() {
    wx.showLoading();
  },

  handleGetPhoneNumber(e) {
    console.log('getUserPhoneNumber success===', e.detail)
    const { code, errMsg } = e.detail
    if (code) {
      wx.request({
        url: `${BASEURL}/minibackend/getUserPhone`,
        method: "POST",
        data: {
          appid: APPID,
          code: code, // 一次性验证码
          jscode: this.jscode,  // 可以根据业务需要存在miniback后端，这里是简单起见，直接存在小程序前端
        },
        success: (res) => {
          wx.hideLoading()
          console.log('getPhoneNumber request success===', res)
          const { statusCode = -1, data = {} } = res || {};
          if (statusCode === 200) {
            this.setData({
              phoneNumber: data.data
            })
          } else {
            const msg = res?.data?.returnMessage || res?.data || '/getUserPhone request fail'
            const errcode = res?.data?.returnCode || statusCode
            console.log('/getUserPhone request fail', res)
            wx.showModal({
              title: 'Failed to retrieve phone number',
              confirmText: 'Confirm',
              content: `/getUserPhone fail:${msg}[code:${errcode}]`,
              showCancel: false
            })
          }
        },
        fail: (err) => {
          wx.hideLoading()
          console.log('wx.request fail', err)
          wx.showModal({
            title: 'wx.request fail',
            confirmText: 'Confirm',
            content: err.errMsg,
            showCancel: false
          })
        },
      })
    } else {
      wx.hideLoading()
      console.log('getUserPhoneNumber does not return code', e.detail)
      wx.showModal({
        title: 'getUserPhoneNumber fail',
        confirmText: 'Confirm',
        content: errMsg,
        showCancel: false
      })
    }
  },

  handleGetEmailAddress(e) {
  console.log('getUserEmail success===', e.detail)
  const { code, errMsg } = e.detail
  if (code) {
    wx.request({
      url: `${BASEURL}/minibackend/getUserEmailDirect`,
      method: "POST",
      data: {
        appid: APPID,
        code: code, // 一次性验证码
        jscode: this.jscode,  // 可以根据业务需要存在miniback后端，这里是简单起见，直接存在小程序前端
      },
      success: (res) => {
        wx.hideLoading()
        console.log('getUserEmailDirect request success===', res)
        const { statusCode = -1, data = {} } = res || {};
        if (statusCode === 200) {
          this.setData({
            emailAddress: data.data
          })
        } else {
          const msg = res?.data?.returnMessage || res || '/getUserEmailDirect request fail'
          const errcode = res?.data?.returnCode || statusCode
          console.log('/getUserEmailDirect request fail', res)
          wx.showModal({
            title: 'Failed to retrieve email address',
            confirmText: 'Confirm',
            content: `/getUserEmailDirect fail:${msg}[code:${errcode}]`,
            showCancel: false
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log('wx.request fail', err)
        wx.showModal({
          title: 'wx.request fail',
          confirmText: 'Confirm',
          content: err.errMsg,
          showCancel: false
        })
      },
    })
  } else {
    wx.hideLoading()
    console.log('getEmailAddress does not return code', e.detail)
    wx.showModal({
      title: 'getEmailAddress fail',
      confirmText: 'Confirm',
      content: errMsg,
      showCancel: false
    })
  }
},

onChooseAvatar(e) {
    console.log('onChooseAvatar===', e)
    const { avatarUrl } = e.detail
    if(avatarUrl.includes('/tmp')) {
      const fs = wx.getFileSystemManager();
      fs.readFile({
        filePath: avatarUrl,
        encoding: 'base64',
        success: (data) => {
          this.setData({
            userHeadBase64: 'data:image/png;base64,' + data.data,
            userHead: 'data:image/png;base64,' + data.data
          })
        },
        fail: (err) => {
          console.error('readFile error===', err);
        }
      });
    }
    if(avatarUrl) {
      this.setData({
        userHead: avatarUrl,
      })
    }
  },

  nickNameChange(e) {
    console.log('nickNameChange===', e)
    this.setData({
      nickName: e.detail.value
    })
  }
})
