<template>
  <div class="login">
    <div class="login-content">
      <div class="login-title">
        <img src="../assets/KDpgvguMpGfqaHPjicRK.svg" alt="" />
        <span>总控后台</span>
      </div>
      <!-- .prevent 阻止原生表单提交，防止第一次登录被重置 -->
      <div class="login-form">
        <a-form
          :form="form"
          layout="horizontal"
          class="login-form"
          @submit.prevent="handleSubmit"
        >
          <!-- 账户 -->
          <a-form-item>
            <a-input
              v-decorator="[
                'userName',
                { rules: [{ required: true, message: '请输入账号!' }] }
              ]"
              placeholder="请输入账号"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <!-- 密码 -->
          <a-form-item class="wwidth">
            <a-input
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '请输入密码!' }] }
              ]"
              type="password"
              placeholder="请输入密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <!-- 验证码 -->
          <div class="codebox">
            <a-form-item>
              <a-input
                class="width"
                v-decorator="[
                  'inputCode',
                  { rules: [{ required: true, message: '请输入验证码!' }] }
                ]"
                placeholder="请输入验证码"
              >
                <a-icon
                  slot="prefix"
                  type="safety"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <!-- 更新验证码 -->
            <div class="codeImg" @click="newGetCode">
              <!-- 验证码图 -->
              <img :src="codeImage" alt="" />
            </div>
          </div>

          <!-- 按钮 -->
          <a-form-item>
            <a-button type="primary" html-type="submit" class="wwidth">
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 验证码的当前时间戳
      currTimestamp: '',
      // 验证码的状态
      codeState: false,
      // 验证码的图
      codeImage: '',
      // 表单提交状态
      submitState: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    // 渲染前先调用接口获取数据（实现数据更新就显示二维码图）
    // 调用获取验证码方法
    this.getCode()
  },
  methods: {
    // 获取验证码
    getCode() {
      this.codeState = true
      this.currTimestamp = Date.now()
      // console.log(this.currTimestamp)

      fetch(`/system-admin/sys/randomImage/${this.currTimestamp}`)
        .then(response => {
          return response.json()
        })
        .then(res => {
          console.log(res)
          if (res.success) {
            this.codeImage = res.result
          } else {
            alert(res.message)
          }
        })
        .finally(() => {
          this.codeState = false
        })
    },
    // 点击更新验证码
    newGetCode() {
      if (this.codeState) {
        return
      } else {
        this.getCode()
      }
    },
    // 提交表单
    handleSubmit() {
      if (this.submitState) {
        return
      }
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }

        this.submitState = true
        var data = {
          username: values.userName,
          password: values.password,
          remember_me: false,
          captcha: values.inputCode,
          checkKey: this.currTimestamp
        }
        fetch('/system-admin/sys/login', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        })
          .then(res => {
            return res.json()
          })
          .then(res => {
            console.log(res)
            if (res.success) {
              var token = res.result.token
              var userInfo = res.result.userInfo
              sessionStorage.setItem('token', token)
              sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
              // this.$router.push('/gamesCon')
              this.$router.push('/gamesRecord')
            } else {
              alert(res.message)
              // 登录失败,则刷新验证码（调用验证码方法）
              this.getCode()
            }
          })
          .finally(() => {
            // 提交时表单状态是开的，现在是关闭（为了再次点击能提交
            this.submitState = false
          })
      })
    }
  }
}
</script>

<style>
.login {
  padding-top: 40px;
  height: 100vh;
  background: #f0f2f5;
}
.login-content {
  padding: 32px 0 24px 0;
  background: url('../assets/background.svg');
}
.login-title {
  margin-bottom: 40px;
  height: 44px;
  text-align: center;
  line-height: 44px;
}
.login-title img {
  height: 44px;
  margin-right: 16px;
  vertical-align: top;
}
.login-title span {
  font-size: 32px;
  line-height: 44px;
  font-weight: 600;
}
.login-form {
  width: 368px;
  margin: auto;
}
.ant-input {
  height: 40px;
}
.codebox {
  display: flex;
  justify-content: space-between;
}

.codeImg {
  width: 105px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  margin-top: 2.5px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.codeImg img {
  position: absolute;
  left: 0;
  top: 0;
}
.ant-btn-primary {
  width: 100%;
}
.ant-form-item-control-wrapper {
  width: 100%;
}
</style>
