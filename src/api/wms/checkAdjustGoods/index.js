import request from '@/utils/request'

let basePath = '/wms/checkAdjustGoods';

// 查询库存盘点调整详情货物列表
export function listCheckAdjustGoods(data) {
  return request({
    url: `${basePath}/list`,
    method: 'post',
    data: data
  })
}

// 查询库存盘点调整详情货物详细
export function getCheckAdjustGoods(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增库存盘点调整详情货物
export function addCheckAdjustGoods(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改库存盘点调整详情货物
export function updateCheckAdjustGoods(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除库存盘点调整详情货物
export function delCheckAdjustGoods(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
