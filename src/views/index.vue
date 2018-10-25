<template>
  <div>
    <div class="tab">
      <span :class="{active:tabindex == 0}" @click="tabClick(0)">未发布</span>
      <span :class="{active:tabindex == 1}" @click="tabClick(1)">已发布</span>
      <span :class="{active:tabindex == 2}" @click="tabClick(2)">已下线</span>
    </div>
    <yd-infinitescroll :callback="loadList" ref="infinitescroll">
      <ul class="list" slot="list">
        <li class="listchild" v-for="(item,n) in list" :key="n">
          <p class="width">
            <time>{{ item.updated_at | yyyy_mm_dd }}</time>
            <span>浏览：{{ item.pageviews }}</span>
          </p>
          <div class="imgbox width">
            <img :src="item.cover_image_url" alt="" @click="linkinfo(item.id)">
            <span class="delete" @click="deleteFun(item.id)" v-if="tabindex == 0 || tabindex == 2">删除</span>
          </div>
          <h1 class="width" @click="linkinfo(n)">{{ item.name }}</h1>
          <div class="width price" @click="linkinfo(n)">
            <span><em>￥</em>{{ item.discount_price }}</span>
            <s>￥{{ item.original_price }}</s>
            <i v-if="item.total_count > 0">已报名{{ item.join_count }}/{{ item.total_count }}人</i>
            <i v-if="item.total_count == 0">已报名{{ item.join_count }}人</i>
          </div>
          <!-- 未发布 -->
          <div class="bottom" v-if="tabindex == 0">
            <router-link tag="span" :to="{name:'preview',params:{id:item.id}}">
              <img src="static/img/yulan.png" alt="">
              预览</router-link>
          </div>
          <!-- 已发布 -->
          <div class="bottom fabu" v-if="tabindex == 1">
            <span @click="openQrcode(item)">
              <img src="static/img/erweima.png" alt="">
            </span>
            <router-link tag="span" :to="{name:'preview',params:{id:item.id}}">
              <img src="static/img/yulan.png" alt="">
              预览</router-link>
            <router-link tag="span" :to="{name:'share',params:{id:item.id}}">
              <img src="static/img/fenxiang.png" alt="">
              分享</router-link>
            <span>
              <img src="static/img/bmicon.png" alt="">
              报名信息</span>
          </div>
          <!-- 已下线 -->
          <div class="bottom" v-if="tabindex == 2">
            <span>
              <img src="static/img/bmicon.png" alt="">
              报名信息</span>
          </div>
        </li>
      </ul>
      <!-- 数据全部加载完毕显示 -->
      <span class="doneTip" slot="doneTip">没有数据啦~~</span>
      <!-- 加载中提示，不指定，将显示默认加载中图标 -->
      <svg slot="loadingTip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <path stroke="none" d="M3 50A47 47 0 0 0 97 50A47 49 0 0 1 3 50" fill="#bababa" transform="rotate(81.4932 50 51)">
          <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="0.6s" begin="0s" repeatCount="indefinite"></animateTransform>
        </path>
      </svg>
    </yd-infinitescroll>
    <div class="bottombox">
      <span>验证码核销</span>
      <router-link tag="span" :to="{name:'add'}">添加试听课</router-link>
    </div>

    <!-- 删除弹框 -->
    <yd-popup v-model="deleshow" position="center" width="90%">
      <div class="popup">
        <div class="popuptop">
          若试听课有学员信息，<br>
          将查看不到学员信息，是否确认删除。
        </div>
        <div class="popupbottom">
          <span @click="deleshow = false">取消</span>
          <span class="ok" @click="deletePost">删除</span>
        </div>
      </div>
    </yd-popup>

    <!-- 二维码 -->
    <yd-popup v-model="qrcodeshow" position="center" width="90%">
      <div class="qrcode">
        <img :src="qrcodeUrl" alt="">
      </div>
    </yd-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabindex: 1,
      deleshow: false,
      page: 1,
      limit: 2,
      list: [],
      delid: "",
      qrcodeshow: false,
      qrcodeUrl: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    openQrcode(item){
      this.qrcodeshow = true
      this.qrcodeUrl = item.cover_image_url
    },
    linkinfo(id) {
      this.$router.push({ name: "info", params: { id } });
    },
    tabClick(index) {
      this.tabindex = index;
      this.page = 1;
      this.list = [];
      this.$refs.infinitescroll.$emit("ydui.infinitescroll.reInit");
      this.getList();
    },
    deleteFun(id) {
      this.deleshow = true;
      this.delid = id;
    },
    deletePost() {
      this.$dialog.loading.open("正在删除");
      this.deleshow = false;
      this.$http
        .get("/api/trial/trial_class/del/" + this.delid)
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            this.$dialog.toast({
              mes: "删除成功",
              timeout: 1500,
              icon: "success"
            });
            setTimeout(() => {
              this.page = 1;
              this.list = [];
              this.getList();
            }, 1500);
          }
        })
        .catch(err => {
          this.$dialog.loading.close();
        });
    },
    getList() {
      this.$dialog.loading.open("加载中...");
      this.$http
        .get("/api/trial/trial_class", {
          data: {
            merchant_id: this.user.id,
            status: this.tabindex,
            page: this.page,
            limit: this.limit
          }
        })
        .then(data => {
          /* 单次请求数据完毕 */
          this.$dialog.loading.close();
          this.$refs.infinitescroll.$emit("ydui.infinitescroll.finishLoad");
          if (data.status == "ok") {
            this.list = this.list.concat(data.data.item);
            if (data.data.item.length < this.limit) {
              /* 所有数据加载完毕 */
              this.$refs.infinitescroll.$emit("ydui.infinitescroll.loadedDone");
            }
          }
        })
        .catch(err => {
          this.$dialog.loading.close();
        });
    },
    loadList() {
      this.page++;
      this.getList();
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
@import "../less/style.less";
.editor {
  width: 100%;
  background-color: #fff;
  height: 200px;
}

.tab {
  width: 100%;
  display: flex;
  height: 50px;
  border-bottom: 1px solid @bc;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  > span {
    display: block;
    flex: 1;
    text-align: center;
    line-height: 50px;
    position: relative;
    font-size: 16px;
    color: @c1;
    &:last-child {
      &::before {
        display: none;
      }
    }
    &::before {
      content: "";
      width: 1px;
      height: 22px;
      background-color: @bc;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
    &.active {
      color: @c;
      &::after {
        content: "";
        display: block;
        width: 40px;
        height: 2px;
        background-color: @c;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
      }
    }
  }
}

.qrcode {
  display: block;
  height: 200px;
  background-color: #fff;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    height: 160px;
  }
}
.list {
  width: 100%;
  box-sizing: border-box;
  padding-top: 50px;
  .listchild {
    background-color: #fff;
    margin-bottom: 10px;
    > p {
      display: flex;
      justify-content: space-between;
      color: @c2;
      padding: 10px 0;
    }
    .imgbox {
      height: 7 * 400/760rem;
      overflow: hidden;
      border-radius: 4px;
      position: relative;
      img {
        width: block;
        width: 100%;
        min-height: 100%;
      }
      .delete {
        display: block;
        width: 40px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.14);
        position: absolute;
        top: 10px;
        right: 10px;
        color: #fff;
        border-radius: 2px;
      }
    }
    h1 {
      font-size: 16px;
      color: @c1;
      font-weight: 500;
      padding: 10px 0;
    }
    .price {
      display: flex;
      align-items: center;
      line-height: 1;
      margin-bottom: 16px;
      > span {
        display: block;
        font-size: 20px;
        font-weight: bold;
        color: @c;
        margin-right: 5px;
        em {
          font-size: 14px;
        }
      }
      s {
        display: block;
        color: @c3;
        text-decoration: line-through;
        flex: 1;
      }
      i {
        display: block;
        color: @c2;
      }
    }
    .bottom {
      height: 40px;
      border-top: 1px solid @bc;
      font-size: 14px;
      color: @c2;
      display: flex;
      justify-content: center;
      align-items: center;
      &.fabu {
        justify-content: space-between;
        position: relative;
        span {
          display: block;
          flex: 1;
          &:first-child {
            img {
              height: 14px;
              margin-left: 20px;
            }
          }
        }
      }
      span {
        img {
          position: relative;
          top: 2px;
          margin-right: 2px;
        }
      }
    }
  }
}

.doneTip {
  display: block;
  height: 50px;
}

.width {
  width: 7rem;
  margin: 0 auto;
}
</style>

