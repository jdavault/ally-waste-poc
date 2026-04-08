import { RouteStatus } from '@ally-waste/shared-types'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="container mt-4">
      <h1>Ally Waste Admin</h1>
      <p className="text-muted">Route statuses: {Object.values(RouteStatus).join(', ')}</p>
    </div>
  )
}

export default App
