import request from '@/utils/request'

let basePath = '/basics/supplier';

// 查询供应商基本信息列表
export function listSupplier(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询供应商基本信息详细
export function getSupplier(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增供应商基本信息
export function addSupplier(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改供应商基本信息
export function updateSupplier(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除供应商基本信息
export function delSupplier(id) {
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