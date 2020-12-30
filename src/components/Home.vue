<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <a href="http://localhost:8081/welcome#/welcome"><img src="../assets/heima.png"/></a>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 展开折叠切换菜单按钮；绑定单击事件实现折叠展开效果 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" unique-opened :collapse="isCollapse"
          :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 一级菜单图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 一级菜单文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNavState('/'+subItem.path)">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 二级菜单图标 -->
                <i class="el-icon-menu"></i>
                <!-- 二级菜单文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左则菜单数据
      menuList: [],
      // 定义一级分类图标对象，一个分类一个图标
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠,默认不折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },

  created () {
    this.getMenuList()
    // 获取 sessionStorage 中的值
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 退出功能：清空 sessionStorage 中的 token,跳转到登录页面
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      // res 是给 data 取的别名
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}

// 顶部导航
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; // 左右贴边
  padding-left: 0; // 去左边
  align-items: center; // 让退出按键居中，默认是贴边的
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center; // 纵向居中
    span {
      margin-left: 15px;
    }
  }
}

// 左侧边栏
.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none; // 设置左则菜单没有右边框线，使其对齐
  }
}

// 右侧内容主体
.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

//展开折叠切换菜单按钮；绑定单击事件实现折叠展开效果
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em; // 让 |与|之间有距离
  cursor: pointer; // 鼠标移上变小手
}

</style>
