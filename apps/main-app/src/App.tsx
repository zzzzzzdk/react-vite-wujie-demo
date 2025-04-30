import React, { useEffect, useState } from 'react';
import { useDispatch } from '@/store';
import { setUserInfo, setSysConfig } from '@/store/slices/user';
import { initSkinLayout } from '@/store/slices/comment';
import APPRouter from '@/router';
import { getToken, setID, mouseTools } from '@/utils';
import ajax from '@/services';
import character from '@/config/character.config';
import { settingConfig } from '@/config';

function App() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const errorHandel = (err: any) => {
    setLoading(false);
    // Message.error(err.message || '未知错误');
  };

  useEffect(() => {
    mouseTools(100);
    if (getToken()) {
      ajax
        .getUserInfo()
        .then((res) => {
          dispatch(setUserInfo(res.data));
          if (res.data && res.data.user_info) {
            setID(res.data.user_info.id);
            window.user_id = res.data.user_info.id;
          }
          // microApp.setGlobalData({
          //   sysConfig: window.sysConfig,
          //   skin: res.data.color || window.sysConfig.d_color,
          //   userInfo: res.data,
          //   token: getToken(),
          // });
          setLoading(false);
        })
        .catch((err) => {
          errorHandel(err);
        });
      ajax
        .getSysConfig()
        .then((res) => {
          let sysConfigObj = {};
          res.data.forEach((item) => {
            if (sysConfigObj[item.pageName]) {
            } else {
              sysConfigObj[item.pageName] = {};
            }
            sysConfigObj[item.pageName][item.categoryName] = {
              default: item.default,
              max: item.max,
              min: item.min,
            };
          });
          dispatch(setSysConfig(sysConfigObj));
        })
        .catch((err) => {
          errorHandel(err);
          console.log(err);
          console.log('获取配置信息失败，使用默认的');
          dispatch(setSysConfig(settingConfig));
        });
    } else {
      setLoading(false);
      // console.log("1111");
      if (window.location.href.includes('login')) {
        // 使用 window.location.href 来赋值，避免类型不匹配问题
        window.location.href = window.YISACONF.login_url;
        return;
      }
      window.location.href = window.YISACONF.login_url + '&target_url=' + window.location.href;
      // window.location = YISACONF.login_url
    }
  }, []);

  useEffect(() => {
    const popState = (e) => {
      console.log(e);
    };
    window.addEventListener('popstate', popState);
    return () => {
      window.removeEventListener('popstate', popState);
    };
  }, []);

  return loading ? <div className='full-loading'></div> : <APPRouter />;
}

export default App;
