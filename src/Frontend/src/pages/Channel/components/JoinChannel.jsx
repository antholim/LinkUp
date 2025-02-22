import Modal from "../../../Components/Modal/Modal.jsx";

function JoinChannel({ showJoinChannel, setShowJoinChannel }) {
    const handleCreateChannel = () => {
        console.log('Create channel');
    };
    return (
        <>
        <button onClick={() => {
            setShowJoinChannel(true)
            className = "join-channel"
        }}>Join channel</button>
            <Modal
                isOpen={showJoinChannel}
                onClose={() => setShowJoinChannel(false)}
                onSubmit={handleCreateChannel}
                title="Create New Channel"
                inputLabel="Channel Name"
                inputPlaceholder="Enter channel name"
                submitButtonText="Create Channel"
            />
        </>
    )
} export default JoinChannel;
