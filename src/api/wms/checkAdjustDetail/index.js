import request from '@/utils/request'

let basePath = '/wms/checkAdjustDetail';

// 查询库存盘点调整详情列表
export function listCheckAdjustDetail(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询库存盘点调整详情详细
export function getCheckAdjustDetail(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增库存盘点调整详情
export function addCheckAdjustDetail(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改库存盘点调整详情
export function updateCheckAdjustDetail(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除库存盘点调整详情
export function delCheckAdjustDetail(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
