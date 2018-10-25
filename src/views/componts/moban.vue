<template>
	<!-- 模板选择 -->
	<div class="moban">
		<span v-for="(item,n) in list" :key="n" @click="callback(item.remote_url)">
			<img :src="item.remote_url" alt="">
		</span>
    <div class="zanwumoban" v-show="list.length == 0">
      暂无模板
    </div>
	</div>
</template>
<script>
export default {
  data(){
    return {
      list:[]
    }
  },
  methods: {
    callback(url) {
      this.$emit("callback", url);
    },
    getmobanlist(){
      this.$dialog.loading.open("加载中");
      this.$http.get('/api/trial/trial_class/banner')
      .then(data=>{
        this.$dialog.loading.close();
        if(data.status == 'ok'){
          this.list = data.data.item
        }
      })
    }
  },
  created(){
    this.getmobanlist()
  }
};
</script>
<style lang="less" scoped>
.moban {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding: 0.25rem;
  z-index: 10000;
  background-color: #fff;
  top: 0;
  left: 0;
  span {
    width: 100%;
    display: block;
    margin-bottom: 0.25rem;
    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
