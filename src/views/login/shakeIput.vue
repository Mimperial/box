<template>
    <div>
        <el-form-item :class="isAccount?'red':''" ref="account" >
            <span class="svg-container">
                <i class="el-icon-user-solid"></i>
            </span>
            <el-input v-model="accountChild" name="account" autocomplete="on" :placeholder="$t('html.account')" />
        </el-form-item>
        <el-form-item :class="isPassword?'red':''" ref="password">
            <span class="svg-container">
            <i class="el-icon-lock"></i>
            </span>
            <el-input v-model="passwordChild" name="password" autocomplete="on" :placeholder="$t('html.password')"
            :type="showpassword?'password':''"
            @keyup.enter.native="onSubmit" />
            <span class="show-pwd" @click="showpassword = !showpassword">
            <i class="el-icon-view"></i>
            </span>
        </el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click="onSubmit">{{$t('html.btn')}}</el-button>
    </div>
</template>

<script>
export default {
    props:['account','password'],
    data(){
        return{
            isAccount:false,//判断是否有用户名，用户名格式是否正确
            isPassword:false,//判断是否有密码，密码格式是否正确
            showpassword:true,//是否显示密码
            loading: false,//加载动画
            accountChild:this.account,
            passwordChild:this.password,
            timeFlage:false,//设置输入框是否抖动，防止重复点击
        }    
    },
    methods:{
        onSubmit(){
            let account = this.accountChild;//取出用户名
            let password = this.passwordChild;//取出密码
            let accountEvent = this.$refs.account.$el;//用户名div框的元素
            let passwordEvent = this.$refs.password.$el;//密码div框的元素
            if(!account){
                // 用户名为空
                this.isAccount = true;
                this.shake(accountEvent);
            }
            else{
                let rega=/[\u4e00-\u9fa5]+/.test(account)
                let regp=/[\u4e00-\u9fa5]+/.test(password)
                if(rega){
                    this.isAccount = true;
                    this.shake(accountEvent);
                    this.$message({
                        message: this.$t('js.msgonea'),
                        type: "warning",
                    });
                }else{
                    this.isAccount = false;
                    if(!password){
                        //没有密码
                        this.shake(passwordEvent);
                        this.isPassword = true;
                    }else{
                        if(regp){
                            this.shake(passwordEvent);
                            this.isPassword = true;
                            this.$message({
                                message:this.$t('js.msgones'),
                                type: "warning",
                            });
                        }else{
                            this.isPassword = false;
                            this.$emit('login',account,password)//将用户名和密码传给父组件
                        }
                    }
                }
                
                // if(account.length==0){
                // //非法用户名
                //     this.isAccount = true;
                //     this.shake(accountEvent);
                // }else{
                //     this.isAccount = false;
                // if(!password){
                //     //没有密码
                //     this.shake(passwordEvent);
                //     this.isPassword = true;
                // }else{
                //     if(password.length==0){
                //         this.shake(passwordEvent);
                //         this.isPassword = true;
                //     }else{
                //         this.isPassword = false;
                //         this.$emit('login',account,password)//将用户名和密码传给父组件
                //     }
                // }
                // }
            }
        },
        shake(elem){//抖动  当用户名或者密码不正确的时候会发生抖动的动画函数
            if(!this.timeFlage){
                this.timeFlage = true;
                var time1 = 0;
                var shakeIput1 = setInterval(()=>{
                    if(elem.style.left == 3+'px'){
                        elem.style.left = -3 +'px'
                    }else{
                        elem.style.left = 3 + 'px'
                    }
                        time1++;
                    if(time1 == 5){
                        this.timeFlage = false;
                        clearInterval(shakeIput1);
                    }
                },100)
            }
        },
    }
}
</script>
