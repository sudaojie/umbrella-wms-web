import request from '@/utils/request'

let basePath = '/wms/adjust';

// 查询库存盘点调整单列表
export function listAdjust(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询库存盘点调整单详细
export function getAdjust(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增库存盘点调整单
export function addAdjust(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改库存盘点调整单
export function updateAdjust(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除库存盘点调整单
export function delAdjust(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
