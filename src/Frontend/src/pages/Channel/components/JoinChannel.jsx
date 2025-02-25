import { useEffect, useRef, useState } from "react"
import { fetchingService } from "../../../services/fetchingService"

function JoinChannel() {
  const [channels, setChannels] = useState([])
    useEffect(()=> {
        const fetch = async () => {
            const data = await fetchingService.get("/get-all-channel", localStorage.getItem('accessToken'), null)
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
  return (
    <>
      <div ref={backdropRef} className="modal-backdrop" onClick={handleBackdropClick}></div>
      <div ref={modalRef} className="modal" role="dialog" aria-modal="true">
        <select name="" id="">
          {channels.map((channel) => {
            return <option>{channel.channelName}</option>
          })}
        </select>
      </div>
    </>
  )

} export default JoinChannel;
