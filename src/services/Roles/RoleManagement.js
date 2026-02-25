import store from "../../store/store"

class RoleManagement {
    getUserRole() {
        try {
            return store.getters.getUser?.priviliges || [];
        } catch {
            return [];
        }
    }

    isExistRole(isRole) {
        let isExist = false;
        let roles = store.getters.getUser.priviliges.filter(role => role === isRole);
        if (roles.length > 0) {
            isExist = true;   
        }
        if (store.getters.getUser.priviliges.filter(role => role === "ROLE_ADMIN").length > 0) {
            isExist = true;   
        } 
        return isExist;
    }

    hasAnyRole(requiredRoles = [], allowAdminOverride = true) {
        const roles = this.getUserRole();
        if (allowAdminOverride && roles.includes('ROLE_ADMIN')) return true;
        return requiredRoles.some(r => roles.includes(r));
    }
}

export const roleManagement = new RoleManagement();