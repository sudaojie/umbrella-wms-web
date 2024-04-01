import request from '@/utils/request'

let basePath = '/wcs/deviceEarlyWarningInfo';

// 查询设备预警信息列表
export function listInfo(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询设备预警信息详细
export function getInfo(id) {
  return request({
    url: `${basePath}/getInfo`,
    method: 'get',
    params: {
      id: id
    }
  })
}
