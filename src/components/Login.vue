<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png"/>
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_info" label-width="0">
        <!-- 用户名 -->
        <el-form-item label="" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" placeholder="请输入登录名称"></el-input>
        </el-form-item>
        <!-- 电话号码 -->
        <!--        <el-form-item label="" prop="phone">-->
        <!--          <el-input v-model="loginForm.phone" prefix-icon="el-icon-phone" placeholder="请输入手机号码"></el-input>-->
        <!--        </el-form-item>-->
        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" show-password
                    type="password" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns" label="">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        // 对象的属性
        username: 'admin',
        password: '123456'
      },
      // 自定义的表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          {
            required: true,
            message: '请输入登录名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ]
        // 验证手机号码是否合法
        // phone: [
        //   {
        //     required: true,
        //     message: '请输入手机号码',
        //     trigger: 'blur'
        //   }
        // ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // 点击重置按钮，重置登录表单
      // console.log(this) // $refs 对象，loginFormRef 属性表单引用对象
      this.$refs.loginFormRef.resetFields() // resetFields() eui框架重置函数
    },
    login () {
      // 先拿到 表单的引用对象，再调用 validate 方法进行预校验
      // this.$refs.loginFormRef.validate(valid => {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // main.js中配置请求的根路径后，这里url直接写方法路径和参数
        // const result = this.$http.post('login', this.loginForm)
        // await 只能用在 async 修饰的方法中，异步 拿到服务器返回的数据 { data: res }
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res) // 返回 Promise
        // if (res.meta.status !== 200) return console.log('登录失败')
        // 使用消息弹框
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        // console.log('登录成功')
        this.$message.success('登录成功')
        // console.log(res) // 登录成功打印出 token
        // 登录成功之后的 token,保存到客户端的 sessionStorage 中(临时的，会话期间有效）
        // 项目中除了登录之外的其他 API 接口，必须在登录之后才能访问
        // token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 登录成功 路由跳转；通过编程式导航跳转到后台主页，路由地址是 /home
        await this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_info {
  position: absolute;
  bottom: 0; // 底部对齐
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box; // 不超出边框
}

.btns {
  display: flex; // 弹性盒模型
  justify-content: flex-end; // 尾部对齐
}
</style>
