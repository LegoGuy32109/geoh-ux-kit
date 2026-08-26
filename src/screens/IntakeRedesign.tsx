/**
 * New route — no portal page behind this yet.
 */
export const meta = {
  path: '/intake-redesign',
  title: 'Intake Redesign',
  nav: {
    parent: 'SuperAdmin',
    icon: 'TbSparkles'
  }
}

export default function IntakeRedesign() {
  return (
    <div className='card'>
      <p style={{ margin: 0 }}>
        A second designer's prototype, on its own branch and its own URL — proof that two
        can run side by side in one repo.
      </p>
    </div>
  )
}
