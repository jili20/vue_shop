<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <!-- 功能实现全过程
         1、新建组件目录和文件
         2、配置路由
         3、添加面包屑导航区域
         4、添加卡片视图区域
         5、data 中定义存放商品分类数据列表的空数组 cateList: []
         6、created 调用获取商品分类列表数据的方法 this.getCateList()
         7、methods 中定义上面获取商品分类数据方法 getCateList()
         8、data 中定义 查询分页条件对象 queryInfo:{...}
         9、data 中定义总数据条数 total: 0
     -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <!-- 1、表格各行的数据源 :data="cateList"
           2、columns 表格各列的配置 :columns="columns"
           3、data 中定义columns
           4、去掉复选框 :selection-type="false"
           5、去除展开行表格 :expand-type="false"
           6、显示索引 show-index
           7、显示索引名为 # 号：index-text="#"
           8、显示纵身边框 border
           9、去除鼠标划过高亮效果 :show-row-hover="false"
           10、使用自定义模板列渲染表格数据 columns 中定义
           11、树形控件中 添加模板和插槽 template slot="isok"
           12、slot-scope="scope" 获取这一行的数据，scope.row.cat_deleted 获取属性的值
           13、判断取值给样式 v-if="scope.row.cat_deleted === false" style="color: lightseagreen"
           14、data columns 中定义排序列 order
           15、添加排序操作列模板 <template slot="order" slot-scope="scope"> 根据判断显示对应等级
      -->
      <tree-table class="treeTable" :data="catelist" :columns="columns"
                  :selection-type="false" :expand-type="false" show-index index-text="#" border
                  :show-row-hover="false">
        <!-- 使用自定义模板列 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"
             style="color: lightseagreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">编辑</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <!-- 1、添加分页组件
           2、methods 中定义 handleSizeChange 监听 pagesize 改变，
             接收到新值，马上赋值给 data 定义的 pagenum，刷新数据列表
           3、methods 中定义监听 pagenum 改变的函数 handleCurrentChange
             接收到新值，赋值给 data 中定义的 pagesize，刷新数据列表
           4、为分页组件绑定当前组件对应的有效的数据，
           -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <!-- 1、添加分类对话框,修改标题 title="添加分类"
         2、绑定布尔值 控制对话框的关闭与显示 :visible.sync="addCateDialogVisible"
         3、data 中定义对话框的默认初始值为隐藏 addCateDialogVisible: false
         4、取消和确定按钮点击事件换上 addCateDialogVisible
         5、添加分类按钮绑定单击事件 @click="showAddCateDialog">添加分类</el-button>
         6、methods 中定义 showAddCateDialog方法，设置对话框为 true
         7、添加分类表单，双向绑定数据对象 :model="addCateForm"
         8、data 中定义数据对象初始值 addCateForm: {}
         9、表单中添加 校验规则对象 :rules="addCateFormRules"、引入对象 ref="addCateFormRef"
         10、处理 el-form-item 各项的值
         11、data addCateForm 表单数据对象中定义分类属性和初始值 cat_name: '' cat_pid: 0, cat_level: 0
         12、data 中定义表单验证规则 addCateFormRules cat_name[]
         13、添加 el-form-item label="父级分类："
         14、methods 中定义获取父级分类的数据列表方法 getParentCateList
         15、methods showAddCateDialog 方法中调用 getParentCateList 方法，先获取数据再展示对话框
         16、data 中定义父级分类列表的空数组 parentCateList: []
         17、把 getParentCateList 方法获取到的分类列表数据赋值给 data 中定义的空数组 parentCateList
         18、添加级联选择器展示分类数据
    -->
    <el-dialog
      @close="addCateDialogClosed"
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%">
      <!-- 添加分类表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <!-- 级联选择器 -->
        <!-- 级联选择器
             1、绑定数据源 父级分类的列表 :options="parentCateList"
             2、props 用来指定配置对象 :props="{ cascaderProps: 'hover' }"
             3、data 中定义配置对象和属性值 cascaderProps: {...}
             4、v-model="selectedKeys" 定义选中的值的数组
             5、data 中定义选中的父级分类的 id 数组 selectedKeys: []
             6、只要级联选择项发生变化就会触发函数方法 @change="parentCateChange"
             7、methods 中定义 parentCateChange 函数方法
             8、全局样式文件中修改级联选择器样式 .el-scrollbar__wrap{height: 200px !important;}
             9、支持清空选项 clearable
             10、允许选择任意一级的选项 change-on-select
             11、级联选择器发生变化触发 parentCateChange 函数，函数中，如果选中分类 selectedKeys 大于0
                反之没有选中任何父分类，添加的为一级分类，如果选中分类，数组长度大于0，添加的分类的
                Id 为数组索引长度 -1，添加的分类的等级为数组的长度。反之分类id 为0，等级为0，都是一级
             12、添加分类 确定 按钮绑定单击事件， @click="addCate">确 定</el-button>
             14、methods 中定义点击按钮添加新的分类函数 addCate ，测试 页面输入分类名称，点击确定，打印等级和分类都是0
             15、监听添加分类对话框的关闭事件 <el-dialog @close="addCateDialogClosed"
             16、methods 中处理 addCateDialogClosed 函数，监听对话框的关闭事件，重置表单数据
             17、methods 处理 添加新的分类函数 addCate，
         -->
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="parentCateChange" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data () {
    return {
      // 分页查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空数组
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          // 表示 将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示 将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示 将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏，默认隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '', // 将要添加的分类的名称
        cat_pid: 0, // 父级分类 id
        cat_level: 0 // 默认要添加的分类是一级分类
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id', // 指定选中的值的属性
        label: 'cat_name', // 指定看到的属性
        children: 'children' // 指定父子嵌套所用的属性
      },
      // 选中的父级分类的 id 数组
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 🔘 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }

      console.log(res.data)
      // 把数据列表，赋值给 catelist
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 🔘 分页 - 监听 pagesize 改变
    handleSizeChange (newSize) {
      // 接收到最新的 pagesize 即 newSize 赋值给 this.querInfo.pagesize
      this.querInfo.pagesize = newSize
      // 刷新数据列表
      this.getCateList()
    },
    // 🔘 分页 - 监听 pagenum 改变
    handleCurrentChange (newPage) {
      // 接收到改变，赋值给定义的 pagenum
      this.querInfo.pagenum = newPage
      // 刷新列表
      this.getCateList()
    },
    // 🔘 点击按钮，展示添加分类的对话框
    showAddCateDialog () {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
    // 🔘 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      // console.log(res.data)
      // 把获取到的分类列表数据赋值给 data 中定义的空数组 parentCateList
      this.parentCateList = res.data
    },
    // 🔘 级联选择项发生变化触发这个函数
    parentCateChange () {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中了父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 获取父分类 id，数组的最后一个索引值
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前添加的分类的等级赋值，等于数组的长度
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的 id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 🔘 点击按钮，添加新的分类
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        await this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 🔘监听对话框的关闭事件，重置表单数据
    addCateDialogClosed () {
      // 获取表单引用，调用框架重置表单方法 resetFields()
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

// 设置级联选择框宽度
.el-cascader {
  width: 100%;
}
</style>
