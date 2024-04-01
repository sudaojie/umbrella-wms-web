import request from '@/utils/request'

let basePath = '/stock/warning';

// 查询库存总览列表
export function listTblstock(data) {
  return request({
    url: `${basePath}/detainedList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询库存总览详细
export function getTblstock(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增库存总览
export function addTblstock(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改库存总览
export function updateTblstock(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除库存总览
export function delTblstock(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
