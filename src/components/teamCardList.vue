<template>
  <div id="teamCardList">
  <van-card
      v-for="team in teamList"
      :desc="team.description"
      :title="team.name"
      :thumb="team.teamAvatarUrl == '' || team.teamAvatarUrl == null ? image : team.teamAvatarUrl"
  >
    <template #tags>
      <van-tag plain type="danger" style="margin-right: 8px;margin-top: 5px">
        {{teamStatusEnum[team.status]}}
      </van-tag>
    </template>
    <template #bottom>
      <div>
        {{`最大人数`+team.maxNum}}
      </div>
      <div v-if="team.expireTime">
        {{`过期时间`+team.expireTime}}
      </div>
      <div>
        {{`创建时间`+team.createTime}}
      </div>
    </template>
    <template #footer>
      <van-button v-if="!team.isInTeam" size="small" type="primary" @click="doJoinTeam(team)">加入队伍</van-button>
      <van-button  v-if="team.userId===currentUser?.data.id" size="small"  @click="doUpdateTeam(team)">更新队伍</van-button>
      <van-button  v-if="team.isInTeam && !team.isOtherWatching" size="small" @click="watchDetails(team)">查看队伍</van-button>
      <van-button  v-if="team.isInTeam && team.userId!==currentUser?.data.id && !team.isOtherWatching" size="small"  @click="doQuitTeam(team.id)">退出队伍</van-button>
      <van-button  v-if="team.userId===currentUser?.data.id" size="small"  @click="doDeleteTeam(team.id)">解散队伍</van-button>
    </template>
  </van-card>
  <van-dialog v-model:show="isShow" title="请输入口令" show-cancel-button @confirm="onConfirm" @cancel="onCancel()">
      <van-cell-group>
          <van-field v-model="password" placeholder="口令" id="input"></van-field>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">

import {teamStatusEnum} from "../constants/team";
import {teamType} from "../model/team";
import image from "../assets/images.jpg"
import myAxios from "../plugin/myAxios";
import 'vant/es/toast/style';
import {showFailToast, showSuccessToast} from "vant";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/userService";
import {useRouter} from "vue-router";

let isShow = ref(false)
let password = ref('')
const currentUser = ref();
onMounted(async ()=>{

  currentUser.value=await getCurrentUser();
})

interface teamCardListProps{
  teamList:teamType[];
}
const curTeam = ref()
const onConfirm = async () => {
  const res = await myAxios.post("/team/join",{
    teamId:curTeam.value.id,
    password:password.value
  })
  if(res.code==0){
    showSuccessToast('加入成功');
    router.go(0)
  }else{
    showFailToast("加入失败"+(res.description ? `. ${res.description}`: ''))
  }
  password.value = ''
  isShow.value = false
}
const onCancel = () => {
  password.value = ''
  isShow.value = false
}
const router = useRouter();
const props = defineProps<teamCardListProps>()

const doJoinTeam = async (team)=>{
  console.log(team.status)
  if(team.status == 2){
    curTeam.value = team
    isShow.value = true
    return;
  }

  const res = await myAxios.post("/team/join",{
    teamId:team.id
  })
  if(res.code==0){
    showSuccessToast('加入成功');
    router.go(0)
  }else{
    showFailToast("加入失败"+(res.description ? `. ${res.description}`: ''))
  }
}
const doUpdateTeam=(team)=>{
  console.log(team.id,'123')
  router.push({
    path:"/home/team/update",
    query:{
      team:JSON.stringify(team)
    }
  })
}
const watchDetails = (teamInfo) => {
  console.log('123',teamInfo)
  router.push({
    path: '/home/team/details',
    // query: teamInfo
    query: {
      teamInfo: JSON.stringify(teamInfo)
    }
  })
}
const doQuitTeam=async (id:number)=>{
  const res = await myAxios.post("/team/quit",{
    id
  })
  if(res?.code==0){
    showSuccessToast('退出成功');
    router.go(0)
  }else{
    showFailToast("退出失败"+(res.description ? `. ${res.description}`: ''))
  }
}

const doDeleteTeam=async (id:number)=>{
  const res = await myAxios.post("/team/delete",{
    id
  })
  if(res?.code==0){
    showSuccessToast('解散成功');
    router.go(0)
  }else{
    showFailToast("解散失败"+(res.description ? `. ${res.description}`: ''))
  }
}
</script>

<style scoped>
#teamCardList :deep(.van-image__img){
  height: 120px;
  object-fit: unset;
}
</style>