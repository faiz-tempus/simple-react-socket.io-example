import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// storing socket connection in this global variable
let socket = null;

function handleClick() {
  // we emit this event that increments the count on the server
  // and the updated count is emitted back via 'counter updated'
  socket.emit('counter clicked');
}

function App() {
  const [count, setCount] = useState(0);
  const [vms, setList] = useState([]);


  // after component mount...
  useEffect(() => {
    // connect to the socket server
    socket = io('ws://localhost:5000');

    // when connected, look for when the server emits the updated count
    socket.on('counter updated', function (countFromServer) {
      // set the new count on the client
      setCount(countFromServer);
    })


    socket.on('VM_STATE_CHANGED', function (res) {
      // set the new count on the client
      console.log("VM_STATE_CHANGED", res);
      alert(`Machine ${res.name} status changed to ${res.state}`)
      setList(prevItems => {
        return prevItems.map(item => {
          if (item.name === res.name) {
            // Return a new object with updated name
            return { ...item, state: res.state };
          }
          return item; // Return the unchanged item
        });
      });

    })

  }, []);


  useEffect(() => {
    fetch("http://localhost:8000/vms").then(res => res.json().then(res => {
      if (res && res.list) {
        setList(res.list);
      }

    }))

  }, []);

  return (
    <div style={{ padding: "40px", textAlign: 'center' }}>
      {/* <button onClick={handleClick}>Counter: {count}</button> */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
          </tr>
        </thead>

        <tbody>
          {vms.map(vm =>
            <tr>
              <td>{vm.name}</td>
              <td>{vm.state}</td>

            </tr>
          )}
        </tbody>


      </table>

    </div >
  );
}

export default App;
