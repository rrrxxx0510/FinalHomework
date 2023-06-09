<template>
    <div class="register-box">
        <div class="input-box">
            <input type="text" placeholder="Account" v-model="userAccount">
            <input type="password" placeholder="Password" v-model="userPassword">
            <input type="password" placeholder="Repeate Password" v-model="checkPassword">
        </div>
        <div class="btn-item">
            <button class="btn-account">Have Account?</button>
        </div>
        <div class="register">
            <button class="btn-rg" @click="onRegister()">注册</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue'
import {useRouter} from 'vue-router'
import myAxios from '../plugin/myAxios.ts'
import {showFailToast, showSuccessToast} from 'vant'
let userAccount = ref('')
let userPassword = ref('')
let checkPassword = ref('')
const emit = defineEmits(['goLogin']);
const router = useRouter()
const checkAccount = (userAccount, userPassword, checkPassword) => {
  const userAccountPattern = /^.{5,}$/;
  const pattern = /^[^\s\W]{5,}$/;
    // 校验密码是否符合要求，包含至少一个数字、至少一个字母，且长度不小于 8
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}$/;
    if(!userAccountPattern.test(userAccount)){
      showFailToast("账户长度不得小于4位");
      return false;
    }
    if (!passwordPattern.test(userPassword)) {
      showFailToast("密码至少包含一位数字或字符，且长度不可小于8")
      return false;
    }
    if (userPassword !== checkPassword){
        showFailToast("密码不一致");
        return false;
    }
    if(userAccount.length==0||userPassword.length==0||checkPassword==0){
      showFailToast("信息输入不完整");
      return false;
    }
    if(userAccount.trim().length==0||userPassword.trim().length==0||checkPassword.trim().length==0){
      showFailToast("输入内容不可为空");
      return false;
    }
    if((!pattern.test(userAccount))||(!pattern.test(userPassword))||(!pattern.test(checkPassword))){
      showFailToast("输入内容不可包括特殊字符");
      return false;
    }
    return true;
}
const onRegister =  async() => {
    try{
        if (!checkAccount(userAccount.value , userPassword.value, checkPassword.value)) {
            return false;
        }
        let res = await myAxios.post("/user/register", {
            userAccount: userAccount.value,
            userPassword: userPassword.value,
            checkPassword: checkPassword.value
        })
        console.log(res.code)
        if(res.code == 0){
            showSuccessToast("注册成功")
            // router.go(0)
            emit('goLogin', true);
        }

    }catch{
        showFailToast("注册失败")
    }
}


</script>


<style scoped>
    .register-box{
        width: 100%;
    }
    .input-box{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
    }
    .input-box input{
        width: 70%;
        margin: 0 auto;
        margin-top: 20px;
        padding: 5px 10px;
        /* font-size: 20px; */
        
        border: none;
        outline: none;
        border-bottom: 2px solid rgb(170, 217, 255);
        /* border-radius: 13px; */
    }
    .input-box input::placeholder{
        color: rgb(148, 148, 148);
    }
    .btn-item{
        width: 100%;
        overflow: hidden;
        margin-top: 10px;
    }
    .btn-account{
        background-color: transparent;
        border: none;
        outline: none;
        float: right;
        margin-right: 12px;
        color: rgb(91, 146, 255);
    }
    .register{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .register .btn-rg{
        /* margin: 0 auto; */
        background-color: transparent;
        border: 0;
        background-image: linear-gradient(to right, #4c9fff, #4866ff);
        color: white;
        padding: 10px 20px;
        border-radius: 15px;
    }
</style>