<template>
  <div class="infobox">
    <div class="imgbox"><img :src="info.cover_image_url" alt=""></div>
    <div class="preview">
		<div class="prowtitle">
			<span>{{ info.name }}</span>
			<em><img src="static/img/eyes.png" alt="">{{ info.pageviews }}</em>
		</div>
		<div class="prow">
			<img src="static/img/time.png" alt=""><span>{{ info.updated_at | yyyy_mm_dd }}</span>
		</div>
		<div class="prow">
			<img src="static/img/phone.png" alt=""><span>{{ info.contact_phone }}</span>
		</div>
		<div class="prow" @click="mapshow = true">
			<img src="static/img/address.png" alt=""><span>{{ info.address }}</span>
		</div>
	</div>
    <div class="content" v-html="info.description" v-if="info.source == 'pc'"></div>
    <div class="content_h5box" v-if="info.source == 'h5'">
      <div class="textbox" v-html="info.description"></div>
      <div class="imgboxyl" v-if="imglist.length > 0">
        <img :src="item" alt="" v-for="(item,index) in imglist" :key="index">
      </div>
    </div>
    <div class="bottombox">
      <span>电话咨询</span>
      <span>我要报名</span>
    </div>

    <!-- 地图弹框	 -->
    <yd-popup v-model="mapshow" position="center" width="90%">
      <maps v-if="info.id" :height="400" :longitude="longitude" :latitude="latitude" :canclick="canclickBaidu"></maps>
      <div class="mapclose" @click="mapshow = false">
        关闭
      </div>
    </yd-popup>
  </div>

</template>
<script>
import maps from "./componts/map";
export default {
  data() {
    return {
      info: {},
      userlist: [],
      imglist: [],
      mapshow: false,
      longitude: "",
      latitude: "",
      canclickBaidu: false
    };
  },
  components: {
    maps
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    getInfo() {
      this.$dialog.loading.open("加载中");
      this.$http
        .get("/api/trial/trial_class/info/" + this.$route.params.id)
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            this.info = data.data;
            this.longitude = this.info.lon;
            this.latitude = this.info.lat;
            let list = data.data.h5_img_list.split(",");
            let arr = [];
            list.forEach(element => {
              if (element.length > 0) {
                arr.push(element);
              }
            });
            this.imglist = arr;
          }
        });
    },
  },
  created() {
    this.getInfo();
  }
};
</script>
<style lang="less" scoped>
@import "../less/style.less";
.preview{
	background-color: #fff;
	padding: 0.25rem;
	margin-bottom: 10px;
	padding-bottom: 0;
	.prowtitle{
		margin-bottom: 1px solid @bc;
		font-size: 16px;
		color: @c2;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		span{
			font-size: 20px;
			font-weight: bold;
			color: @c1;
		}
		em{
			display: block;
			min-width: 60px;
			text-align: right;
			color: @c3;
			img{
				height: 14px;
				position: relative;
				top: 1px;
				margin-right: 6px;
			}
		}
	}
	.prow{
		font-size: 16px;
		color: @c1;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 15px 0;
		border-bottom: 1px solid @bc;
		&:last-child{
			border: none;
		}
		img{
			width: 16px;
			height: 16px;
			min-width: 14px;
			margin-right: 10px;
			position: relative;
			top: 3px;
		}
	}
}
.content {
  background-color: #fff;
  padding: 0.25rem;
  img {
    max-width: 100%;
  }
}

.content_h5box {
  background-color: #fff;
  padding: 0.25rem;
  .textbox {
    padding-bottom: 10px;
  }
  .imgboxyl {
    img {
      display: block;
      max-width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>