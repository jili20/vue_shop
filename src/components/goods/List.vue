<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <!-- 搜索与清空功能
               搜索：1、搜索框数据双向绑定 v-model="queryInfo.query"
                    2、点击按钮 调用获取商品列表函数，获取商品列表数据 @click="getGoodsList"></el-button>
              清空：1、 <el-input 中添加 clearable @clear="getGoodsList" 清空后重新获取列表数据
           -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 通过编程式导航跳转到商品添加页面
              1、添加商品按钮绑定单击函数 @click="goAddPage">添加商品</el-button>
              2、methods 中定义 goAddPage 函数,进行路由跳转
              3、新建组件 src/components/goods/Add.vue
              4、配置路由
           -->
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表 table 表格区域 -->
      <!-- tab 页签区域 -->
      <el-table :data="goodsList" border="" stripe="">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <!-- 根据 id 删除商品数据
                 1、给删除按钮绑定单击事件，传当前行 id：@click="removeById(scope.row.goods_id)">删除
                 2、methods 中定义 removeById 函数
             -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域
          1、methods 中监听 每页显示条数 改变事件 handleSizeChange (newSize) {} 改变事件，将传入的 newSize 赋值给 data 中的 queryInfo，重新刷新列表
          2、methods 中监听 当前页码 改变事件 handleCurrentChange
          3、给分页组件 当前页面赋值。指定每页显示条数 :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize" ...
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
    <!-- 获取商品列表
        1、created 中定义 获取商品列表 this.getGoodsList()
        2、methods 中定义 getGoodsList 方法，根据分页获取对应的商品列表
        3、data 中定义查询参数对象 queryInfo
        4、methods getGoodsList 调用接口获取商品列表数据
        5、data 中定义商品列表 goodsList: [], 总数据条件 total: 0
        6、methods getGoodsList 将调用接口获取到的商品列表数据赋值给
           this.goodsList = res.data.goods  this.total = res.data.total
     -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 查询参数对象
      queryInfo: {
        query: '', // 查询参数 关键字
        pagenum: 1, // 当前页码
        pagesize: 10 // 每页显示条数
      },
      // 商品列表
      goodsList: [],
      // 总数据条件
      total: 0
    }
  },
  created () {
    // 获取商品列表
    this.getGoodsList()
  },
  methods: {
    // 🔘 根据分页获取对应的商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      // this.$message.success('获取商品列表成功！')
      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },

    // 🔘 监听 每页显示条数改变事件；根据分页获取对应的商品列表
    handleSizeChange (newSize) {
      // 将传入的 newSize 赋值给 data 中定义的 queryInfo.pagesize
      this.queryInfo.pagesize = newSize
      this.getGoodsList() // 刷新数据列表
    },

    // 🔘 监听 页码改变事件
    handleCurrentChange (newPage) {
      // 将传入的 newPage 赋值给 data 中定义的 queryInfo.pagenum
      this.queryInfo.pagenum = newPage
      this.getGoodsList() // 刷新数据列表
    },

    // 🔘 根据 id 删除商品数据
    async removeById (id) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      // console.log('确认了删除')
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      await this.getGoodsList()
    },

    // 🔘 路由跳转到添加商品组件
    goAddPage () {
      this.$router.push('/goods/add')
      // http://localhost:8081/#/goods/add
    }
  }
}
</script>
<style lang="less" scoped>
</style>
