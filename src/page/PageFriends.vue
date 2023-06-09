<template>
    <div class="page-friend">
        <div class="input-box">
            <input type="text" placeholder="搜索" v-model="searchText" @keydown.enter="searchFriends()">
            <van-button plain type="primary" @click="searchFriends">搜索</van-button>
        </div>
        <div>
            <van-cell-group>
                <van-cell title="新朋友" is-link to="/home/friends/apply"></van-cell>
            </van-cell-group>
        </div>
        <div class="friends-box">
            <h3 class="title">我的好友</h3>
            <div>
                <van-empty description="暂无好友" v-if="friendsList.length == 0" />
            </div>
            <div class="list" v-if="friendsList.value">
                <ComponentFriendList v-for="(item,index) in friendsList.value" :key="item.id" :friendInfo="item"></ComponentFriendList>
            </div>
        </div>
    </div>
</template>


<script setup>
import {Empty, showFailToast, showSuccessToast} from 'vant';
import {ref, onMounted, reactive} from 'vue'
import ComponentFriendList from '../components/CompomentFriendList.vue'
import myAxios from '../plugin/myAxios'
let friendsList = reactive({
    value: []
})
let searchText  =ref('')
onMounted(async() => {
    try{
        const res = await myAxios.post('/friends/getFriends')
        
        if(res.code == 0){
            friendsList.value = res.data
            // friendsList.value.isFriend = true
            showSuccessToast("好友加载成功")
        }else{
            showFailToast("好友加载失败")
        }
    }catch{
        showFailToast("好友加载失败")
    }
    
})
const searchFriends = async() => {
    try{
        const res = await myAxios.get('/friends/searchMyFriends',{
            params: {
                searchText: searchText.value
            },
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        })
        if(res.code == 0){
            friendsList.value = res.data
            console.log(friendsList.value)
            searchText.value = ''
        }else{
            showFailToast("搜索失败!")
        }
    }catch{
        showFailToast("搜索失败")
    }
}
</script>

<style scoped>
.input-box{
    /* margin-top: 20px; */
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    width: 90%;
    margin: 10px auto;
    /* justify-content: space-between; */
}
.input-box input{
    padding:12px 10px;
    width: 75%;
    border: 1px solid rgb(194, 194, 194);
    border-radius: 5px;
}
.friends-box{
    width: 100%;
}
.title{
    margin-left: 20px;
}
.van-cell :deep(.van-cell__title){
    font-weight: bold;
    font-size: 1.2em;
    margin-left: 5px;
}
.van-button :deep(.van-button__text){
    white-space: nowrap;
}
</style>