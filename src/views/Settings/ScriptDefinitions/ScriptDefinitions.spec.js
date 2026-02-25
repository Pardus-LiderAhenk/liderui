import { mount } from '@vue/test-utils';
import ScriptDefinitions from './ScriptDefinitions.vue';

describe('ScriptDefinitions.vue', () => {
  it('component başarılı şekilde render edilmeli', () => {
    const wrapper = mount(ScriptDefinitions, {
      props: { scriptDefinitionTitle: true },
      global: {
        config: {
          globalProperties: {
            $t: (msg) => msg
          }
        },
        stubs: ['Card', 'Button', 'DataTable', 'Column', 'Paginator', 'Dialog', 'Dropdown', 'InputText', 'Textarea']
      }
    });
    expect(wrapper.exists()).toBe(true);
    // scriptDefinitionTitle prop'u true ise data ve props kontrolü
    expect(wrapper.props('scriptDefinitionTitle')).toBe(true);
  });

  it('scriptDefinitionTitle false olduğunda başlık render edilmemeli', () => {
    const wrapper = mount(ScriptDefinitions, {
      props: { scriptDefinitionTitle: false },
      global: {
        config: {
          globalProperties: {
            $t: (msg) => msg
          }
        },
        stubs: ['Card', 'Button', 'DataTable', 'Column', 'Paginator', 'Dialog', 'Dropdown', 'InputText', 'Textarea']
      }
    });
    // scriptDefinitionTitle false olduğunda ilk Card'ın başlığı olmamalı
    expect(wrapper.text()).not.toContain('settings.script_definition.title');
  });

  it('Yeni script ekleme methodu çağrılınca dialog açılmalı', async () => {
    const wrapper = mount(ScriptDefinitions, {
      global: {
        config: {
          globalProperties: {
            $t: (msg) => msg
          }
        },
        stubs: ['Card', 'Button', 'DataTable', 'Column', 'Paginator', 'Dialog', 'Dropdown', 'InputText', 'Textarea']
      }
    });
    expect(wrapper.vm.showTemplateDialog).toBe(false);
    wrapper.vm.addNewScript();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showTemplateDialog).toBe(true);
  });

  it('getScripts metodu çağrıldığında scripts arrayi güncellenmeli', async () => {
  const mockScripts = [{ id: 1, label: 'Test', contents: 'echo', scriptType: 0 }];
  const wrapper = mount(ScriptDefinitions, {
    global: {
      config: {
        globalProperties: {
          $t: (msg) => msg
        }
      },
      stubs: ['Card', 'Button', 'DataTable', 'Column', 'Paginator', 'Dialog', 'Dropdown', 'InputText', 'Textarea']
    }
  });

  // getScripts metodu mocklama
  wrapper.vm.getScripts = jest.fn(() => {
    wrapper.vm.scripts = mockScripts;
  });

  await wrapper.vm.getScripts();

  expect(wrapper.vm.scripts.length).toBe(1);
  expect(wrapper.vm.scripts[0].label).toBe('Test');
});


  it('validateForm boş label ve contents ile false dönmeli', () => {
    const wrapper = mount(ScriptDefinitions, {
      global: {
        config: {
          globalProperties: {
            $t: (msg) => msg
          }
        },
        stubs: ['Card', 'Button', 'DataTable', 'Column', 'Paginator', 'Dialog', 'Dropdown', 'InputText', 'Textarea']
      }
    });
    wrapper.vm.label = '';
    wrapper.vm.contents = '';
    expect(wrapper.vm.validateForm()).toBe(false);
  });
});
