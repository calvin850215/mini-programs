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
    openID: 'o2fde6c3b48a17567zJjbrv91064',
    testConsumableProductID: 'zcoin_100_consumable_100coins', 
  },

  bindConsumableProductID(e) {
    this.setData({
      testConsumableProductID: e.detail.value
    })
  },

  checkConsumableProduct() {
    const consumableProductID = this.data.testConsumableProductID;
    console.log("checkConsumableProduct id:", consumableProductID)
    wx.invokeNativePlugin({
      api_name: 'isIAPProductAvailable',
      data: {
        productID: consumableProductID,
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
    const consumableProductID = this.data.testConsumableProductID;
    const openID = this.data.openID;
    console.log("consumableProductID:", consumableProductID)
    wx.invokeNativePlugin({
      api_name: 'requestIAP',
      data: {
        productID: consumableProductID,
        type: 'consumable',
        openID: openID
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
