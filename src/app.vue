<template>
  <router-view></router-view>
</template>
<script>
import token from "./plugin/token";
export default {
  methods: {
    login() {
      this.$dialog.loading.open("登录中...");
      this.$http
        .post("/api/auth/login", {
          data: {
            phone: "15319333285",
            password: "111111"
          }
        })
        .then(data => {
          this.$dialog.loading.close();
          if (data.status == "ok") {
            token.setToken("token", data.data.token);
            this.$store.commit("setuser", {
              token: data.data.token,
              id: "11323"
            });
          }
        });
    }
  },
  created() {
    this.login();
  }
};
</script>
