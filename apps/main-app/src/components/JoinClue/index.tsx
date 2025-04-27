import { Modal, Message, Divider, Button } from '@yisa/webui'
import { useEffect, useState } from 'react'
import { SearchTree } from '..'
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import { JoinClueProps } from './interface'
import services from "@/services";
import { matchRoutes, useLocation, } from 'react-router';
import './index.scss'
import routeData from '@/router/router.config'

function JoinClue(props: JoinClueProps) {
	const {
		visible = false,
		onOk,
		onCancel,
		clueDetails = [],
		isbutton = false,
		cardData
	} = props
	// const { pathname } = useLocation();
	const location = useLocation();
	const p1 = matchRoutes(routeData, location)
	const [isadding, setIsadding] = useState(false)
	const [selectid, setSelectid] = useState('')

	const [jionvisible, setJionVisible] = useState(visible)//false
	const modelvisible = 'visible' in props && !isbutton ? visible : jionvisible

	const handleok = () => {
		if (isadding) {
			Message.warning('请完成本次操作')
			return
		}
		if (selectid === '') {
			Message.warning('您尚未选择')
			return
		}
		let newclueDetails = clueDetails.map((item) => {
			return { ...item, sysModel: p1?.[p1?.length - 1].route.text }
		})

		// 通过source标识卡片数据来源，后端操作日志用
		const dataSource = cardData && cardData.source ? { source: cardData.source } : {}

		services.joinClue({
			caseId: selectid,
			// clueDetails
			clueDetails: newclueDetails,
			...dataSource
		}).then(res => {
			if (res.failedNumber > 0) {
				Message.warning(res.message || "添加失败")
				return
			}
			Message.success(res.message || '添加成功')
		}).catch(err => {
			Message.error('添加失败')
			return
		})
		console.log(selectid, '确认');
		setSelectid('')
		if (isbutton) {
			setJionVisible(false)
		}
		else {
			onOk && onOk()
		}
	}
	const handlecancel = () => {
		// console.log(isadding);
		if (isadding) {
			Message.warning('请完成本次操作')
			return
		}
		console.log('取消');
		setSelectid('')
		if (isbutton) {
			setJionVisible(false)
		}
		else {
			onCancel && onCancel()
		}
	}
	const onSelect = (selectedNodes: NodeInstance[]) => {
		if (selectedNodes.length) {
			setSelectid(selectedNodes[0].key ? selectedNodes[0].key : selectedNodes[0].props.dataRef?.jobId)
		} else {
			setSelectid('')
		}
	}
	return (
		<div>
			{
				isbutton ?
					<Button onClick={() => {
						setJionVisible(true)
					}}
						size="small"
					>加入线索库</Button>
					: ''
			}
			<Modal
				title='加入线索库'
				visible={modelvisible}
				onOk={handleok}
				onCancel={handlecancel}
				maskStyle={{ zIndex: 2022 }}
				wrapClassName='cluemodel'
				unmountOnExit>
				<SearchTree ismodel={true} onSelect={onSelect} changemodelstatus={setIsadding}></SearchTree>
			</Modal>
		</div>
	)
}

export default JoinClue
