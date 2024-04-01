import request from '@/utils/request'

let basePath = '/basics/location';

// 查询库位基本信息列表
export function listLocation(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询库位基本信息详细
export function getLocation(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增库位基本信息
export function addLocation(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改库位基本信息
export function updateLocation(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除库位基本信息
export function delLocation(id) {
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

export function getWarehouseData(){
  return request({
    url: `/basics/warehouse/getWarehouseData`,
    method: 'post'
  })
}

export function getAreaData(data){
  return request({
    url: `/basics/area/getAreaData`,
    method: 'post',
    data:data
  })
}
//获取打印数据
export function getPrintData(data){
  return request({
    url: `${basePath}/getPrintData`,
    method: 'post',
    data:data
  })
}