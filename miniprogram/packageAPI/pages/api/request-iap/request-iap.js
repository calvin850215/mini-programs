import { i18n,lang } from '../../../../i18n/lang'
Page({
  onShareAppMessage() {
    return {
      title: 'IAP Payment',
      path: 'packageAPI/pages/api/request-iap/request-iap'
    }
  },

  data: {
    theme: 'light',
    openId: 'o2fde6c3b48a17567zJjbrv91064',
    testConsumableProductId: 'zcoin_100_consumable_100coins', 
  },

  bindConsumableProductId(e) {
    this.setData({
      testConsumableProductId: e.detail.value
    })
  },

  checkConsumableProduct() {
    const consumableProductId = this.data.testConsumableProductId;
    console.log("checkConsumableProduct id:", consumableProductId)
    wx.invokeNativePlugin({
      api_name: 'isIAPProductAvailable',
      data: {
        productId: consumableProductId,
        type: 'consumable',
      },
      success: (res) => {
        console.log('===success[invokeNativePlugin isIAPProductAvailable consumable]===', res);
        wx.showToast({
          title: 'isAvailable:' + res.isAvailable,
        });
      },
      fail: (err) => {
        console.log('===err[invokeNativePlugin isIAPProductAvailable consumable]===', err);
      },
      complete(res) {
        console.log('===complete[invokeNativePlugin isIAPProductAvailable consumable]===', res);
      },
    })
  },

  purchaseConsumableProduct() {
    const consumableProductId = this.data.testConsumableProductId;
    const openId = this.data.openId;
    console.log("consumableProductId:", consumableProductId)
    wx.invokeNativePlugin({
      api_name: 'requestIAP',
      data: {
        productId: consumableProductId,
        type: 'consumable',
        openId: openId
      },
      success: (res) => {
        console.log('===success[invokeNativePlugin requestIAP consumable]===', res);
        wx.showToast({
          title: 'Complete purchase IAP product',
        });
      },
      fail: (err) => {
        console.log('===err[invokeNativePlugin requestIAP consumable]===', err);
        wx.showToast({
          title: 'Failed to purchase IAP product',
        });
      },
      complete(res) {
        console.log('===complete[invokeNativePlugin requestIAP consumable]===', res);
      },
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
