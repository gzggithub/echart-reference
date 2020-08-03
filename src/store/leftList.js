//import mine from './mine'

const state = {
    changeId: '', //选中id 
};
const mutations = {

    SET_CHANGE_ID(state, value) {
        state.changeId = value
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
