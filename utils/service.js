const {httpPost,httpGet}=require('./http.js');


/**
 * 获取首页默认地址
 */

export const cityGuess=()=>{
    return httpGet('/v1/cities',{
        type:'guess'
    })
}

/* 
登录 param {username:'1884112658‘，password:'1',captcha_code:'124'}

*/

export const login=(param)=>{
    return httpPost('/v2/login',param);
}

/**
 * 获取图片验证码
 */

export const getcaptchas = () => httpPost('/v1/captchas', {});