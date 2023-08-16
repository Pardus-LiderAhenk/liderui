import store from "../../store/store"

class RoleManagement {
    getUserRole() {
        try {
            let roles = null;
            roles = store.getters.getUser.priviliges;
            return roles;
        } catch {
            return null
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
}

export const roleManagement = new RoleManagement();