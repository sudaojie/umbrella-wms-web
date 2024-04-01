import request from '@/utils/request'

let basePath = '/wmsMoveList/moveBill';

// 查询移库单列表
export function listList(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询移库单详细
export function getList(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增移库单
export function addList(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改移库单
export function updateList(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除移库单
export function delList(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
