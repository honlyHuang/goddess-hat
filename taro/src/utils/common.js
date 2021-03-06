import Taro from '@tarojs/taro'
// import { getPassSdk } from '@/store/user'
// import { getLogger } from 'utils/logger'

// export {
  // getPassSdk,
// }

export const networkInfo = {
  isConnected: true,
  networkType: 'wifi'
}

const showNetworkTips = () => {
  Taro.showToast({
    title: '当前无网络，请重新联网',
    icon: 'none',
    duration: 3000
  })
}

Taro.getNetworkType({
  success: (res) => {
    networkInfo.isConnected = res.networkType !== 'none'
    networkInfo.networkType = res.networkType
    if (res.networkType === 'none') {
      showNetworkTips()
    }
  }
})

Taro.onNetworkStatusChange(function (res) {
  networkInfo.isConnected = res.isConnected
  networkInfo.networkType = res.networkType

  if (!res.isConnected) {
    showNetworkTips()
  }
})




export function $log(msg, arg2) {}

/**
 * $bi({ name: '', data: {} }) 或 $bi('', {})
 */
export function $bi(a, b) {
  let name
  let data
  if (!a) return
  if (typeof a === 'string') {
    name = a
    data = b
  } else {
    name = a.name
    data = a.data
  }

  let source = Taro.getStorageSync('source')
  let trackInfo = {
    e0: 1100,
    e1: name,
    e2: {
      source,
      ...(data || {})
    }
  }

  wx.bisdk && wx.bisdk.send && wx.bisdk.send(trackInfo)
  return {}
}

let _systemInfo = null
let _isXPhoneArea = null
export const getSystemInfo = () => {
  if (_systemInfo === null) {
    _systemInfo = Taro.getSystemInfoSync()
  }
  return _systemInfo
}


/** 判断是否是 IphoneX、iPhone 11 系列 */
export const isIphoneSafeArea = () => {
  if (_isXPhoneArea === null) {
    const { model = '', brand = '', statusBarHeight = 0 } = getSystemInfo()
    _isXPhoneArea = statusBarHeight === 44 && (model.includes('iPhone') || brand.includes('Apple') || brand.includes('iPhone') )
  }
  return _isXPhoneArea
}

export function percent(a, b) {
  return range(divide(a, b) * 100, 1, 100)
}

export function divide(a, b) {
  return (a / b) || 0
}

export function range(x, min, max, _default) {
  let result = Math.max(x, min)
  return Math.min(result, max) || _default || min
}

export function getOriginImgUrl(url = '') {
  let originUrl = url.split('?').length > 0 ? url.split('?')[0] : url

  return originUrl || ''
}


/**
 * 传入原始图片url，根据指定宽度获取图片地址，宽度大于`width`的时候会缩放至该宽度（等比）
 * 宽度小于改宽度的时候图片不缩放
 *
 * @export
 * @param {any} url
 * @param {any} width
 * @returns
 */
export function getImgByWidth(url, maxWidth, prefix = '?imageView2/2/w/') {
  let origin = getOriginImgUrl(url)
  return `${origin}${prefix}${maxWidth}`
}


/** 获取当前页面 */
export const getCurPage = () => {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/**
 * 获取gif第一帧
 */
export function pickGifFirst(imageUrl) {
  if (/\.gif/.test(imageUrl)) {
    return imageUrl + '?imageMogr2/format/png'
  }
  return imageUrl
}