import request from '@/utils/request'

let basePath = '/warehousing/goods';

// 查询入库单货物列表
export function listGoods(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询入库单货物详细
export function getGoods(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增入库单货物
export function addGoods(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改入库单货物
export function updateGoods(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除入库单货物
export function delGoods(id) {
  return request({
    url: `${basePath}/remove/${id}`,
    method: 'delete'
  })
}
