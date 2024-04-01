import request from '@/utils/request'

let basePath = '/stock/tblstock';

// 查询库存总览列表
export function listTblstock(data) {
  return request({
    url: `${basePath}/detailList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}

//查询仓库数据
export function getWarehouseData(){
  return request({
    url: `/basics/warehouse/getWarehouseData`,
    method: 'post'
  })
}

//库存货位信息数据
export function showTblstockDetail(data){
  return request({
    url: `${basePath}/showTblstockDetail?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'post',
    data: data
  })
}
