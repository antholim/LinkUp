import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = forwardRef(function Modal(
  { title, actions, content },
  ref
) {
  const dialog = useRef();
  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
    };
  });

  return createPortal(
    <dialog id="modal" ref={dialog}>
      <h2>{title}</h2>
      {content}
    </dialog>,
    document.getElementById('modal')
  );
});

export default ModalPortal;
