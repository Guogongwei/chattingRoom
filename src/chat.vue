<template>
  <div class="activity">
    <div class="header">
      <Button class="CurrentUser"> 当前用户: {{user}}</Button>
      <Button class="CurrentUser" > 当前会话: {{selectedRoom}}</Button>
    </div>
    <Row class="row">
      <Col class="user-list" span="4">
        <div class="head">用户列表

        </div>
        <li><div @click="roomchange('public')">大厅</div><div v-if="msgsCount['public']">{{msgsCount['public']}} 条未读</div></li>
        <li v-for="user in users">
          <div @click="roomchange(user)">{{ user }}<span v-if="msgsCount[user]" class="notice">{{msgsCount[user]}} 条未读</span>
          </div>
        </li>
      </Col>
      <Col class="chatbox" span="16">
        <div class="content">
          <div class="head">消息盒子</div>
            <Table stripe :columns="msgcloumn" :data="showableMsgs"></Table>
        </div>
        <div class="send">
          <form id="sendform" class="form-inline" onsubmit="return false;">
            <div class="form-group">
              <input type="text" class="form-control" name="content" v-model.lazy="inputValue">
            </div>
            <button id="send-msg" class="send btn btn-success" @click="sendEvent">发送</button>
          </form>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import io from 'socket.io-client';

  export default {
    data() {
      return {
        public: 'public',
        user: '',
        msgcloumn: [
            { title: '', key: 'other' },
            { title: '', key: 'sys' },
            { title: '', key: 'self' }
        ],
        msgs: [],
        users: [],
        inputValue: '',
        connectState: false,
        socket: '',
        selectedRoom: 'public',
        showableMsgs: [],
        msgsCount: [],
      }
    },
    methods: {
      connectEvent (user) {
        this.socket = io.connect('http://localhost:9999');
        this.connectState = true;
        var that = this;
        this.socket.on('connect', function () {
            that.socket.emit('join', user);
        });


        this.socket.on('sys', function (sysMsg, users) {
          var msg = {'other': '', 'sys':sysMsg, 'self': ''};
          that.msgs['public'].push(msg);
          that.users = users;
          if (users) {
            for (var i = users.length - 1; i >= 0; i--) {
              if (!that.msgsCount[users[i]]) {
                that.msgsCount[users[i]] = 0;
              }
            }
          }
        });

        this.socket.on('msg', function (userName, msg) {
          if (userName == that.user) {
            var message = {'other': '', 'sys':'', 'self':userName + ': ' + msg};
          } else {
            var message = {'other':userName + ': ' + msg, 'sys':'', 'self':''};
          }

          that.msgs['public'].push(message);
          if (that.selectedRoom != 'public') {
            that.msgsCount['public'] ++;
          }
        });

        this.socket.on('pmsg', function (from,to,msg)
        {
          var msg = {'other':from + ': ' + msg, 'sys':'', 'self':''};
          if (!that.msgs[from]) {
            that.msgs[from] = [];
          }
          that.msgs[from].push(msg);

          if (that.selectedRoom != from) {
            if (!that.msgsCount[from]) {
              that.msgsCount[from] = 0
            }
            that.msgsCount[from] ++;
          }

        });

      },
      sendEvent() {
        this.inputValue = this.inputValue;
        if (this.inputValue.length > 0) {
          if (this.connectState) {
            if (this.selectedRoom == 'public') {
              this.socket.emit('public_message',this.inputValue);
            } else {
              this.socket.emit("private_message",this.user,this.selectedRoom,this.inputValue);
              var msg = {'other': '', 'sys':'', 'self':this.user + ': ' + this.inputValue}
              if (this.msgs[this.selectedRoom]) {
                this.msgs[this.selectedRoom].push(msg);
              } else {
                this.msgs[this.selectedRoom] = [];
                this.msgs[this.selectedRoom].push(msg);
              }
            }
            this.inputValue = '';
          }
        }
      },

      roomchange(user) {
        console.log(user);
        this.selectedRoom = user;
        if (!this.msgs[this.selectedRoom]) {
          this.msgs[this.selectedRoom] = [];
        }

        this.showableMsgs = this.msgs[this.selectedRoom]
        this.msgsCount[this.selectedRoom] = 0;
      }
    },
    beforeMount: function() {
      var user = window.localStorage.user;
      if (user) {
        this.user = user;
      } else {
        this.$router.push('/login');
      }
      this.msgs['public'] = [];
      this.showableMsgs = this.msgs['public'];
      this.msgsCount['public'] = 0;
    },
    mounted: function() {
      this.connectEvent(this.user);
    }
  }
</script>

<style lang="less">

.activity {
  height: 90%;
}

.row {
  height: 90%;
}

.user-list {
  margin-left: 7%;
  border: 1px solid;
  margin-top: 20px;
  height: 100%;
  border-radius: 5px;
  .head {
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid;
  }
  li {
    border-bottom: 1px solid;
    list-style:none;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}

.chatbox {
  height: 100%;
  margin: 20px;
  border: 1px solid;
  border-radius: 5px;
  .content {
    height: 80%;
    overflow-y: auto;
    // border: 1px solid;
    .head {
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid;
    }
    #content-table {
        .sysMsg {
        color: #c1bfbf;
        font-size: 14px;
        text-align: center;
      }
    }
  }
  .send {
    border-top: 1px solid;
    height: 20%;
    #sendform {
      margin-left: 20px;
      margin-top: 5%;
      input {
        width: 600px;
      }
    }
  }
}

.header {
  margin-left: 50px;
}

thead {
  display: none;
}
</style>