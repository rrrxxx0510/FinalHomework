import { createApp } from 'vue'
import App from './App.vue'
import { NavBar, showFailToast } from 'vant';
import { Button } from 'vant';
import {Icon,Tabbar, TabbarItem } from "vant";
import * as VueRouter from 'vue-router';
import router from "./config/route"
import store from './store/index'
import { Search ,Toast,Divider,Tag,TreeSelect,Col, Row,Cell, CellGroup,Card,Empty,DatePicker,Stepper,Radio,Uploader} from 'vant';


router.beforeEach((to, from, next) => {

    if(!store.state.isLogin && to.path !== '/login') {
        next('/login')
        showFailToast("请登录")
    }else{
        next()
    }
})

const app = createApp(App);
app.use(NavBar)
app.use(Button)
app.use(Icon)
app.use(Tabbar)
app.use(TabbarItem)
app.use(router)
app.use(Search)
app.use(Toast)
app.use(Divider)
app.use(Tag)
app.use(TreeSelect)
app.use(Col)
app.use(Row)
app.use(Cell)
app.use(CellGroup)
app.use(Card)
app.use(Empty)
app.use(DatePicker)
app.use(Stepper)
app.use(Radio)
app.use(Uploader)
app.use(store)
app.mount('#app')






