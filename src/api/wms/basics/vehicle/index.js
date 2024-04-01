import request from '@/utils/request'

let basePath = '/basics/vehicle';

// 查询车辆基本信息列表
export function listVehicle(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询车辆基本信息详细
export function getVehicle(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增车辆基本信息
export function addVehicle(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改车辆基本信息
export function updateVehicle(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除车辆基本信息
export function delVehicle(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}

//检查数据
export function checkData(data){
  return request({
    url: `${basePath}/checkData`,
    method: 'post',
    data: data
  })
}