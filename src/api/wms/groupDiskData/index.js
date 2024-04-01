import request from '@/utils/request'

let basePath = '/wms/groupDiskData';

// 查询已组盘托盘列表
export function getGroupDiskData(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询已组盘托盘上货物明细列表
export function getGoodsInfoOnGroupTray(data) {
  return request({
    url: `${basePath}/getGoodsInfoOnGroupTray?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
