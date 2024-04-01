import request from '@/utils/request'

let basePath = '/stock/account';

// 查询库存台账列表
export function listAccount(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
