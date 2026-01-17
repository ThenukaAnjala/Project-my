import '../styles/AnimatedSection.css'

function AnimatedSection({ id, background = 'light', className = '', children }) {
  const classes = ['section', `section--${background}`, 'section--visible', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section id={id} className={classes}>
      <div className="section__inner">{children}</div>
    </section>
  )
}

export default AnimatedSection

