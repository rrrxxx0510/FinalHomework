<template>
    <div>
        <van-tabs v-model:active="active">
            <van-tab >
                <template #title>
                    <van-icon name="bullhorn-o"></van-icon>
                    我收到的
                </template>
                <van-empty description="暂无新的好友申请" v-if="applyList.length === 0"></van-empty>
                <ComponentApplyCard v-for="(item) in applyList" 
                :key="item.userId" 
                :cardInfo="item"
                @handleAcceput="onAccept()"
                @handleReject="onReject()"></ComponentApplyCard>
            </van-tab>
            <van-tab >
                <template #title>
                    <van-icon name="user-o"></van-icon>
                    我的申请
                </template>
                <van-empty description="暂无新的好友申请" v-if="applyList.length === 0"></van-empty>
                <ComponentApplyCard v-for="(item) in applyList" 
                :key="item.userId" 
                :cardInfo="item"></ComponentApplyCard>
            </van-tab>
        </van-tabs>
    </div>
</template>



<script setup>
import {ref, reactive, onMounted, watch} from 'vue'
import myAxios from '../plugin/myAxios.ts'
import { showFailToast } from 'vant'
import ComponentApplyCard from './ComponentApplyCard.vue'
let active = ref(0)
let applyList = ref([])
const onAccept = () => {
    // console.log(123)
    getMyGet()
}
const onReject = () => {
    // console.log(321)
    getMyGet()
}
onMounted(() => {
    getMyGet()
})
const getMyGet = async () => {
    try{
        const res = await myAxios.get('/friends/getFromUserApplyList',{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if(res.code == 0){
            applyList.value = res.data
            applyList.value.forEach(item => {
                item.isMyGet = true
            })
        }else{
            showFailToast("获取申请失败")
        }
    }catch{
        showFailToast("获取申请失败")
    }
} 
watch(
    () => active.value,
    async() => {
        if(active.value == 0){
            getMyGet()
        }else{
            try{
                const res = await myAxios.get('/friends/getToUserApplyList',{
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                if(res.code == 0){
                    applyList.value = res.data
                    applyList.value.forEach(item => {
                        item.isMyApply = true
                    })
                }else{
                    showFailToast("获取申请失败")
                }
            }catch{
                showFailToast("获取申请失败")
            }
        }
    }
)
</script>

<style scoped>

</style>