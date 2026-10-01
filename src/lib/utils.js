export function capitalizeFirstLetter(str) {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const entitiesAttributes = {
	employee: [
		"name",
		"position",
		"branch",
		"email",
		"phone",
		"salary",
		"dateHired"
	],
	"branch": [
		"name",
		"manager",
		"location",
		"phone"
	],
	"client": [
		"name",
		"branch",
		"email",
		"phone"
	],
	"sale": [
		"employee",
		"client",
		"branch",
		"products",
		"totalAmount",
		"saleDate"
	],
	"product": [
		"name",
		"category",
		"branch",
		"price",
		"stock"
	],
}
