import React, { useEffect, useRef, useState } from 'react'
import { Input, Image, Button, Form, Message } from "@yisa/webui"
import './index.scss'
import { Icon, } from '@yisa/webui/es/Icon'
// import './index.scss'
import logo from '@/assets/images/login/gongan2.png'
import { LoginForm } from './interface'
// import { useHistory } from 'react-router'
import { useLocation, useNavigate, Navigate } from 'react-router'
import { getParams, getQueryString } from '@/utils'
import ajax from '@/services'
import cookie, { getToken, setToken } from '@/utils/cookie'
import empty from "@/assets/images/login/empty.png";
import faceTitle from '@/assets/images/login/renlian-title.png'
import vehicleTile from '@/assets/images/login/cheliang-title.png'
import fasTitle from '@/assets/images/login/ronghe-title.png'
import fas from '@/assets/images/login/ronghe.gif'
import fas2 from '@/assets/images/login/fas2.png'
import face from '@/assets/images/login/renlian.png'
import vehicle from '@/assets/images/login/cheliang.png'
import { useDispatch } from '@/store'
import { setID, aesUtil, mouseTools } from '@/utils'
import { setSysConfig, setUserInfo } from '@/store/slices/user'
import { settingConfig } from '@/config'

const { Password } = Input

declare global {  //设置全局属性
	interface Window {  //window对象属性
		user_id: string;
		jump_url: string
	}
}
function Login(props: any) {
	const prefixCls = 'login'
	// 默认验证码
	const defVerifyData = {
		verify_img_base64: empty,
		verify_code_time: "",
		verify_code_hash: "",
	};
	// 验证码信息
	const [verifyData, setVerifyData] = useState(defVerifyData);
	const [loginForm, setLoginForm] = useState<LoginForm>({
		account: "",
		password: "",
		verify_code: "",
	});
	// 公钥实例
	const isInstance = useRef<any>(createIS());
	const serverRsaPubKey = useRef("");
	const location = useLocation()
	const searchData = getParams(location.search)//地址参数
	const applyId = (location.search && decodeURI(getQueryString(location.search, "apply") || "")) || "";
	// 正在登录
	const [loginLoading, setLoginLoading] = useState(false);
	// const homeref = useRef("/")
	const [title, setTitle] = useState(fasTitle)
	const [symbolContent, setSymbolContent] = useState(fas2)
	// 是否显示验证码
	const [isShow, setIsShow] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate()
	useEffect(() => {
		if (window.YISACONF.sysType) {
			// setTitle()
			if (window.YISACONF.sysType === "fas") {
				setTitle(fasTitle)
				setSymbolContent(fas2)
			}
			else if (window.YISACONF.sysType === "face") {
				setTitle(faceTitle)
				setSymbolContent(face)
			}
			else if (window.YISACONF.sysType === "vehicle") {
				setTitle(vehicleTile)
				setSymbolContent(vehicle)
			}
		}
	}, [])

	useEffect(() => {
		getPubKey()
		// token过期不能跳转首页
		// const token = getToken()
		// if (token) {
		// 	navigate("/home")
		// }
		// else {
		// }
	}, []);

	// 获取公钥
	const getPubKey = () => {
		let pubKey = sessionStorage.getItem("pubKey");
		if (pubKey) {
			isInstance.current = createIS();
			serverRsaPubKey.current = pubKey;
			isInstance.current.rsaUtil.getKeyPair();
		} else {
			ajax.getLoadPbk<any, any>()
				.then(
					(res) => {
						if (res.status === 20000) {
							sessionStorage.setItem("pubKey", res.data);
							isInstance.current = createIS();
							serverRsaPubKey.current = res.data;
							isInstance.current.rsaUtil.getKeyPair();
						} else {
							console.log(res.message);
						}
					},
					(err) => {
						console.log(err);
					}
				)
				.catch((error) => {
					console.log(error);
				});
		}
	};

	// 获取验证码图片
	const getCode = () => {
		ajax.getVerifyCode<any, any>().then(
			(res) => {
				if (res.status === 20000) {
					setVerifyData(res.data || defVerifyData);
				} else {
					Message.error(res.message || '获取验证码失败');
				}
			},
			(err) => {
				// message.error("服务器连接失败！");
				console.log(err);
			}
		);
	};
	// 登录成功，cookie中存储token，并跳转页面
	const jumpToPage = (jump_url: string) => {
		if (process.env.NODE_ENV === "development") {
			setToken('2vb1hj5ft8evs241r4h2siqp78----fronted---token', 88640000)
		}
		window.location.href = jump_url
		// setToken(data.id_token)
		// let getu = ajax.getUserInfo()
		// 	.then((res) => {
		// 		console.log(res.data, 'kkk');
		// 		dispatch(setUserInfo(res.data))
		// 		if (res.data && res.data.user_info) {
		// 			setID(res.data.user_info.id)
		// 			window.user_id = res.data.user_info.id
		// 		}
		// 		//   setLoading(false)
		// 	})
		// let gets = ajax.getSysConfig().then((res) => {
		// 	let sysConfigObj = {}
		// 	res.data.forEach((item: any) => {
		// 		if (sysConfigObj[item.pageName]) {
		// 		} else {
		// 			sysConfigObj[item.pageName] = {}

		// 		}
		// 		sysConfigObj[item.pageName][item.categoryName] = {
		// 			default: item.default,
		// 			max: item.max,
		// 			min: item.min
		// 		}
		// 	})
		// 	dispatch(setSysConfig(sysConfigObj))
		// })


		// localStorage.setItem('jump_url', data.jump_url)
		// window.location.reload()
		// window.location.href = data.jump_url;
		// Promise.all([getu, gets]).then(() => {
		// 	window.location.reload()
		// 	window.location.href = data.jump_url;
		// 	console.log('ppap');
		// }).catch((err) => {
		// 	console.log(err)
		// });

	};
	// 提交，登录提交，类型type： 1、用户名、密码登录  2、PKI证书登录。
	const submit = (args: LoginForm, mode: string) => {
		let obj = {};
		let href = window.location.href;
		let { account, password, verify_code } = args;
		if (!account) {
			Message.warning("请输入用户名！");
			return;
		}
		if (!password) {
			Message.warning("请输入密码！");
			return;
		}
		if (isShow && !verify_code) {
			Message.warning("请输入验证码！");
			return;
		}
		obj = {
			...args,
			...verifyData,
			...searchData,
			apply_id: applyId,
			target_url: href.split("target_url=")[1],
		}
		const aesKey = isInstance.current.aesUtil.getKey();
		console.log(aesKey, serverRsaPubKey.current);

		const encryptedKey = isInstance.current.rsaUtil.encrypt(
			aesKey,
			serverRsaPubKey.current
		);
		const encryptedData = isInstance.current.aesUtil.encrypt(obj, aesKey);

		setLoginLoading(true);

		let postData = {
			data: encryptedData,
			key: encryptedKey,
			type: mode,
		};
		ajax.doAppLogin<any, any>(postData).then(
			(res) => {
				setLoginLoading(false);
				let { status, message = '', data = {} } = res;
				//20000, 20001, 20002, 20003, 40007
				if (status && [20000, 20001, 20002].includes(status)) {
					if (status === 20002) {
						Message.info("您的密码即将失效,请及时修改密码")
					}
					jumpToPage(data.jump_url);
				}
				else if (status === 40007) {
					Message.error("您的密码已经失效，请先修改密码")
					return
				}
				else if (data.hasOwnProperty("verify_code_hash") && data.verify_code_hash) {
					setVerifyData(data || defVerifyData);
					setIsShow(true);
				}
				else {
					Message.error(message)
				}
			},
			(err) => {
				setLoginLoading(false);
				console.log(err);
			}
		);
		// 加密

	};

	return (
		<div className={`${prefixCls}-box`}>
			<div className="symbol-box">
				<Image src={symbolContent} />
			</div>
			<div className="content-box">
				<div className="title-box">
					<Image src={title}></Image>
				</div>
				<div className='center-box'>
					<div className='login-title'>
						<span>欢迎登录</span>
					</div>
					<Form>
						<Form.Item>
							<Input
								type="text"
								placeholder='请输入账号'
								size='large'
								value={loginForm.account}
								onChange={(e) => {
									setLoginForm({
										...loginForm,
										account: e.target.value.replace(/[\s]*/g, "")
									});
								}}
								prefix={<Icon type="yonghu1" />}
								onPressEnter={() => submit(loginForm, "1")}
							/>
						</Form.Item>
						<Form.Item>
							<Password
								placeholder='请输入密码'
								size='large'
								value={loginForm.password}
								onChange={(e) => {
									setLoginForm({
										...loginForm,
										password: e.target.value.replace(/[\s]*/g, "")
									});
								}}
								prefix={<Icon type="mima1" />}
								onPressEnter={() => submit(loginForm, "1")}
							/>
						</Form.Item>
						{
							isShow ? (
								<div className="verify-box">
									<Form.Item>
										<Input
											placeholder="请输入验证码"
											maxLength={8}
											autoComplete="off"
											value={loginForm.verify_code}
											onPressEnter={() => submit(loginForm, "1")}
											name="verify_code"
											onChange={(e) =>
												setLoginForm({
													...loginForm,
													verify_code: e.target.value,
												})
											}
										/>
									</Form.Item>
									<div className="pic-box">
										<img
											src={verifyData.verify_img_base64}
											onClick={getCode}
										/>
										<span onClick={getCode}>换一张</span>
									</div>
								</div>
							) : null}
						<div className='tishi-box'>
							<div className="tishi">
								<span className='tishi-content'>忘记密码请联系管理员</span>
							</div>
						</div>
						<Form.Item>
							<Button
								size="large"
								className='btn-zhanghao'
								onClick={() => {
									submit(loginForm, "1");
								}}
								disabled={loginLoading}
							>账号登录</Button>
						</Form.Item>
						<Form.Item>
							<Button
								size="large"
								className='btn-zhengshu'
								disabled={loginLoading}
								onClick={() => {
									window.location.href = window.YISACONF.certificate_url;
								}}
							>证书登录</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	)
}


export default Login
