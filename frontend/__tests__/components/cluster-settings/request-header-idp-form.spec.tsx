import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { ListInput } from '../../../public/components/utils';
import { IDPNameInput } from '../../../public/components/cluster-settings/idp-name-input';
import { IDPCAFileInput } from '../../../public/components/cluster-settings/idp-cafile-input';
import { AddRequestHeaderPage, AddRequestHeaderPageState } from '../../../public/components/cluster-settings/request-header-idp-form';
import { controlButtonTest } from './basicauth-idp-form.spec';

describe('Add Identity Provider: Request Header', () => {
  let wrapper : ShallowWrapper<{}, AddRequestHeaderPageState>;

  beforeEach(() => {
    wrapper = shallow(<AddRequestHeaderPage />);
  });

  it('should render AddRequestHeaderPage component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render correct Request Header IDP page title', () => {
    expect(wrapper.contains('Add Identity Provider: Request Header')).toBeTruthy();
  });

  it('should render the form elements of AddRequestHeaderPage component', () => {
    expect(wrapper.find(IDPNameInput).exists()).toBe(true);
    expect(wrapper.find(IDPCAFileInput).exists()).toBe(true);
    expect(wrapper.find('input[id="challenge-url"]').exists()).toBe(true);
    expect(wrapper.find('input[id="login-url"]').exists()).toBe(true);
    expect(wrapper.find(ListInput).length).toEqual(5);
  });

  it('should render control buttons in a button bar', () => {
    controlButtonTest(wrapper);
  });

  it('should prefill request-header in name field by default', () => {
    expect(wrapper.find(IDPNameInput).props().value).toEqual(wrapper.state().name);
  });

  it('should prefill Request Header more options list input default values as empty', () => {
    expect(wrapper.find(ListInput).at(0).props().initialValues).toEqual(undefined);
    expect(wrapper.find(ListInput).at(1).props().initialValues).toEqual(undefined);
    expect(wrapper.find(ListInput).at(2).props().initialValues).toEqual(undefined);
    expect(wrapper.find(ListInput).at(3).props().initialValues).toEqual(undefined);
    expect(wrapper.find(ListInput).at(4).props().initialValues).toEqual(undefined);
  });
});
