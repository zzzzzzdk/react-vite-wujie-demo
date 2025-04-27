import React from 'react'
import ajax from "@/services";
import './index.scss'

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: ''
    };
  }

  static getDerivedStateFromError(error) {
    // window.location = './#/'
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo: error
    })
    console.log(
      // error.message,
      // error.name,
      // error.cause,
      // error.fileName,
      // error.lineNumber,
      error.stack)
    if (YISACONF && YISACONF.post_error) {
      ajax.postError(YISACONF.post_error, {
        message: '页面信息：' + JSON.stringify(this.props.data) + '，错误信息：' + error.toString()
      }).then(() => { }).catch(() => { })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='error-page'>
          <div className='title'>对不起，出错了！</div>
          <div className='info'>
            <p>具体错误信息如下:</p>
            {this.state.errorInfo.stack}
          </div>
        </div>)
    }

    return this.props.children;
  }
}

export default ErrorBoundary
