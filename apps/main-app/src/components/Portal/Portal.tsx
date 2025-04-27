import { Component, ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
  getContainer?: () => Element;
  children?: ReactNode;
}

class Portal extends Component<PortalProps> {
  container: Element | null | void = null

  timer: any

  componentDidMount() {
    this.createContainer()

    this.timer = setTimeout(() => {
      if (!this.container) {
        this.createContainer()
      }
    })
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  createContainer() {
    const { getContainer } = this.props
    this.container = getContainer && getContainer()
    this.forceUpdate()
  }

  render() {
    const { children } = this.props
    if (this.container) {
      return createPortal(children, this.container)
    }
    return null
  }
}

export default Portal
