<template>
  <div class="infobox">
    <div class="imgbox" @click="openuploadfile">
      <div>
        <img src="static/img/paizhao.png" alt="">
        <p class="text">选择照片</p>
        <p class="tishi">
          请上传小于5M的PNG/JPG，建议尺寸760*400
        </p>
      </div>
      <img v-if="info.cover_image_url != ''" :src="info.cover_image_url" alt="">
    </div>
    <div class="ctlist">
      <div class="row">
        <span>标题名称</span>
        <input type="text" placeholder="如：新东方6人小班999元/期" v-model="info.name" maxlength="20">
      </div>
      <div class="row">
        <span>咨询电话</span>
        <input type="text" placeholder="电话只支持数字不支持特殊字符，如“-”" v-model="info.contact_phone" maxlength="20">
      </div>
      <div class="row">
        <span>报名通知</span>
        <div class="rowdiv">
          <span class="c3" v-show="info.notify_uid == ''">请选择报名通知接收人</span>
          <span v-for="(item,index) in userlist" :key="index" v-if="info.notify_uid == item.user_id">{{ item.user_name }}</span>
          <select v-model="info.notify_uid" placeholder="请选择报名通知人员">
            <option v-for="(item,index) in userlist" :key="index" :value="item.user_id">{{ item.user_name }}</option>
          </select>
        </div>
      </div>
      <div class="row">
        <span>报名费用</span>
        <input type="number" placeholder="请输入报名费用" v-model="info.discount_price">
      </div>
      <div class="row">
        <span>原价费用</span>
        <input type="number" placeholder="请输入原价费用" v-model="info.original_price">
      </div>
      <div class="row">
        <span>校区地址</span>
        <input type="text" placeholder="请输入学校地址" v-model="info.address" maxlength="100">
        <button class="mapbtnlook" type="button" @click="mapshow = true">查看地图</button>
      </div>
      <div class="row">
        <yd-checkbox v-model="baomNumber" color="#FF6562" size="14">
          报名提交上限为
        </yd-checkbox>
        <input type="number" placeholder="请输入报名上限" v-model="info.total_count">
      </div>
    </div>
    <div class="titlestyle">
      <span>试听课介绍</span>
      <p v-if="info.source == 'pc'">因图文排版样式原因，以下图文介绍请在电脑端编辑</p>
    </div>
    <div class="content_h5" v-if="info.source == 'h5'">
      <textarea rows="3" placeholder="请输入试听课介绍文字…" cols="20" v-model="info.description"></textarea>
      <div class="filebox">
        <div class="contentimgbox" v-for="(item,index) in imglist" :key="index">
          <img :src="item" alt="">
          <span @click="dellistimg(index)">x</span>
        </div>
        <div class="addimg" v-show="imglist.length < 9">
          +
          <input type="file" id="uploadfile" @change="uploadfileFun">
        </div>
        <p class="tishi">
          最多9张，建议上传机构环境，上课实拍，学员作品等（选填）</p>
      </div>
    </div>
    <div class="content" v-html="info.description" v-if="info.source == 'pc'">
    </div>
    <div class="bottombox">
      <span @click="save(0,true)">预览</span>
      <span @click="save(0)">保存</span>
      <span class="okbg" @click="save(1)">发布</span>
    </div>

    <!-- 地图弹框	 -->
    <yd-popup v-model="mapshow" position="center" width="90%">
      <maps v-if="mapshow" :height="400" :address="info.address" :longitude="longitude" :latitude="latitude" :canclick="canclickBaidu" @getmappoint="getMapData"></maps>
      <div class="mapclose" @click="mapshow = false">
        关闭
      </div>
    </yd-popup>

    <!-- 修改封面 -->
    <yd-popup v-model="fmshow" position="center" width="90%">
      <div class="changefilelist">
        <p @click="opmoban">从模板选择</p>
        <p>
          <span>从手机相册选择</span>
          <input type="file" id="bannerimg" @change="filechange">
        </p>
      </div>
    </yd-popup>

    <!-- 封面模板 -->
    <moban v-show="mbshow" @callback="imgcallback"></moban>

  </div>
</template>
<script>
import maps from "./componts/map";
import moban from "./componts/moban";
export default {
  data() {
    return {
      info: {
        name: "",
        cover_image_url: "",
        contact_phone: "",
        address: "",
        lon: "",
        lat: "",
        original_price: "",
        discount_price: "",
        total_count: "",
        source: "h5",
        description: "",
        h5_img_list: "",
        merchant_id: "",
        notify_uid: "",
        status: ""
      },
      userlist: [],
      baomNumber: false,
      fmshow: false,
      mbshow: false,
      description: "",
      imglist: [],
      mapshow: false,
      canclickBaidu: true,
      longitude: "",
      latitude: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  components: {
    maps,
    moban
  },
  watch: {
    baomNumber(v) {
      if (!v) {
        this.info.total_count = 0;
      }
    },
    mbshow() {
      let div = document.querySelector(".moban");
      div.scroll(0, 0);
    }
  },
  methods: {
    // 上传图片
    filechange(e) {
      this.fmshow = false;
      this.$dialog.loading.open("上传中...");
      this.$http
        .post("/api/upload", {
          data: {
            type: "stkfm",
            file: e.target.files[0]
          }
        })
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            this.info.cover_image_url = data.data.url;
          }
        });
    },
    imgcallback(url) {
      this.info.cover_image_url = url;
      this.mbshow = false;
      window.scroll(0, 0);
    },

    opmoban() {
      this.fmshow = false;
      this.mbshow = true;
    },
    openuploadfile() {
      this.fmshow = true;
    },
    getMapData(data) {
      this.info.lat = data.lat;
      this.info.lon = data.lng;
      this.longitude = data.lng;
      this.latitude = data.lat;
      if (data.address) {
        this.info.address = data.address;
      }
      // this.mapshow = false;
    },
    dellistimg(index) {
      this.imglist.splice(index, 1);
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
            this.$dialog.toast({
              mes: "修改成功",
              timeout: 1500,
              icon: "success"
            });
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
    },
    uploadfileFun(e) {
      this.$dialog.loading.open("上传中...");
      this.$http
        .post("/api/upload", {
          data: {
            type: "stkfm",
            file: e.target.files[0]
          }
        })
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            this.imglist.push(data.data.url);
          }
        });
    },
    save(type, yl) {
      this.info.status = type;
      if (this.info.name == "") {
        this.$dialog.toast({
          mes: "请输入标题名称",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      if (this.info.cover_image_url == "") {
        this.$dialog.toast({
          mes: "请上传封面图片",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      if (this.info.contact_phone == "") {
        this.$dialog.toast({
          mes: "请输入咨询电话",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      let reg = /^[0-9]*$/;
      if (!reg.test(this.info.contact_phone)) {
        this.$dialog.toast({
          mes: "咨询电话只能为纯数字",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      if (this.info.address == "") {
        this.$dialog.toast({
          mes: "请填写学校地址",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      if (this.info.lon == "" || this.info.lat == "") {
        this.$dialog.toast({
          mes: "请在地图上标记学校位置",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      if (this.info.discount_price == "") {
        this.$dialog.toast({
          mes: "请填写报名费用",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      if (this.info.original_price == "") {
        this.$dialog.toast({
          mes: "请填写原价费用",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      if (this.info.description == "") {
        this.$dialog.toast({
          mes: "请填写图文介绍",
          timeout: 1500,
          icon: "error"
        });
        return;
      }

      this.info.merchant_id = this.user.id;
      this.info.h5_img_list = this.imglist.join(",");

      this.$dialog.loading.open("操作中...");

      this.$http
        .post("/api/trial/trial_class/add", {
          data: this.info
        })
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            this.$dialog.toast({
              mes: "保存成功",
              timeout: 1500,
              icon: "success"
            });

            setTimeout(() => {
              if (yl) {
                this.$router.push({ name: "preview", params: { id: data.data } });
              } else {
                this.$router.push({ name: "index" });
              }
            }, 1500);
          }
        });
    }
  },
  created() {
    this.getuserlist();
  }
};
</script>
<style lang="less" scoped>
@import "../less/style.less";
</style>