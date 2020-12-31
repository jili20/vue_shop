<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <!-- 1、添加角色按钮区域
         2、data 中定义 初始化角色列表数据数组
         3、created 中调用 获取所有角色数据 函数 this.getRolesList()
         4、methods 写 获取所有角色数据方法 getRolesList()
    -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <!-- 1、绑定数据源 :data="roleList" ，data 中定义的空数组
           2、给表格添加边框线 border、隔行变色 stripe
           3、添加表格索引列 el-table-column type="index"
           4、表格列标题 label="" ，绑定校对属性 prop=""
           5、操作块内容 label="操作"
           6、添加展开列 type="expand"
           7、样式切换 :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']"
           8、遍历一级权限 v-for="(item1,i1) in scope.row.children" :key="item1.id"
           9、遍历二级权限 v-for="(item2,i2) in item1.children" :key="item2.id"
          10、遍历三级权限 v-for="(item3) in item2.children" :key="item3.id"
          11、删除三级权限 closable @close="removeRightById(scope.row,item3.id)"
          12、删除二级权限 closable @close="removeRightById(scope.row,item2.id)"
          13、删除一级权限 closable @close="removeRightById(scope.row,item1.id)"
          14、调用接口删除权限 async removeRightById (role, rightId) {} ； 删除前确认弹框
          15、删除后 给角色重新赋值 解决关闭当前页面状态问题  role.children = res.data
      -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 i1 -->
        <!-- 通过 scope.row 拿到这一行对应的数据信息；再以三层 for 循环，把数据渲染成三级分类 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 渲染一级权限 -->
            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children"
                    :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children"
                            :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--            <pre>-->
            <!--              {{ scope.row }}-->
            <!--            </pre>-->
          </template>
        </el-table-column>
        <!-- 表格列项 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <!-- 分配权限 -->
            <!-- 1、给分配权限按钮绑定单击事件函数：@click="showSetRightDialog()"
                 2、methods 中写单击函数 showSetRightDialog
                 3、新建分配权限对话框
                 4、return 中定义 分配权限对话框的初始值为 隐藏
                 5、methods 中 showSetRightDialog 设置对话框的值为 this.setRightDialogVisible = true
                 6、methods 中 调用接口 获取所有权限数据
                 7、return 中定义所有权限数据的数组 rightsList: [] 默认值为空
                 8、把获取到的权限数据保存到 data 中
            -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <!-- 1、数据源 :data="rightsList"
           2、树形控件的属性绑定对象 :props="treeProps"
           3、在 data 中定义树形控件的属性绑定对象 及属性 treeProps
           4、添加复选框 show-checkbox
           5、绑定选中项项的 id 值： node-key="id"
           6、展开所有节点 default-expand-all
           7、选中默认勾选的节点的 key 的数组 :default-checked-keys="defKeys"
           8、data 中定义 默认选中的节点的 id 值数组: defKeys: []
           9、思路：点击 分配权限按钮 获取所有三级权限 id 赋值给 defKeys
           10、methods 中 使用递归函数 getLeafKeys 获取所有三级节点的 id
           11、给上面 分配权限按钮 点击事件传角色 @click="showSetRightDialog(scope.row)"  template slot-scope="scope"
           12、选中默认勾选的三级权限节点 showSetRightDialog() -> this.getLeafKeys(role, this.defKeys)
           13、修改 bug：权限对话框 methods 中绑定单击函数 每次关闭 给数组重新赋空值 @close="setRightDialogClosed"
           14、给确定按钮绑定单击函数 @click="allotRights" 点击为角色分配权限
           15、给 el-tree 添加引用对象 ref="treeRef"
           16、methods 中实现 allotRights 函数为角色分配权限
           17、methods showSetRightDialog 中拿角色 id: this.roleId = role.id
           18、data 中定义 roleId 当前即将分配权限的角色 id
           19、总结：
               1）点击 分配权限 按钮时，立即保存当前角色 id 在 data 中，供分配角色后续使用
               2）点击 确定 按钮前，先获取整个树形结构中，那些选中和半选中的 id值，
                  把它们合并为一个完整的数组，拼接成以逗号隔开的字符串，调用接口发起请求，把刚才保存的角色Id
                  和新拼接成的字符串，发送到了服务器端，请求失败提示信息，请求成功提示信息，刷新角色列表，
                  关闭分配权限对话框。
      -->
      <el-tree ref="treeRef" :data="rightsList" :props="treeProps"
               show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 所有角色列表
      roleList: [],
      // 控制分配权限对话框的显示与隐藏 默认隐藏
      setRightDialogVisible: false,
      // 所有权限的数据数组 默认为空
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点的 id 值数组
      defKeys: [],
      // 当前即将分配权限的角色 id
      roleId: ''
    }
  },
  created () {
    // 获取所有角色数据
    this.getRolesList()
  },
  methods: {
    // 🔘获取所有角色数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // 如果获取失败，返回提示信息
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败！')
      }
      // 获取数据成功，赋值给 roleList
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 🔘根据 id 删除对应的权限
    async removeRightById (role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      // console.log('确认了删除')
      // 调用接口删除 删除权限
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      // 重新获取权限列表数据 会造成刷新页面 关闭权限分类页面
      // await this.getRolesList()
      // 给权限赋值 解决上面的问题
      role.children = res.data
    },
    // 🔘展示分配权限的对话框
    async showSetRightDialog (role) {
      // 拿到 roleId
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      // 把获取到的权限数据保存到 data 中
      this.rightsList = res.data
      // console.log(this.rightsList)
      // 调用递归获取三级权限节点 id 的方法
      this.getLeafKeys(role, this.defKeys)

      // 打开对话框
      this.setRightDialogVisible = true
    },
    // 🔘通过递归的形式，获取角色下所有三级权限 id，并保存到 defKeys 数组中
    getLeafKeys (node, arr) {
      // 节点，数组
      // 如果当前 node 节点不包含 children 属性，则是三级节点,将其 id 加入到数组
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归（循环调用该方法）获取所有三级节点，保存到数组中
      node.children.forEach(item =>
        this.getLeafKeys(item, arr))
    },
    // 🔘监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 🔘点击为角色分配权限
    async allotRights () {
      // 把两个数组合并成一个数组
      const keys = [
        // 框架 getCheckedKeys 方法，返回目前被选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        // 框架 getHalfCheckedKeys 方法，返回目前半选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      // 把获取到的所有 id 拼成以逗号，分隔的字符串
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      // 刷新数据列表
      await this.getRolesList()
      // 隐藏对话框
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
