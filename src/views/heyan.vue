<template>
	<div class="studentinfo">
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
		<p>
			<span>联系电话</span>
			<em>{{ info.contact_phone }}</em>
		</p>
	</div>
</template>
<script>
export default {
  data() {
    return {
      info: {}
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
    }
  },
  created() {
    this.getinfo();
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

