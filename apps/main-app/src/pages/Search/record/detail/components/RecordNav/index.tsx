import React, { useState, useEffect, useRef } from 'react'
// import  from './interface'
import dictionary from '@/config/character.config'
import cn from 'classnames'
import './index.scss'
import { NumDataType, PortraitClusterCountType } from '../../interface'
type RecordNavProps = {
  navData: {
    value: string;
    label: string;
  }[]
  numData: NumDataType,
  PortraitClusterCount: PortraitClusterCountType
  activeKey: string
  onChangeActiveKey: (parentKey: string, childKey: string) => void
}
type FilterNavType = {
  title: string;
  key: string
  children: {
    name: string;
    text: string;
    required?: boolean;
  }[]
}[]

export default function (props: RecordNavProps) {
  const {
    navData = [],
    numData,
    PortraitClusterCount,
    activeKey = "",
    onChangeActiveKey
  } = props

  const filterNav: FilterNavType = navData.map(item => dictionary.recordNav[item.value])
  const navWrapperRef = useRef<HTMLUListElement>(null)
  const handleNavClick = (parentKey: string, childKey: string) => {
    onChangeActiveKey(parentKey, childKey)
  }

  useEffect(() => {
    document.querySelector(".record-detail-nav .nav-wrapper .active")?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  }, [activeKey])

  return (
    <div className="record-detail-nav">
      {
        filterNav.map(item => (
          <div className="nav-container" key={item.title}>
            <div className="title">{item.title}</div>
            <ul className="nav-wrapper" ref={navWrapperRef}>
              {
                item.children.map(it => {
                  if (item.key === "baseInfo") {
                    if (!numData[it.name] && !it.required) {
                      return null
                    } else {
                      return (
                        <li
                          onClick={() => { handleNavClick(item.key, it.name) }}
                          key={it.name} className={cn("nav-item", { "active": activeKey === it.name })}>
                          <span>{it.text}</span>
                          {numData[it.name] ? <span className="count">({numData[it.name]})</span> : ""}
                        </li>
                      )
                    }
                  } else if (item.key === "portrait") {
                    return (
                      <li
                        onClick={() => { handleNavClick(item.key, it.name) }}
                        key={it.name}
                        className={cn("nav-item", { "active": activeKey === it.name })}>
                        <span>{it.text}</span>
                        <span className="count">({PortraitClusterCount[it.name]})</span>
                      </li>
                    )
                  } else {
                    return (
                      <li
                        onClick={() => { handleNavClick(item.key, it.name) }}
                        key={it.name}
                        className={cn("nav-item", { "active": activeKey === it.name })}>
                        <span>{it.text}</span>
                      </li>
                    )
                  }
                })
              }
            </ul>
          </div>
        ))
      }
    </div >)
}

