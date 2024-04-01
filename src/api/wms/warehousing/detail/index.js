import request from '@/utils/request'

let basePath = '/warehousing/detail';

// 查询入库单详情信息列表
export function listDetail(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询入库单详情信息详细
export function getDetail(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增入库单详情信息
export function addDetail(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改入库单详情信息
export function updateDetail(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除入库单详情信息
export function delDetail(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
