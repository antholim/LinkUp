// import React from 'react';

// const ServersList = ({ activeServer, onServerSelect }) => {
//     const servers = [
//         { id: 1, name: 'Main Server', icon: 'MS' },
//         { id: 2, name: 'Gaming', icon: 'G' },
//         { id: 3, name: 'Study Group', icon: 'SG' },
//     ];

//     return (
//         <div className="servers-list">
//             {servers.map(server => (
//                 <div
//                     key={server.id}
//                     className={`server-icon ${activeServer === server.name ? 'active' : ''}`}
//                     onClick={() => onServerSelect(server.name)}
//                     title={server.name}
//                 >
//                     {server.icon}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ServersList;