/**Created by xiaoqi on 2019/3/22*/
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import user from './modules/user.js'
import permission from './modules/permission.js'
import app from './modules/app.js'
import tagsView from './modules/tagsView.js'

const store = new Vuex.Store({
    modules: {
        user,
        permission,
        app,
        tagsView
    }
});

export default store