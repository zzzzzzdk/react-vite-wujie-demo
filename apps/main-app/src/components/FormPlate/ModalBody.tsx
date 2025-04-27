import React, { useState, useEffect } from 'react'
import ReactDom from 'react-dom'
import { ModalBodyPros } from './interface'


function ModalBody(props: ModalBodyPros) {

  const [el] = useState(function () {
    let el: HTMLDivElement = document.createElement('div')
    el.style.position = 'absolute'
    el.style.left = '0'
    el.style.top = '0'
    el.style.width = '100%'
    return el
  })

  useEffect(() => {
    const root: any = props.getPopupContainer();
    root?.appendChild(el);
    return () => {
      root?.removeChild(el)
    }
  }, []);

  return ReactDom.createPortal(props.children, el)
}

export default ModalBody
