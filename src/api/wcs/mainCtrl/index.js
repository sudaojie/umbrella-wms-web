import request from '@/utils/request'

// let basePath = '/wcs/mainCtrl';

// 存储区
export function selectBylayer(layer) {
  return request({
    url: `/basics/viewController/selectBylayerList`,
    method: 'post',
    data: {
      layer	: layer					//层号
    }
  })
}

// 获取理货区/晾晒区货位信息
export function selectLhList(data) {
  return request({
    url: `/basics/viewController/selectLhList`,
    method: 'post',
    data
  })
}

// 货物信息
export function cargoInfo(locationCode) {
  return request({
    url: `/basics/viewController/selectGoodsByLocCodeList`,
    method: 'post',
    data: {
      locationCode:locationCode
     }
  })
}


/**
 * 根据类型和内容进行筛选定位库位信息
 * @param searchInput  搜索内容
 * @param searchType   搜索类型(1.库位号  2.托盘号  3.机件号)
 */
export function searchLocationByParams(searchInput,searchType) {
  return request({
    url: `/basics/viewController/searchLocationByParams`,
    method: 'post',
    params: {
      searchInput,
      searchType
    }
  })
}


/**
 * 根据类型和内容进行筛选定位库位信息
 * @param searchInput  搜索内容
 * @param searchType   搜索类型(1.库位号  2.托盘号  3.机件号)
 */
export function updateTrayInfo(updateTrayInfoForm) {
  return request({
    url: `/basics/viewController/updateTrayInfo`,
    method: 'post',
    data:updateTrayInfoForm
  })
}


/**
 * 选中有托盘无货库位取盘
 * @param searchInput  库位信息
 */
export function locationRetrieval(Location) {
  return request({
    url: `/basics/viewController/locationRetrieval`,
    method: 'post',
    data:Location
  })
}

/**
 * 禁用库位
 * @param searchInput  库位信息
 */
export function upadateLocationEnable(Location) {
  return request({
    url: `/basics/viewController/upadateLocationEnable`,
    method: 'post',
    data:Location
  })
}
