<template>
    <div class="box">
        <div class="user-box">
            <div class="ava-box">
                <img :src="avaUrl" alt="">
            </div>
            <div class="info-box">
                <p>{{ props.cardInfo.userName }}</p>
                <p>{{ props.cardInfo.comment }}</p>
            </div>
        </div>
        <div class="status-box">
            <p v-if="props.cardInfo.isMyApply || props.cardInfo.status !== 0">
                <van-icon :name="iconName"></van-icon>
                {{ statusName }}
            </p>
            <div v-if="props.cardInfo.isMyGet && props.cardInfo.status === 0" class="btn-box">
                <van-button @click="handleAcceput()" plain hairline type="primary" size="small" style="margin-right:5px;">接受</van-button>
                <van-button @click="handleReject()" plain hairline type="danger" size="small">拒绝</van-button>
            </div>
        </div>
    </div>
</template>


<script setup>
import {ref, defineProps, computed, defineEmits} from 'vue'
import {APPLY_SETTING} from '../settings/index.ts'
import myAxios from '../plugin/myAxios.ts'
import { showSuccessToast, showFailToast } from 'vant'

const props = defineProps(["cardInfo"])
const emit = defineEmits(['handleReject','handleAcceput'])
const avaUrl = computed(()=>{
    // console.log( props.cardInfo.userAvatar)
    return props.cardInfo.userAvatar=='' ? './src/assets/images.jpg' : props.cardInfo.userAvatar
})
const iconName = computed(() => {
    return props.cardInfo.status ==  APPLY_SETTING.STATUS_REJECT ? 'close'
    : props.cardInfo.status == APPLY_SETTING.STATUS_ACCEPUT ? 'passed'
    : ''
})
const handleAcceput = async() => {
    try{
        const res = await myAxios.post('/friends/passOrReject',{
            fromUserId: props.cardInfo.userId,
            pass: true
        })
        if(res.code == 0 && res.data){
            showSuccessToast("添加成功")
            emit('handleAcceput')
        }else{
            showFailToast("添加失败")
        }
    }catch{
        showFailToast("添加失败")
    }
}
const handleReject = async() => {
    try{
        const res = await myAxios.post('/friends/passOrReject',{
            fromUserId: props.cardInfo.userId,
            reject: true
        })
        if(res.code == 0 && res.data){
            showSuccessToast("拒绝成功")
            emit('handleReject')
        }else{
            showFailToast("拒绝失败")
        }
    }catch{
        showFailToast("拒绝失败")
    }
}
const statusName = computed(() => {
    return props.cardInfo.status == APPLY_SETTING.STATUS_REJECT ? '已拒绝'
    : props.cardInfo.status == APPLY_SETTING.STATUS_ACCEPUT ? '已接受'
    : props.cardInfo.status == APPLY_SETTING.STATUS_PADDING ? '待处理'
    : ''
})
</script>



<style scoped>
.box{
    display: flex;
    /* justify-content: center; */
    align-items: center;
    justify-content: space-between;
    padding: 3px 20px;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    border-bottom: 1px solid rgb(221, 221, 221);
}
p{
    line-height: 7px;
}
.box .user-box{
    display: flex;
    justify-content: center;
    align-items: center;
}
.info-box{
    margin-left: 10px;
    max-width: 200px;
}
.btn-box{
    /* display: flex; */
    /* flex-wrap: nowrap; */
    min-width: 100px;
    /* margin-left: 10px; */
}
.info-box p:last-child{
    color: rgb(163, 163, 163);
    font-size: small;
    line-height: 100%;
}
.ava-box img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.status-box p{
    color: rgb(156, 156, 156);
}
.status-box{
    min-width: 30%;
    text-align: center;
}
.user-box{
    margin-right: 0px;
}
</style>