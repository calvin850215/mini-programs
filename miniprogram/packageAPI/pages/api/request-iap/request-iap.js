import { i18n,lang } from '../../../../i18n/lang'

const BASEURL = 'https://miniapp.appao.com'
const APPID = 'mpgmv9l06ptin91f'

Page({
  onShareAppMessage() {
    return {
      title: 'IAP Payment',
      path: 'packageAPI/pages/api/request-iap/request-iap'
    }
  },

  data: {
    theme: 'light',
    openId: 'oc24dee1668917551jyVXBk01729',
    testConsumableProductId: 'zcoin_100_consumable_100coins',
    merchantOrderId: '',
    transactionId: '',
    queryResult: '',
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

  queryTransactionId() {
    const transactionId = this.data.transactionId;
    if (!transactionId) {
      wx.showToast({ title: 'No Transaction ID', icon: 'none' });
      return;
    }
    wx.showLoading();
    wx.request({
      url: `${BASEURL}/minibackend/queryTransaction`,
      method: 'POST',
      data: {
        appId: APPID,
        transactionId: transactionId
      },
      success: (res) => {
        console.log('queryTransactionId success:', res);
        this.setData({ queryResult: JSON.stringify(res.data, null, 2) });
        wx.showToast({ title: 'Query success', icon: 'success' });
      },
      fail: (err) => {
        console.log('queryTransactionId fail:', err);
        this.setData({ queryResult: JSON.stringify(err, null, 2) });
        wx.showToast({ title: 'Query failed', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  queryMerchantOrderId() {
    const merchantOrderId = this.data.merchantOrderId;
    if (!merchantOrderId) {
      wx.showToast({ title: 'No Merchant Order ID', icon: 'none' });
      return;
    }
    wx.showLoading();
    wx.request({
      url: `${BASEURL}/minibackend/queryTransaction`,
      method: 'POST',
      data: {
        appId: APPID,
        merchantOrderId: merchantOrderId
      },
      success: (res) => {
        console.log('queryMerchantOrderId success:', res);
        this.setData({ queryResult: JSON.stringify(res.data, null, 2) });
        wx.showToast({ title: 'Query success', icon: 'success' });
      },
      fail: (err) => {
        console.log('queryMerchantOrderId fail:', err);
        this.setData({ queryResult: JSON.stringify(err, null, 2) });
        wx.showToast({ title: 'Query failed', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  purchaseConsumableProductWithCallback() {
    wx.showLoading()

    const consumableProductId = this.data.testConsumableProductId;
    const openId = this.data.openId;
    console.log("purchaseConsumableProductWithCallback consumableProductId:", consumableProductId)
    
    // First, create IAP order to get prepayId
    var url = `${BASEURL}/minibackend/createIapOrder`;
    wx.request({
      url: url,
      method: "POST",
      data: {
        appId: APPID,
        openId: openId
      },
      success: (res) => {
        console.log('wx.request createIapOrder url: ' + url + ' success===', res);
        const prepayId = res.data.data.prepayId;
        const merchantOrderId = res.data.data.merchantOrderId;
        this.setData({ merchantOrderId });
        
        // Then invoke native plugin with prepayId
        wx.invokeNativePlugin({
          api_name: 'requestIAP',
          data: {
            productId: consumableProductId,
            type: 'consumable',
            openId: openId,
            prepayId: prepayId
          },
          success: (res) => {
            const transactionId = res.transactionId;
            this.setData({ transactionId });
            console.log('===success[invokeNativePlugin requestIAP consumable with callback]===', res);
            wx.showToast({
              title: 'Complete purchase IAP product',
            });
            wx.hideLoading()
          },
          fail: (err) => {
            console.log('===err[invokeNativePlugin requestIAP consumable with callback]===', err);
            wx.showToast({
              title: 'Failed to purchase IAP product',
            });
            wx.hideLoading()
          },
          complete(res) {
            console.log('===complete[invokeNativePlugin requestIAP consumable with callback]===', res);
          },
        })
      },
      fail: (err) => {
        wx.hideLoading()
        console.log('wx.request create_iap_order fail', err);
        wx.showToast({
          title: 'Failed to create IAP order',
        });
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
