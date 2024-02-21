import * as React from 'react'
import { Button, Modal, ModalVariant, Tab, TabContent, TabContentBody, TabTitleText, Tabs } from '@patternfly/react-core'
import * as Constants from '../../Constants/constants'
import { SectionForm } from '../Form/SectionForm'
import { SwRequirementForm } from '../Form/SwRequirementForm'
import { SwRequirementSearch } from '../Search/SwRequirementSearch'

export interface MappingSwRequirementModalProps {
  api
  modalAction: string
  modalVerb: string
  modalTitle: string
  modalDescription: string
  modalShowState: boolean
  modalFormData
  modalSection
  modalIndirect
  modalOffset
  parentData
  parentType
  parentRelatedToType
  loadMappingData
  setModalShowState
  setModalOffset
  setModalSection
}

export const MappingSwRequirementModal: React.FunctionComponent<MappingSwRequirementModalProps> = ({
  modalShowState = false,
  setModalShowState,
  modalAction = '',
  modalVerb = '',
  modalTitle = '',
  modalFormData,
  modalIndirect,
  modalOffset,
  modalSection,
  parentData,
  parentType,
  parentRelatedToType,
  loadMappingData,
  modalDescription = '',
  api,
  setModalOffset,
  setModalSection
}: MappingSwRequirementModalProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [swRequirements, setSwRequirements] = React.useState([])
  const handleModalToggle = () => {
    const new_state = !modalShowState
    setModalShowState(new_state)
    setIsModalOpen(new_state)
  }

  React.useEffect(() => {
    if (modalShowState == true) {
      loadSwRequirements('')
    }
    setIsModalOpen(modalShowState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalShowState])

  const loadSwRequirements = (searchValue) => {
    const url = Constants.API_BASE_URL + '/sw-requirements?search=' + searchValue
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSwRequirements(data)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0)
  // Toggle currently active tab
  const handleTabClick = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex)
  }

  const newItemRef = React.createRef<HTMLElement>()
  const sectionItemsRef = React.createRef<HTMLElement>()
  const existingItemsRef = React.createRef<HTMLElement>()

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
          <Button key='cancel' variant='link' onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        <Tabs
          id='tabs-sw-requirements-modal'
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label='Add a New/Existing Test Specification'
          role='region'
        >
          <Tab
            id='tab-btn-sw-requirement-data'
            eventKey={0}
            title={<TabTitleText>Sw Requirement Data</TabTitleText>}
            tabContentId='tabNewTestCase'
            tabContentRef={newItemRef}
          />
          <Tab
            id='tab-btn-sw-requirement-mapping-section'
            eventKey={1}
            title={<TabTitleText>Mapping Section</TabTitleText>}
            tabContentId='tabSection'
            tabContentRef={sectionItemsRef}
          />
          <Tab
            id='tab-btn-sw-requirement-existing'
            eventKey={2}
            isDisabled={modalVerb == 'POST' ? false : true}
            title={<TabTitleText>Existing</TabTitleText>}
            tabContentId='tabExistingTestCase'
            tabContentRef={existingItemsRef}
          />
        </Tabs>
        <div>
          <TabContent eventKey={0} id='tabContentSwRequirementForm' ref={newItemRef}>
            <TabContentBody hasPadding>
              <SwRequirementForm
                api={api}
                formAction={modalAction}
                formData={modalFormData}
                formVerb={modalVerb}
                parentData={parentData}
                parentType={parentType}
                parentRelatedToType={parentRelatedToType}
                handleModalToggle={handleModalToggle}
                loadMappingData={loadMappingData}
                modalIndirect={modalIndirect}
                modalOffset={modalOffset}
                modalSection={modalSection}
                formDefaultButtons={1}
                formMessage={''}
                modalFormSubmitState={'waiting'}
              />
            </TabContentBody>
          </TabContent>
          <TabContent eventKey={1} id='tabContentSwRequirementSection' ref={sectionItemsRef} hidden>
            <TabContentBody hasPadding>
              <SectionForm
                api={api}
                //formVerb={modalVerb}
                //handleModalToggle={handleModalToggle}
                //modalIndirect={modalIndirect}
                modalOffset={modalOffset}
                modalSection={modalSection}
                setModalOffset={setModalOffset}
                setModalSection={setModalSection}
              />
            </TabContentBody>
          </TabContent>
          <TabContent eventKey={2} id='tabContentSwRequirementExisting' ref={existingItemsRef} hidden>
            <TabContentBody hasPadding>
              <SwRequirementSearch
                api={api}
                parentData={parentData}
                parentType={parentType}
                formVerb={modalVerb}
                parentRelatedToType={parentRelatedToType}
                handleModalToggle={handleModalToggle}
                loadMappingData={loadMappingData}
                loadSwRequirements={loadSwRequirements}
                modalIndirect={modalIndirect}
                modalOffset={modalOffset}
                modalSection={modalSection}
                swRequirements={swRequirements}
                formDefaultButtons={1}
                formMessage={''}
                formData={null}
              />
            </TabContentBody>
          </TabContent>
        </div>
      </Modal>
    </React.Fragment>
  )
}
