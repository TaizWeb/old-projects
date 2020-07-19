module.exports = {
	permissionsOf: (author) => {
		if (author.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
			//Lazy admin checking
			return "admin";
		} else {
			return "user";
		}
	}
}