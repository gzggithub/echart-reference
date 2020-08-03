import Vue from 'vue';
import Vuex from 'vuex';
import leftList from './leftList'
import List from './list'

Vue.use(Vuex);
//const store = new Vuex.Store();
const modules = {
    List,
    leftList
}

export default new Vuex.Store({
    modules,
})