<template>
  <div class="panel panel-default">
    <div class="panel-heading">
        <p class="tc">请先登录</p>
    </div>
    <div class="panel-body m15">
      <div class="loginContainer">
        <div class="form-group">
          <div class="input-group">
            <span class="input-group-addon">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </span>
            <input type="text" class="form-control" id="username" name="username" placeholder="请输入用户名" required  v-model.lazy="userName">
          </div>
        </div>
        <Button type="info" long @click="login">登录</Button>
        <div class="help-block">{{ notice }}</div>
      </div>
    </div>
  </div>
</template>

<script>
    // import {mapState, mapMutations} from 'vuex'
    import Axios from 'Axios';

    export default {
        data(){
            return {
                userName: null, //用户名
                notice: null,
            }
        },
        components: {
        },
        computed: {

        },
        methods: {
          login: function() {
            if (this.userName) {
              Axios.post('/login', {uname: this.userName}).then(
                res => {
                  console.log(res.data);
                  if (res.data == 0) {
                    this.notice == '用户名重复';
                  } else {
                    this.$router.push('/chatroom');
                    window.localStorage.setItem('user', this.userName);
                  }
                })
            }

          }
        }
    }

</script>

<style lang="less" scoped>
.panel {
  width: 400px;
  margin: auto;
  margin-top: 50px;
}
</style>
