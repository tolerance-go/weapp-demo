import React from 'react'

interface Props {
  className?: string
}

const defaultProps = {
  className: '',
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type FieldsetSubtitleProps = Props & NativeAttrs

const FieldsetSubtitle = (({
  className,
  children,
  ...props
}: React.PropsWithChildren<FieldsetSubtitleProps> & typeof defaultProps) => {
  return (
    <>
      <div className={className} {...props}>
        {children}
      </div>
      <style jsx>{`
        div {
          font-size: 0.875em;
          line-height: 1.6;
          letter-spacing: -0.005625em;
          margin: 0.75em 0;
        }
      `}</style>
    </>
  )
}) as React.FC<React.PropsWithChildren<FieldsetSubtitleProps>>

FieldsetSubtitle.defaultProps = defaultProps
FieldsetSubtitle.displayName = 'GeistFieldsetSubtitle'
export default FieldsetSubtitle
