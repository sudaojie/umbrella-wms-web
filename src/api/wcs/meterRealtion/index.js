import request from '@/utils/request'

let basePath = '/wcs/meterDeviceRealtion';

// 查询WCS电表设备关联关系列表
export function listRealtion(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询设备信息下拉列表
export function listTypeDeviceInfos(deviceType) {
  return request({
    url: `${basePath}/listTypeDeviceInfos?deviceType=` + deviceType,
    method: 'get'
  })
}

// 查询WCS新风温湿度传感器关联关系详细
export function getRealtion(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 查询WCS电表设备关联关系
export function queryRelationById(id) {
  return request({
    url: `${basePath}/queryRelationById/${id}`,
    method: 'get'
  })
}

// 新增WCS新风温湿度传感器关联关系
export function addRealtion(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 新增WCS网关采集器关联关系
export function addGateWayRealtion(data) {
  return request({
    url: `${basePath}/addGateWayRelation`,
    method: 'post',
    data: data
  })
}

// 新增WCS电表设备关联关系
export function addMeterRealtion(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改WCS新风温湿度传感器关联关系
export function updateRealtion(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除WCS新风温湿度传感器关联关系
export function delRealtion(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
