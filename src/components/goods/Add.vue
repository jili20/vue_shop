<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视频区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条区域
          1、居中显示 align-center
          2、颜色 finish-status="success"
          3、data 中定义激活索引，并赋初始值 activeIndex: 0

          实现步骤条和tab栏的数据联动效果：让 <el-steps 和 <el-tabs 共用同一索引
          1、el-steps 索引从 0 开始
          2、给 el-tab-pane 添加值 name="0" name="1" 、2、3、4 索引值
          3、给 <el-tabs 添加 v-model="activeIndex" 绑定 <el-steps  activeIndex -> :active="activeIndex"
          4、<el-steps 将字符串索引转数值 :active="activeIndex - 0"
      -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 左竖 tab 栏区域
          1、添加外层表单 <el-form ，定义和绑定添加商品的表单数据对象 :model="addForm"
          2、data 中定义 添加商品的表单数据对象 addForm：{}
          3、表单中 添加表单验证规则 :rules="addFormRules"
          4、data 中定义表单验证规则
          5、表单中 添加引用对象 ref="addFormRef"
          6、data 中定义引用对象
          7、表单中指定 文本框在 label 之上 label-position="top"

          绘制基本信息面板的UI结构
          1、在 <el-tab-pane  中添加 <el-form-item 绑定校验规则项，添加 <el-input 项 绑定数据项
          2、data addForm 中定义 goods_name, addFormRules 中定义 goods_name 校验规则,其它几个属性一样的操作流程

          阻止页签切换
          1、<el-tabs 标签中绑定 :before-leave="brforeTableLeave">
          2、methods 中定义 beforeTableLeave 传参 (activeName, oldActiveName)

          获取动态参数列表数据
          1、给 <el-tabs 绑定事件 @tab-click="tabClicked" （tab 被选中时触发）
          2、methods 中定义 tabClicked 函数，判断激活索引是否=1，=1 进入动态参数面板，
          发起请求，为了简化请求 定义了下面的计算属性，调用接口获取分类数据，失败提示，保存数据
          3、计算属性 computed cateId 中定义获取三级分类 id逻辑
          4、data 中定义上面方法中用到的 动态参数列表数据数组 manyTableData:[]
      -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTableLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>

            <!-- 商品分类级联选择器
                1、绑定所有分类数据源 :options="cateList"
                2、定义配置对象 :props="cateProps"
                3、data 中定义配置对象 cateProps 各项的值
                4、data addForm 中添加 商品所属的分类数组 goods_cat: []
                5、级联选择器中绑定分类数组 v-model="addForm.goods_cat"
                6、methods 中新增事件处理函数 handleChange 级联选择器选中项变化，会触发这个函数
                7、商品分类绑定校验规则 <el-form-item prop="goods_cat"
                8、data addFormRules 中添加 校验项 goods_cat

                只允许选中三级商品分类
                1、handleChange 实现方法，没选中三级分数设置为空
             -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                expand-trigger="hover"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数
            <!-- 渲染表单的 Item 项
                1、定义 <el-form-item 遍历数组 取值
                2、methods async tabClicked () {} 获取到数据，遍历，将字符串以空格分隔成数组，再赋值给 manyTableData,控制台中查看打印出来的数组
                3、src/plugins/element.js 中导入和注册复选框组件
                4、页面添加复选框组件,绑定数组数据 <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox 中遍历 manyTableData 的 attr_vals 数组，页面输出数据
            -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 渲染商品属性面板的UI结构 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in onlyTableData">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 上传图片
              1、action 表示图片要上传到的后台 API 地址，需要完整地址
              2、data 中定义上传图片的 URL 地址 uploadURL, 作为参数给 :action="uploadURL" 使用
              3、methods 中实现指定预览事件函数 :on-preview="handlePreview"
              4、data 中定义处理移除图片的操作 事件函数 :on-remove="handleRemove"
              5、图片上传后显示的效果 list-type="picture" 这里显示图片，还可以设置为列表。。。
              6、headers 设置上传的请求头部，手动为上传组件绑定请求头 :headers="headerObj"
              7、data 中定义上传组件的 headers 请求头对象 headerObj: {},值是 token

              8、on-success 文件上传成功时的钩子, 上传组件中绑定 :on-success="handleSuccess"
              9、methods 中定义 handleSuccess 监听图片上传成功的事件,并后台打印查看到临时上传成功的路径
              10、data addForm 中定义存放临时上传路径的数组，名称以接口提供的为准 pics: []
              11、methods handleSuccess 中处理后续操作，得到图片信息对象，保存到 pics 数组中

              移除上传的图片信息
              1、上传组件绑定 :on-remove="handleRemove"
              2、methods 中处理定义的 handleRemove 方法：获取将要删除的图片的临时路径，从 pics 数组中，找到这个图片对应的索引值
                调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除

              实现图片的预览效果
              1、on-preview 点击文件列表中已上传的文件时的钩子，上传组件中定义 :on-preview="handlePreview"
              2、methods 中 处理 handlePreview 处理图片预览效果函数
              3、data 中定义 previewPath: '' 存放上传图片成功的 URL 页面预览使用
              4、methods handlePreview 中 获取到点击上传成功图片的名字时的信息，赋值给 previewPath
              5、添加对话框，显示预览的图片
          -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件
                1、data addForm 中添加商品详情描述属性 goods_introduce: ''
                2、双向绑定表单数据 v-model="addForm.goods_introduce" 在文本编辑器输入的任何内容都放在表单身上
                3、页面查看富文本编辑效果
                4、全局样式文件中，调整富文本最小高度为 300px
                5、添加 添加商品的按钮，调整按钮距离 上面的距离 margin-top: 15px;
                6、添加 添加商品的按钮，调整按钮与上面的距离 15px，绑定单击事件 @click="add"
                7、methods 中定义 add 方法,console.log(this.addForm) 页面编辑器中输入内容，点击按钮，控制台打印出输入的内容
                  添加表单预验证：拿到表单引用对象 addFormRef，添加验证
            -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 获取商品分类数据
           1、created 中调用获取商品分类数据方法 this.getCateList()
           2、methods 定义  getCateList () { 方法，请求接口，获取所有商品分类数据
           3、data 中定义 商品分类列表数组 cateList: []
      -->
    </el-card>

    <!-- 图片预览
        1、监听上传组件的 :on-preview="handlePreview" 事件，
        2、methods handlePreview 中接收到将要预览的图片信息，点击上传的图片名字得到的图片完整路径，显示对话框，显示图片
        2、:visible.sync="previewVisible" 控制图片显示或隐藏布尔值，默认为 false
        3、data 中定义 previewVisible: false
        4、对话框中添加 <img :src="previewPath" alt="">,动态绑定 显示图片URL,值是 methods handlePreview 中 获取到点击上传成功图片的名字时的信息 previewPath
        5、上传组件 :on-preview="handlePreview" 事件中处理展示图片预览框
        6、methods handlePreview -> this.previewVisible = true // 展开图片预览对话框
        7、调整图片预览框显示宽度样式为 100%,给img 标签添加类和样式 class="previewImg">  width: 100%;
     -->
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>

  </div>
</template>
<script>
import _ from 'lodash' // 导入安装好的进行深拷贝的组件

export default {
  data () {
    return {
      activeIndex: -0,
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情的描述
        goods_introduce: '',
        // 存放商品参数 商品属性，数组每个参数都是一个对象
        attrs: []
      },
      // 表单验证规则
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 表单引用对象
      addFormRef: {},
      // 商品分类列表数组
      cateList: [],
      // 分类级联选择器配置对象
      cateProps: {
        label: 'cat_name', // 显示的属性名
        value: 'cat_id', // 选中谁的值
        children: 'children' // 哪个属性父子嵌套
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的 URL 地址
      uploadURL: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      // 图片上传组件的 headers 请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 存放上传图片成功的 URL 页面预览使用
      previewPath: '',
      // 控制预览图片显示或隐藏布尔值，默认为隐藏
      previewVisible: false
    }
  },
  created () {
    // 获取所有商品分类数据
    this.getCateList()
  },
  methods: {
    // 🔘 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      // 🔘赋值给 data 定义的商品分类列表空数组
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 🔘 级联选择器选中项变化，会触发这个函数
    handleChange () {
      console.log(this.addForm.goods_cat)
      // 只允许选中三级商品分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 🔘 即将离开和进入的标签页
    beforeTableLeave (activeName, oldActiveName) {
      // console.log('即将离开的标签页名字是：' + oldActiveName)
      // console.log('即将进入的标签页名字是：' + activeName)
      // return false // 阻止页签切换
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类！')
        return false
      }
    },
    // 🔘 调用接口获取分类数据
    async tabClicked () {
      // 打印一下当前被激活的页签的 索引
      // console.log(this.activeIndex) // 控制台中点击页签查看索引值
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        // console.log('动态参数面板')
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        console.log(res.data)
        // 遍历，三元空判断，将字符串以空格分隔成数组，再赋值
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data

        // 访问静态属性的值
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败！')
        }
        console.log(res.data)
        // 保存到 data 中定义的 onlyTableData
        this.onlyTableData = res.data
      }
    },
    // 🔘处理图片预览效果
    handlePreview (file) {
      console.log(file) // 测试，上传图片成功，点击图片名称，打印到信息和地址
      // 把获取到的信息给 data 中定义的 previewPath赋值
      this.previewPath = file.response.data.url
      // 因为上传图片的地址不是公网，所在显示不出来？
      // "http://127.0.0.1:8888/tmp_uploads/0a15a3a0ec992ff0801f250a516d8ec6.jpg"
      this.previewVisible = true // 展开图片预览对话框
    },
    // 🔘处理移除图片的操作
    handleRemove (file) {
      // console.log(file)
      // 1、获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2、从 pics 数组中，找到这个图片对应的索引值
      // findIndex 查找数组对应项的索引值的新方法，x 数组中的每一项，
      // splice() 方法可删除从 index 处开始的零个或多个元素
      const i = this.addForm.pics.findIndex(x => x.pic === filePath) // 证明找到这一项，返回对应索引值
      // 3、调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 🔘 监听图片上传成功的事件
    handleSuccess (response) {
      console.log(response)
      // 1、拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2、将图片信息对象，push 到 pics 数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 🔘 添加商品
    add () {
      // console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加的业务逻辑
        // 把 goods_cat 从数组转换为用逗号隔开的字符串，报错，因为表单绑定的数据 addForm.goods_cat 是数组，这里需要字符串
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // 使用深拷贝工具解决此问题，安装，引入，使用 lodash  cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',') // 转字符串
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        await this.$router.push('/goods') // 编程路由，跳转到商品列表
      })
    }
  },
  // 计算属性
  computed: {
    // 🔘获取三级分类 id,供调用
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
// 图片预览区域
.previewImg {
  width: 100%;
}

// 添加按钮与上面的距离
.btnAdd {
  margin-top: 15px;
}
</style>
