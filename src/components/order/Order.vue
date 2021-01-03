<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视频区域 -->
    <!-- 根据分页 获取订单数据列表
        1、data 中定义查询对象 queryInfo
        2、created 中调用查询订单列表方法 this.getOrderList()
        3、methods 中定义 getOrderList() 方法,调用接口获取订单数据列表
        4、data 中定义  total: 0, orderList: []
     -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据
          1、绑定数据源 :data="orderList"， border 边框，stripe 隔行变色
      -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <!-- 实现省市区县数据联动效果
            1、编辑按钮绑定单击事件 @click="showBox" 展示修改地址的对话框
            2、methods 中定义 showBox 方法
         -->
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <!--
          1、pagesize 发生变化，调用 @size-change="handleSizeChange"
          2、methods 中定义 handleSizeChange 方法，监听 pagesize变化 ，把传入的 新 pagesize ，赋值给定义的 pagesize
          3、methods 中定义监听 页码值发生变化事件 handleCurrentChange
          4、页面添加修改地址的对话框
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2,5, 10,15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background="">
      </el-pagination>
    </el-card>

    <!--  修改地址的对话框 -->
    <!--
        1、title="修改地址" ,布尔值控制隐藏或显示 :visible.sync="addressVisible"
        2、data 中定义 addressVisible: false 默认隐藏
        3、点击取消和确实都隐藏对话框 @click="addressVisible = false"
        4、只要点击了修改按键 methods showBox 打开对话框 this.addressVisible = true
        5、对话框中添加表单,输入各项值： address1 address2 为自定义
        6、data 中定义 对话框表单绑定数据对象和属性 addressForm: {address1: [], address2: ''}
           定义校验规则 :rules="addressFormRules"
        7、引入 省市区县 数据文件 src/components/order/citydata.js
        8、页面导入 citydata.js 文件
        9、data 中定义 cityData
    -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <!-- 级联选择器
              1、绑定数据 :options="cityData" v-model="addressForm.address1"
              2、修改样式 el-cascader 宽度为 width: 100%;
              3、监听对话框的关闭事件，清空表单  <el-dialog  @close="addressDialogClosed"
              4、methods 中定义 addressDialogClosed 获取引用对象，调用框架方法，清空表单
              :props="cityData"  @change="handleChange"
           -->
          <el-form-item>
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              expand-trigger="hover"
            ></el-cascader>
          </el-form-item>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <!-- 展示物流进度对话框并获取物流信息
         1、定位按钮绑定单击事件 icon="el-icon-location"  @click="showProgressBox"></el-button>
         2、methods 中定义 showProgressBox
         3、添加 展示物流进度的对话框 :visible.sync="progressVisible" 布尔值控制对话框的显示与隐藏
         4、data 中定义 progressVisible: false 对话框默认为关闭
         5、methods showProgressBox 只要点击定位按钮 显示对话框,调用接口获取物流进度信息
         6、data 中定义 progressInfo: [] 保存物流信息
         -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
      <span>这是一段信息</span>
    </el-dialog>

    <!-- 时间线 -->
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
        {{ activity.context }}
      </el-timeline-item>
    </el-timeline>

  </div>
</template>
<script>
import cityData from './citydata.js' // 引入 省市区县 数据文件

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      // 修改地址对话框 默认隐藏
      addressVisible: false,
      // 对话框表单绑定数据对象
      addressForm: {
        address1: [],
        address2: ''
      },
      // 修改表单校验规则
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区县',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true,
            message: '请填写详情地址',
            trigger: 'blur'
          }
        ]
      },
      // 省市区县数据
      // cityData: cityData // 属性名和属性值同名可简写，如下
      cityData,
      // 展示物流进度的对话框
      progressVisible: false,
      // 保存物流信息
      progressInfo: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 🔘 分页查询订单列表
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }
      console.log(res)
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    // 🔘 监听 pagesize 变化，触发此方法
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize // 把接收到的 newSize 赋值给定义的 pagesize
      this.getOrderList() // 刷新数据库列表
    },
    // 🔘 监听 pagenum 变化，触发此方法
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 🔘 展示修改地址的对话框
    showBox () {
      this.addressVisible = true
    },
    // 🔘 监听对话框的关闭事件，重置表单
    addressDialogClosed () {
      // 获取引用对象，调用框架方法，清空表单
      this.$refs.addressFormRef.resetFields()
    },
    // 🔘 点击定位按钮触发事件
    async showProgressBox () {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      this.progressInfo = res.data

      this.progressVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>
<style lang="less" scoped>
// 时间线样式
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
// 级联选择器宽度
.el-cascader {
  width: 100%;
}
</style>
