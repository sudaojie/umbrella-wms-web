import request from '@/utils/request'

let basePath = '/wms/api';

// 获取堆垛机状态信息集合
export function getStackerStatusList() {
  return request({
    url: `${basePath}/getStackerStatusList`,
    method: 'post'
  })
}

