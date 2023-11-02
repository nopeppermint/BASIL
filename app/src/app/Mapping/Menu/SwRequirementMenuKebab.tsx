import React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement } from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';

export interface SwRequirementMenuKebabProps {
  indirect;
  srModalShowState;
  setDetailsModalInfo;
  setHistoryModalInfo;
  setUsageModalInfo;
  setDeleteModalInfo;
  setForkModalInfo;
  setTcModalInfo;
  setTsModalInfo;
  setSrModalInfo;
  api;
  mappingParentType;
  mappingParentRelatedToType;
  mappingIndex;
  mappingList;
  mappingSection;
  mappingOffset;
}

export const SwRequirementMenuKebab: React.FunctionComponent<SwRequirementMenuKebabProps> = ({
  indirect,
  setDetailsModalInfo,
  setHistoryModalInfo,
  setUsageModalInfo,
  setDeleteModalInfo,
  setForkModalInfo,
  setTcModalInfo,
  setTsModalInfo,
  setSrModalInfo,
  api,
  mappingParentType,
  mappingParentRelatedToType,
  mappingIndex,
  mappingList,
  mappingSection,
  mappingOffset,
}: SwRequirementMenuKebabProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  const _SR = 'sw-requirement';

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="kebab dropdown toggle"
          variant="plain"
          onClick={onToggleClick}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      shouldFocusToggleOnSelect
    >

      <DropdownList>
        <DropdownItem
          value={0}
          id={"btn-menu-sw-requirement-assign-test-case-" + mappingList[mappingIndex].relation_id}
          name={"btn-menu-sw-requirement-assign-test-case"}
          key="assign test case"
          onClick={() => setTcModalInfo(true,
                                        true,
                                        'add',
                                        api,
                                        mappingSection,
                                        mappingOffset,
                                        _SR,
                                        mappingList,
                                        mappingIndex,
                                        mappingParentType)}>
          Assign Test Case
        </DropdownItem>
        <DropdownItem
          value={1}
          id={"btn-menu-sw-requirement-assign-test-specification-" + mappingList[mappingIndex].relation_id}
          name={"btn-menu-sw-requirement-assign-test-specification"}
          key="assign test specification"
          onClick={() => setTsModalInfo(true,
                                        true,
                                        'add',
                                        api,
                                        mappingSection,
                                        mappingOffset,
                                        _SR,
                                        mappingList,
                                        mappingIndex,
                                        mappingParentType)}>
          Assign Test Specification
        </DropdownItem>
        <DropdownItem
          value={2}
          id={"btn-menu-sw-requirement-delete-" + mappingList[mappingIndex].relation_id}
          name={"btn-menu-sw-requirement-delete"}
          key="delete"
          className="danger-text"
          onClick={() => (setDeleteModalInfo(true,
                                             _SR,
                                             mappingParentType,
                                             mappingParentRelatedToType,
                                             mappingList,
                                             mappingIndex))}>
          Delete
        </DropdownItem>
        <DropdownItem
          value={3}
          id={"btn-menu-sw-requirement-edit-" + mappingList[mappingIndex].relation_id}
          name={"btn-menu-sw-requirement-edit"}
          key="edit"
          onClick={() => (setSrModalInfo(true,
                                         indirect,
                                         'edit',
                                          api,
                                          mappingSection,
                                          mappingOffset,
                                          mappingParentType,
                                          mappingList,
                                          mappingIndex,
                                          mappingParentRelatedToType))}>
          Edit
        </DropdownItem>
        <DropdownItem
          value={4}
          id={"btn-menu-sw-requirement-fork-" + mappingList[mappingIndex].relation_id}
          name={"btn-menu-sw-requirement-fork"}
          key="fork"
          onClick={() => (setForkModalInfo(true,
                                           _SR,
                                           mappingParentType,
                                           mappingParentRelatedToType,
                                           mappingList,
                                           mappingIndex))}>
          Fork
        </DropdownItem>
        <DropdownItem
          value={5}
          id={"btn-menu-sw-requirement-history-" + mappingList[mappingIndex].relation_id}
          name={"btn-menu-sw-requirement-history"}
          key="history"
          onClick={() => (setHistoryModalInfo(true,
                                              _SR,
                                              mappingParentType,
                                              mappingList[mappingIndex].relation_id))}>
          History
        </DropdownItem>
        <DropdownItem
          value={6}
          key="show-details"
          onClick={() => (setDetailsModalInfo(true,
                                              _SR,
                                              mappingList[mappingIndex]['id']))}>
          Show Details
        </DropdownItem>
        <DropdownItem
          value={7}
          id={"btn-menu-sw-requirement-details-" + mappingList[mappingIndex].relation_id}
          name={"btn-menu-sw-requirement-details"}
          key="usage"
          onClick={() => (setUsageModalInfo(true,
                                            _SR,
                                            mappingList[mappingIndex]['id']))}>
          Usage
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};
