import request from '@/utils/request'

let basePath = '/wcs/smartLightingDetailInfo';

// 查询WCS智慧照明系统基本信息列表
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

export function getBatchSetTime() {
  return request({
    url: `${basePath}/getBatchSetTime`,
    method: 'get'
  })
}

export function saveBatchSetTime(data) {
  return request({
    url: `${basePath}/saveBatchSetTime`,
    method: 'post',
    data: data
  })
}
