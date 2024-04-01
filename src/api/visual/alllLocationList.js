import request from '@/utils/request'


// 全部
export function allLocationList(data) {
  return request({
    url: `/basics/viewController/selectAllLocationList`,
    method: 'post',
    data:{}
  })
}

// 弹窗
export function cargoInfo(locationCode) {
  return request({
    url: `/basics/viewController/selectGoodsByLocCodeList`,
    method: 'post',
    data: {
      locationCode:locationCode
    }
  })
}


// 烟感
export function getInstrumentInformationByDeviceNo(deviceNo) {
  return request({
    url: `/basics/viewController/getInstrumentInformationByDeviceNo`,
    method: 'get',
    params: {
      deviceNo
    }
  })
}

