<template>
  <div>
    <div class="main-box">
      <div class="main-ctrl">
<!--        存储区货位-->
        <div class="storage-area" v-if="storageArea">
          <div class="main-left">
            <div class="layer-box" :class="[i == activeStatus  ? 'active' : '']" v-for="i of pageCount"
                 :key="i" @click="changeMsg(i)">
              <span>{{i}}层</span>
            </div>
          </div>
          <div class="main-center">
            <!--  存储区货位-->
            <div class="shelf-box">
              <div class="shelf-floor" :class="inAnimation?'anim':''" @animationend='inAnimation=false'>
                <div class="goods-shelves">
                  <div class="storey-box" ref="container">
                    <div class="goods-shelves-list">
                      <div class="goods-list-box drying-area-list"
                           :class="[item.locationStatus=='0'?'nervous-bg':'',
                                    item.locationStatus=='1'?'full-bg': '',
                                    item.locationStatus=='2'?'free-bg': '',
                                    item.locationStatus=='3'? 'forbidden-bg': '',
                                    item.locationCode == activeLocationCode ?'location-bg':'',
                                    index == locationTopAverage-1 ? 'shelvesAverageList':' ']"
                           v-for="(item,index) in goodsShelves.locationTop" :key="index"
                           @click="handleShowInfo(item)"
                           >
                        <el-popover
                          popper-class="main-pop"
                          placement="left"
                          width="400"
                          trigger="click">
                          <div class="popover-button" slot="reference">
                          </div>
                          <div class="pop-box" v-for="(itemInfo,index) in popList" :key="index">
                            <div class="pop-img">
                              <img src="@/assets/wcsImages/sk_icon.png" alt="">
                            </div>
                            <el-form class="pop-list" v-if="item.locationStatus=='0'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="货物类型：">{{itemInfo.goodsName}}</el-form-item>
                              <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                              <el-form-item label="计量单位：">{{itemInfo.measureUnit}}</el-form-item>
                              <el-form-item label="规格型号：">{{itemInfo.model}}</el-form-item>
                              <el-form-item label="货物数量：">{{itemInfo.num}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="库位状态： ">
                                <span>有货</span>
                              </el-form-item>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='1'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="库位状态：">
                                <span>有托盘无货</span>
                              </el-form-item>
                              <el-button size="small" type="success" round @click="locationRetrievals(itemInfo)">取盘</el-button>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='2'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="货位状态： " >
                                <span>无托盘</span>
                              </el-form-item>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='3'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="货位状态： " >
                                <span>禁用</span>
                              </el-form-item>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='4'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                            </el-form>
                          </div>
                        </el-popover>
                      </div>
                    </div>
                  </div>
                  <div class="storey-box">
                    <div class="goods-shelves-list">
                      <div class="goods-list-box drying-area-list"
                           :class="[item.locationStatus=='0'?'nervous-bg':'',
                                    item.locationStatus=='1'?'full-bg': '',
                                    item.locationStatus=='2'?'free-bg': '',
                                    item.locationStatus=='3'? 'forbidden-bg': '',
                                    item.locationCode == activeLocationCode ?'location-bg':'',
                                    index == locationCenterAverage-1 ? 'shelvesAverageList':' ']"
                           @click="handleShowInfo(item)"
                        v-for="(item,index) in goodsShelves.locationCenter" :key="index">
                        <el-popover
                          popper-class="main-pop"
                          placement="left"
                          width="400"
                          trigger="click"
                          >
                          <div class="popover-button" slot="reference"
                          >
                          </div>
                          <div class="pop-box"  v-for="(itemInfo,index) in popList" :key="index">
                            <div class="pop-img">
                              <img src="@/assets/wcsImages/sk_icon.png" alt="">
                            </div>
                            <el-form class="pop-list" v-if="item.locationStatus=='0'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="货物类型：">{{itemInfo.goodsName}}</el-form-item>
                              <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                              <el-form-item label="计量单位：">{{itemInfo.measureUnit}}</el-form-item>
                              <el-form-item label="规格型号：">{{itemInfo.model}}</el-form-item>
                              <el-form-item label="货物数量： ">{{itemInfo.num}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="库位状态： ">
                                <span>有货</span>
                              </el-form-item>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='1'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="库位状态：">
                                <span>有托盘无货</span>
                              </el-form-item>
                              <el-button size="small" type="success" round @click="locationRetrievals(itemInfo)">取盘</el-button>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='2'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="货位状态： " >
                                <span>无托盘</span>
                              </el-form-item>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='3'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="货位状态：" >
                                <span>禁用</span>
                              </el-form-item>
                            </el-form>
                            <el-form class="pop-list" v-else>
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                            </el-form>
                          </div>
                        </el-popover>
                      </div>
                    </div>
                  </div>
                  <div class="storey-box">
                    <div class="goods-shelves-list">
                      <div  class="goods-list-box drying-area-list"
                        :class="[item.locationStatus=='0'?'nervous-bg':'',
                                 item.locationStatus=='1'?'full-bg': '',
                                 item.locationStatus=='2'?'free-bg': '',
                                 item.locationStatus=='3'? 'forbidden-bg': '',
                                 item.locationCode == activeLocationCode ?'location-bg':'',
                                 index == locationBottomAverage-1 ? 'shelvesAverageList':' ']"
                        v-for="(item,index) in goodsShelves.locationBottom" :key="index"
                        @click="handleShowInfo(item)"
                      >
                        <el-popover
                          popper-class="main-pop"
                          placement="left"
                          width="400"
                          trigger="click"
                          >
                          <div  class="popover-button" slot="reference"
                          >
                          </div>
                          <div class="pop-box"  v-for="(itemInfo,index) in popList" :key="index">
                            <div class="pop-img">
                              <img src="@/assets/wcsImages/sk_icon.png" alt="">
                            </div>
                            <el-form class="pop-list" v-if="item.locationStatus=='0'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="货物类型：">{{itemInfo.goodsName}}</el-form-item>
                              <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                              <el-form-item label="计量单位：">{{itemInfo.measureUnit}}</el-form-item>
                              <el-form-item label="规格型号：">{{itemInfo.model}}</el-form-item>
                              <el-form-item label="货物数量：">{{itemInfo.num}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="库位状态： ">
                                <span>有货</span>
                              </el-form-item>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='1'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="库位状态：">
                                <span>有托盘无货</span>
                              </el-form-item>
                              <el-button size="small" type="success" round @click="locationRetrievals(itemInfo)">取盘</el-button>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='2'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="货位状态： " >
                                <span>无托盘</span>
                              </el-form-item>
                            </el-form>
                            <el-form class="pop-list" v-else-if="item.locationStatus=='3'">
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                              <el-form-item label="货位状态： " >
                                <span>禁用</span>
                              </el-form-item>
                            </el-form>
                            <el-form class="pop-list" v-else>
                              <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                              <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                              <el-form-item label="库位类型： ">{{itemInfo.locationType == '1' ? '母库位':'子库位'}}</el-form-item>
                            </el-form>
                          </div>
                        </el-popover>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--  理货、晾晒区货位-->
        <div class="" v-if="tallyingAndDryingArea">
          <div class="tallyArea">
            <div class="cargo-area-title">理货区货位</div>
            <div class="cargo-area-list">
              <div
                v-for="(item,index) in cargoAreaList" :key="index"
                @click="tallyAreaShowInfo(item)"  :style="{ marginRight: index === 3 ? '50px' : '0' }"
              >
                <el-popover
                  popper-class="main-pop"
                  placement="bottom"
                  width="400"
                  trigger="click"
                >
                  <div class="goods-list-box"
                       v-for="(item,index) in item" :key="item.locationStatus" slot="reference"
                       :class="[item.locationStatus=='0'?'nervous-bg':'',
                                item.locationStatus=='1'?'full-bg': '',
                                item.locationStatus=='2'?'free-bg': '',
                                item.locationCode == activeLocationCode ?'location-bg':'',
                                item.locationStatus=='3'? 'forbidden-bg': '',]">
                  </div>
                  <div class="pop-box" v-for="(itemInfo,index) in popList" :key="index" >
                    <div class="pop-img">
                      <img src="@/assets/wcsImages/sk_icon.png" alt="">
                    </div>
                    <el-form class="pop-list" v-if="itemInfo.locationStatus=='0'">
                      <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                      <el-form-item label="货物类型：">{{itemInfo.goodsName}}</el-form-item>
                      <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                      <el-form-item label="计量单位：">{{itemInfo.measureUnit}}</el-form-item>
                      <el-form-item label="规格型号：">{{itemInfo.model}}</el-form-item>
<!--                      <el-form-item label="货物数量： ">{{itemInfo.num}}</el-form-item>-->
                      <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                      <el-form-item label="库位状态： ">
                        <span>有货</span>
                      </el-form-item>
                    </el-form>
                    <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='1'">
                      <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                      <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                      <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                      <el-form-item label="库位状态：">
                        <span>有托盘无货</span>
                      </el-form-item>
                    </el-form>
                    <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='2'">
                      <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                      <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                      <el-form-item label="货位状态：" >
                        <span>无托盘</span>
                      </el-form-item>
                    </el-form>
                    <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='3'">
                      <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                      <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                      <el-form-item label="货位状态：" >
                        <span>禁用</span>
                      </el-form-item>
                    </el-form>
                    <el-form class="pop-list" v-else>
                      <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                    </el-form>
                  </div>
                </el-popover>
              </div>

              </div>
            </div>
          <div class="tallyArea tallyArea-interval">
            <div class="cargo-area-title">晾晒区货位</div>
            <div class="drying-area-content">
              <div class="interval-list cargo-area-list drying-area drying-area-up" v-for="(item,index) in dryingAreaList.upFine" :key="item.locationCode">
                <div
                  v-for="(item,index) in item" :key="item.locationCode"
                  @click="handleShowInfo(item)">
                  <el-popover
                    popper-class="main-pop"
                    placement="bottom"
                    width="400"
                    trigger="click"
                  >
                    <div class="goods-list-box"
                         :class="[item.locationStatus=='0'?'nervous-bg':'',
                                  item.locationStatus=='1'?'full-bg': '',
                                  item.locationStatus=='2'?'free-bg': '',
                                  item.locationCode == activeLocationCode ?'location-bg':'',
                                  item.locationStatus=='3'? 'forbidden-bg': '',]"
                         slot="reference">
                    </div>
                    <div class="pop-box"  v-for="(itemInfo,index) in popList" :key="index + '-only'">
                      <div class="pop-img">
                        <img src="@/assets/wcsImages/sk_icon.png" alt="">
                      </div>
                      <el-form class="pop-list" v-if="itemInfo.locationStatus=='0'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="货物类型：">{{itemInfo.goodsName}}</el-form-item>
                        <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                        <el-form-item label="计量单位：">{{itemInfo.measureUnit}}</el-form-item>
                        <el-form-item label="规格型号：">{{itemInfo.model}}</el-form-item>
                        <!--                      <el-form-item label="货物数量： ">{{itemInfo.num}}</el-form-item>-->
                        <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="库位状态： ">
                          <span>有货</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='1'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                        <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="库位状态：">
                          <span>有托盘无货</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='2'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="货位状态：" >
                          <span>无托盘</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='3'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="货位状态：" >
                          <span>禁用</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else>
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                      </el-form>
                    </div>
                  </el-popover>
                </div>
              </div>
              <div class="drying-area-formal">
                <div class="interval-list cargo-area-list drying-area-formal-list" v-for="(item,index) in dryingAreaList.formal" :key="item.locationCode">
                <div
                  v-for="(item,index) in item" :key="item.locationCode"
                  :class="index == average ? 'averageList':' '"
                  @click="handleShowInfo(item)">
                  <el-popover
                    popper-class="main-pop"
                    placement="bottom"
                    width="400"
                    trigger="click"
                  >
                    <div class="goods-list-box"
                         :class="[item.locationStatus=='0'?'nervous-bg':'',
                                    item.locationStatus=='1'?'full-bg': '',
                                    item.locationStatus=='2'?'free-bg': '',
                                    item.locationCode == activeLocationCode ?'location-bg':'',
                                    item.locationStatus=='3'? 'forbidden-bg': '',]"
                         slot="reference">
                    </div>
                    <div class="pop-box"  v-for="(itemInfo,index) in popList" :key="index + '-only'">
                      <div class="pop-img">
                        <img src="@/assets/wcsImages/sk_icon.png" alt="">
                      </div>
                      <el-form class="pop-list" v-if="itemInfo.locationStatus=='0'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="货物类型：">{{itemInfo.goodsName}}</el-form-item>
                        <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                        <el-form-item label="计量单位：">{{itemInfo.measureUnit}}</el-form-item>
                        <el-form-item label="规格型号：">{{itemInfo.model}}</el-form-item>
                        <!--                      <el-form-item label="货物数量： ">{{itemInfo.num}}</el-form-item>-->
                        <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="库位状态： ">
                          <span>有货</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='1'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                        <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="库位状态：">
                          <span>有托盘无货</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='2'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="货位状态：" >
                          <span>无托盘</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='3'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="货位状态：" >
                          <span>禁用</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else>
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                      </el-form>
                    </div>
                  </el-popover>
                </div>
              </div>
              </div>
              <div class="interval-list cargo-area-list drying-area drying-area-down" v-for="(item,index) in dryingAreaList.downFine" :key="item.locationCode">
                <div
                  v-for="(item,index) in item" :key="item.locationCode"
                  @click="handleShowInfo(item)">
                  <el-popover
                    popper-class="main-pop"
                    placement="bottom"
                    width="400"
                    trigger="click"
                  >
                    <div class="goods-list-box"
                         :class="[item.locationStatus=='0'?'nervous-bg':'',
                                  item.locationStatus=='1'?'full-bg': '',
                                  item.locationStatus=='2'?'free-bg': '',
                                  item.locationCode == activeLocationCode ?'location-bg':'',
                                  item.locationStatus=='3'? 'forbidden-bg': '',]"
                         slot="reference">
                    </div>
                    <div class="pop-box" v-for="(itemInfo,index) in popList" :key="index + '-only'">
                      <div class="pop-img">
                        <img src="@/assets/wcsImages/sk_icon.png" alt="">
                      </div>
                      <el-form class="pop-list" v-if="itemInfo.locationStatus=='0'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="货物类型：">{{itemInfo.goodsName}}</el-form-item>
                        <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                        <el-form-item label="计量单位：">{{itemInfo.measureUnit}}</el-form-item>
                        <el-form-item label="规格型号：">{{itemInfo.model}}</el-form-item>
                        <!--                      <el-form-item label="货物数量： ">{{itemInfo.num}}</el-form-item>-->
                        <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="库位状态： ">
                          <span>有货</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='1'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="托盘号：">{{itemInfo.trayCode}}</el-form-item>
                        <el-form-item label="排序值： ">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="库位状态：">
                          <span>有托盘无货</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='2'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="货位状态：" >
                          <span>无托盘</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else-if="itemInfo.locationStatus=='3'">
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                        <el-form-item label="排序值：">{{itemInfo.orderNo}}</el-form-item>
                        <el-form-item label="货位状态：" >
                          <span>禁用</span>
                        </el-form-item>
                      </el-form>
                      <el-form class="pop-list" v-else>
                        <el-form-item label="库位号：">{{itemInfo.locationCode}}</el-form-item>
                      </el-form>
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
            </div>
        </div>
          <ul class="status-description">
            <li>
              <span class="null-box"></span>
              <span>无托盘</span>
            </li>
            <li>
              <span class="pallet-box"></span>
              <span>有托盘无货</span>
            </li>
            <li>
              <span class="live-box"></span>
              <span>有货</span>
            </li>
            <li>
              <span class="forbidden-box"></span>
              <span>禁用</span>
            </li>
          </ul>
          <div class="tab-shelf">
            <div class="tab-shelf-list" :class="{tabActive:dayIndex==0}" @click="tabButton(0)">存储区<br />货位
            </div>
            <div class="tab-shelf-list" :class="{tabActive:dayIndex==1}" @click="tabButton(1)">
              理货、晾<br />晒区货位</div>
          </div>
      </div>
        <div class="main-right">
          <div class="main-right-box">
            <div class="right-list search-box">
              <div class="search-title">查询</div>
              <el-select v-model="screenValue" placeholder="请选择" @change="screenChange">
                <el-option
                  v-for="item in screenOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div style="display: flex;align-items: center">
                <el-input size="medium" placeholder="请输入内容搜索" suffix-icon="el-icon-search"
                          v-model="searchInput">
                </el-input>
                <el-button size="small" type="primary" style="width: 85px;margin-left: 20px;margin-bottom: 8px;" @click="handlerChange">查询</el-button>
              </div>

              <el-descriptions title="库位信息" :column="1" border>

                <template v-for="(item,index) in cargoInfoList" >

                  <el-descriptions-item key="index"
                                        label="操作">
                    <el-button size="small" type="primary" icon="el-icon-edit" @click="updateTrayInfo(item)">修改托盘</el-button>
                  </el-descriptions-item>

                  <el-descriptions-item key="index"
                       label="托盘号">
                       {{item.trayCode}}
                  </el-descriptions-item>
                     <el-descriptions-item key="index"
                                           label="库位号"> {{item.locationCode}}</el-descriptions-item>
                     <el-descriptions-item key="index"
                                           label="货物状态">
                       <span v-if="item.locationStatus === '0'">有货</span>
                       <span v-if="item.locationStatus === '1'">有托盘无货</span>
                       <span v-if="item.locationStatus === '2'">无托盘</span>
                       <span v-if="item.locationStatus === '3'">禁用</span>
                       <el-descriptions-item key="index"
                                             label="货物编号"> {{item.info}}</el-descriptions-item>
                       </el-descriptions-item>
                     <el-descriptions-item key="index"
                                           label="货物名称"> {{item.goodsCode}}</el-descriptions-item>
                     <el-descriptions-item key="index"
                                           label="规格型号"> {{item.goodsName}}</el-descriptions-item>
                     <el-descriptions-item key="index"
                                           label="计量单位"> {{item.model}}</el-descriptions-item>
                     <el-descriptions-item key="index"
                                           label="数量">
                         <span class="num-click" @click="goodsNumClick"> {{item.num === 0 ? "" : ""+ item.num +""}}</span>
                       <!--<el-dialog :title="dialogGoodsName" :visible.sync="partCodeDialogVisible">-->
                       <!--  <ul class="part-code">-->
                       <!--    <li v-for="item in partCodeList" :key="item" >{{item}}</li>-->
                       <!--  </ul>-->
                       <!--</el-dialog>-->
                       <el-dialog title="机件号列表" v-loading="print.loading" :visible.sync="print.open" width="60%" append-to-body>
                         <div class="demo-image">
                           <div v-for="item in print.dataList" class="block">
                             <div style="display: flex;align-items: center;">
                               <div style="flex: 4;margin-left: 10px;">
                                 <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                                   <div style="width: 30%;border-right: solid black 1px;">批 次 号</div>
                                   <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.charg }}</div>
                                 </div>
                                 <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                                   <div style="width: 30%;border-right: solid black 1px;">货物编码</div>
                                   <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.goodsCode }}</div>
                                 </div>
                                 <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                                   <div style="width: 30%;border-right: solid black 1px;">货物规格</div>
                                   <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.model }}</div>
                                 </div>
                                 <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                                   <div style="width: 30%;border-right: solid black 1px;">计量单位</div>
                                   <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.jldw }}</div>
                                 </div>
                                 <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                                   <div style="width: 30%;border-right: solid black 1px;">供 应 商</div>
                                   <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.gys }}</div>
                                 </div>
                                 <div style="border: solid black 1px;height: 60px;display: flex;align-items: center;justify-content: space-around;">
                                   <div style="width: 30%;height: 100%;;border-right: solid black 1px;">货物描述</div>
                                   <div style="width: 70%;height: 100%;text-align: left;padding-left: 5px;">{{ item.goodsName }}</div>
                                 </div>
                               </div>
                               <div style="flex:2;">
                                 <el-image style="width: 75%; height: 75%" :src="item.url" fit="cover" />
                                 <span class="demonstration code">{{ item.code }}</span>
                               </div>
                             </div>
                           </div>
                         </div>
                         <div slot="footer" class="dialog-footer">
                           <el-button @click="print.open = false">取 消</el-button>
                         </div>
                       </el-dialog>

                     </el-descriptions-item>
                   </template>
                 </el-descriptions>
              <el-empty v-if="emptyShow" :image-size="100"></el-empty>
            </div>
            <el-collapse accordion>
              <el-collapse-item>
              <template slot="title"> 禁用库位<i class="header-icon el-icon-info"></i> </template>
                  <el-descriptions class="disable-box">
                    <el-descriptions-item key="index" label="存储区1">
                      <el-button type="warning" size="mini" round icon="el-icon-star-off" @click="updateEnableLocalhost('CCQ01',true)">禁用</el-button>
                      <el-button type="success" size="mini" round icon="el-icon-edit" @click="updateEnableLocalhost('CCQ01',false)">解禁</el-button>
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-descriptions class="disable-box">
                    <el-descriptions-item key="index" label="存储区3">
                      <el-button type="warning" size="mini" round icon="el-icon-star-off" @click="updateEnableLocalhost('CCQ03',true)">禁用</el-button>
                      <el-button type="success" size="mini" round icon="el-icon-edit" @click="updateEnableLocalhost('CCQ03',false)" >解禁</el-button>
                    </el-descriptions-item>
                  </el-descriptions>
              </el-collapse-item>
            </el-collapse>
            <div class="right-list info-box">
              <el-descriptions title="设备状态" :column="1">
                <el-descriptions-item v-for="item in statusDevice" :key="item.state" :label="item.name">
                  <div :class="[item.state=='联机'?'free':[item.state=='手动'?'full':'nervous']]">
                    {{item.state}}</div>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </div>
    </div>

    <el-dialog class="updateTrayInfoDialog" title="修改托盘" :visible.sync="updateTrayInfoDialogView" width="60%" append-to-body>
      <el-form ref="updateTrayInfoForm" :model="updateTrayInfoForm" label-width="80px">
        <el-form-item label="库位号" style="margin-bottom: 20px">
          <el-input v-model="updateTrayInfoForm.locationCode" readonly></el-input>
        </el-form-item>
        <el-form-item label="托盘号">
          <el-input v-model="updateTrayInfoForm.trayCode" maxlength="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateTrayInfoDialogConfirm">修改</el-button>
        <el-button @click="updateTrayInfoDialogView = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { selectBylayer,selectLhList,cargoInfo,searchLocationByParams,updateTrayInfo,locationRetrieval,upadateLocationEnable } from '@/api/wcs/mainCtrl'
import { getStackerStatusList } from '@/api/wms/deviceStatus'
import {getIoPrintData} from "@/api/wms/warehousing/parts";
export default {
  data() {
    return {
      print: {
        loading: false,
        open: false,
        dataList: [],
      },
      updateTrayInfoDialogView:false,
      average:'',
      locationTopAverage:'',
      locationCenterAverage:'',
      locationBottomAverage:'',
      emptyShow:true,
      visiblepop:false,
      layer:'1',
      pageCount: 4,
      activeStatus: 1,
      dayIndex: 0,
      storageArea: true,
      tallyingAndDryingArea: false,
      updateTrayInfoForm:{
        trayCode: ''
      },
      goodsShelves: {
        layer: null,
        areaType:"0",
        locationTop:[
          // [
          //   // {locationCode: 'KW0002', locationStatus: '0'},
          //   // {locationCode: 'KW0004', locationStatus: '0'},
          //   // {locationCode: 'KW0008', locationStatus: '1'},
          //   // {locationCode: 'KW0006', locationStatus: '1'},
          //   // {locationCode: 'KW0010', locationStatus: '2'}
          // ],
        ],
        locationCenter:[],
        locationBottom:[],
      },
      cargoAreaList: [],
      dryingAreaList: {
        upFine: [],
        formal:[],
        downFine: [],
      },
      cargoInfoList: [],
      statusDevice: [
        {
          name: '堆垛机1',
          state: '联机'
        },
        {
          name: '堆垛机2',
          state: '联机'
        },
        {
          name: '堆垛机3',
          state: '联机'
        },
      ],
      popList:[],
      searchInput: '',
      activeLocationCode:'',
      inAnimation: true,
      screenOptions: [{
        value: '1',
        label: '库位号'
      }, {
        value: '2',
        label: '托盘号'
      }, {
        value: '3',
        label: '机件号'
      }],
      screenValue: '1',
      partCodeDialogVisible: false,
      dialogGoodsName:'',
      partCodeList:[

      ]
    };

  },
  mounted() {
    this.changeMsg(1)
    this.getList();
    getStackerStatusList().then(res => {
      let stackerStatusData = res.data;
      this.statusDevice = stackerStatusData;
    })
  },
  methods: {
    updateEnableLocalhost(areaId, flag) {
      let param = {
        "areaId": areaId,
        "flag": flag
      };
      upadateLocationEnable(param).then(res => {
        this.layerList();
        this.$message({
          message: res.msg,
          type: 'success'
        });
      });
    },

    //选中有托盘无货库位取盘
    locationRetrievals(item){
      locationRetrieval(item).then(res => {
        // this.layerList();
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },

    updateTrayInfo(item){
      this.updateTrayInfoDialogView = true;
      this.updateTrayInfoForm.locationCode = item.locationCode;
      this.updateTrayInfoForm.trayCode = item.trayCode
    },
    updateTrayInfoDialogConfirm(){
      updateTrayInfo(this.updateTrayInfoForm).then(res => {
        this.updateTrayInfoDialogView = false;
        this.layerList();
        this.getList();
        this.$message({
          message: '托盘信息修改成功',
          type: 'success'
        })
      })
    },
    // 存储区
    layerList(){
      selectBylayer(this.layer).then(res => {
        // console.log(res.data)
        let selectBylayerInfo = res.data
        if(selectBylayerInfo.locationData != ''){
          this.goodsShelves.locationTop = []
          this.goodsShelves.locationCenter = []
          this.goodsShelves.locationBottom = []
          selectBylayerInfo.locationData[0].locationList.forEach(item => {
            item.forEach(item => {
              this.goodsShelves.locationTop.push(
                {
                  locationStatus: item.locationStatus,
                  locationCode: item.locationCode,
                }
              )
            })
          })
          this.locationTopAverage = Object.keys(this.goodsShelves.locationTop).length/2;
          selectBylayerInfo.locationData[1].locationList.forEach(item => {
            item.forEach(item => {
              this.goodsShelves.locationCenter.push(
                {
                  locationStatus: item.locationStatus,
                  locationCode: item.locationCode,
                }
              )
            })
          })
          this.locationCenterAverage = Object.keys(this.goodsShelves.locationCenter).length/2;
          selectBylayerInfo.locationData[2].locationList.forEach(item => {
            item.forEach(item => {
              this.goodsShelves.locationBottom.push(
                {
                  locationStatus: item.locationStatus,
                  locationCode: item.locationCode,
                }
              )
            })
          })
          this.locationBottomAverage = Object.keys(this.goodsShelves.locationCenter).length/2;
        }else {
          this.goodsShelves.locationTop = []
          this.goodsShelves.locationCenter = []
          this.goodsShelves.locationBottom = []
        }
      })
    },
    // 详情弹窗接口
    infoDetails(){
      cargoInfo(this.locationCode).then(res => {
        let infoData = res.data
        this.popList = []
        if(this.locationCode){
          this.popList.push({
            locationStatus: infoData.locationStatus,
            locationCode: infoData.locationCode,
            goodsCode:infoData.goodsCode,
            trayCode: infoData.trayCode,
            measureUnit: infoData.measureUnit,
            model: infoData.model,
            num: infoData.num,
            // locationName: selectBylayerInfo.locationName,
            goodsName: infoData.goodsName,
            orderNo:infoData.orderNo,
            locationType: infoData.locationType
          })
        }
      })
    },
    // 存储区货位,理货、晾晒区货位切换
    tabButton(e) {
      this.dayIndex = e
      if (e == 0) {
        //Tab切换一
        this.storageArea = true
        this.tallyingAndDryingArea = false
        this.changeMsg(1)
      }
      if (e == 1) {
        //Tab切换二
        this.storageArea = false
        this.tallyingAndDryingArea = true
        this.getList()
      }
    },
    // 切换层数
    changeMsg(i) {
      this.activeStatus = i;
      this.inAnimation = !this.inAnimation;
      this.layer = i
      this.layerList()
    },
    // 存储区货位,理货、晾晒区货位详情
    getList(){
      selectLhList().then(res => {
        console.log(res.data)
        // 理货区货位
        let tallyAreaInfo = res.data.tallyArea.locationList
        tallyAreaInfo.forEach(item => {
          this.cargoAreaList = []
          this.dryingAreaList.upFine =[]
          this.dryingAreaList.formal =[]
          this.dryingAreaList.downFine = []
          item.forEach(item => {
            let cargoInfo = [{
              locationStatus: item.locationStatus,
              locationCode: item.locationCode,
            }]
            this.cargoAreaList.push(cargoInfo)
          })
        })
        // 晾晒区货位
        let selectLhListInfo = res.data.sunCureArea.locationList
        this.dryingAreaList.upFine = selectLhListInfo.upFine
        this.dryingAreaList.formal = selectLhListInfo.formal
        this.dryingAreaList.downFine = selectLhListInfo.downFine
        this.dryingAreaList.formal.forEach(item => {
          this.average = Math.round(Object.keys(item).length/2.5);
        })
      })
    },
    // 详情
    handleShowInfo(item){
      this.locationCode = item.locationCode
      this.infoDetails()
      // this.visiblepop=!this.visiblepop
      this.searchInput = item.locationCode;
      this.screenValue = '1';
      this.handlerChange();
    },
    tallyAreaShowInfo(item){
      item.forEach(item => {
        this.locationCode = item.locationCode
        this.searchInput = item.locationCode;
        this.screenValue = '1';
        this.infoDetails();
        this.handlerChange();
      })

    },
    handlerChange(e){
      searchLocationByParams(this.searchInput,this.screenValue).then(res => {
        let cargoInfoData = res.data;
        this.dialogGoodsName = cargoInfoData.goodsName + '-机件号列表';
        if(res.data.goodsDetailVoList !== null && res.data.goodsDetailVoList !== undefined && res.data.goodsDetailVoList.length > 0){
          this.partCodeList = res.data.goodsDetailVoList.map(item=>{return item.partCode});
        }else{
          this.partCodeList = [];
        }
        this.locationCode = cargoInfoData.locationCode;
        this.cargoInfoList = [];
        if (this.searchInput != '') {
            if(cargoInfoData.locationName.indexOf('晾晒区') !== -1 || cargoInfoData.locationName.indexOf('理货区') !== -1){
              this.storageArea = false
              this.dayIndex = 1
              this.tallyingAndDryingArea = true
              this.getList()
        } else {
              this.storageArea = true
              this.dayIndex = 0
              this.tallyingAndDryingArea = false
        }
        this.cargoInfoList.push(
              {
                trayCode: cargoInfoData.trayCode,
                locationCode: cargoInfoData.locationCode,
                locationStatus: cargoInfoData.locationStatus,
                goodsCode: cargoInfoData.goodsCode,
                goodsName: cargoInfoData.goodsName,
                model: cargoInfoData.model,
                measureUnit: cargoInfoData.measureUnit,
                num: cargoInfoData.num
              }
        )
        this.emptyShow = false
        this.activeLocationCode = cargoInfoData.locationCode
        let str = this.activeLocationCode.slice(10, 11)
        this.activeStatus = str;
        this.layer = str
        // 点击空白处去除样式
        document.addEventListener("click",e => {
          if(e.target.className !== 'location-bg'){
            this.activeLocationCode = ''
          }
        })
        // 存储区
        this.layerList()
        } else {
          this.cargoInfoList = []
          this.emptyShow = true
          this.activeLocationCode = ''
          this.activeStatus = '1';
          this.layer = '1'
          // 存储区
          this.layerList()
        }
      })
    },
    // 筛选下拉框
    screenChange(value) {
      this.screenValue = value;
    },
    goodsNumClick() {
      this.print.open = true;
      let sendData = {
        partCodes: this.partCodeList.join(','),
        type:'0'
      };

      getIoPrintData(sendData).then(res => {
        this.print.open = true;
        this.print.dataList = res.data;
        this.print.dataList.forEach(item => {
          let src = process.env.VUE_APP_BASE_API + item.url;
          item.url = src
        });
      })
    }
  }
};
</script>

<style scoped>
.el-collapse-item__header {
  font-size: 17px;
  color:red;
}
.main-box {
  display: flex;
}

.main-ctrl {
  flex: 1;
  position: relative;
  border-right: 1px solid #DFE4ED;
}

.storage-area {
  display: flex;
}

.main-left {
  width: 100px;
  /*float: left;*/
  /*height: 880px;*/
}

.layer-box {
  width: 83px;
  height: 30px;
  background: #F0F7FF;
  color: #666;
  border-radius: 3px;
  line-height: 30px;
  margin: 10px 0;
  text-align: center;
  cursor: pointer;
}

.active {
  background: #409EFF;
  color: #fff;
}

.main-center {
  flex: 1;
  margin: 0 10px;
  padding-left: 10px;
  border-left: 1px solid #DFE4ED;
  position: relative;
}

.main-center .shelf-box {
  width: 94%;
  float: left;
}

.main-center .shelf-floor {}

.main-center .goods-shelves {
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
  margin-bottom: 30px;
}
.main-center .goods-shelves .storey-box{
  /*margin-bottom: 20px;*/
  width: 100%;
}
.main-center .goods-shelves .goods-shelves-list{
  width: 100%;
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
}
.main-center .goods-shelves .goods-list-box {
  /*margin: 5px;*/
  /*width: 40px;*/
  /*height: 40px;*/
  /*flex: 0 0 3.7%;*/
  /*border: 1px solid #FFCF8E;*/
  /*border-radius: 8px;*/
  /*position: relative;*/
  /*overflow: hidden;*/
}
.main-center .goods-shelves .drying-area-list{
  flex: 0 0 2.9%;
  margin: 0.3%;
  height: 30px;
  /*height: 0;*/
  /*min-height:16px;*/
  /*padding-bottom: 2.9%;*/
  border-radius: 8px;
  border: 1px solid #FFCF8E;
  cursor: pointer;
}
/* 去除每行尾多余的边距 */
/*.main-center .goods-shelves .drying-area-list:nth-child(27) {*/
/*  margin-right: 0;*/
/*}*/
.main-center .goods-shelves .drying-area-list .popover-button{
  width: 100%;
  height: 100%;
  display: block;
}
/*.main-center .goods-shelves .goods-list-box:focus,*/
/*.main-center .goods-shelves .goods-list-box:hover,*/
/*.cargo-area-list .goods-list-box:focus,*/
/*.cargo-area-list .goods-list-box:hover{*/
/*  background: #409EFF;*/
/*  border: 3px solid #007EFF;*/
/*}*/
.main-center .goods-shelves .drying-area-list .popover-button:focus{
  background: #409EFF;
  border: 3px solid #007EFF;
  border-radius: 8px;
}
.main-center .goods-shelves .location-bg{
  background: #409EFF;
  border: 3px solid #007EFF;
  border-radius: 8px;
}

.location-bg{
  background: #409EFF !important;
  border: 3px solid #007EFF !important;;
  border-radius: 8px !important;;
}

/*无托盘 2*/
.free-bg {
  background: #fff;
  border: 1px solid #DFE4ED;
}

/*有货 0*/
.nervous-bg {
  background: #FFB550;
  border: 1px solid #FF9300;
}

/*有托盘无货 1*/
.full-bg {
  background: #FFE8CA;
  border: 1px solid #FFCF8E;
}
/*禁用 3*/
.forbidden-bg{
  background: #f11a52;
  border: 1px solid #c41744;
}

.shelf-floor-title {
  color: #666;
  text-align: center;
  font-size: 18px;
  margin-bottom: 50px;
}

.shelf-num {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.shelf-num span {
  display: inline-block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px solid #7f7f7f;
}

.shelf-num .total-reset {
  height: 40px;
  min-width: 100px;
  line-height: 40px;
  padding: 0 10px;
  background: #f59a23;
  border-radius: 3px;
  margin-left: 20px;
  text-align: center;
}

.null-box {}

.tab-shelf {
  position: absolute;
  right: 0;
  top: 350px;
}

.tab-shelf .tab-shelf-list {
  width: 80px;
  /*height: 60px;*/
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  background: #F5F7FA;
  margin-bottom: 10px;
  color: #6F7071;
  cursor: pointer;
}

.tab-shelf .tab-shelf-list.tabActive {
  background: #409EFF;
  color: #FFF;
}

.status-description {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-description li {
  list-style: none;
  line-height: 30px;
  /*margin: 0 10px;*/
}

.status-description li span {
  display: inline-block;
  vertical-align: middle;
  margin: 0 5px;
}

.status-description li .null-box {
  width: 30px;
  height: 30px;
  background: #FFFFFF;
  border: 1px solid #DFE4ED;
  border-radius: 5px;
}

.status-description li .pallet-box {
  width: 30px;
  height: 30px;
  background: #FFE8CA;
  border: 1px solid #FFCF8E;
  border-radius: 5px;
}

.status-description li .live-box {
  width: 30px;
  height: 30px;
  background: #FFB550;
  border: 1px solid #FF9300;
  border-radius: 5px;
}
.status-description li .forbidden-box{
  width: 30px;
  height: 30px;
  background: #f11a52;
  border: 1px solid #c41744;
  border-radius: 5px;
}

.main-right {
  width: 280px;
  margin-left: 15px;
  /*background: #00C6B3;*/
}

.main-right .main-right-box .right-list {
  width: 100%;
  padding: 20px;
  border-radius: 10px;
}

.main-right .main-right-box .search-box {
  min-height: 420px;
  background: #F5F7FA;
  margin-bottom: 20px;
}

.main-right .main-right-box .search-box .search-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  line-height: 30px;
  margin-bottom: 10px;
}

.main-right .main-right-box .info-box {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.main-right .main-right-box .search-box .el-select{
  width: 100%;
  margin-bottom: 10px;
}
.main-right .main-right-box .search-box .el-input {
  width: 100%;
  margin-bottom: 10px;
}

::v-deep .el-input__suffix {
  color: #409EFF;
}


::v-deep .el-descriptions__title {
  margin: 5px 0 5px 80px;
}

::v-deep .el-descriptions__body {
  border-radius: 3px;
}

::v-deep .el-descriptions--medium.is-bordered .el-descriptions-item__cell {
  padding: 0px;
  height: 35px;
  line-height: 33px;
  text-align: center;

}
::v-deep .search-box .el-descriptions-item__content {
  padding-left: 10px;
  text-align: left;

}

::v-deep .search-box .el-descriptions-item__label {
  /*text-align: right;*/
  width: 80px;
  background: #F5F5F5;
  display: inline-block;
}

::v-deep .el-descriptions-item__content {
  width: 100%;
}

::v-deep .info-box .el-descriptions-item__content {
  justify-content: right;
  text-align: left;
}

::v-deep .info-box .el-descriptions-item__content div {
  width: 50px;
  height: 23px;
  line-height: 23px;
  font-size: 12px;
  text-align: center;
  border-radius: 10px;
  color: #fff;
}

.info-box .free {
  background: #7DB137;
}

.info-box .nervous {
  background: #F6350E;
}

.info-box .full {
  background: #FF9300;
}

.el-popover__reference {
  cursor: pointer;
}

.anim {
  animation: showMsg 1s;
}

@keyframes showMsg {
  from {
    opacity: 0;
  }

  to {
    opacity: 1
  }
}


::v-deep .empty-list {
  width: 100% !important;
  margin: 10px 0 !important;
}

/*理货、晾 晒区货位*/
.cargo-area-title {
  text-align: center;
  font-size: 18px;
  margin: 10px 0;
  /*font-weight: bold;*/
}

.cargo-area-list {
  /*margin: 10px 0;*/
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-flow: row wrap;
}

/*.tallyArea-interval .interval-list:nth-of-type(4){*/
/*  margin-bottom: 60px !important;*/
/*}*/
/*.tallyArea-interval .interval-list:nth-of-type(5){*/
/*  margin-top: 30px;*/
/*}*/
.cargo-area-list .goods-list-box {
  margin: 5px;
  width: 40px;
  height: 40px;
  /*border: 1px solid #FFCF8E;*/
  border-radius: 8px;
  /*position: relative;*/
  /*overflow: hidden;*/
}
.cargo-area-list .goods-list-box:focus,
.cargo-area-list .goods-list-box:hover{
  background: #409EFF;
  border: 3px solid #007EFF;
}
.drying-area{
  display: flex;
  /*flex-direction:column;*/
  align-items: center;
  align-content: center;
}
/*修改晾晒区样式*/
.drying-area-content{
  position: relative;
  min-height: 490px;
}
.drying-area-formal{
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.drying-area-up{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-110%,-50%);
  z-index:1;
}
.drying-area-down{
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(107.5%,-50%);
}
.drying-area-formal-list{
  flex-direction:column;
}
.drying-area-formal-list:first-child{
  margin-right: 60px;
}
.pop-box{
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.pop-box .pop-list{
  width: 65%;
  /*margin-top: 15px;*/
}
::v-deep .el-form-item--medium .el-form-item__label{
  width: 70px;
  text-align: right;
}

::v-deep .el-form-item--medium .el-form-item__label,
::v-deep .el-form-item--medium .el-form-item__content {
  line-height: 22px;
}
.pop-box .pop-img{
  width: 140px;
  height: 140px;
  background: #FFFFFF;
  border-radius: 15px;
  margin-right: 10px;
  position: relative;
}
.pop-img img{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.el-form-item{
  margin-bottom: 0px;
  color: #fff;
}
::v-deep .el-form-item__label{
  color: #fff;
  padding: 0;
}
@media screen and (max-width : 1440px) {
  .main-center .goods-shelves .drying-area-list[data-v-3f963ac9] {
    height: 20px;
    border-radius: 5px;
  }
  .main-center .goods-shelves .drying-area-list .popover-button:focus {
    border-radius: 5px;
  }
}
</style>
<style>

  .updateTrayInfoDialog .el-form-item__label{
    color: #606266 !important;
    line-height: 35px !important;
  }

  .updateTrayInfoDialog .el-form-item__content{
    margin-left: 110px !important;
  }
  .main-pop.el-popover{
  width: 380px !important;
  min-height: 180px;
  background: rgba(64, 158, 255, 0.85);
  border-radius: 10px;
  padding: 20px;
  border:none;
}
.main-pop.el-popover .popper__arrow{
  border: none;
}
.main-pop.el-popper[x-placement^=right] .popper__arrow::after,
.main-pop.el-popper[x-placement^=left] .popper__arrow::after{
  border: none;
}
.averageList{
  margin-bottom: 50px;
}
#shelvesAverageList{
  margin-bottom: 20px;
}
.main-center .goods-shelves .goods-list-box.shelvesAverageList{
  margin-bottom: 20px;
}
.num-click{
  cursor: pointer;
  color: #007EFF;
  font-weight: bold;
}
.part-code{
  display: flex;
  flex-flow: row wrap;
}
.part-code li{
  background: #2c68ff;
  border-radius: 4px;
  color: #fff;
  margin-bottom: 6px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-right: 15px;
  padding-left: 10px;
  padding-right: 10px;
}
.el-dialog__header{
  display: flex;

}
#location-bg{
  background: pink;
}


.demo-image .block {
  text-align: center;
  border: solid 2px;
  display: inline-block;
  width: 49%;
  box-sizing: border-box;
  vertical-align: top;
  margin-right: 5px;
  margin-bottom: 10px;
}

.demo-image .block:last-child {
  /*margin-right: none;*/
}

.demonstration {
  display: block;
  /*color: var(--el-text-color-secondary);*/
  font-size: 12px;
  padding: 0px 3px;
  margin-bottom: 5px;
  height: 42px;
}

.demo-image .code {
  font-size: 14px;
  font-weight: bolder;
  margin-bottom: 5px;
}
@media screen and (max-width:1600px) {
  .cargo-area-list .goods-list-box {
    width: 30px !important;
    height: 30px !important;
    margin: 3px !important;

  }
  .averageList {
    margin-bottom: 35px;
  }
  .drying-area-content{
    min-height: 350px !important;
  }
  .drying-area-formal-list:first-child {
    margin-right: 44px !important;
  }
}
@media screen and (max-width:1440px) {
  .cargo-area-list .goods-list-box {
    width: 25px !important;
    height: 25px !important;
    margin: 2px !important;

  }
  .averageList {
    margin-bottm: 30px;
  }
  .drying-area-content{
    min-height: 280px !important;
  }
  .drying-area-formal-list:first-child {
    margin-right: 35px !important;
  }
}
  .disable-box .el-descriptions-item__container{
    align-items: center;
  }
  .disable-box .el-button--mini.is-round{
    padding: 5px 8px;
  }
  .disable-box .el-descriptions--medium:not(.is-bordered) .el-descriptions-item__cell{
    padding-bottom: 15px;
  }
  .el-collapse-item__content{
    padding-bottom: 10px;
  }
</style>
