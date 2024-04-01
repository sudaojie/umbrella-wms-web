import request from '@/utils/request'

let basePath = '/basics/model';

// 查询托盘规格列表
export function listModel(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询托盘规格详细
export function getModel(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增托盘规格
export function addModel(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改托盘规格
export function updateModel(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除托盘规格
export function delModel(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
