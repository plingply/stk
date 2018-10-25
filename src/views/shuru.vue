<template>
	<div>
		<div class="inputbox" v-if="!heyan">
			<div class="input">
				<span>验证码</span>
				<input type="text" placeholder="请输入核验码" v-model="code">
			</div>
			<button class="btn" type="button" @click="getinfo">下一步</button>
		</div>
		<div class="studentinfo" v-if="heyan">
			<p>
				<span>验证码</span>
				<em>{{ info.check_code }}</em>
			</p>
			<p>
				<span>试听课名称</span>
				<em>{{ info.class_name }}</em>
			</p>
			<p>
				<span>学员姓名</span>
				<em>{{ info.student_name }}</em>
			</p>
			<p class="mb70">
				<span>联系电话</span>
				<em>{{ info.contact_phone }}</em>
			</p>
			<button class="btn" type="button">确认核验码</button>
		</div>
	</div>
</template>
<script>
export default {
  data() {
    return {
      code: "",
	  info: {},
	  heyan:false
    };
  },
  methods: {
    getinfo() {
      this.$dialog.loading.open("正在查询...");
      this.$http
        .get("/api/trial/student/info/", {
          data: {
            merchant_id: this.$route.params.mid,
            check_code: this.code
          }
        })
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            this.info = data.data;
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../less/style.less";
.inputbox {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;
  padding: 20px;
  padding-top: 140px;
  top: 0;
  left: 0;
  .input {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    border-bottom: 1px solid @bc;
    padding-bottom: 10px;
    margin-bottom: 70px;
    span {
      display: block;
      color: @c1;
      min-width: 70px;
    }
    input {
      border: none;
      text-align: right;
      flex: 1;
    }
  }
}

.studentinfo {
  background-color: #fff;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  top: 0;
  left: 0;
  padding-top: 50px;
  p {
    display: flex;
    justify-content: space-between;
    margin-right: 10px;
    margin-bottom: 20px;
    &.mb70 {
      margin-bottom: 70px;
    }
    span {
      color: @c2;
      min-width: 80px;
    }
    em {
      color: @c1;
      text-align: right;
    }
  }
}
</style>
