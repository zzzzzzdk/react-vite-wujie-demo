import React from "react";
import { Button, Popover } from '@yisa/webui'
import Logo from '../images/footer-logo.png'
import Yisalab from '../images/footer-yisalab.png'


function Footer(props) {

  return (
    <div className='layout-footer'>
      <img src={Logo} alt="以萨" />
      <span className='layout-footer-name'>
        Copyright &copy; {new Date().getFullYear()}以萨技术股份有限公司. All Rights Reserved. 推荐使用谷歌浏览器 1920*1080分辨率
      </span>
      {
        YISACONF && YISACONF.win7ChromeUrl ?
          <Popover trigger="hover" content={
            <div>
              推荐浏览器
              <Button
                style={{ marginLeft: '6px' }}
                type='primary'
                target='_blank'
                size="mini"
                href={YISACONF.win7ChromeUrl}>
                下载
              </Button>
            </div>
          }>
            <span className='download'>下载</span>
          </Popover> :
          null
      }
      {/* <img src={Yisalab} alt="yisalab" /> */}
    </div>
  );
}

export default Footer;