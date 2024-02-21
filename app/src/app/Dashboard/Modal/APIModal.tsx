import React from 'react'
import { Button, Modal, ModalVariant } from '@patternfly/react-core'
import { APIForm } from '../Form/APIForm'

export interface APIModalProps {
  modalAction: string
  modalVerb: string
  modalTitle: string
  modalDescription: string
  modalShowState: boolean
  modalFormData
  setCurrentLibrary
  loadLibraries
  loadApi
  setModalShowState
}

export const APIModal: React.FunctionComponent<APIModalProps> = ({
  modalShowState = false,
  setModalShowState,
  setCurrentLibrary,
  loadLibraries,
  loadApi,
  modalAction = '',
  modalVerb = '',
  modalTitle = '',
  modalFormData,
  modalDescription = ''
}: APIModalProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalFormSubmitState, setModalFormSubmitState] = React.useState('waiting')

  const handleModalConfirm = () => {
    setModalFormSubmitState('submitted')
  }

  const handleModalToggle = () => {
    const new_state = !modalShowState
    setModalShowState(new_state)
    setIsModalOpen(new_state)
  }

  React.useEffect(() => {
    setIsModalOpen(modalShowState)
  }, [modalShowState])

  return (
    <React.Fragment>
      <Modal
        bodyAriaLabel='Scrollable modal content'
        tabIndex={0}
        variant={ModalVariant.large}
        title={modalTitle}
        description={modalDescription}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button id='btn-modal-api-confirm' key='confirm' variant='primary' onClick={() => handleModalConfirm()}>
            Confirm
          </Button>,
          <Button id='btn-modal-api-reset' key='cancel' variant='link' onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        <APIForm
          formAction={modalAction}
          formVerb={modalVerb}
          formDefaultButtons={0}
          formData={modalFormData}
          modalFormSubmitState={modalFormSubmitState}
          setModalFormSubmitState={setModalFormSubmitState}
          //setCurrentLibrary={setCurrentLibrary}
          //loadLibraries={loadLibraries}
          //loadApi={loadApi}
          //handleModalToggle={handleModalToggle}
        />
      </Modal>
    </React.Fragment>
  )
}
