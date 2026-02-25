import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ComputerManagement from './ComputerManagement.vue'

// Gerekli child componentleri ve servisleri mock'la
jest.mock('@/components/Tree/TreeComponent.vue', () => ({ __esModule: true, default: { template: '<div />' } }))
jest.mock('@/components/Dashboardbox/Dashboardbox.vue', () => ({ __esModule: true, default: { template: '<div />' } }))
jest.mock('@/views/ComputerManagement/Plugins/Task/System/SystemManagementPage.vue', () => ({ __esModule: true, default: { template: '<div />' } }))
jest.mock('@/views/ComputerManagement/Plugins/Task/Package/PackageManagementPage.vue', () => ({ __esModule: true, default: { template: '<div />' } }))
jest.mock('@/views/ComputerManagement/Plugins/Task/Script/ScriptManagementPage.vue', () => ({ __esModule: true, default: { template: '<div />' } }))
jest.mock('@/views/ComputerManagement/Plugins/Task/Service/ServiceManagementPage.vue', () => ({ __esModule: true, default: { template: '<div />' } }))
jest.mock('@/views/ComputerManagement/Plugins/Task/RemoteAccess/RemoteAccessPage.vue', () => ({ __esModule: true, default: { template: '<div />' } }))
jest.mock('@/views/ComputerManagement/Plugins/Task/Security/SecurityManagementPage.vue', () => ({ __esModule: true, default: { template: '<div />' } }))
jest.mock('@/views/ComputerManagement/Plugins/Task/TaskHistory/TaskHistory.vue', () => ({ __esModule: true, default: { template: '<div />' } }))
jest.mock('../../services/ComputerManagement/ComputerManagement.js', () => ({
  computerManagementService: {
    computerAgentListSize: jest.fn().mockResolvedValue({ response: { status: 200, data: { agentListSize: 1, onlineAgentListSize: 1 } }, error: null })
  }
}))
jest.mock('../../services/Profile/ProfileService', () => ({}))

// Vuex store'u mock'la
const store = createStore({
  actions: {
    setSelectedLiderNode: jest.fn(),
    // başka action ihtiyacı olursa buraya ekle
  },
  // Eğer state/getters/mutations gerekiyorsa ekle
})

describe('ComputerManagement.vue', () => {
  it('renders component', async () => {
    const wrapper = mount(ComputerManagement, {
      global: {
        plugins: [store], // Store'u buraya ekledik!
        mocks: {
          $t: (msg) => msg,
          $toast: { add: jest.fn() }
        },
        stubs: ['Button']
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.computer-management').exists()).toBe(true)
  })
})
