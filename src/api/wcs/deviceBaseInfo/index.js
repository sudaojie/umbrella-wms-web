import request from '@/utils/request'

let basePath = '/wcs/deviceBaseInfo';

// 查询WCS设备基本信息列表
export function listInfo(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询WCS设备基本信息详细
export function getInfo(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 查询可绑定传感器信息列表
export function getSensorInfoList(data) {
  return request({
    url: `${basePath}/getSensorInfoList`,
    method: 'post',
    data: data
  })
}

// 查询网关可绑定设备信息列表
export function getGateWayDeviceInfoList(data) {
  return request({
    url: `${basePath}/getGateWayDeviceInfoList`,
    method: 'post',
    data: data
  })
}

// 查询电表可绑定设备信息列表
export function getMeterDeviceInfoList(data) {
  return request({
    url: `${basePath}/getMeterDeviceInfoList`,
    method: 'post',
    data: data
  })
}

// 新增WCS设备基本信息
export function addInfo(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改WCS设备基本信息
export function updateInfo(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除WCS设备基本信息
export function delInfo(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}

// 查询指定区域内的摄像头列表
export function getCameraListByType(type) {
  return request({
    url: `${basePath}/getCameraListByType`,
    method: 'get',
    params: {
       type
    }
  })
}

// 查询指定区域内的摄像头列表
export function getCameraInfoById(id) {
  return request({
    url: `${basePath}/getCameraInfoById`,
    method: 'get',
    params: {
      id
    }
  })
}

// 指定摄像头播放摄像头
export function startPlay(ids) {
  return request({
    url: `${basePath}/startPlay`,
    method: 'get',
    params: {
      ids
    }
  })
}

// 调整指定摄像头方向
export function adjustCameraDirection(id, command) {
  return request({
    url: `${basePath}/adjustCameraDirection`,
    method: 'get',
    params: {
      id, command
    }
  })
}

// 获取摄像头分组列表
export function getCameraListGroup() {
  return request({
    url: `${basePath}/getCameraListGroup`,
    method: 'get',
  })
}

// 上传摄像头截图
export function uploadScreenShot(file) {
  return request({
    url: `${basePath}/uploadScreenShot`,
    method: 'post',
    data: file,
    headers: {
      'Content-Type': ''
    }
  })
}
