import request from '@/utils/request'

let basePath = '/warning/config';

// 查询库存预警策略列表
export function listConfig(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询库存预警策略详细
export function getConfig(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增库存预警策略
export function addConfig(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改库存预警策略
export function updateConfig(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除库存预警策略
export function delConfig(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
