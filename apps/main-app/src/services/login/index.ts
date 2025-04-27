import ajax from '@/utils/axios.config'

const login = {

    // 获取验证码
    // getVerifyUser: function <U, T>(data?: U) {
    //     return ajax<T, U>({
    //         method: "get",
    //         url: `/v1/admin/login/refresh_verify_code`,
    //         data
    //     });
    // },
    // doAppLogin:function <U, T>(data?: U) {
    //     return ajax<T, U>({
    //         method: "post",
    //         url: `/v1/admin/login/app_login`,
    //         data
    //     });
    // },
    // okToLogin:function <U, T>(data?: U) {
    //     return ajax<T, U>({
    //         method: "get",
    //         url: `/v1/admin/common/ok_to_log_in`,
    //         data
    //     });
    // },
    //获取公钥
    // getLoadPbk:function <U, T>(data?: U) {
    //     return ajax<T, U>({
    //         method: "get",
    //         url: `/v1/admin/get_load_pbk`,
    //         data
    //     });
    // },
}

export default {
    login,
}
