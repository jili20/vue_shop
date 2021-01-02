<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视频区 -->
    <el-card>
      <!-- 警告区域 -->
      <!-- 1、显示图标 show-icon
           2、关闭 x 按钮 :closable="false"
       -->
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false">
      </el-alert>

      <!-- 选择商品分类区域 -->
      <!-- 1、created 调用获取所有商品分类列表方法 this.getCateList()
           2、methods 中定义获取所有商品分类列表 getCateList，调用后端接口获取数据
           3、data 中定义 catelist: [] 存放分类列表数据
           4、methods getCateList 调用接口，把请求到的数据赋值给 catelist: []
      -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <!-- 级联选择框
              1、指定数据源，所有分类列表数据 :options="catelist"
              2、级联选择框的配置对象 :props="cateProps"
              3、data 中定义级联配置对象 cateProps
              4、把选中的 id 值双向绑定到数组中 v-model="selectedCateKeys"
              5、data 中定义 selectedCateKeys: []
              6、级联选择框选中项变成，会触发 @change="handleChange" 函数
              7、methods 中定义 @change="handleChange"
              8、控制级联选择框的选中范围只能是三级，在 handleChange 函数中控制 selectedCateKeys 数组的长度，如果选择的不是三级分类，数组为空
              -->
          <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="selectedCateKeys"
                       @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <!-- 1、页面引入 tab 页签
           2、src/plugins/element.js 中注册页签
           3、data 中定义 activeName 被激活的页签的名称，默认为 first
           4、name="first" 每个页签唯一的名称
           5、methods 中定义页签点击事件的处理函数 handleTabClick
           6、调整页签内容
           7、computed 中定义控制按钮是否被禁用的 函数 isBtnDisabled
           8、按钮中 绑定 isBtnDisabled 函数 :disabled="isBtnDisabled"
           9、计算属性 computed 中定义获取选中三级分类的方法 cateId
           10、面板中绑定接口参数 name="many" name="only"，修改data中的绑定初始值
           11、methods 中完善 handleChange 方法，根据选中id获取对应参数
           12、methods 方法抽取，获取参数列表的数据 async getParamsData () {
           13、methods handleChange 和 handleTabClick 中调用 getParamsData
           14、data 中定义 getParamsData 方法用到的挂载数据的数组：manyTableData: [],onlyTableData: []
           15、渲染动态参数和静态属性的Table表格,绑定数据源，加边框，隔行变色 :data="mynyTableData" border stripe
      -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button type="primary" size="mini"
                     :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数
          </el-button>
          <!-- ⚪️ 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <!-- 渲染参数下的可选项
                 1、methods -> getParamsData 遍历获取到的参数字符串，用空格分隔成数组
                 2、展开项循环渲染 Tag 标签  <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i">{{ item }}</el-tag>
                 3、添加 closable 每一项添加 x 按钮
                 4、添加 按钮输入文本框  <el-input ，添加按钮 <el-button
          -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 Tag 标签 -->
                <!-- 删除参数可选项
                     1、给标签绑定关闭 Tag 时触发的事件，传索引值和当前行数据（顺序不能更换） @close="handleClose(i,scope.row)">{{ item }}
                     2、methods 中定义 handleClose 函数
                     -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                        @close="handleClose(i,scope.row)">{{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <!-- 1、控制文本框的隐藏与显示 v-if="inputVisible"； data 中定义初始值 inputVisible: false
                     2、data 中定义文本框输入的内容：v-model="inputValue" -> inputValue: ''
                     3、methods 中定义绑定的文本框失去焦点，或按下 Enter 键都会触发的函数
                     4、methods 中定义绑定的函数 @click="showInput">+ New Tag ,点击按钮，展示文本输入框，页面测试
                     5、控制点击按钮弹出的输入框的长度 .input-new-tag { width: 120px; }

                     6、为每一行 v-if= v-model= 提供唯一的 值：data -> getParamsData -> item.inputVisible = false  item.inputValue = ''
                     7、<el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                     8、删除 data 中的：inputVisible: false, inputValue: ''
                     9、添加按钮传行数据 @click="showInput(scope.row)">+ New Tag
                     10、methods showInput 中接收参数 row，显示文本框 row.inputVisible = true

                     11、methods  showInput (row) { 让文本框自动获得焦点，调用框架的方法
                      this.$nextTick(_ => {
                        this.$refs.saveTagInput.$refs.input.focus();
                      })

                      12、监听点击事件中传当行数据 @keyup.enter.native="handleInputConfirm(scope.row)"
                                           @blur="handleInputConfirm(scope.row)"
                      13、methods handleInputConfirm (row) { 接收数据，隐藏文本框
                      14、测试 点击 + New Tag 按钮，获得焦点，失去焦点，回到 + New Tag 按钮状态
                      15、methods handleInputConfirm (row) 去除空格，赋空值，隐藏文本框
                      添加操作：
                      16、上面12。监听点击事件中传当行数据
                      17、methods handleInputConfirm 显示添加的合法的标签
                         将用户输入的值保存到空数组中，紧接将文本框时的值清空，隐藏输入框
                         调用接口发起请求，保存添加的标签到数据库，成功提示，失败提示
                -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>

              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 通过作用域插槽的方式获取数据 -->
                <el-button type="primary" icon="el-icon-edit" size="mini"
                           @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>

                <!-- 完成删除参数的业务逻辑
                    1、删除按钮绑定点击事件，同时传当前行数据 id @click="removeParams(scope.row.attr_id)">删除
                    2、methods 中定义删除函数 removeParams 确认提示
                     -->
                <el-button type="danger" icon="el-icon-delete" size="mini"
                           @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加属性
          </el-button>
          <!-- ⚪️ 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 Tag 标签 -->
                <!-- 删除参数可选项
                     1、给标签绑定关闭 Tag 时触发的事件，传索引值和当前行数据（顺序不能更换） @close="handleClose(i,scope.row)">{{ item }}
                     2、methods 中定义 handleClose 函数
                     -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                        @close="handleClose(i,scope.row)">{{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <!-- 1、控制文本框的隐藏与显示 v-if="inputVisible"； data 中定义初始值 inputVisible: false
                     2、data 中定义文本框输入的内容：v-model="inputValue" -> inputValue: ''
                     3、methods 中定义绑定的文本框失去焦点，或按下 Enter 键都会触发的函数
                     4、methods 中定义绑定的函数 @click="showInput">+ New Tag ,点击按钮，展示文本输入框，页面测试
                     5、控制点击按钮弹出的输入框的长度 .input-new-tag { width: 120px; }

                     6、为每一行 v-if= v-model= 提供唯一的 值：data -> getParamsData -> item.inputVisible = false  item.inputValue = ''
                     7、<el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                     8、删除 data 中的：inputVisible: false, inputValue: ''
                     9、添加按钮传行数据 @click="showInput(scope.row)">+ New Tag
                     10、methods showInput 中接收参数 row，显示文本框 row.inputVisible = true

                     11、methods  showInput (row) { 让文本框自动获得焦点，调用框架的方法
                      this.$nextTick(_ => {
                        this.$refs.saveTagInput.$refs.input.focus();
                      })

                      12、监听点击事件中传当行数据 @keyup.enter.native="handleInputConfirm(scope.row)"
                                           @blur="handleInputConfirm(scope.row)"
                      13、methods handleInputConfirm (row) { 接收数据，隐藏文本框
                      14、测试 点击 + New Tag 按钮，获得焦点，失去焦点，回到 + New Tag 按钮状态
                      15、methods handleInputConfirm (row) 去除空格，赋空值，隐藏文本框
                      添加操作：
                      16、上面12。监听点击事件中传当行数据
                      17、methods handleInputConfirm 显示添加的合法的标签
                         将用户输入的值保存到空数组中，紧接将文本框时的值清空，隐藏输入框
                         调用接口发起请求，保存添加的标签到数据库，成功提示，失败提示
                -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>

              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 通过作用域插槽的方式获取数据 -->
                <el-button type="primary" icon="el-icon-edit" size="mini"
                           @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                           @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <!-- 1、添加参数的对话框
         2、computed 计算属性中添加动态计算标题文本的方法 titleText
         3、title 中绑定计算文本函数 :title="'添加'+titleText"
         4、控制对话框的显示或隐藏 :visible.sync="addDialogVisible"
            @click="addDialogVisible = false"
         5、data 中定义 addDialogVisible 赋初值隐藏 addDialogVisible: false
         6、给添加属性 添加参数按钮绑定点击事件 @click="addDialogVisible = true" ； 测试效果
         7、添加 添加参数的对话框 el-form，绑定数据对象 :model="addForm"
         8、data 中定义 addForm: {} 初始值为空对象
         9、添加参数的对话框绑定校验对象和引入对象 :rules="addFormRules" ref="addFormRef"
         10、对话框 动态绑定标题文本 :label="titleText"，校验属性 prop="attr_name"，绑定数据对象属性 v-model="addForm.attr_name"
         11、data addForm 中定义对象属性 attr_name: '', 为 attr_name 定义校验规则 addFormRules attr_name
         12、监听对话框的 @close="addDialogClosed" 事件，清空再次点击对话框的残留的校验提示
         13、methods 中定义 addDialogClosed 方法，监听添加对话框的关闭事件，获取引用对象调用框架重置表单方法
    -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <!-- 完成动态参数和静态属性的添加操作
            1、给添加按钮绑定函数 @click="addParams">确 定</el-button>
            2、methods 中写 addParams 事件处理函数
            -->
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 渲染修改参数的对话框
         1、给动态参数、静态属性 编辑按钮绑定同一单击事件 @click="showEditDialog"
         2、data 中定义 showEditDialog 方法 点击按钮，展示修改的对话框
         3、复制添加对话框，修改为修改对话框,修改各项参数，装 add 改为 edit
         4、data 中定义 editDialogVisible: false ，控制对话框的显示与隐藏
         5、methods 中定义表单重置函数 editDialogClosed
         6、data 中定义修改的表单数据对象 editForm: {}
         7、data 中定义修改表单的验证对象写校验规则 editFormRules
         8、methods 中定义修改的确定按钮的点击事件函数 editParams

         完成修改参数的操作：
         1、根据 id 查询参数，给编辑按钮点击函数传当前行 id: @click="showEditDialog(scope.row.attr_id)"
         2、methods showEditDialog 中接收 attriId,请求接口，获取当前参数的信息
         3、编辑提交参数 methods editParams
         -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data () {
    return {
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id', // 指定选中的值的属性
        label: 'cat_name', // 指定看到的属性
        children: 'children' // 指定父子嵌套所用的属性
      },
      // 级联选择框双向绑定的 id 数组
      selectedCateKeys: [],
      // 被激活的页签的名称,默认是第一页
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数组
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      }
      // 控制按钮与文本框的隐藏或显示，默认隐藏
      // inputVisible: false, // 换在方法中定义
      // 文本框输入的内容
      // inputValue: '' // 换在方法中定义
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 🔘 获取所有商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      // 把请求到的数据赋值给 catelist: []
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 🔘 级联选择框选中项变化，会触发这个函数
    handleChange () {
      this.getParamsData()
    },
    // 🔘方法抽取，获取参数列表的数据
    async getParamsData () {
      // console.log(this.selectedCateKeys)
      // 如果选择的不是三级分类，数组为空
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 证明选中的是三级分类
      console.log(this.selectedCateKeys)
      // 根据所选分类的 id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      // console.log(res.data)
      // 赋值之前，循环遍历每一项（字符串），再用空格隔开，变成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      // 判断获取的是动态参数，还是静态属性，根据类型赋值，定义空数组存放数据
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 🔘 tab 页签点击事件的处理函数
    handleTabClick () {
      this.getParamsData()
      console.log(this.activeName)
    },
    // 🔘监听添加对话框的关闭事件
    addDialogClosed () {
      // 获取引用对象，调用框架 resetFields 重置表单方式
      this.$refs.addFormRef.resetFields()
    },
    // 🔘 点击按钮，添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false // 关闭对话框
        await this.getParamsData() // 刷新列表
      })
    },
    // 🔘 点击按钮，展示修改的对话框
    async showEditDialog (attrId) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 🔘重置修改的表单
    editDialogClosed () {
      // 引用对象，调用重置表单方法
      this.$refs.editFormRef.resetFields()
    },
    // 🔘 点击按钮，修改参数信息
    editParams () {
      // categories/:id/attributes/:attrId
      // - 请求方法：put
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        await this.getParamsData() // 刷新数据列表
        this.editDialogVisible = false // 关闭对话框
      })
    },
    // 🔘 根据 id 删除对应的参数项
    async removeParams (attrId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      console.log('确认了删除')
      // 删除的业务逻辑
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      await this.getParamsData()
    },
    // 🔘文本框失去焦点，或按下 Enter 键都会触发的函数
    async handleInputConfirm (row) {
      // 去除文本框输入的空值
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '' // 置空
        row.inputVisible = false // 隐藏文本框
      }
      // 如果没有 return，则证明输入的内容，需要做后续处理
      // 把输入的合法的值去除空格加入 attr_vals数组
      row.attr_vals.push(row.inputValue.trim())
      // 给输入框赋空值
      row.inputValue = ''
      row.inputVisible = false // 关闭输入框
      // 调用保存方法，提交参数
      await this.saveAttrVals(row)
    },
    // 🔘点击按钮，展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals (row) {
      // 发起请求，保存操作提交参数
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ') // 用空格拼接成字符串
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    // 🔘删除对应的参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row) // 调用保存方法
    }
  },
  computed: {
    // 🔘 如果按钮需要被禁用，则返回 true,否则返回 false
    isBtnDisabled () {
      // 如果选中不是三级分类 禁用按钮
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 🔘 当前选中的三级分类的 id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 🔘 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
//选择分类文本
.cat_opt {
  margin: 15px 0;
}

// 渲染参数下的可选项
.el-tag {
  margin: 10px;
}

// 控制按钮输入框的长度
.input-new-tag {
  width: 120px;
}
</style>
