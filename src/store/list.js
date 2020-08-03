//import mine from './mine'

const state = {
    defaultActive: 'M101', //选中id 
    userName: '',
    token: '',
    menuList: [],
};
const mutations = {

    SET_DEFAULT_ACTIVE(state, value) {
        state.defaultActive = value
    },
    SET_USER_NAME(state, value) {
        state.userName = value
    },
    SET_TOKEN(state, value) {
        state.token = value
    },
    SET_MENU_LIST(state, value) {
        state.menuList = value
    },
};
const actions = {
    
};
const modules = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    modules,
}
