import { Component, ReactNode } from 'react'
import Portal from './Portal'

export interface PortalWrapperProps {
  getContainer?: () => Element;
  children?: ReactNode;
  forceRender?: boolean;
  visible?: boolean;
}

class PortalWrapper extends Component<PortalWrapperProps> {
  static displayName = 'Portal'

  static defaultProps = {
    getContainer: () => document.body
  }

  instance: any

  componentWillUnmount() {
    this.instance = null
  }

  render() {
    const { forceRender, visible } = this.props
    return (forceRender || visible || this.instance) && <Portal
      ref={ref => this.instance = ref}
      {...this.props}
    />
  }
}

export default PortalWrapper
