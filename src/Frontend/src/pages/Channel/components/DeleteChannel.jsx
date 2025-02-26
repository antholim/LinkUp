import { useEffect, useRef, useState } from "react"
import { fetchingService } from "../../../services/fetchingService"

function DeleteChannel() {
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState('');
  const handleChannelChange = (event) => {
    setSelectedChannel(event.target.value);
  };
  useEffect(() => {
    const fetch = async () => {
      const data = await fetchingService.get("/get-all-channel", {
        accessToken:localStorage.getItem('accessToken'),
    }, null)
      setChannels(data)
    }
    fetch();
  }, [])
  const modalRef = useRef(null)
  const backdropRef = useRef(null)
  const handleBackdropClick = (event) => {
    if (event.target === backdropRef.current) {
      ref.current.close()
    }
  }
  const handleDelete = () => {
    const fetch = async () => {
      if (selectedChannel) {
        try {
          console.log("Deleting channel")
          await fetchingService.patch("/delete-channel", {
            accessToken:localStorage.getItem('accessToken'),
            channelID:selectedChannel
        }, null);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("Select valid channel")
      }
    }
    fetch();
  }
  return (
    <>
      <div ref={backdropRef} className="modal-backdrop" onClick={handleBackdropClick}></div>
      <div ref={modalRef} className="modal" role="dialog" aria-modal="true">
        <select
          value={selectedChannel}
          onChange={handleChannelChange}
        >
          <option value="">Select a channel</option>
          {channels.map((channel) => (
            <option key={channel._id} value={channel._id}>
              {channel.channelName}
            </option>
          ))}
        </select>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </>
  )

} export default DeleteChannel;
