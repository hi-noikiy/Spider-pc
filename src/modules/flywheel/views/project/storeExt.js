export default function createStoreExt(data = {}) {
  return {
    "extEnable": true,
    "plugins": {},
    "pages": ["pages/home/index", "pages/auth-msg/auth-msg"],
    "window": {
      "backgroundColor": "#f3f3f3",
      "backgroundTextStyle": "light",
      "navigationBarBackgroundColor": "#fff",
      "navigationBarTitleText": "商家端",
      "navigationBarTextStyle": "black",
      "renderingMode": "mixed"
    },
    "extPages": {
      "pages/home/index": {
        "navigationBarTitleText": "商家端",
        "enablePullDownRefresh": true
      }
    },
    "extAppid": data.wechatAppId,
    // "navigateToMiniProgramAppIdList": ["wxa093e346aecb59fe"],
    "ext": {
      "theme": {
        "--color-primary": "#F14422",
        "--color-primary2": "rgb(252, 218, 211)",
        "--color-primary4": "rgb(249, 180, 167)",
        "--color-primary6": "rgb(247, 143, 122)",
        "--color-primary8": "rgb(244, 105, 78)"
      },
      "config": {
        "HOME_PATH": "/pages/home/index",
        "baseUrl": data.projectApi + '/',
        "IMG_HOST": data.cosHost,
        "appId": data.wechatAppId,
        "consumerWXAppId": data.consumerWXAppId,
      }
    }
  }
}