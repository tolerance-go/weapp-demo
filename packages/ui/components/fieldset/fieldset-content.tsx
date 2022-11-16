import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  className?: string
  hasHeadImg?: boolean
}

const defaultProps = {
  className: '',
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type FieldsetContentProps = Props & NativeAttrs

const FieldsetContentComponent = (({
  className,
  children,
  hasHeadImg,
  ...props
}: React.PropsWithChildren<FieldsetContentProps> & typeof defaultProps) => {
  const { SCALES } = useScale()
  const classes = useClasses('content', className)

  return (
    <div className={classes} {...props}>
      {children}
      <style jsx>{`
        .content {
          width: ${SCALES.width(1, '100%')};
          height: ${SCALES.height(1, 'auto')};
          padding: ${SCALES.pt(hasHeadImg ? 0.6 : 1.3)} ${SCALES.pr(1.3)}
            ${SCALES.pb(1.3)} ${SCALES.pl(1.3)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)};
        }
        .content :global(> *:first-child) {
          margin-top: 0;
        }
        .content :global(> *:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}) as React.FC<React.PropsWithChildren<FieldsetContentProps>>

FieldsetContentComponent.defaultProps = defaultProps
FieldsetContentComponent.displayName = 'GeistFieldsetContent'
const FieldsetContent = withScale(FieldsetContentComponent)
export default FieldsetContent
