<template>
    <form action="/">
      <van-search
          v-model="searchText"
          show-action
          placeholder="请输入要搜索的标签"
          @search="onSearch"
          @cancel="onCancel"
      />
    </form>
    <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      已选择标签
    </van-divider>
    <div v-if="activeId.length===0">请选择标签</div>
  
    <van-row gutter="20">
      <van-col  v-for="tag in activeId" >
        <van-tag closeable size="medium" type="primary" @close="close(tag)">
          {{tag}}
        </van-tag>
      </van-col>
    </van-row>
  
  
    <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      未选择标签
    </van-divider>
  
    <van-tree-select
        v-model:active-id="activeId"
        v-model:main-active-index="activeIndex"
        :items="useTagList"
    />
  
    <van-button block type="primary" @click="doSearch">修改</van-button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import {useRouter} from "vue-router";
import myAxios from '../plugin/myAxios';
import { showFailToast, showSuccessToast } from 'vant';
import qs from 'qs'
  const router = useRouter();
  
  const oragintagList = [
    {
      text: '性別',
      children: [
        {text: '男', id: '男'},
        {text: '女', id: '女'},
      ],
    },
    {
      text: '年级',
      children: [
        {text: '大一', id: '大一'},
        {text: '大二', id: '大二'},
        {text: '大三', id: '大三'},
        {text: '大四', id: '大四'},
        {text: '研一', id: '研一'},
        {text: '研二', id: '研二'},
        {text: '研三', id: '研三'},
      ],
    },
    {
      text: '方向',
      children: [
        {text: 'c++', id: 'c++'},
        {text: 'java', id: 'java'},
        {text: 'python', id: 'python'},
        {text: '前端',id:'前端'},
        {text: '后端',id:'后端'},
        {text: 'go',id:'go'},
        {text: 'vue',id:'vue'},
        {text: 'reactor',id:'reactor'},
        {text: 'Linux',id:'Linux'}
      ],
    },
  ];
  
  //创建响应式对象
  let useTagList = ref(oragintagList);
  
  
  const searchText = ref('');
  const onSearch = (val) => {
    //进行标签的搜索过滤
    useTagList.value=oragintagList.map(parentTag=>{
      const tempParentTag = {...parentTag};
      const tempChildTag = [...parentTag.children];
      tempParentTag.children=tempChildTag.filter(item=>item.text.includes(searchText.value));
      return tempParentTag;
    })
    for(let i=0;i<useTagList.value.length;++i)
    {
      if(useTagList.value[i].text==='方向'&&useTagList.value[i].children.length!==0)
      {
        activeIndex.value=2;
      }
      if(useTagList.value[i].text==='年级'&&useTagList.value[i].children.length!==0)
      {
        activeIndex.value=1;
      }
    }
  };
  const onCancel = () => {
    searchText.value=' ';
    useTagList=oragintagList;
    activeIndex.value=0;
  };
  
  
  //标签的删除方法
  const close = (tag) =>
  {
    activeId.value=activeId.value.filter(item=>{
      return tag!==item;
    })
  }
  
  const activeId = ref([]); //右侧的索引，可以传入数组
  const activeIndex = ref(0); //左侧索引
  
  
  const doSearch= async()=>
  {
    const tagNameList = Object.values(activeId.value)
    try{
      // const res = await myAxios.post('/user',{
      //   tagNameList
      // },
      // {
      //   headers: {
      //     'Content-Type': 'x-www-form-urlencoded'
      //   }
      // })
      const res = await myAxios.get('/user/commitUserTags',{
        params: {
          tagNameList
        },
        paramsSerializer: params => {
          return qs.stringify(params, { indices: false })
        }
      })
      if(res.code == 0 && res.data){
        showSuccessToast("修改成功")
        router.push({
          path: '/home'
        })
      }else{
        showFailToast("修改失败")
      }
    }catch{
      showFailToast("修改失败")
    }
  }
  
  </script>
  
  <style scoped>
  
  </style>