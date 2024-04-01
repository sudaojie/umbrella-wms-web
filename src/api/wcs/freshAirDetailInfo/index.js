import request from '@/utils/request'

let basePath = '/wcs/freshAirDetailInfo';

// 查询WCS新风系统基本信息列表
export function listInfo(data) {
  return request({
    url: `${basePath}/list`,
    method: 'post',
    data: data
  })
}

export function saveData(data) {
  return request({
    url: `${basePath}/saveData`,
    method: 'post',
    data: data
  })
}

export function start(id) {
  return request({
    url: `${basePath}/start?id=` + id,
    method: 'get'
  })
}

export function pause(id) {
  return request({
    url: `${basePath}/pause?id=` + id,
    method: 'get'
  })
}

//查询爆闪灯列表
export function queryExplosiveFlashList() {
  return request({
    url: `${basePath}/queryExplosiveFlashList`,
    method: 'get'
  })
}

//保存爆闪灯 温湿度的区间范围
export function saveExplosiveFlash(data) {
  return request({
    url: `${basePath}/saveExplosiveFlash`,
    method: 'post',
    data: data
  })
}
