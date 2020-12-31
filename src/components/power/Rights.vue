<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <!-- 权限列表
         1、data 中 定义权限列表数据对象初始值 rightsList: []
         2、created 中 定义 获取所有的权限 方法 this.getRightsList()
         3、methods 中 定义 获取权限列表的数据的 方法 getRightsList () {}
         4、给权限列表表格 添加边框 border ； 隔行变色 stripe
         5、添加索引 type="index"
         6、绑定校验属性 prop="authName"
         7、接收所有数据 slot-scope="scope"
         -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created () {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
