<template>
  <div class="search-box">
    <van-search v-model="searchText" placeholder="请输入搜索关键词" class="search-input" @keydown.enter="handleSearch()"/>
    <button class="btn" @click="handleSearch">搜索</button>
  </div>
  <user-card-list  :user-list="userList"/>
  <div style="display:flex;flex-direction:column;justify-content:center;align-items:center; position:fixed;bottom:50px; width:100%;background-color:white;">
    <div>
      <a href="https://beian.miit.gov.cn/" target="_blank" style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">晋ICP备2023015028号</a>
    </div>
    <div>
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011002017122" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="../assets/beian.jpg" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">浙公网安备 33011002017122号</p></a>
    </div>
  </div>
</template>

<script setup>
import UserCardList from "../components/userCardList.vue";
import myAxios from "../plugin/myAxios.ts";
import {onMounted, ref} from "vue";
import { showFailToast } from "vant";

let searchText = ref('')
const userList = ref('');
onMounted(async ()=>{
  const res = await myAxios.get("/user/match",{
    params:{
      num: 15
    }
  });

  if(res.code===0&&res.data.length>0){
    res.data.forEach(user=>{
      if(user.tags){
        user.tags=JSON.parse(user.tags.replace(/'/g, "\""))
      }
      user.avatarUrl = user.avatarUrl == '' ? 'src/assets/images.jpg' : user.avatarUrl
      user.profile = user.profile == '' ? '这个用户很懒，还没有简介哦' : user.profile
      user.tags = user.tags == '' ? '该用户暂未设置标签' : user.tags
    })
    userList.value=res.data;
    // userList.value.forEach(item => {
    //   item.isOtherWatching = true
    // })
    // console.log(userList.value)
  }
});
const handleSearch = async() => {
  try{
    let res = await myAxios.get('/user/search',{
      params:{
        username:searchText.value
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if(res.code == 0){
      res.data.forEach(user => {
        console.log(user.tags)
       if(user.tags){
         user.tags=JSON.parse(user.tags.replace(/'/g, "\""))
       }
      user.avatarUrl = user.avatarUrl == '' ? 'src/assets/images.jpg' : user.avatarUrl
      user.profile = user.profile == '' ? '这个用户很懒，还没有简介哦' : user.profile
      user.tags = user.tags == '' ? '该用户暂未设置标签' : user.tags
      })
      userList.value=res.data;
    }else{
      showFailToast("搜索失败!")
    }
  }catch(e){
    console.error(e)
    showFailToast("搜索失败!!")
  }
  searchText.value = ''
}
</script>

<style scoped>
.search-box{
  display: flex;
  flex-wrap: nowrap;
}
.search-box .search-input{
  width: 85%;
}
.search-box .btn{
  background-color: #fff;
  outline: none;
  border: none;
  color: rgb(83, 172, 255);
  min-width: 44px;
}
</style>