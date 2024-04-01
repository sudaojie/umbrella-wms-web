<template>
  <div class="login">
    <div class="header">
      <div class="logo">智慧仓储管理平台</div>
    </div>
    <div class="content">
      <div class="left-box">
        <img src="../assets/logo/left.png" />
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <div class="login-title">欢迎登录</div>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
            >
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="captchaEnabled">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img"/>
            </div>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width:100%;background-color: #2d68ff;font-size: 16px;border-radius: 25px;padding: 15px;"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <div style="float: right;" v-if="register">
              <router-link class="link-type" :to="'/register'">立即注册</router-link>
            </div>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>

import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      title:process.env.VUE_APP_TITLE,
      codeUrl: "",
      loginForm: {
        username: "wms",
        password: "123456",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    width: 100%;
    height: 100%;
    padding: 0 5% 0 5%;
    box-sizing: border-box;
    background: url(../assets/logo/background.png);
    background-size: 100% 100%;
  }

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    padding-top: 3%;
    padding-bottom: 7%;
  }

  .header .logo{
    width: 620px;
    height: 50px;
    font-size: 37px;
    font-weight: bold;
    color: white;
    margin-right: 15px;
    /*background: url(../assets/logo/logo.png);*/
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .header .title {
    color: #646c9a;
    font-size: 36px;
    font-weight: 700;
    line-height: 65px;
    letter-spacing: 6px;
  }

  .content {
    height: 70%;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: 100%;
    // align-items: center;
  }

  .left-box {
    width: 55%;
    position: relative;
  }

  .left-box img {
    position: absolute;
    width: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-58%);
  }

  .login-form {
    height: 430px;
    background: #fafafa;
    border-radius: 8px;
    // box-shadow: -20px -20px 40px #fff, 20px 20px 40px rgb(4 84 242 / 15%);
    padding: 40px;
    box-sizing: border-box;
    width: 460px;
    border: 1px solid #ffffff;
    margin-top: 50px;
    margin-right: 50px;
  }

  .el-form-item {
    margin-bottom: 22px;
  }

  .login-form .login-title {
    color: #1463b8;
    font-size: 38px;
    font-weight: 700;
    height: 66px;
    letter-spacing: 3px;
    line-height: 66px;
    margin-bottom: 10px;
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }
/*.login {*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  height: 100%;*/
/*  background-image: url("../assets/images/login-background.jpg");*/
/*  background-size: cover;*/
/*}*/
/*.title {*/
/*  margin: 0px auto 30px auto;*/
/*  text-align: center;*/
/*  color: #707070;*/
/*}*/

/*.login-form {*/
/*  border-radius: 6px;*/
/*  background: #ffffff;*/
/*  width: 400px;*/
/*  padding: 25px 25px 5px 25px;*/
/*  .el-input {*/
/*    height: 38px;*/
/*    input {*/
/*      height: 38px;*/
/*    }*/
/*  }*/
/*  .input-icon {*/
/*    height: 39px;*/
/*    width: 14px;*/
/*    margin-left: 2px;*/
/*  }*/
/*}*/
/*.login-tip {*/
/*  font-size: 13px;*/
/*  text-align: center;*/
/*  color: #bfbfbf;*/
/*}*/

/*.el-login-footer {*/
/*  height: 40px;*/
/*  line-height: 40px;*/
/*  position: fixed;*/
/*  bottom: 0;*/
/*  width: 100%;*/
/*  text-align: center;*/
/*  color: #fff;*/
/*  font-family: Arial;*/
/*  font-size: 12px;*/
/*  letter-spacing: 1px;*/
/*}*/
/*.login-code-img {*/
/*  height: 38px;*/
/*}*/
</style>
