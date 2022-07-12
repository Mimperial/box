<template>
  <div>
    <el-dialog
      title="导入"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="form" inline>
          <el-form-item label="导入图片">
            <el-input v-model="form.model"></el-input>
          </el-form-item>
        </el-form>
        <el-upload
          class="upload-demo"
          action=""
          accept=".rar,.zip"
          :on-change="changeFile"
        >
          <el-button type="">选择</el-button>
        </el-upload>
        <div class="hint-message">
          文件格式为rar压缩包，单张最大175px,最小80px的正方形图片，每张大小2M以内
        </div>
      </div>
      <div style="height: 67px"></div>
      <div style="text-align: center" slot="footer" class="dialog-footer">
        <el-button
          style="border: 1px solid #010b56"
          @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button
          style="background-color: #010b56"
          type="primary"
          @click="upload"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/token.js'
import { faceFileupload } from '@/api/article.js'
import axios from '@/utils/request'

export default {
  props: {
    GroupId: {
      type: String,
    },
  },
  data() {
    return {
      dialogVisible: false,
      form: { model: '' },
      httpUrl:
        process.env.NODE_ENV == 'dev'
          ? process.env.VUE_APP_URL + ':8183'
          : window.location.origin,
      header: {
        Token: getToken(),
      },
      file: '',
    }
  },
  methods: {
    upload() {
      if (!this.file) {
        this.$message({
          message: '请上传文件',
          type: 'warning',
        })
        return
      }
      axios
        .file('/api/web/file_upload', { file: this.file }, this.httpUrl)
        .then(async (res) => {
          await this.addImage(res.data)
          this.handleClose()
          this.$message({
            message: '上传成功',
            type: 'success',
          })
          // 导入图片添加进去
        })
        .catch((e) => {
          this.handleClose()
        })
    },
    changeFile(file) {
      this.file = file.raw
      this.form.model = file.name
    },
    addImage(data) {
      return new Promise((resolve, rej) => {
        axios({
          method: 'post',
          url: '/api/web/batchAddFacePerson',
          data: {
            BatchFile: data,
            GroupId: this.GroupId,
          },
        }).then((res) => {
          resolve(res)
        })
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.form.model = ''
      this.file = ''
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.hint-message {
  margin: 20px 0;
}
.dialog-footer {
  text-align: center;
}
/deep/.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.upload-demo {
  position: absolute;
  left: 52%;
  top: 27%;
}
.hint-message {
  position: absolute;
  left: 15%;
  top: 38%;
  width: 36%;
}
</style>
