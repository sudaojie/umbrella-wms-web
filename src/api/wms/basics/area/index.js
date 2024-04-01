import request from '@/utils/request'

let basePath = '/basics/area';

// 查询库区基本信息列表
export function listArea(data) {
  return request({
    url: `${basePath}/selectAreas?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询库区基本信息详细
export function getArea(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增库区基本信息
export function addArea(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改库区基本信息
export function updateArea(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除库区基本信息
export function delArea(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}

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
