<template>
  <div class="infobox">
    <div class="imgbox"><img :src="info.cover_image_url" alt=""></div>
    <div class="ctlist">
      <div class="row">
        <span>标题名称</span>
        <em>{{ info.name }}</em>
      </div>
      <div class="row">
        <span>咨询电话</span>
        <em>{{ info.contact_phone }}</em>
      </div>
      <div class="row">
        <span>报名通知</span>
        <em v-if="info.notify_uid == 0">无</em>
        <em v-for="(item,index) in userlist" :key="index" v-if="info.notify_uid == item.user_id">{{ item.user_name }}</em>
      </div>
      <div class="row">
        <span>报名费用</span>
        <em>￥{{ info.discount_price }}</em>
      </div>
      <div class="row">
        <span>原价费用</span>
        <em>￥{{ info.original_price }}</em>
      </div>
      <div class="row">
        <span>校区地址</span>
        <em>{{ info.address }}<button type="button" class="mapbtnlook" @click="mapshow = true">查看地图</button></em>
      </div>
      <div class="row">
        <span class="max">报名提交上限为</span>
        <em v-if="info.total_count == 0">不限</em>
        <em v-if="info.total_count > 0">{{ info.total_count }}</em>
      </div>
    </div>
    <div class="titlestyle">
      <span>试听课介绍</span>
    </div>
    <div class="content" v-html="info.description" v-if="info.source == 'pc'"></div>
    <div class="content_h5box" v-if="info.source == 'h5'">
      <div class="textbox" v-html="info.description"></div>
      <div class="imgboxyl" v-if="imglist.length > 0">
        <img :src="item" alt="" v-for="(item,index) in imglist" :key="index">
      </div>
    </div>
    <div class="bottombox">
      <span v-if="info.status == 1" @click="editorStatus(2)">下线</span>
      <span v-if="info.status != 1" @click="editorStatus(1)">发布</span>
      <router-link tag="span" :to="{name:'editor',params:{id:$route.params.id}}" class="ok">编辑</router-link>
    </div>

    <!-- 地图弹框	 -->
    <yd-popup v-model="mapshow" position="center" width="90%">
      <maps v-if="info.id" :height="400" :longitude="longitude" :latitude="latitude" :canclick="canclickBaidu"></maps>
      <div class="mapclose" @click="mapshow = false">
        关闭
      </div>
    </yd-popup>

    <!-- 分享 -->
    <fx :changetime="changetime" :id="$route.params.id"></fx>

  </div>

</template>
<script>
import maps from "./componts/map";
import fx from "./componts/fx"
export default {
  data() {
    return {
      info: {},
      userlist: [],
      imglist: [],
      mapshow: false,
      longitude: "",
      latitude: "",
      canclickBaidu: false,
      changetime: 0
    };
  },
  components: {
    maps,
    fx
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
    editorStatus(status) {
      this.$dialog.loading.open("加载中");
      this.$http
        .post("/api/trial/trial_class/update/" + this.$route.params.id, {
          data: {
            status: status
          }
        })
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            if (status == 1) {
              this.changetime = +new Date();
            } else {
              this.$dialog.toast({
                mes: "已下线",
                timeout: 1500,
                icon: "success"
              });
            }

            setTimeout(() => {
              this.getInfo();
            }, 1500);
          }
        });
    },
    getuserlist() {
      this.$http
        .get("/api/trial/trial_class/user", {
          data: {
            merchant_id: this.user.id
          }
        })
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            this.userlist = data.data.item;
          }
        });
    }
  },
  created() {
    this.getInfo();
    this.getuserlist();
  }
};
</script>
<style lang="less" scoped>
@import "../less/style.less";

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