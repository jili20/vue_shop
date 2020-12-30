<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
                    clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <!-- 为表格指定数据源 :data="userList" -->
      <!-- 表格加边框 border ；隔行变色 stripe     -->
      <el-table :data="userList" border stripe>
        <!-- 指定列表 label="姓名" ； 姓名对应的值 prop="username" -->
        <!-- 指定 type="index" 变成索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <!-- {{ scope.row.mg_state }}-->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <!-- 通过 slot-scope="scope" 的 scope 拿到这一行的用户 id {{ scope.row.id }} -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <!-- :enterable="false" 鼠标进入到 tooltip 中自动隐藏 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <!-- 切换下拉框页码触发： @size-change="handleSizeChange" ；
           监听分页 页码值 改变事件： @current-change="handleCurrentChange"
           当前页数 :current-page="currentPage4"
           每页显示几条 :page-sizes="[1, 2, 5, 10]"
           当前每页显示多少条数据 :page-size="100"
           显示数据总数 total ；sizes 下拉框显示页数数量切换；
           共有多少条数据 :total="total" -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <!-- 1、设置对话框的宽度 占屏幕的一半：width="50%"
         2、控制对话框的显示或隐藏(绑定布尔值） :visible.sync="addDialogVisible"
         3、表单数据对象 :model="addForm"
         4、表单验证规则对象 :rules="addFormRules"
         5、表单引对象名 ref="addFormRef"
         6、验证规则属性 prop="username" data中写验证规则
         7、表单数据项 v-model="addForm.username"
         8、输入框中显示校验结果反馈图标 status-icon 打对勾
         9、重置表单 绑定单击事件 @close="addDialogClosed" -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
               label-width="70px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <!-- 只要点击了取消或确定都会隐藏对话框 addDialogVisible -->
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <!-- 1、设置对话框的宽度 占屏幕的一半：width="50%"
         2、控制对话框的显示或隐藏(绑定布尔值） :visible.sync="editDialogVisible"
         3、绑定表单数据对象 :model="editForm" ，data 中定义数据对象 editForm
         4、定义校验规则对象 :rules="editFormRules"，data 中定义修改表单验证规则对象 editFormRules
         5、定义表单引用对象 ref="editFormRef"
         6、用户名 禁用 disabled
         7、指定校验规则 prop="email"
         8、输入框中显示校验结果反馈图标 status-icon 打对勾
         9、重置表单 绑定单击事件 @close="editDialogClosed" -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" status-icon>
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    // 自定义验证邮箱的校验规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义验证手机号的校验规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 初始化列表数据库源
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据，一个对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 15,
            message: '用户名长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }, {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 控制修改用户对话框的显示与隐藏,默认为隐藏
      editDialogVisible: false,
      // 点击编辑按钮 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入用户邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入用户手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      this.total = res.data.total
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
    },
    // 监听分页下拉框切换分页事件
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList() // 改变分页数量之后重新渲染分页
    },
    // 监听分页 页码值 改变事件
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList() // 改变分页数量之后重新渲染分页
    },
    // 监听 switch 开关状态的改变，修改用户状态
    async userStateChanged (userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户成功！')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      // 获取表单引用对象，调用框架清空表单方法 resetFields
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮 添加新用户
    addUser () {
      // 拿到表单的引用对象，检查页面校验是否通过，通过调用接口方法添加用户
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 通过页面预校验，调用接口方法添加用户
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        await this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      // console.log(id)
      // 调用接口 根据用户 id 查询用户信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      // 调用接口方法 把查询到的数据保存到 editForm 对象身上
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      // 拿到表单引用对象，调用框架的
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      // 拿到表单引用对象，调用
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        // 没有通过校验 直接返回
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        // 通过校验 调用接口方法 修改用户信息
        const { data: res } = await this.$http.put('users/' +
          this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        await this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 根据 id 删除用户
    async removeUserById (id) {
      // console.log(id)
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '删除用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认了删除')
      // 调用后端接口 删除用户
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      // 重新获取用户列表
      await this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
