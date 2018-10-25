<template>
	<!-- 分享弹框 -->
	<yd-popup v-model="fenxiangshow" position="center" width="90%">
		<div class="popup">
			<div class="popuptop">
				试听课已发布，是否分享给好友
			</div>
			<div class="popupbottom">
				<span @click="fenxiangshow = false">稍后分享</span>
				<router-link :to="{name:'share',params:{id:id}}" tag="span" class="ok">立即分享</router-link>
			</div>
		</div>
	</yd-popup>
</template>
<script>
export default {
  props: ["changetime", "id"],
  data() {
    return {
      fenxiangshow: false
    };
  },
  watch: {
    changetime() {
      this.fenxiangshow = true;
    }
  }
};
</script>
