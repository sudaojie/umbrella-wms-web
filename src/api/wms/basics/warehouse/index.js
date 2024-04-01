import request from '@/utils/request'

let basePath = '/basics/warehouse';

// 查询仓库基本信息列表
export function listWarehouse(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询仓库基本信息详细
export function getWarehouse(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增仓库基本信息
export function addWarehouse(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改仓库基本信息
export function updateWarehouse(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除仓库基本信息
export function delWarehouse(id) {
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