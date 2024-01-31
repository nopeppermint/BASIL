import React from 'react';
import * as Constants from '../../Constants/constants';
import { ActionGroup, Button, FormGroup, FormHelperText, HelperText, HelperTextItem, Hint, HintBody, TextInput} from '@patternfly/react-core';
import {
  DataList,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  SearchInput,
} from '@patternfly/react-core';

export interface TestCaseSearchProps {
  api;
  baseApiUrl: str;
  formDefaultButtons: int;
  formVerb: str;
  formData;
  formMessage: string;
  parentData;
  parentType: string;
  parentRelatedToType;
  handleModalToggle;
  modalOffset;
  modalSection;
  modalIndirect;
  loadMappingData;
  loadTestCases;
  testCases;
}

export const TestCaseSearch: React.FunctionComponent<TestCaseSearchProps> = ({
    api,
    baseApiUrl,
    formDefaultButtons= 1,
    formVerb='POST',
    formData = {'id': 0,
                'title': '',
                'description': '',
                'repository': '',
                'relative_path': ''},
    formMessage = "",
    parentData,
    parentType,
    parentRelatedToType,
    handleModalToggle,
    modalOffset,
    modalSection,
    modalIndirect,
    loadMappingData,
    loadTestCases,
    testCases,
    }: TestCaseSearchProps) => {

    const [searchValue, setSearchValue] = React.useState(formData.title);
    const [messageValue, setMessageValue] = React.useState(formMessage);
    const [statusValue, setStatusValue] = React.useState('waiting');
    const [selectedDataListItemId, setSelectedDataListItemId] = React.useState('');

    const [coverageValue, setCoverageValue] = React.useState(formData.coverage);
    const [validatedCoverageValue, setValidatedCoverageValue] = React.useState<validate>('error');

    const resetForm = () => {
        setSelectedDataListItemId(-1);
        setCoverageValue("0");
        setSearchValue("");
    }

    React.useEffect(() => {
        if (coverageValue === '') {
          setValidatedCoverageValue('default');
        } else if (/^\d+$/.test(coverageValue)) {
          if ((coverageValue >= 0) && (coverageValue <= 100)){
            setValidatedCoverageValue('success');
          } else {
            setValidatedCoverageValue('error');
          }
        } else {
          setValidatedCoverageValue('error');
        }
    }, [coverageValue]);

    const handleCoverageValueChange = (_event, value: string) => {
        setCoverageValue(value);
    };

    const onChangeSearchValue = (value) => {
      setSearchValue(value);
    }

    const onSelectDataListItem = (_event: React.MouseEvent | React.KeyboardEvent, id: string) => {
      setSelectedDataListItemId(id);
    };

    const handleInputChange = (_event: React.FormEvent<HTMLInputElement>, id: string) => {
      setSelectedDataListItemId(id);
    };

    React.useEffect(() => {
        loadTestCases(searchValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    const getTestCasesTable = (test_cases) => {
      return test_cases.map((test_case, tcIndex) => (
        <DataListItem
          key={test_case.id}
          aria-labelledby={"clickable-action-item-" + test_case.id}
          id={"list-existing-test-case-item-" + test_case.id}
          data-id={test_case.id}>
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key={tcIndex}>
                  <span id={"clickable-action-item-" + test_case.id}>{test_case.title}</span>
                </DataListCell>,
              ]}
            />
            <DataListAction
              aria-labelledby={"clickable-action-item-" + test_case.id + " clickable-action-action-" + test_case.id}
              id={"clickable-action-action-" + test_case.id}
              aria-label="Actions"
              isPlainButtonAction
            >
            </DataListAction>
          </DataListItemRow>
        </DataListItem>
      ))
    }

    React.useEffect(() => {
        if (statusValue == 'submitted'){
          handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusValue]);

    const handleSubmit = () => {
        if ((selectedDataListItemId == -1) || (selectedDataListItemId == '') || (selectedDataListItemId == undefined)){
            setMessageValue('Please, select an item before submitting the form.');
            setStatusValue('waiting');
            return;
        } else if (validatedCoverageValue != 'success'){
            setMessageValue('Coverage of Parent Item is mandatory and must be a integer value in the range 0-100.');
            setStatusValue('waiting');
            return;
        } else if (modalSection.trim().length==0){
            setMessageValue('Section of the software component specification is mandatory.');
            setStatusValue('waiting');
            return;
        }

        setMessageValue('');
        const test_case_id = document.getElementById(selectedDataListItemId).dataset.id;

        const data = {
          'api-id': api.id,
          'test-case': {'id': test_case_id},
          'section': modalSection,
          'offset': modalOffset,
          'coverage': coverageValue,
        }

        if (modalIndirect == true){
          data['relation-id'] = parentData.relation_id;
          data['relation-to'] = parentRelatedToType;
          if (parentType == Constants._TS) {
            if (parentRelatedToType == Constants._A){
              data[parentType] = {'id': parentData[Constants._TS_]['id']};
            } else if (parentRelatedToType == Constants._SR){
              data[parentType] = {'id': parentData[Constants._TS_]['id']};
            }
          } else if (parentType == Constants._SR){
            data[parentType] = {'id': parentData[Constants._SR_]['id']};
          } else {
            setMessageValue("Wrong data.");
            setStatusValue("waiting");
            return;
          }
        }

        if ((formVerb == 'PUT') || (formVerb == 'DELETE')){
          setMessageValue('Wrong actions.');
          setStatusValue('waiting');
          return;
        }

        fetch(baseApiUrl + '/mapping/' + parentType + '/test-cases', {
          method: formVerb,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.status !== 200) {
              setMessageValue(response.statusText);
              setStatusValue('waiting');
            } else {
              setStatusValue('waiting');
              setMessageValue('Database updated!');
              handleModalToggle();
              setMessageValue('');
              loadMappingData(Constants.force_reload);
            }
          })
          .catch((err) => {
            setStatusValue('waiting');
            setMessageValue(err.toString());
            console.log(err.message);
          });
      };


    return (
        <React.Fragment>
        <SearchInput
            placeholder="Search Identifier"
            value={searchValue}
            onChange={(_event, value) => onChangeSearchValue(value)}
            onClear={() => onChangeSearchValue('')}
            style={{width:'400px'}}
          />
        <br />
        <DataList
          isCompact
          id="list-existing-test-cases"
          aria-label="clickable data list example"
          selectedDataListItemId={selectedDataListItemId}
          onSelectDataListItem={onSelectDataListItem}
          onSelectableRowChange={handleInputChange}>
          {getTestCasesTable(testCases)}
        </DataList>
        <br />
        <FormGroup label="Unique Coverage:" isRequired fieldId={`input-test-case-coverage-${formData.id}`}>
          <TextInput
            isRequired
            id={`input-test-case-coverage-${formData.id}`}
            name={`input-test-case-coverage-${formData.id}`}
            value={coverageValue || ''}
            onChange={(_ev, value) => handleCoverageValueChange(_ev, value)}
          />
          {validatedCoverageValue !== 'success' && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant={validatedCoverageValue}>
                  {validatedCoverageValue === 'error' ? 'Must be an integer number in the range 0-100' : ''}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>
        <br />

          { messageValue ? (
          <Hint>
            <HintBody>
              {messageValue}
            </HintBody>
          </Hint>
          ) : (<span></span>)}

          {formDefaultButtons ? (
            <ActionGroup>
              <Button
                id="btn-mapping-existing-test-case-submit"
                variant="primary"
                onClick={() => setStatusValue('submitted')}>
              Submit
              </Button>
              <Button
                id="btn-mapping-existing-test-case-cancel"
                variant="secondary"
                onClick={resetForm}>
                Reset
              </Button>
            </ActionGroup>
          ) : (<span></span>)}

        </React.Fragment>
   );
};
