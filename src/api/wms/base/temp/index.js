import request from '@/utils/request'

let basePath = '/wms/temp';

// 查询模板配置列表
export function listTemp(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询模板配置详细
export function getTemp(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 验证模板id是否唯一
export function checkTempId(data) {
  return request({
    url: `${basePath}/checkTempId`,
    method: 'post',
    data: data
  })
}

// 新增模板配置
export function addTemp(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改模板配置
export function updateTemp(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除模板配置
export function delTemp(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}

// 查询模板配置列表
export function checkTempIdDistinct(data) {
  return request({
    url: `${basePath}/checkTempIdDistinct`,
    method: 'post',
    data: data
  })
}
