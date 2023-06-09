<template>
    <div class="page">
        <div>
            <van-notice-bar
            left-icon="volume-o"
            color="#1989fa" 
            background="#ecf9ff"
            text="感谢大家的光临,本项目仅供参考学习,切勿在此刷屏。
为了维护和谐的网络环境，保护他人合法权益，发言时需要注意以下几点：不得发表违反国家法律法规的言论，包括但不限于煽动颠覆国家政权、宣扬恐怖主义、色情、暴力等内容。不得发布涉及他人隐私、名誉、财产等方面的信息。不得进行人身攻击、诽谤、侮辱、歧视等行为，尊重他人的权利和尊严。不得发布广告、垃圾信息等干扰他人正常使用网络的内容。不得散布虚假信息、恶意传播谣言等行为，避免误导他人。不得违反网络道德，包括但不限于恶意抄袭、剽窃、侵犯知识产权等行为。发言时需要注意措辞、语气，避免引起他人不良情绪或产生误解。"
            />
        </div>
        <div class="room-body" ref="PageChatRoom">
            <component v-for="(item,index) in info"
            :is="curUser.id === item.fromUser.id ? componentName[1] : componentName[0]" :info="item"
            :key="index">
            </component>
        </div>
        <div class="room-footer">
            <ComponentEmoji @getMsg="getMsg"></ComponentEmoji>
        </div>
    </div>
    
</template>


<script setup>
import ComponentEmoji from '../components/ComponentEmoji.vue'
import ComponentMessageMy from '../components/ComponentMessageMy.vue'
import ComponentMessageOther from '../components/ComponentMessageOther.vue'
import {getCurrentUser} from '../services/userService'
import {ref, onMounted,onUnmounted,nextTick,onUpdated,watch} from 'vue'
import {useRoute} from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import myAxios from '../plugin/myAxios'

let componentName = [ComponentMessageOther,ComponentMessageMy]
let curUser = ref({})
const route = useRoute()
const PageChatRoom = ref(null)
onMounted(async() => {
    try{
        const res = await getCurrentUser()
        if(res.code == 0){
            curUser.value = res.data
        }
        console.log(curUser.value)
    }catch{

    }
    //跳转到最下方
    // nextTick(()=>{
    //     const lastElementChild = PageChatRoom.value.lastElementChild
    //     lastElementChild.scrollIntoView()
    // })
})
let info = ref([
//     {
//     fromUser: {
//         id: 460787,
//         username: '努力的大刘',
//         userAccount: 'lzyyyy',
//         avatarUrl: 'https://i.postimg.cc/Znt1jWYF/user.jpg'
//     },
//     toUser: {
//         id: 4,
//         username: 'Aiis',
//         userAccount: 'aiis123',
//         avatarUrl: 'https://i.postimg.cc/Znt1jWYF/user.jpg'
//     },
//     teamId: 0,
//     text: "hello worldhello worldhello worldhello worldhello worldhello worldhello world",
//     chatType: 0,
//     createTime: '2023年04月30日 19:39:29'
// },
// {
//     fromUser: {
//         id: 123456,
//         username: '努力的大刘',
//         userAccount: 'lzyyyy',
//         avatarUrl: 'https://i.postimg.cc/Znt1jWYF/user.jpg'
//     },
//     toUser: {
//         id: 460787,
//         username: 'Aiis',
//         userAccount: 'aiis123',
//         avatarUrl: 'https://i.postimg.cc/Znt1jWYF/user.jpg'
//     },
//     teamId: 0,
//     text: "hello worldhello worldhello worldhello worldhello worldhello worldhello world",
//     chatType: 0,
//     createTime: '2023年04月30日 19:39:29'
// },


])
watch(
    () => route.path,
    () => {
        if(route.path == '/home/chat') {
            getData()
        }
    }
)
const getHistoryChat = async(toId, teamId) => {
    const type = route.query.type
    if(type == 1) {
        //大厅
        await getHallChat()
    }else if(type == 2) {
        //队伍
        await getTeamChat(teamId)
    }else if(type == 0) {
        //私聊
        await getPrivateChat(toId)
    }
}
const getHallChat = async() => {
    try{
        const res = await myAxios.get('/chat/getHallChat',{
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        })
        if(res.code == 0) {
            res.data.forEach(item => {
                item.text = decodeURIComponent(item.text)
            })
            info.value = res.data
        }
    }catch{

    }
}
const getPrivateChat = async(userId) => {
    try{
        const res = await myAxios.post('/chat/getPrivateChat',{
            userId
        })
        if(res.code == 0) {
            res.data.forEach(item => {
                item.text = decodeURIComponent(item.text)
            })
            info.value = res.data
        }
    }catch{

    }
}
const getTeamChat = async(teamId) => {
    try{
        const res = await myAxios.post('/chat/getTeamChat',{
            teamId
        })
        if(res.code == 0) {
            res.data.forEach(item => {
                item.text = decodeURIComponent(item.text)
            })
            info.value = res.data
        }
    }catch{

    }
}
let ws;
let scdId = 0;
onMounted(async ()=>{
    let toId = 0;
    let teamId = 0;
    if(route.query.scdId){
        toId = route.query.type == 0 ? route.query.scdId : 0;
        teamId = route.query.type == 2 ? route.query.scdId : 0;
    }
    await getHistoryChat(toId, teamId)
    const lastElementChild = PageChatRoom.value.lastElementChild
    lastElementChild.scrollIntoView()
})
const getData = async() => {
    if(ws.readyState  === WebSocket.OPEN) {
        console.log('iiclose')
        ws.close()
    }
    let toId = 0;
    let teamId = 0;
    if(route.query.scdId){
        toId = route.query.type == 0 ? route.query.scdId : 0;
        teamId = route.query.type == 2 ? route.query.scdId : 0;
    }
    await getHistoryChat(toId, teamId)
    const lastElementChild = PageChatRoom.value.lastElementChild
    lastElementChild.scrollIntoView()

    const res = await getCurrentUser()
    const curUser = res.data
    //当前用户id，作为第一个参数
    const userId = curUser.id
    if(route.query.scdId && route.query.type == 2){
        scdId = route.query.scdId
    }
    // console.log(curUser.id)
    //创建对象
    ws = new WebSocket(`wss://lzy.lzyzxq.cn:8088/api/webSocket/${userId}/${scdId}/${route.query.type}`)
    //启动socket服务
    ws.addEventListener('open',()=>{
        showSuccessToast("连接服务已启动")
    })
    //接受数据
    ws.addEventListener('message',(e)=>{
        // const data = JSON.parse(e.data)
        // if(data.chatType == route.query.type){
        //     info.value.push(data)
        // }
        // info.value.push(JSON.parse(e.data))
        const data = JSON.parse(e.data)
        data.text  = decodeURIComponent(data.text)
        info.value.push(data)
      // console.log(info.value)
      nextTick(()=>{
        const lastElementChild = PageChatRoom.value.lastElementChild
        lastElementChild.scrollIntoView()
    })
    })
}
onMounted(async()=>{
    const res = await getCurrentUser()
    const curUser = res.data
    //当前用户id，作为第一个参数
    const userId = curUser.id
    if(route.query.scdId && route.query.type == 2){
        scdId = route.query.scdId
    }
    // console.log(curUser.id)
    //创建对象
    ws = new WebSocket(`wss://lzy.lzyzxq.cn:8088/api/webSocket/${userId}/${scdId}/${route.query.type}`)
    //启动socket服务
    ws.addEventListener('open',()=>{
        showSuccessToast("连接服务已启动")
    })
    //接受数据
    ws.addEventListener('message',(e)=>{
        // const data = JSON.parse(e.data)
        // if(data.chatType == route.query.type){
        //     info.value.push(data)
        // }
        const data = JSON.parse(e.data)
        data.text  = decodeURIComponent(data.text)
        info.value.push(data)
      // console.log(info.value)
      nextTick(()=>{
        const lastElementChild = PageChatRoom.value.lastElementChild
        lastElementChild.scrollIntoView()
    })
    })
    
})
onUnmounted(()=>{
   ws.close()
})
const getMsg = (msg) => {
    // console.log(msg)
    let toId = 0;
    let teamId = 0;
    if(route.query.scdId){
        toId = route.query.type == 0 ? route.query.scdId : 0;
        teamId = route.query.type == 2 ? route.query.scdId : 0;
    }
    ws.send(JSON.stringify({
        toId,
        teamId,
        text: encodeURIComponent(msg),
        chatType: route.query.type
    }))
}
</script>


<style scoped>
    .page{
        min-height: 100%;
        width: 100%;
        position: relative;
    }
    
    .room-footer{
        border-top: 1px solid black;
        position: fixed;
        bottom: 50px;
        z-index: 100;
        width: 100%;
    }
    .room-body{
        width: 100%;
        padding-top: 40px;
        padding-bottom: 60px;
        overflow: hidden;
    }
    .van-notice-bar{
        position: fixed;
        width: 100%;
    }
</style>