import Icon from './Icon.jsx'
import Note from './Note.jsx'
import Caption from './Caption.jsx'
import './Notice.css'

// Notice: a message that something went wrong, and what to do about it.
// The icon is ember (--error); the words stay in the normal text color.
// That way it is readable anywhere, even over the granite texture, where
// ember text would be too faint. Never color alone: always icon + words.
//
// Props:
//   children – what happened and what to do, in one or two short sentences
//   hint     – optional extra help in small print, e.g. where a setting is
function Notice({ children, hint }) {
  return (
    <div className="notice">
      <span className="notice__icon">
        <Icon name="warning" />
      </span>
      <div className="stack-tight">
        <Note>{children}</Note>
        {hint && <Caption>{hint}</Caption>}
      </div>
    </div>
  )
}

export default Notice
