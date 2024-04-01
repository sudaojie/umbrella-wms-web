/*
 * @Date: 2023-02-23 16:59:20
 * @Description:
 * @LastEditors: jun
 * @FilePath: \umbrella-wms-web\src\api\wms\basics\config\index.js
 */
import request from '@/utils/request'

let basePath = '/wms/config';

// 查询wms参数配置列表
export function listConfig(data) {
  return request({
    url: `${basePath}/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

// 查询wms参数配置详细
export function getConfig(id) {
  return request({
    url: `${basePath}/getInfo/${id}`,
    method: 'get'
  })
}

// 新增wms参数配置
export function addConfig(data) {
  return request({
    url: `${basePath}/add`,
    method: 'post',
    data: data
  })
}

// 修改wms参数配置
export function updateConfig(data) {
  return request({
    url: `${basePath}/edit`,
    method: 'put',
    data: data
  })
}

// 删除wms参数配置
export function delConfig(wmsConfigId) {
  return request({
    url: `${basePath}/remove/${wmsConfigId}`,
    method: 'delete'
  })
}


// 获取agv列表
export function configData() {
  return request({
    url: `${basePath}/listAGV`,
    method: 'post',
    data: {}
  })
}

// 获取策略信息
export function configStrategy() {
  return request({
    url: `${basePath}/listConfig`,
    method: 'post',
    data: {}
  })
}

// 排序
export function configOrderBy() {
  return request({
    url: `/basics/area/findAreaData`,
    method: 'post',
    data: {}
  })
}

// 更新策略
export function configStrategySave(data) {
  return request({
    url: `${basePath}/editConfig`,
    method: 'put',
    data: data
  })
}
