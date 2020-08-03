import { get, post, deletes, put,postJSON,postFile} from './http'
let baseUrl = '/apis/equip/'

/* 登陆相关 */

export const signAndToken = p => get(`${baseUrl}dgequip/equip/login/getSignAndToken`, p);//获取签名和token
export const login = p => get(`${baseUrl}dgequip/equip/login/login`, p);//登录/
//export const simulationForTokenByUserName = p => get(`${baseUrl}dgequip/equip/login/simulationForTokenByUserName//${p.userName}`);//根据用户名判断是否登录
//export const logout = p => post(`${baseUrl}dgportal/portal/main/logout`, p);//登出
//export const changePassword = p => post(`${baseUrl}dgportal/portal/main/changePassword`, p);//修改密码
export const verifyCode = p => get(`${baseUrl}dgequip/equip/login/verifyCode`, p);//校验验证码
export const queryLeftMenu = p => get(`${baseUrl}dgequip/equip/login/queryLeftMenu`, p);//获取左侧菜单

export const getChildrenByNameAndFlag = p => get(`${baseUrl}dgequip/equip/menu/getChildrenByNameAndFlag`, p);//获取下级版主或者供电局
export const getMenus = p => get(`${baseUrl}dgequip/equip/menu/getMenus`, p);//获取左侧菜单
export const professionalListByFlag = p => get(`${baseUrl}dgequip/equip/professionalQuestion/professionalListByFlag`, p);//根据状态获取专业
export const queryMainDataQualityByName = p => get(`${baseUrl}dgequip/equip/dataQuality/queryMainDataQualityByName`, p);//根据名称查询主网数据质量--变电月运行所
export const queryViceDataQualityInfo = p => get(`${baseUrl}dgequip/equip/dataQuality/queryViceDataQualityInfo`, p);//查询配网设备数据质量 -- 大理局
export const queryMainDataQualityInfo = p => get(`${baseUrl}dgequip/equip/dataQuality/queryMainDataQualityInfo`, p);//查询主网设备数据质量 -- 大理局
export const queryStandingListVice = p => get(`${baseUrl}dgequip/equip/dataQuality/queryStandingListVice`, p);//top10与last10图表配网

export const queryStandingList = p => get(`${baseUrl}dgequip/equip/dataQuality/queryStandingListVice`, p);//top10与last10图表 配网
export const queryStandingListMain = p => get(`${baseUrl}dgequip/equip/dataQuality/queryStandingListMain`, p);//top10与last10图表 主网

export const queryProfessionalQuestionQualityAnalysisInfo = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryProfessionalQuestionQualityAnalysisInfo`, p);//各专业问题数据质量分析-总体
export const queryProfessionalQuestionQualityAnalysisInfoMain = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryProfessionalQuestionQualityAnalysisInfoMain`, p);//各专业问题数据质量分析-主网
export const queryProfessionalQuestionQualityAnalysisInfoVice = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryProfessionalQuestionQualityAnalysisInfoVice`, p);//各专业问题数据质量分析-配网
export const queryDeviceParetoChart = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryDeviceParetoChart`, p);//设备类别帕累托图-总体
export const queryDeviceParetoChartMain = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryDeviceParetoChartMain`, p);//设备类别帕累托图-主网
export const queryDeviceParetoChartVice = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryDeviceParetoChartVice`, p);//设备类别帕累托图-配网
export const queryGradeParetoChart = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryGradeParetoChart`, p);//电压等级帕累托图-总体
export const queryGradeParetoChartMain = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryGradeParetoChartMain`, p);//电压等级帕累托图-主网
export const queryGradeParetoChartVice = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryGradeParetoChartVice`, p);//电压等级帕累托图-配网
export const queryNoResInfo = p => get(`${baseUrl}dgoperation/operation/noResInfo/queryNoResInfo`, p);//待认责数据项查询

export const queryDataQualityInfo = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryDataQualityInfo`, p);//数据质量统计分析-总体
export const queryDataQualityInfoMain = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryDataQualityInfoMain`, p);//数据质量统计分析-主网
export const queryDataQualityInfoVice = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryDataQualityInfoVice`, p);//数据质量统计分析-配网
export const queryDataQuestionList = p => get(`${baseUrl}dgequip/equip/professionalQuestion/queryDataQuestionList`, p);//查询问题数据明细
export const downloadDataQuestionExcel = p => get(`${baseUrl}dgequip/equip/professionalQuestion/downloadDataQuestionExcel`, p);//将表格数据导出为Excel
export const getOgrListByParent = p => get(`${baseUrl}dgequip/equip/professionalQuestion/getOgrListByParent`, p);//根据id和状态获取下级组织

export const queryProDataSteward = p => get(`${baseUrl}dgequip/equip/dataSteward/queryProDataSteward`, p);//省
export const queryCityDataSteward = p => get(`${baseUrl}dgequip/equip/dataSteward/queryCityDataSteward`, p);//市
export const queryCountyDataSteward = p => get(`${baseUrl}dgequip/equip/dataSteward/queryCountyDataSteward`, p);//县


export const queryObjectQueryNumTop20 = p => get(`${baseUrl}dgequip/equip/object-query-num/queryObjectQueryNumTop20`, p);//常查前20个节点
export const queryObjectOne = p => post(`${baseUrl}dgequip/equip/object-query-num/queryOne`, p);//查询节点1次

//角色相关
export const roleManag = p => get(`${baseUrl}dgequip/equip/ptRole/roleListByPage`, p);//获取角色列表
export const saveRole = p => post(`${baseUrl}dgequip/equip/ptRole/save`, p);//添加单个角色
export const deleteRole = p => post(`${baseUrl}dgequip/equip/ptRole/delBatch`, p);//批量删除角色
export const findRole = p => get(`${baseUrl}dgequip/equip/ptRole/detail/${p.id}`, p);//查询角色
export const updateRole = p => put(`${baseUrl}dgequip/equip/ptRole/update`, p);//修改角色
export const dialogUserListByPage = p => get(`${baseUrl}dgequip/equip/ptUser/userListByPage`, p);//绑定账号列表数据
export const userIdsPinlessRole = p => get(`${baseUrl}dgequip/equip/ptRole/userIdsPinlessRole`, p);//传入多个账号id和一个角色进行批量绑定
export const userListByRoleId = p => get(`${baseUrl}dgequip/equip/ptRole/userListByRoleId`, p);//传入角色id查询角色绑定的账号
export const authorTreeList = p => get(`${baseUrl}dgequip/equip/ptAuthorization/authorTreeList`, p);//传入角色id查询角色绑定的账号
export const setAuthorization = p => get(`${baseUrl}dgequip/equip/ptRole/setAuthorization`, p);//传入多个权限id一个角色id进行绑定
export const authorizationListByRoleId = p => get(`${baseUrl}dgequip/equip/ptAuthorization/authorizationListByRoleId`, p);//传入多个权限id一个角色id进行绑定


/* 组织机构管理 */
export const getPositionList = p => get(`${baseUrl}dgequip/equip/ptPosition/getPositionList`, p);//岗位列表查询
export const savePositionList = p => post(`${baseUrl}dgequip/equip/ptPosition/save`, p);//岗位列表增加
export const deletePositionList = p => deletes(`${baseUrl}dgequip/equip/ptPosition/delete/${p.id}`, p);//岗位列表删除
export const updatePositionList = p => put(`${baseUrl}dgequip/equip/ptPosition/update`, p);//岗位列表修改

export const getEmployeeList = p => get(`${baseUrl}dgequip/equip/ptEmployee/getEmployeeList`, p);//人员列表查询
export const saveEmployeeList = p => post(`${baseUrl}dgequip/equip/ptEmployee/save`, p);//人员列表增加
export const deleteEmployeeList = p => deletes(`${baseUrl}dgequip/equip/ptEmployee/delete/${p.id}`, p);//人员列表删除
export const updateEmployeeList = p => put(`${baseUrl}dgequip/equip/ptEmployee/update`, p);//人员列表修改



//账号相关
export const orgTreeByOrgId = p => get(`${baseUrl}dgequip/equip/ptOrg/orgTreeByOrgId`, p);//根据组织id查询组织树
export const orgSave = p => post(`${baseUrl}dgequip/equip/ptOrg/save`, p);//添加单个组织
export const orgUpdate = p => put(`${baseUrl}dgequip/equip/ptOrg/update`, p);//修改单个组织
export const orgDelete = p => get(`${baseUrl}dgequip/equip/ptOrg/delete/${p.id}`, p);//删除单个组织

export const queryEmployeeListByOrgId = p => get(`${baseUrl}dgequip/equip/ptEmployee/queryEmployeeListByOrgId`, p);//根据组织id查询人员列表/
export const createUserByEmplyeeIds = p => get(`${baseUrl}dgequip/equip/ptUser/createUserByEmplyeeIds`, p);//创建用户
export const orgRegionTreeByOrgId = p => get(`${baseUrl}dgequip/equip/ptOrg/orgRegionTreeByOrgId`, p);//根据组织id查询局本部树形结构

export const getdocs = p => get(`${baseUrl}dgequip/equip/doc-info/docs`, p);//获取文档列表
export const deleteDoc = p => post(`${baseUrl}dgequip/equip/doc-info/delete/${p.docId}`, p);//删除文档
export const parseFinish = p => post(`${baseUrl}dgequip/equip/doc-info/parseFinish/${p.docId}`, p);//解析文档
export const uploadDoc = p => postFile(`${baseUrl}dgequip/equip/doc-info/upload`, p);//上传文档
export const uploadDocs = p => postFile(`${baseUrl}dgequip/equip/doc-info/uploadFiles`, p);//批量上传文档

export const uploadDocsUrl = `${baseUrl}dgequip/equip/doc-info/uploadFiles`
export const uploadDocUrl = `${baseUrl}dgequip/equip/doc-info/upload`

export const getClassifyMain = p => get(`${baseUrl}dgequip/equip/bookMain/getClassifys`, p);//获取设备类别主网
export const getClassifyVice = p => get(`${baseUrl}dgequip/equip/bookVice/getClassifys`, p);//获取设备类别配网
export const getModelByClassifyMain = p => get(`${baseUrl}dgequip/equip/bookMain/getModelByClassify`, p);//获取设备型号主网
export const getModelByClassifyVice = p => get(`${baseUrl}dgequip/equip/bookVice/getModelByClassify`, p);//获取设备型号配网
export const getDetailsMain = p => get(`${baseUrl}dgequip/equip/bookMain/queryBookMainByValues`, p);//获取纠错详细主网
export const getDetailsVice = p => get(`${baseUrl}dgequip/equip/bookVice/queryBookViceByValues`, p);//获取纠错详细配网


export const queryClassifyNameAndTotal = p => get(`${baseUrl}dgequip/equip/correct/queryClassifyNameAndTotal`, p);//获取设备类别名称与数量
export const queryDeviceModelAndTotal = p => get(`${baseUrl}dgequip/equip/correct/queryDeviceModelAndTotal`, p);//获取设备型号与数量
export const queryManufacturerAndTotal = p => get(`${baseUrl}dgequip/equip/correct/queryManufacturerAndTotal`, p);//获取设备生产厂家与数量
export const queryPerByClassifyDeviceModeManufacture = p => get(`${baseUrl}dgequip/equip/correct/queryPerByClassifyDeviceModeManufacture`, p);//获取不同参数整体占比最多的比例
export const queryMainDeviceAnswerByClassifyDeviceModeManufacture = p => get(`${baseUrl}dgequip/equip/correct/queryMainDeviceAnswerByClassifyDeviceModeManufacture`, p);//获取主网设备各参数纠错数据
export const queryViceDeviceAnswerByClassifyDeviceModeManufacture = p => get(`${baseUrl}dgequip/equip/correct/queryViceDeviceAnswerByClassifyDeviceModeManufacture`, p);//获取配网设备各参数纠错数据
export const findOneMainDeviceAnswerByClassifyDeviceModeManufacture = p => get(`${baseUrl}dgequip/equip/correct/findOneMainDeviceAnswerByClassifyDeviceModeManufacture`, p);//获取主网设备各参数纠错数据(one)
export const findOneViceDeviceAnswerByClassifyDeviceModeManufacture = p => get(`${baseUrl}dgequip/equip/correct/findOneViceDeviceAnswerByClassifyDeviceModeManufacture`, p);//获取配网设备各参数纠错数据(one)
export const queryMaindeviceCorrectDetails = p => get(`${baseUrl}dgequip/equip/correct/queryMaindeviceCorrectDetails`, p);//获取主网设备技术参数纠错明细数据
export const queryVicedeviceCorrectDetails = p => get(`${baseUrl}dgequip/equip/correct/queryVicedeviceCorrectDetails`, p);//获取配网设备技术参数纠错明细数据

//export const orgTreeByOrgId = p => get(`${baseUrl}dgequip/equip/ptOrg/orgTreeByOrgId`, p);//根据组织id查询组织树

let GraphBaseUrl='/apis/graph/'
export const queryObjectTypes = p => postJSON(`${GraphBaseUrl}getGraphThree/`, p);//查询具有哪些本体类别
export const queryLikeObjects = p => postJSON(`${GraphBaseUrl}getGraphOne/`, p);//模糊查询相似实体
export const queryObjectRelations = p => postJSON(`${GraphBaseUrl}getGraphTwo/`, p);//查询实体与关系

export const parseDoc = p => postJSON(`${GraphBaseUrl}creatGraph/`, p);//解析文档

export const checkDevModelMain = p => postJSON(`${GraphBaseUrl}checkDevModel/`, p);//智能纠错——主网
export const checkDevModelVice = p => postJSON(`${GraphBaseUrl}checkDevModel/`, p);//智能纠错——配网

export const checkDevModelByOne = p => postJSON(`${GraphBaseUrl}checkDevModelByOne/`, p);//智能纠错——单一型号


let localJsonUrl='/apis/json/'
export const checkDevModelViceMock = p => get(`${localJsonUrl}static/check/vice.json`, p);//智能纠错——配网



