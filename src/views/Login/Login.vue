<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <Form ref="loginForm"
                :model="account"
                :label-width='0'
                :rules='rules'
                @keydown.enter.native="handleSubmit">
            <FormItem prop="userName">
              <Input v-model="account.userName" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="ios-person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="account.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="md-lock"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script lang='ts'>
  import { Component, Vue } from 'vue-property-decorator'
  import { Mutation } from 'vuex-class'

  @Component
  export default class Login extends Vue {
    account: { [key: string]: string } = {
      userName: Math.random().toString(16).slice(2, 8),
      password: ''
    }

    get rules() {
      return {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }

    @Mutation('setLoginStatus')
    setLoginStatus!: (payload: { isLogin: boolean }) => void

    handleSubmit() {
      (this.$refs.loginForm as any).validate((valid: boolean) => {
        if (valid) {
          this.setLoginStatus({ isLogin: true })
        }
      })
    }
  }
</script>

<style scoped lang='scss'>
  .login {
    width: 100%;
    height: 100%;
    background-image: url('../../assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
    position: relative;

    &-con {
      position: absolute;
      right: 160px;
      top: 50%;
      transform: translateY(-60%);
      width: 300px;

      &-header {
        font-size: 16px;
        font-weight: 300;
        text-align: center;
        padding: 30px 0;
      }

      .form-con {
        padding: 10px 0 0;
      }

      .login-tip {
        font-size: 10px;
        text-align: center;
        color: #c3c3c3;
      }
    }
  }
</style>
