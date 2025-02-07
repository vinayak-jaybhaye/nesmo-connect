import React from 'react'

function Connections({ connectionId }) {
    return (
      <div>
        
      </div>
    );
  }
  
function Connections(connections) {
  return (
    <div>
      {
        connections.map((connection) => (
            <Connections key={connection} connection={connection} />
        ))
      }
    </div>
  )
}

export default Connections
