import './index.scss'

function AspectRatioBox(props) {
  const {
    className,
    style,
    ratio,
    children,
    ...otherProps
  } = props

  return (
    <div
      className={className ? 'aspect-ratio-box ' + className : 'aspect-ratio-box'}
      style={{
        ...(style || {}),
        paddingTop: `${ratio * 100}%`
      }}
      {...otherProps}
    >
      <div className="aspect-ratio-box-content">
        {children}
      </div>
    </div>
  )
}

export default AspectRatioBox
