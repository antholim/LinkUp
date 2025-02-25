import { useRef } from "react"
import { categories } from "../../../data/FakeChannels"
function JoinChannel() {

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
            {categories[0].channels.map((channel) => {
                return <option>{channel.name} {channel.icon}</option>
            })}
          </select>
        </div>
      </>
    )

} export default JoinChannel;
