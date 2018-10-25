<template>
	<div class="student">
		<div class="search">
			<div><img src="static/img/search.png" alt=""><input placeholder="请输入学员姓名或电话" type="text" v-model="search"></div>
			<button type="button" @click="searchfun">搜索</button>
		</div>
		<yd-infinitescroll :callback="loadList" ref="infinitescroll" v-show="!searchshow">
			<ul class="list" slot="list">
				<router-link :to="{name:'studentinfo',params:{mid:item.merchant_id,id:item.id}}" tag="li" v-for="(item,index) in list" :key="index">
					<h1>
						<span>{{ item.class_name }}</span>
						<em>已核销</em>
					</h1>
					<p><span>学员信息：{{ item.student_name }}-{{ item.contact_phone }}</span></p>
					<p><span>报名时间：{{ item.created_at | yyyy_mm_dd_H_M_S }}</span></p>
					<p>
						<span>报名费用：¥{{ item.class_price }}</span>
						<button>退款</button>
					</p>
				</router-link>
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
		<div class="zanwu" v-show="searchshow">
			<img src="static/img/zanwu.png" alt="">
			<p>暂无搜索结果</p>
		</div>
	</div>
</template>
<script>
export default {
  data() {
    return {
      count: 0,
      page: 1,
      limit: 10,
      list: [],
      search: "",
      searchshow: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    searchfun() {
      this.getStudent(true);
    },
    loadList() {},
    getStudent(issearch) {
      this.$dialog.loading.open("加载中...");

      if (issearch) {
        this.page = 1;
      }
      this.$http
        .get("/api/trial/student", {
          data: {
            merchant_id: this.user.id,
            class_id: this.$route.params.id,
            search: this.search,
            page: this.page,
            limit: this.limit
          }
        })
        .then(data => {
          this.$dialog.loading.close();
          this.$refs.infinitescroll.$emit("ydui.infinitescroll.finishLoad");
          if (data.status == "ok") {
            if (issearch) {
              this.list = [];
              if (data.data.count == 0) {
                this.searchshow = true;
                return;
              }
            }
            this.searchshow = false;
            this.count = data.data.count;
            this.list = this.list.concat(data.data.item);
            this.page++;
            if (data.data.item.length < this.limit) {
              /* 所有数据加载完毕 */
              this.$refs.infinitescroll.$emit("ydui.infinitescroll.loadedDone");
            }
          }
        });
    }
  },
  created() {
    this.getStudent();
  }
};
</script>


<style lang="less" scoped>
@import "../less/style.less";
.student {
  .zanwu {
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    img {
      display: block;
      width: 192px;
      margin: 0 auto;
    }
    p {
      font-size: 14px;
      color: @c2;
      padding-top: 10px;
      line-height: 1;
      text-align: center;
    }
  }
  .search {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    > div {
      flex: 1;
      height: 40px;
      background-color: #f7f7f7;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      padding-left: 20px;
      align-items: center;
      img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
      }
      input {
        display: block;
        flex: 1;
        border: none;
        height: 30px;
      }
    }
    > button {
      display: block;
      width: 70px;
      height: 40px;
      border: none;
      outline: none;
      color: @c;
    }
  }
  .list {
    padding: 20px;
    padding-top: 100px;
    li {
      border-radius: 4px;
      background-color: #fff;
      padding: 0 20px;
      font-size: 14px;
      padding-bottom: 20px;
      margin-bottom: 20px;
      h1 {
        display: flex;
        justify-content: space-between;
        padding: 14px 0;
        border-bottom: 1px solid @bc;
        span {
          display: block;
          .textOverflow();
        }
        em {
          display: block;
          min-width: 50px;
          text-align: right;
        }
      }
      p {
        font-size: 14px;
        color: @c2;
        padding-top: 14px;
        line-height: 1;
        display: flex;
        justify-content: space-between;
        button {
          display: block;
          border: 1px solid @c;
          padding: 2px 10px;
          font-size: 14px;
          color: @c;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
