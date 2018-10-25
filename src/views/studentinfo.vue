<template>
	<div class="studentinfo">
		<h1><span>支付金额</span><em>￥00.00</em></h1>
		<p>
			<span>试听课名称</span>
			<em>{{ info.class_name }}</em>
		</p>
		<p>
			<span>商户名称</span>
			<em>{{ merchant.merchant_name }}</em>
		</p>
		<p>
			<span>学员姓名</span>
			<em>{{ info.student_name }}</em>
		</p>
		<p>
			<span>联系电话</span>
			<em>{{ info.contact_phone }}</em>
		</p>
		<p>
			<span>提交时间</span>
			<em>{{ info.created_at }}</em>
		</p>
		<p>
			<span>验证码</span>
			<em>{{ info.check_code }}</em>
		</p>
	</div>
</template>
<script>
export default {
  data() {
    return {
      info: {},
      merchant: {}
    };
  },
  methods: {
    getinfo() {
      this.$dialog.loading.open("加载中...");
      this.$http
        .get("/api/trial/student/info/", {
          data: {
            merchant_id: this.$route.params.mid,
            student_id: this.$route.params.id
          }
        })
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            this.info = data.data;
          }
        });
    },
    getmerchant() {
      this.$http
        .get("/api/merchant/info/" + this.$route.params.mid)
        .then(data => {
          if (data.status == "ok") {
            this.merchant = data.data.merchant;
          }
        });
    }
  },
  created() {
    this.getinfo();
    this.getmerchant();
  }
};
</script>

<style lang="less" scoped>
@import "../less/style.less";
.studentinfo {
  background-color: #fff;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  h1 {
    font-size: 20px;
    color: @c1;
    font-weight: normal;
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    span {
      margin-right: 10px;
    }
    em {
      display: block;
      min-width: 60px;
	  color: @c;
	  text-align: right;
    }
  }
  p {
    display: flex;
    justify-content: space-between;
	margin-right: 10px;
	margin-bottom: 20px;
	span{
		color: @c2;
		min-width: 80px;
	}
	em{
		color: @c1;
		text-align: right;
	}
  }
}
</style>

