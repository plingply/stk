<template>
  <div class="mapbox" :style="{height:height+'px'}">
    <input v-show="canclick" type="text" id="mapsouch" placeholder="请输入地点" ref="mapsearchval">
    <span v-show="canclick" @click="clearValueFun"></span>
    <div id="baidumapbox" :style="{height:height+'px'}"></div>
    <div id="searchResultPanel" :style="{maxHeight:height-50+'px'}" v-show="show">
      <div v-for="(item,index) in searchlist" :key="index" class="list" :id="'list_'+index">
        <h1>{{ item.name }}</h1>
        <p>{{ item.address }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    //里面存放的也是数据，与data里面的数据不同的是，这里的数据是从其他地方得到的数据
    height: {
      type: Number,
      default: 300
    },
    address: {
      type: String,
      default: ""
    },
    longitude: 0, //定义经度
    latitude: 0, //定义纬度
    canclick: false
  },
  data() {
    return {
      searchlist: [],
      show: false
    };
  },
  methods: {
    clearValueFun() {
      this.$refs.mapsearchval.value = "";
      this.searchlist = [];
      this.show = false;
    },
    initMap() {
      let self = this;
      var searchService, citylocation, center, map, marker, geocoder;
      var search = document.getElementById("mapsouch");
      var searchResultPanel = document.getElementById("searchResultPanel");
      center = new qq.maps.LatLng(self.latitude, self.longitude);
      map = new qq.maps.Map(document.getElementById("baidumapbox"), {
        // 地图的中心地理坐标。
        center: center,
        zoom: 12
      });

      // 添加中心点
      marker = new qq.maps.Marker({
        position: center,
        map: map
      });

      geocoder = new qq.maps.Geocoder({
        complete: function(result) {
          map.setCenter(result.detail.location);
          center = new qq.maps.LatLng(
            result.detail.location.lat,
            result.detail.location.lng
          );
          marker.setPosition(center);
          self.$emit("getmappoint", {
            lat: result.detail.location.lat,
            lng: result.detail.location.lng,
            address: result.detail.address
          });
        }
      });

      if (self.latitude == 0 && self.longitude == 0) {
        //获取城市列表接口设置中心点
        citylocation = new qq.maps.CityService({
          complete: function(result) {
            map.setCenter(result.detail.latLng);

            // 地址为空，定位当前城市中心
            if (self.address != "") {
              geocoder.getLocation(self.address);
            }
          }
        });
        //调用searchLocalCity();方法    根据用户IP查询城市信息。
        citylocation.searchLocalCity();
      }

      // 地图点击
      qq.maps.event.addListener(map, "click", function(e) {
        if (self.canclick) {
          let obj = e.latLng;
          center = new qq.maps.LatLng(obj.lat, obj.lng);
          marker.setPosition(center);
          self.$emit("getmappoint", obj);
        }
      });

      searchService = new qq.maps.SearchService({
        complete: function(results) {
          if (results.type == "POI_LIST") {
            self.searchlist = results.detail.pois;
            self.show = true;
          }
        }
      });

      search.addEventListener("input", function(e) {
        searchService.search(self.$refs.mapsearchval.value);
      });

      // 监听dom
      qq.maps.event.addDomListener(searchResultPanel, "click", function(event) {
        if (
          event.target.className == "list" ||
          event.target.parentNode.className == "list"
        ) {
          let id = event.target.id || event.target.parentNode.id;
          let index = id.split("_")[1];
          center = new qq.maps.LatLng(
            self.searchlist[index].latLng.lat,
            self.searchlist[index].latLng.lng
          );
          map.panTo(center);
          marker.setPosition(center);

          self.$emit("getmappoint", {
            lat: self.searchlist[index].latLng.lat,
            lng: self.searchlist[index].latLng.lng,
            address:
              self.searchlist[index].address + self.searchlist[index].name
          });
          self.show = false;
        }
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  }
};
</script>
<style lang="less" scoped>
@c: #ff6562;
@c1: #3a2929;
@c2: #8b7f7f;
@c3: #bfbfbf;
@bj: #f8f8f8;
@bc: #f0f0f0;

.textOverflow() {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
//百度地图
#baidumapbox {
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.mapbox {
  position: relative;
  input {
    display: block;
    width: 200px;
    height: 34px;
    border: none;
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 1;
    background-color: #fff;
    padding: 0 10px;
    outline: none;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  }
  span {
    display: block;
    width: 34px;
    height: 34px;
    position: absolute;
    top: 10px;
    left: 230px;
    z-index: 2;
    cursor: pointer;
    background-image: url("../../../static/img/close1.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #fff;
    &:after {
      content: "";
      width: 1px;
      height: 14px;
      position: absolute;
      top: 10px;
      left: 0;
      background-color: #ddd;
    }
  }
}

#searchResultPanel {
  width: 200px;
  background-color: #fff;
  position: absolute;
  top: 44px;
  left: 10px;
  overflow: auto;
  z-index: 10000;
  box-sizing: border-box;
  padding: 10px;
  box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.3);
  > div {
    border-bottom: 1px solid @bc;
    padding: 10px 0;
    cursor: pointer;
    h1 {
      font-size: 14px;
      font-weight: normal;
      color: @c1;
      .textOverflow();
    }
    p {
      font-size: 12px;
      color: @c2;
      .textOverflow();
    }
    &:last-child {
      border: none;
    }
  }
}
</style>